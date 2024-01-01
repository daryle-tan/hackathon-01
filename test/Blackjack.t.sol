// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../src/Blackjack.sol";
import "./mocks/LinkToken.sol";
import "forge-std/Test.sol";
import "./mocks/MockOracle.sol";

contract BlackjackTest is Test {
    LinkToken public linkToken;
    MockOracle public mockOracle;
    Blackjack public blackjack;

    bytes32 jobId;
    uint256 fee;
    bytes32 blank_bytes32;

    uint256 constant AMOUNT = 1 * 10**18;
    uint256 constant RESPONSE = 777;
    bool gameStarted;

    function setUp() public {
        linkToken = new LinkToken();
        mockOracle = new MockOracle(address(linkToken));
        blackjack = new Blackjack();
    }

    function testStartGame() public {
        blackjack.startGame();
        assertEq(blackjack.getGameStarted(), true);
    }

    function testDealCard() public {}
}
