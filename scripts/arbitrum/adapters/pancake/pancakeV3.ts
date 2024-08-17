import { deployAdapter } from "../utils";

const networkName = "arbitrum";
const contractName = "PancakeV3Adapter";
const name = contractName;
const gasEstimate = 385_000;
const quoterGasLimit = gasEstimate - 60_000;
const defaultFees = [100, 500, 2500, 10_000];
const args = [
  name,
  gasEstimate,
  quoterGasLimit,
  "0xa7f586470CD7b70F9b5893eEe85C0b5354541A99",
  "0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865",
  defaultFees,
];

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
