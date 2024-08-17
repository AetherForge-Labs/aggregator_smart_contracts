"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("hardhat/config");
// npx hardhat verify-contract --network {network} --deployment-file-path {path}
(0, config_1.task)("verify-contract", "Verifies the contract in the explorer", async function (path, hre, _) {
    const { deploymentFilePath } = path;
    console.log(`Verifying ${deploymentFilePath}`);
    const deploymentFile = require(path.join("..", deploymentFilePath));
    const args = deploymentFile.args;
    const contractAddress = deploymentFile.address;
    await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: args,
    });
}).addParam("deploymentFilePath", "Deployment file path");
