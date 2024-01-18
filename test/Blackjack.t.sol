// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Blackjack} from "../src/Blackjack.sol";
import {DeployBlackjack} from "../script/DeployBlackjack.s.sol";
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

    modifier skipFork() {
        if (block.chainid != 31337) {
            return;
        }
        _;
    }

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
        bool cardsAlreadyDealt;
        bool playerTurn;

        blackjack.startGame();
        uint256 requestId = blackjack.dealCards();
        assertTrue(requestId != 0);
        assertEq(cardsAlreadyDealt, true);
        assertEq(playerTurn, true);
    }

    function testFulfillRandomWords() public skipFork {
        uint256 counter = 0;

        VRFCoordinatorV2Mock(vrfCoordinator).fulfillRandomWords(
            0,
            address(blackjack)
        );
        assert(counter == 3);
        // assert(s_randomResult.length == 52);
    }

    function testFulfillRandomWordsRequestId(uint256 randomRequestId)
        public
        skipFork
    {
        // ACT
        // vm.recordLogs();
        // blackjack.performUpkeep("");
        // Vm.Log[] memory entries = vm.getRecordedLogs();
        // bytes32 requestId = entries[1].topics[1];

        vm.expectRevert("nonexistent request");
        VRFCoordinatorV2Mock(vrfCoordinator).fulfillRandomWords(
            randomRequestId,
            address(blackjack)
        );
    }

    function testPlayerHitCard() public {
        uint256 counter = 0;

        blackjack.startGame();
        blackjack.dealCards();
        blackjack.playerHitCard();
        assertEq(counter, 1);
    }

    function testStandHand() public {
        bool playerTurn;
        bool dealerTurn;

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
        assertEq(blackjack.s_randomResult.length, 0);
        assertEq(blackjack.s_playerValue, 0);
        assertEq(blackjack.s_dealerValue, 0);
        assertEq(blackjack.counter, 0);
        assertEq(blackjack.s_requestId, 0);
        assertEq(blackjack.gameStarted, false);
        assertEq(blackjack.cardsAlreadyDealt, false);
        assertEq(blackjack.dealerTurn, false);
    }

    function testRestCards() public {}
}
