import { deployAdapter } from "../../../utils";

// const { factory, quoter } = addresses.arbitrum.arbidex;

const quoter = "";
const factory = "";
const networkName = "arbitrum";
const contractName = "UniswapV3Adapter";
const name = "ArbiDexAdapter";
const gasEstimate = 300_000;
const quoterGasLimit = 300_000;
const defaultFees = [80, 450, 2_500, 10_000];
const args = [name, gasEstimate, quoterGasLimit, quoter, factory, defaultFees];

export default async function main() {
  console.log(`starting deployment to the ${networkName} blockchain`);
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
