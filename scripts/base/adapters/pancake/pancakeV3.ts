import { deployAdapter } from "../../../utils";

const networkName = "base";
const contractName = "PancakeV3Adapter";
const name = contractName;
const quoter = "0xB048Bbc1Ee6b733FFfCFb9e9CeF7375518e25997";
const factory = "0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865";
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
