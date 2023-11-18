// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import {VRFCoordinatorV2Interface} from "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

import "forge-std/console.sol";

contract Blackjack is VRFConsumerBaseV2 {
    VRFCoordinatorV2Interface immutable COORDINATOR;
    LinkTokenInterface immutable LINKTOKEN;
    // create variables of all 52 cards
    enum Suit {
        Hearts,
        Diamonds,
        Clubs,
        Spades
    }
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

    struct Card {
        Suit suit;
        Rank rank;
        uint8 cardValue;
    }

    // Your subscription ID.
    uint64 immutable s_subscriptionId;
    bytes32 immutable s_keyHash;
    uint32 immutable s_callbackGasLimit;

    // The default is 3, but you can set this higher.
    uint16 private constant REQUEST_CONFIRMATIONS = 3;

    uint8 internal s_numCards = 4;
    uint256 internal s_randomResult;
    uint256 internal desiredRange = 52;
    uint256 public s_requestId;
    address s_owner;
    Card[] public deck;

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
    }

    function requestRandomWords() public onlyOwner {
        // Will revert if subscription is not set and funded.
        s_requestId = COORDINATOR.requestRandomWords(
            s_keyHash, // gaslane
            s_subscriptionId,
            REQUEST_CONFIRMATIONS,
            s_callbackGasLimit,
            s_numCards
        );
    }

    // implement the VRF to randomly select cards from the deck
    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)
        internal
        override
    {
        // s_randomResult = randomWords % desiredRange;
        // emit ReturnedRandomness(randomWords);
    }

    // create function to start game
    function startGame() public {
        // if s_numCards != 4 then set to 4
    }

    // create a function to hit
    function hitCard() public {
        // set s_numCards to 1 and call requestRandomWords and fulfillRandomWords
    }

    // create function for standing
    function standingHand() external {}

    // create logic to bust or win
    function bustOrBlackjack() internal {}
}
