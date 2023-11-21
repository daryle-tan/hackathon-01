// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import {VRFCoordinatorV2Interface} from "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "forge-std/console.sol";

contract Blackjack is VRFConsumerBaseV2 {
    error Blackjack__IncorrectRequestId(uint256);
    error Blackjack__RandomCardsNotYetGenerated();
    error Blackjack__NoWinnersYet();

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

    // Your subscription ID.
    uint64 immutable s_subscriptionId;
    bytes32 immutable s_keyHash;
    uint32 immutable s_callbackGasLimit;

    // The default is 3, but you can set this higher.
    uint16 private constant REQUEST_CONFIRMATIONS = 3;

    uint8 internal s_numCards = 4;
    uint8 s_playerValue;
    uint8 s_dealerValue;
    uint256[] internal s_randomResult;
    uint256 internal desiredRange = 52;
    uint256 public s_requestId;
    address s_owner;
    Card[52] public deck;

    event Blackjack__RandomWordsRequested();
    event Blackjack__ReturnedRandomness(uint256[]);
    event Blackjack__PlayerWins();
    event Blackjack__Push();
    event Blackjack__DealerWins();
    event Blackjack__CardValue(uint8 cardValue);

    modifier onlyOwner() {
        require(msg.sender == s_owner);
        _;
    }

    constructor(
        address vrfCoordinator,
        address link,
        bytes32 keyHash,
        uint32 callbackGasLimit,
        uint64 subscriptionId
    ) VRFConsumerBaseV2(vrfCoordinator) {
        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
        LINKTOKEN = LinkTokenInterface(link);
        s_keyHash = keyHash;
        s_owner = msg.sender;
        s_callbackGasLimit = callbackGasLimit;
        s_subscriptionId = subscriptionId;

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
    function performUpkeep(
        bytes calldata /* performData */
    ) public {
        (bool upkeepNeeded, ) = checkUpkeep("");
        if (!upkeepNeeded) {
            revert Blackjack__NoWinnersYet();
        }
        //  s_playerValue = 0
        //   s_dealerValue = 0;
    }

    function requestRandomWords() public onlyOwner {
        s_requestId = COORDINATOR.requestRandomWords(
            s_keyHash, // gaslane
            s_subscriptionId,
            REQUEST_CONFIRMATIONS,
            s_callbackGasLimit,
            s_numCards
        );
        emit Blackjack__RandomWordsRequested();
    }

    // implement the VRF to randomly select cards from the deck
    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)
        internal
        override
    {
        if (requestId != s_requestId) {
            revert Blackjack__IncorrectRequestId(requestId);
        }

        Card[52] memory selectedCards;
        // Process each random number received
        for (uint256 i = 0; i < randomWords.length; i++) {
            // Ensure the random number is within the desired range (0-51)
            uint256 cardIndex = randomWords[i] % desiredRange;
            // Get the card from the deck at the randomly generated index
            // and add to selectedCards array
            selectedCards[i] = deck[cardIndex];
            emit Blackjack__CardValue(deck[cardIndex].cardValue);
            // s_playerValue += ;
        }
        // s_randomResult = randomWords;
        emit Blackjack__ReturnedRandomness(randomWords);
    }

    // create function to start game
    function startGame() public {
        if (s_numCards != 4) {
            s_numCards = 4;
        }
        requestRandomWords();
    }

    // create a function for player to hit
    function playerHitCard() external {
        // set s_numCards to 1 and call requestRandomWords and fulfillRandomWords
        //   s_playerValue = sumOfCardValue
    }

    // create a function for dealer to hits
    function dealerHitCard() external {
        // set s_numCards to 1 and call requestRandomWords and fulfillRandomWords
        //   s_dealerValue = sumOfCardValue;
        if (s_dealerValue > 21) {
            emit Blackjack__PlayerWins();
            // performUpkeep();
        } else if (s_dealerValue == s_playerValue) {
            emit Blackjack__Push();
            // performUpkeep();
        } else if (s_dealerValue > s_playerValue && s_dealerValue <= 21) {
            emit Blackjack__DealerWins();
            // performUpkeep();
        }
    }

    // create function for standing
    function standHand() external {
        // s_dealerValue += deck[cardIndex].cardValue;
    }
}
