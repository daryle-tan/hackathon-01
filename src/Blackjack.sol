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
    error Blackjack__MustStartGameFirst();
    error Blackjack__CardsAlreadyDealt();

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
    bool cardsAlreadyDealt;
    bool playerTurn;
    bool dealerTurn;

    bytes32 private immutable i_gasLane =
        0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c;

    uint64 private immutable i_subscriptionId = 7200;

    uint8 internal s_numCards = 52;
    uint8 s_playerValue;
    uint8 s_dealerValue;
    uint256 counter = 0;

    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 constant CALLBACK_GAS_LIMIT = 2500000;

    // uint128 constant BID_FEE = 0.001 ether;

    Card[] s_randomResult;

    uint256 internal desiredRange = 52;
    uint256 public s_requestId;

    address s_owner;

    // Card[] public deck;
    // mapping(uint256 => Card) public s_randomResult;
    mapping(uint256 => Card) public deck;

    event Blackjack__RandomWordsRequested(uint256 indexed requestId);
    event Blackjack__ReturnedRandomness(Card[]);
    event Blackjack__PlayerWins();
    event Blackjack__Push();
    event Blackjack__DealerWins();
    event Blackjack__CardValue(uint8 cardValue);

    modifier onlyOwner() {
        require(msg.sender == s_owner);
        _;
    }

    constructor()
        VRFConsumerBaseV2(0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625)
    {
        COORDINATOR = VRFCoordinatorV2Interface(
            0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625
        );
        LINKTOKEN = LinkTokenInterface(
            0x779877A7B0D9E8603169DdbD7836e478b4624789
        );
        s_owner = msg.sender;

        uint256 cardIndex = 0;

        for (uint256 i = 0; i < 13; i++) {
            for (uint256 j = 0; j < 4; j++) {
                Rank cardRank = Rank(i);
                Suit cardSuit = Suit(j);

                uint8 value;
                if (i == uint256(Rank.Ace)) {
                    value = 1;
                } else if (i >= uint256(Rank.Two) && i <= uint256(Rank.Nine)) {
                    value = uint8(i) + 1;
                } else {
                    value = 10;
                }

                deck[cardIndex] = Card(cardRank, cardSuit, value);
                cardIndex++;
            }
        }
    }

    // create function to start game
    function startGame() public {
        if (s_numCards != 52) {
            s_numCards = 52;
        }
        gameStarted = true;
    }

    function dealCards() public returns (uint256) {
        if (!gameStarted) {
            revert Blackjack__MustStartGameFirst();
        }
        if (cardsAlreadyDealt) {
            revert Blackjack__CardsAlreadyDealt();
        }
        s_requestId = COORDINATOR.requestRandomWords(
            i_gasLane, // keyHash
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            CALLBACK_GAS_LIMIT,
            s_numCards
        );
        cardsAlreadyDealt = true;
        playerTurn = true;
        // s_numCards = 1;
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
        uint256 cardIndex;
        // Process each random number received
        for (uint256 i = 0; i < randomWords.length; i++) {
            // Ensure the random number is within the desired range (0-51) or 52
            cardIndex = randomWords[i] % 52;
            s_randomResult.push(deck[cardIndex]);
            // s_randomResult = deck[cardIndex];
        }
        // s_requestId = 0;
        emit Blackjack__ReturnedRandomness(s_randomResult);
    }

    // create a function for player to hit
    function playerHitCard() external {
        if (!playerTurn) {
            revert Blackjack__NotPlayerTurn(playerTurn);
        }
        counter++;
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
        counter++;
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

    function getRandomResult() public view returns (Card[] memory) {
        return s_randomResult;
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
            rankToString(deck[4].rank),
            suitToString(deck[2].suit),
            deck[3].cardValue
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

    function getDeck() external view returns (Card memory) {
        return deck[counter];
    }
}

// for (uint256 i = 0; i < 52; i++) {
//             // Calculate rank and suit based on index
//             Rank cardRank = Rank(i % 13); // 13 ranks
//             Suit cardSuit = Suit(i / 13); // 4 suits

//             // Convert enum to uint for comparison
//             uint8 rankValue = uint8(cardRank);
//             // check for aces and assign value of 1
//             // Initialize card for each index of the deck array
//             if (rankValue == 0) {
//                 deck.push(Card(cardRank, cardSuit, 1));
//             } else if (rankValue >= 1 && rankValue <= 8) {
//                 deck.push(Card(cardRank, cardSuit, rankValue + 1));
//             } else {
//                 deck.push(Card(cardRank, cardSuit, 10));
//             }
//         }
