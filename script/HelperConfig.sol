// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

// import {VRFCoordinatorV2Mock} from "../test/mocks/VRFCoordinatorV2Mock.sol";
// import {LinkToken} from "../test/mocks/LinkToken.sol";
import {Script} from "forge-std/Script.sol";

contract HelperConfig is Script {
    NetworkConfig public activeNetworkConfig;

    struct NetworkConfig {
        address vrfCoordinator;
        address link;
        bytes32 keyHash;
        uint32 callbackGasLimit;
        uint64 subscriptionId;
        uint256 deployerKey;
    }

    mapping(uint256 => NetworkConfig) public chainIdToNetworkConfig;

    constructor() {
        activeNetworkConfig = getSepoliaEthConfig();
    }

    function getSepoliaEthConfig()
        public
        returns (
            // view
            NetworkConfig memory sepoliaNetworkConfig
        )
    {
        sepoliaNetworkConfig = NetworkConfig({
            vrfCoordinator: 0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625,
            link: 0x779877A7B0D9E8603169DdbD7836e478b4624789,
            keyHash: 0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c,
            callbackGasLimit: 2500000,
            subscriptionId: 7200,
            deployerKey: vm.envUint("PRIVATE_KEY")
        });
    }
}
