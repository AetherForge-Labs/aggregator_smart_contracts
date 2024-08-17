import { deployAdapter } from "../../utils";

const networkName = "move";
const contractName = "PancakeV3Adapter";
const name = contractName;
const quoter = "0x37E63744c7A34A1cAF1e7f9341b106b90502D64b";
const factory = "0xdeF0844815A4143D8940980cc7550e349536b344";
const gasEstimate = 385_000;
const quoterGasLimit = gasEstimate - 60_000;
const defaultFees = [100, 500, 2500, 10_000];
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
