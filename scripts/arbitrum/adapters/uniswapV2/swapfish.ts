import { deployUniV2Contract } from "../../../utils";

const networkName = "arbitrum";
const name = "SwapfishAdapter";
const fee = 3n;
const factory = "0x71539D09D3890195dDa87A6198B98B75211b72F3";

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
