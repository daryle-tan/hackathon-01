// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import {VRFCoordinatorV2Interface} from "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import {VRFConsumerBaseV2} from "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";

contract Blackjack is VRFConsumerBaseV2, AutomationCompatibleInterface {
    error Blackjack__IncorrectRequestId(uint256);
    error Blackjack__RandomCardsNotYetGenerated();
    error Blackjack__NotPlayerTurn(bool);
    error Blackjack__IndexOutOfRange(string);
    error Blackjack__MustStartGameFirst();
    error Blackjack__CardsAlreadyDealt();
    error Blackjack__MustDealCards(bool);
    error Blackjack__DealerTurn();
    error Blackjack__StillPlayerTurn(bool);
    error Blackjack__NotDealerTurn(bool);
    error Blackjack__NoMoreNumbersCanBeAdded();
    error Black__GameHasAlreadyStarted();
    error Blackjack__CardHasAlreadyBeenPlayed();

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
        bool hasBeenPlayed;
    }

    bool gameStarted;
    bool cardsAlreadyDealt;
    bool playerTurn;
    bool dealerTurn;
    bool playerWins;
    bool dealerWins;
    bool noWinner;

    bytes32 private immutable i_gasLane =
        0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c;
    uint64 private immutable i_subscriptionId = 7200;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant CALLBACK_GAS_LIMIT = 2500000;
    uint256 private constant DESIRED_RANGE = 52;

    uint8 internal s_numCards = 52;
    uint8 s_dealerValue = 0;
    uint8 s_playerValue = 0;
    uint256 counter = 0;
    uint256 internal desiredRange = 52;
    uint256 public s_requestId;

    Card[] public s_randomResult;

    address s_owner;

    mapping(uint256 => Card) public deck;

    event Blackjack__RandomWordsRequested(uint256 indexed requestId);
    event Blackjack__ReturnedRandomness(Card[]);
    event Blackjack__ReturnedFirstRandomFourCards(Card, Card, Card, Card);
    event Blackjack__PlayerWins();
    event Blackjack__PushNoWinner();
    event Blackjack__DealerWins();
    event Blackjack__CardValue(uint8 cardValue);
    event Blackjack__PlayerHit(Rank, Suit, uint8);
    event Blackjack__PlayerStands();

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

                deck[cardIndex] = Card(cardRank, cardSuit, value, false);
                cardIndex++;
            }
        }
    }

    // function to start game
    function startGame() public {
        if (s_numCards != 52) {
            s_numCards = 52;
        }
        if (gameStarted) {
            revert Black__GameHasAlreadyStarted();
        }
        gameStarted = true;
        if (playerWins) {
            playerWins = false;
        } else if (noWinner) {
            noWinner = false;
        } else if (dealerWins) {
            dealerWins = false;
        }
    }

    // function to generate 52 random numbers
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

        emit Blackjack__RandomWordsRequested(s_requestId);
        return s_requestId;
    }

    /* implement the VRF to randomly select cards from the deck and assign them to s_randomResult 
    and increment counter to 3 which represents index of the first 4 cards in s_randomResult */
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
            cardIndex = randomWords[i] % DESIRED_RANGE;
            Card memory card = deck[cardIndex];
            s_randomResult.push(card);
        }

        if (counter > s_randomResult.length) {
            revert Blackjack__IndexOutOfRange("Index out of bounds");
        }
        counter += 3;
        if (s_randomResult[counter].hasBeenPlayed) {
            revert Blackjack__CardHasAlreadyBeenPlayed();
        }
        if (s_randomResult.length > 52) {
            revert Blackjack__NoMoreNumbersCanBeAdded();
        } else {
            s_randomResult[0].hasBeenPlayed = true;
            s_randomResult[1].hasBeenPlayed = true;
            s_randomResult[2].hasBeenPlayed = true;
            s_randomResult[3].hasBeenPlayed = true;

            s_playerValue += s_randomResult[0].cardValue;
            s_dealerValue += s_randomResult[1].cardValue;
            s_playerValue += s_randomResult[2].cardValue;
            s_dealerValue += s_randomResult[3].cardValue;
        }

        emit Blackjack__ReturnedFirstRandomFourCards(
            s_randomResult[0],
            s_randomResult[1],
            s_randomResult[2],
            s_randomResult[3]
        );
        emit Blackjack__ReturnedRandomness(s_randomResult);
    }

    // function for player to hit
    function playerHitCard() external returns (Card memory) {
        if (!playerTurn) {
            revert Blackjack__NotPlayerTurn(playerTurn);
        }
        counter++;

        if (counter > s_randomResult.length) {
            revert Blackjack__IndexOutOfRange("Index out of bounds");
        }

        s_randomResult[counter].hasBeenPlayed = true;
        s_playerValue += s_randomResult[counter].cardValue;
        if (s_playerValue > 21) {
            playerTurn = false;
            dealerTurn = true;
        }

        emit Blackjack__PlayerHit(
            s_randomResult[counter].rank,
            s_randomResult[counter].suit,
            s_randomResult[counter].cardValue
        );
        return s_randomResult[counter];
    }

    // function for standing
    function standHand() external {
        if (!cardsAlreadyDealt) {
            revert Blackjack__MustDealCards(cardsAlreadyDealt);
        }
        if (!playerTurn) {
            revert Blackjack__NotPlayerTurn(playerTurn);
        }
        playerTurn = false;

        if (dealerTurn) {
            revert Blackjack__DealerTurn();
        }
        dealerTurn = true;
        emit Blackjack__PlayerStands();
    }

    // function for dealer to hit which will be called through automation
    function dealerHitCard() public {
        if (playerTurn) {
            revert Blackjack__StillPlayerTurn(playerTurn);
        }
        if (!dealerTurn) {
            revert Blackjack__NotDealerTurn(dealerTurn);
        }

        counter++;
        if (s_randomResult[counter].hasBeenPlayed) {
            revert Blackjack__CardHasAlreadyBeenPlayed();
        }
        s_randomResult[counter].hasBeenPlayed = true;
        s_dealerValue += s_randomResult[counter].cardValue;

        if (s_dealerValue > 21) {
            playerWins = true;
            emit Blackjack__PlayerWins();
            gameOver();
        } else if (s_dealerValue == s_playerValue) {
            noWinner = true;
            emit Blackjack__PushNoWinner();
            gameOver();
        } else if (s_dealerValue > s_playerValue && s_dealerValue <= 21) {
            dealerWins = true;
            emit Blackjack__DealerWins();
            gameOver();
        }
    }

    function checkUpkeep(
        bytes calldata /* checkData */
    )
        public
        view
        override
        returns (
            bool upkeepNeeded,
            bytes memory /* performData */
        )
    {
        upkeepNeeded = (dealerTurn);
        return (upkeepNeeded, "0x0");
    }

    // Calls dealerHitCard if upKeepNeeded
    function performUpkeep(
        bytes calldata /* performData */
    ) external override {
        if (s_playerValue > 21) {
            dealerWins = true;
            gameOver();
            emit Blackjack__DealerWins();
        } else if (s_dealerValue < s_playerValue && s_dealerValue < 21) {
            dealerHitCard();
        } else if (s_dealerValue > s_playerValue && s_dealerValue <= 21) {
            dealerWins = true;
            emit Blackjack__DealerWins();
            gameOver();
        }
    }

    function gameOver() internal {
        resetCards(); // Reset s_randomResult values
        s_playerValue = 0;
        s_dealerValue = 0;
        counter = 0;
        s_requestId = 0;
        gameStarted = false;
        cardsAlreadyDealt = false;
        dealerTurn = false;
    }

    function resetCards() internal {
        delete s_randomResult;
    }

    function getRandomResult() public view returns (Card[] memory) {
        return s_randomResult;
    }

    function getPlayerValue() public view returns (uint8) {
        return s_playerValue;
    }

    function getDealerValue() public view returns (uint8) {
        return s_dealerValue;
    }

    function getCounter() public view returns (uint256) {
        return counter;
    }

    function getGameStarted() public view returns (bool) {
        return gameStarted;
    }

    function getCardsAlreadyDealt() public view returns (bool) {
        return cardsAlreadyDealt;
    }

    function getPlayerTurn() public view returns (bool) {
        return playerTurn;
    }

    function getDealerTurn() public view returns (bool) {
        return dealerTurn;
    }

    function getPlayerWins() public view returns (bool) {
        return playerWins;
    }

    function getDealerWins() public view returns (bool) {
        return dealerWins;
    }

    function getNoWinner() public view returns (bool) {
        return noWinner;
    }

    function getDeck() external view returns (Card[] memory) {
        uint256 size = 52;
        Card[] memory values = new Card[](size);

        for (uint256 i = 0; i < size; i++) {
            values[i] = deck[i];
        }
        return values;
    }
}
