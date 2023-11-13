// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20

contract Blackjack {
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
// create logic to call bust or win
// create a function to hit
}