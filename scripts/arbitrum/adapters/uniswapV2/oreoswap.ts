import { deployUniV2Contract } from "../../../utils";

const networkName = "arbitrum";
const name = "OreoswapAdapter";
const fee = 3n;
const factory = "0x20fAfD2B0Ba599416D75Eb54f48cda9812964f46";

export default async function main() {
  console.log(`starting deployment to the ${networkName} blockchain`);
  try {
    const contract = await deployUniV2Contract(name, factory, fee);

    console.log(
      `${name} on ${networkName} is deployed to: ${contract.address}`
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
