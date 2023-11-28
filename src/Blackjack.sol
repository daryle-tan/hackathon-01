// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import {VRFCoordinatorV2Interface} from "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "forge-std/console.sol";

contract Blackjack is VRFConsumerBaseV2 {
    error Blackjack__IncorrectRequestId(uint256);
    error Blackjack__RandomCardsNotYetGenerated();
    error Blackjack__NoWinnersYet();
    error Blackjack__NeedToSetNumCardsToOne();
    error Blackjack__NotPlayerTurn(bool);
    error Blackjack__MustSendBidFee(uint128);
    error MustStartGameFirst();

    VRFCoordinatorV2Interface immutable COORDINATOR;
    LinkTokenInterface immutable LINKTOKEN;
    // create variables of all 52 cards
    enum Rank {
        Ace,
        Two,
        Three,
        Four,
        Five,
        Six,
        Seven,
        Eight,
        Nine,
        Ten,
        Jack,
        Queen,
        King
    }
    enum Suit {
        Spades,
        Clubs,
        Hearts,
        Diamonds
    }

    struct Card {
        Rank rank;
        Suit suit;
        uint8 cardValue;
    }

    bool gameStarted;
    bool playerTurn;
    bool dealerTurn;

    bytes32 private immutable i_gasLane =
        0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c;
    uint32 private immutable i_callbackGasLimit = 2500000;
    uint64 private immutable i_subscriptionId = 7200;

    uint8 internal s_numCards = 4;
    uint8 s_playerValue;
    uint8 s_dealerValue;

    uint16 private constant REQUEST_CONFIRMATIONS = 3;

    uint128 constant BID_FEE = 0.001 ether;

    uint256[] internal s_randomResult;
    uint256 internal desiredRange = 52;
    uint256 public s_requestId;

    address s_owner;

    Card[52] public deck;

    event Blackjack__RandomWordsRequested(uint256 indexed _requestId);
    event Blackjack__ReturnedRandomness(uint256[]);
    event Blackjack__PlayerWins();
    event Blackjack__Push();
    event Blackjack__DealerWins();
    event Blackjack__CardValue(uint8 _cardValue);
    event Blackjack__GameHasStarted(bool _gameStarted);

    modifier onlyOwner() {
        require(msg.sender == s_owner);
        _;
    }

    constructor()
        payable
        VRFConsumerBaseV2(0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625)
    {
        COORDINATOR = VRFCoordinatorV2Interface(
            0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625
        );
        LINKTOKEN = LinkTokenInterface(
            0x779877A7B0D9E8603169DdbD7836e478b4624789
        );
        s_owner = msg.sender;

        for (uint256 i = 0; i < 52; i++) {
            // Calculate rank and suit based on index
            Rank cardRank = Rank(i % 13); // 13 ranks
            Suit cardSuit = Suit(i / 13); // 4 suits

            // Convert enum to uint for comparison
            uint8 rankValue = uint8(cardRank);
            // check for aces and assign value of 1
            // Initialize card for each index of the deck array
            if (rankValue == 0) {
                deck[i] = Card(cardRank, cardSuit, 1);
            } else if (rankValue >= 1 && rankValue <= 8) {
                deck[i] = Card(cardRank, cardSuit, rankValue + 1);
            } else {
                deck[i] = Card(cardRank, cardSuit, 10);
            }
        }
    }

    // create function to start game
    function startGame() public {
        if (s_numCards != 4) {
            s_numCards = 4;
        }
        dealCards();
        gameStarted = true;
        playerTurn = true;
        emit Blackjack__GameHasStarted(gameStarted);
    }

    function dealCards() public returns (uint256) {
        // if (msg.value != BID_FEE) {
        //     revert Blackjack__MustSendBidFee(BID_FEE);
        // }
        if (!gameStarted) {
            revert MustStartGameFirst();
        }
        s_requestId = COORDINATOR.requestRandomWords(
            i_gasLane, // keyHash
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            s_numCards
        );
        emit Blackjack__RandomWordsRequested(s_requestId);
        return s_requestId;
    }

    // implement the VRF to randomly select cards from the deck
    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)
        internal
        override
    {
        if (requestId != s_requestId) {
            revert Blackjack__IncorrectRequestId(requestId);
        }
        s_randomResult = randomWords;

        Card[52] memory selectedCards;
        // Process each random number received
        for (uint256 i = 0; i < s_randomResult.length; i++) {
            // Ensure the random number is within the desired range (0-51)
            uint256 cardIndex = s_randomResult[i] % desiredRange;
            // Get the card from the deck at the randomly generated index
            // and add to selectedCards array
            selectedCards[i] = deck[cardIndex];
            emit Blackjack__CardValue(deck[cardIndex].cardValue);
        }
        emit Blackjack__ReturnedRandomness(randomWords);
    }

    // create a function for player to hit
    function playerHitCard() external {
        if (!playerTurn) {
            revert Blackjack__NotPlayerTurn(playerTurn);
        }
        // set s_numCards to 1 and call requestRandomWords and fulfillRandomWords
        s_numCards = 1;
        if (s_numCards > 1) {
            revert Blackjack__NeedToSetNumCardsToOne();
        }
        dealCards();
        emit Blackjack__RandomWordsRequested(s_requestId);
        // fulfillRandomWords(s_requestId, s_randomResult);
        // emit Blackjack__ReturnedRandomness(s_randomResult);
    }

    // create function for standing
    function standHand() external {
        playerTurn = false;
        dealerTurn = true;
        // s_dealerValue += deck[cardIndex].cardValue;
    }

    // create a function for dealer to hits
    function dealerHitCard() external {
        // set s_numCards to 1 and call requestRandomWords and fulfillRandomWords

        if (s_dealerValue > 21) {
            emit Blackjack__PlayerWins();
            performUpkeep();
        } else if (s_dealerValue == s_playerValue) {
            emit Blackjack__Push();
            performUpkeep();
        } else if (s_dealerValue > s_playerValue && s_dealerValue <= 21) {
            emit Blackjack__DealerWins();
            performUpkeep();
        }
    }

    function checkUpkeep(
        bytes memory /* checkData */
    )
        public
        view
        returns (
            bool upkeepNeeded,
            bytes memory /* performData */
        )
    {
        bool playerWins = s_playerValue == 21;
        bool dealerWins = s_dealerValue == 21;
        upkeepNeeded = (playerWins || dealerWins);
        return (upkeepNeeded, "0x0");
    }

    // create logic to bust or win
    function performUpkeep() public /*bytes calldata*/
    /* performData */
    {
        (bool upkeepNeeded, ) = checkUpkeep("");
        if (!upkeepNeeded) {
            revert Blackjack__NoWinnersYet();
        }
        //  s_playerValue = 0
        //   s_dealerValue = 0;
    }

    function getStruck()
        external
        view
        returns (
            string memory,
            string memory,
            uint8
        )
    {
        return (
            rankToString(deck[1].rank),
            suitToString(deck[1].suit),
            deck[1].cardValue
        );
    }

    function rankToString(Rank _rank) internal pure returns (string memory) {
        if (_rank == Rank.Ace) return "Ace";
        if (_rank == Rank.Two) return "Two";

        return ""; // Return empty string if none matches
    }

    function suitToString(Suit _suit) internal pure returns (string memory) {
        if (_suit == Suit.Spades) return "Spades";
        if (_suit == Suit.Clubs) return "Clubs";

        return ""; // Return empty string if none matches
    }
}
