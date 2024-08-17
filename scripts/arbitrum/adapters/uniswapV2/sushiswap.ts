import { deployUniV2Contract } from "../../../utils";

const networkName = "arbitrum";
const name = "SushiswapAdapter";
const factory = "0xc35DADB65012eC5796536bD9864eD8773aBc74C4";
const fee = 3n;

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
