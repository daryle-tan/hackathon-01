// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract Blackjack is VRFConsumerBaseV2 {
// create a variable of all 52 cards
enum Suit { Hearts, Diamonds, Clubs, Spades };
enum Rank { Ace, Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten, Jack, Queen, King };

struct Card {
    Suit suit;
    Rank rank;
}

mapping(uint8 => Card) public deck;
// implement the VRF to randomly select cards from the deck
// create function to start game
function startGame() external {}
// create logic to call bust or win
function bustOrBlackjack() internal {}
// create a function to hit
function hitCard() external {}

}