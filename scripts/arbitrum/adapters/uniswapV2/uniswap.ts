import { deployUniV2Contract } from "../../../utils";

const networkName = "sepolia";
const name = "UniswapAdapter";
const factory = "0xf1D7CC64Fb4452F05c498126312eBE29f30Fbcf9";
const fee = 3n;

async function main() {
  try {
    const contract = await deployUniV2Contract(name, factory, fee);
    console.log(
      `Uniswap v2 on ${networkName} is deployed to: ${contract.address}`
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
