// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Blackjack} from "../src/Blackjack.sol";
import {HelperConfig} from "../script/HelperConfig.s.sol";
import {VRFCoordinatorV2Mock} from "./mocks/MockVRFCoordinatorV2.sol";
import {Test, console} from "forge-std/Test.sol";
import {Vm} from "forge-std/Vm.sol";

// import {CreateSubscription} from "../../script/Interactions.s.sol";

// import {MockOracle} from "./mocks/MockOracle.sol";

contract BlackjackTest is Test {
    // LinkToken public linkToken;
    // MockOracle public mockOracle;
    Blackjack public blackjack;

    bytes32 jobId;
    uint256 fee;
    bytes32 blank_bytes32;

    uint256 constant AMOUNT = 1 * 10**18;
    uint256 constant RESPONSE = 777;
    bool gameStarted;
    bool playerTurn;
    bool dealerTurn;
    bool cardsAlreadyDealt;

    function setUp() public {
        // linkToken = new LinkToken();
        // mockOracle = new MockOracle(address(linkToken));
        blackjack = new Blackjack();
    }

    function testStartGame() public {
        blackjack.startGame();
        assertEq(blackjack.getGameStarted(), true);
    }

    function testFailStartGame() public {
        blackjack.startGame();
        assertEq(blackjack.getGameStarted(), false);
    }

    function testDealCard() public {
        blackjack.startGame();
        blackjack.dealCards();
        assertEq(cardsAlreadyDealt, true);
        assertEq(playerTurn, true);
    }

    function testPlayerHitCard() public {}

    function testStandHand() public {
        blackjack.startGame();
        blackjack.dealCards();
        blackjack.standHand();
        assertEq(playerTurn, false);
        assertEq(dealerTurn, true);
    }

    function testDealerHitCard() public {}

    function testGameOver() public {}

    function testRestCards() public {}
}
