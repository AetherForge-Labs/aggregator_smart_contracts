import hre from "hardhat";
import { deployAdapter } from "../../utils";

const networkName = "move";
const name = "WETHAdapter";
const contractName = "WNativeAdapter";

const gasEstimate = 80_000;
const wnative = "0xc02df8710Be33901D11A7E2D49B6c841e12B6f76";
const args = [wnative, gasEstimate];

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
