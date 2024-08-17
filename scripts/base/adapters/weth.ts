import hre from "hardhat";
import { deployAdapter } from "../../utils";

const networkName = "base";
const name = "WETHAdapter";
const contractName = "WNativeAdapter";

const gasEstimate = 80_000;
const wnative = "0x4200000000000000000000000000000000000006";
const args = [name, wnative, gasEstimate];

export default async function main() {
  try {
    const contract = await deployAdapter(contractName, args);

    console.log(
      `${name} on ${networkName} is deployed to: ${contract.address}`
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
