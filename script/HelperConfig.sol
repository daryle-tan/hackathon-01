// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

contract HelperConfig {
    NetworkConfig public activeNetworkConfig;

    struct NetworkConfig {
        address vrfCoordinator;
        address link;
        bytes32 keyHash;
        uint32 callbackGasLimit;
        uint64 subscriptionId;
    }

    mapping(uint256 => NetworkConfig) public chainIdToNetworkConfig;
}
