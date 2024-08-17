import { deployAdapter } from "../../../utils";

const networkName = "arbitrum";
const name = "SwaprAdapter";
const contractName = "DxSwapAdapter";
const gasEstimate = 180_000;
const args = [name, "0x359F20Ad0F42D75a5077e65F30274cABe6f4F01a", gasEstimate];

async function main() {
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
