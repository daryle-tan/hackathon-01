// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {Blackjack} from "../src/Blackjack.sol";
import {HelperConfig} from "./HelperConfig.s.sol";
import {CreateSubscription, FundSubscription, AddConsumer} from "./Interactions.s.sol";

contract DeployBlackjack is Script {
    function run() external returns (Blackjack, HelperConfig) {
        HelperConfig helperConfig = new HelperConfig();
        (
            address vrfCoordinator,
            address link,
            bytes32 keyHash,
            uint32 callbackGasLimit,
            uint64 subscriptionId,

        ) = helperConfig.activeNetworkConfig();

        if (subscriptionId == 0) {
            CreateSubscription createSubscription = new CreateSubscription();
            subscriptionId = createSubscription.createSubscription(vrfCoordinator);

            FundSubscription fundSubscription = new FundSubscription();
            FundSubscription.fundSubscription(vrfCoordinator, subscriptionId, link);
        }

        vm.startBroadcast();
        Blackjack blackjack = new Blackjack(
            vrfCoordinator,
            link,
            keyHash,
            callbackGasLimit,
            subscriptionId
        )
        vm.stopBroadcast();

        AddConsumer addConsumer = new AddConsumer();
        addConsumer.addConsumer(address(blackjack), vrfCoordinator, subscriptionId);
        return (blackjack, helperConfig);
    }
}
