import { task } from "hardhat/config";
import path from "path";

// npx hardhat verify-contract --network {network} --deployment-file-path {path}
task(
  "verify-contract",
  "Verifies the contract in the explorer",
  async function (path: any, hre, _) {
    const { deploymentFilePath } = path;
    console.log(`Verifying ${deploymentFilePath}`);
    const deploymentFile = require(path.join("..", deploymentFilePath));
    const args = deploymentFile.args;
    const contractAddress = deploymentFile.address;

    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  }
).addParam("deploymentFilePath", "Deployment file path");
