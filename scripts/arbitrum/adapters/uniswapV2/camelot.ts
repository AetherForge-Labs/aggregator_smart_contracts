import { deployAdapter } from "../../../utils";

const networkName = "arbitrum";
const contractName = "CamelotAdapter";
const name = contractName;
const gasEstimate = 238_412;
const args = [name, "0x6EcCab422D763aC031210895C81787E87B43A652", gasEstimate];

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
