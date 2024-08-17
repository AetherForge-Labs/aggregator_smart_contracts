import { deployUniV2Contract } from "../../../utils";

const networkName = "base";
const name = "SushiswapAdapter";
const factory = "0x71524B4f93c58fcbF659783284E38825f0622859";
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
