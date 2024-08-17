import { deployAdapter } from "../../../utils";

const networkName = "sepolia";
const contractName = "UniswapV3Adapter";
const qouter = "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6";
const factory = "0x1F98431c8aD98523631AE4a59f267346ea31F984";
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
