import { deployUniV2Contract } from "../../../utils";

const networkName = "blast";
const name = "SushiswapAdapter";
const factory = "0x42Fa929fc636e657AC568C0b5Cf38E203b67aC2b";
const fee = 3n;

async function main() {
  console.log("starting deployment to the sepolia blockchain");
  try {
    const contract = await deployUniV2Contract(name, factory, fee);

    console.log(
      `sushiswap on ${networkName} is deployed to: ${contract.address}`
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
