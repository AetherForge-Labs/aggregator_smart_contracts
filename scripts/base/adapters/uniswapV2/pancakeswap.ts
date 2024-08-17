import { deployUniV2Contract } from "../../../utils";

const networkName = "Base";
const name = "PancakeswapAdapter";
const factory = "0x02a84c1b3BBD7401a5f7fa98a384EBC70bB5749E";
const fee = 3n;

async function main() {
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
