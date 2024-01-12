// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Blackjack} from "../src/Blackjack.sol";
import {DeployBlackjack} from "../script/Blackjack.s.sol";
import {HelperConfig} from "../script/HelperConfig.s.sol";
import {VRFCoordinatorV2Mock} from "@chainlink/contracts/src/v0.8/mocks/VRFCoordinatorV2Mock.sol";
import {Test, console} from "forge-std/Test.sol";
import {Vm} from "forge-std/Vm.sol";
import {LinkToken} from "../test/mocks/LinkToken.sol";
import {CreateSubscription} from "../../script/Interactions.s.sol";

// import {MockOracle} from "./mocks/MockOracle.sol";

contract BlackjackTest is Test {
    // LinkToken public linkToken;
    // MockOracle public mockOracle;
    Blackjack blackjack;
    HelperConfig helperConfig;
    // uint96 baseFee = 0.25 ether;
    // uint96 gasPriceLink = 1e9;

    address vrfCoordinator;
    address link;
    bytes32 keyHash;
    uint32 callbackGasLimit;
    uint64 subscriptionId;

    address public PLAYER = makeAddr("player");
    uint256 public constant STARTING_USER_BALANCE = 10 ether;

    function setUp() public {
        // linkToken = new LinkToken();
        // mockOracle = new MockOracle(address(linkToken));
        DeployBlackjack deployer = new DeployBlackjack();
        (blackjack, helperConfig) = deployer.run();
        (
            vrfCoordinator,
            link,
            keyHash,
            callbackGasLimit,
            subscriptionId,

        ) = helperConfig.activeNetworkConfig();
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
        uint256 requestId = blackjack.dealCards();
        assertTrue(requestId != 0);
        assertEq(cardsAlreadyDealt, true);
        assertEq(playerTurn, true);
    }

    function testFulfillRandomWords() public {
        VRFCoordinatorV2Mock(vrfCoordinator).fulfillRandomWords(
            0,
            address(blackjack)

            assert(counter == 3);
            assert(s_randomResult.length == 52);
        );
    }

    function testPlayerHitCard() public {
        blackjack.startGame();
        blackjack.dealCards();
        blackjack.playerHitCard();
        assertEq(counter, 1);
    }

    function testStandHand() public {
        blackjack.startGame();
        blackjack.dealCards();
        blackjack.standHand();
        assertEq(playerTurn, false);
        assertEq(dealerTurn, true);
    }

    function testCheckUpkeepReturnsFalseIfDealerTurnIsFalse() public {
        (bool upkeepNeeded, ) = blackjack.checkUpkeep("");
        assert(!upkeepNeeded);
    }

    function testPerformUpkeepCanOnlyRunIfCheckUpkeepIsTrue() public {
        // Arrange
        blackjack.standHand();
        // Act / Assert
        blackjack.performUpkeep("");
    }

    function testDealerHitCard() public {}

    function testGameOver() public {
        // Arrage
        blackjack.gameOver();
        // Act / Assert
        assertEq(s_randomResult.length, 0);
        assertEq(s_playerValue, 0);
        assertEq(s_dealerValue, 0);
        assertEq(counter, 0);
        assertEq(s_requestId, 0);
        assertEq(gameStarted, false);
        assertEq(cardsAlreadyDealt, false);
        assertEq(dealerTurn, false);
    }

    function testRestCards() public {}
}
