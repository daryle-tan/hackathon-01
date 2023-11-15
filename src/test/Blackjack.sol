// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "forge-std/console.sol";

contract Blackjack is VRFConsumerBaseV2 {
    // create a variable of all 52 cards
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
    }
    VRFCoordinatorV2Interface immutable COORDINATOR;
    LinkTokenInterface immutable LINKTOKEN;

    // Your subscription ID.
    uint64 immutable s_subscriptionId;
    bytes32 immutable s_keyHash;
    address s_owner;
    mapping(uint8 => Card) public deck;

    constructor(
        uint64 subscriptionId,
        address vrfCoordinator,
        address link,
        bytes32 keyHash
    ) VRFConsumerBaseV2(vrfCoordinator) {
        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
        LINKTOKEN = LinkTokenInterface(link);
        s_keyHash = keyHash;
        s_owner = msg.sender;
        s_subscriptionId = subscriptionId;
    }

    // implement the VRF to randomly select cards from the deck
    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)
        internal
        override
    {
        // s_randomWords = randomWords;
        // emit ReturnedRandomness(randomWords);
    }

    // create function to start game
    function startGame() external {}

    // create logic to call bust or win
    function bustOrBlackjack() internal {}

    // create a function to hit
    function hitCard() external {}

    // create function for standing
    function standingHand() external {}
}
