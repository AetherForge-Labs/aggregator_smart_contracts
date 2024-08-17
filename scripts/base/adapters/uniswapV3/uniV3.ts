import hre from "hardhat";
import { deployAdapter } from "../../../utils";

const networkName = "base";
const contractName = "UniswapV3Adapter";
const qouter = "0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a";
const factory = "0x33128a8fC17869897dcE68Ed026d694621f6FDfD";
const name = contractName;
const gasEstimate = 300_000;
const quoterGasLimit = 300_000;
const defaultFees = [500, 3_000, 10_000];
const args = [name, gasEstimate, quoterGasLimit, qouter, factory, defaultFees];

export default async function main() {
  try {
    const contract = await deployAdapter(contractName, args);

    console.log(
      `${name} on ${networkName} is deployed to: ${contract.address}`
    );
    // console.log(`sushiswap deployed to: ${contract.address}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
