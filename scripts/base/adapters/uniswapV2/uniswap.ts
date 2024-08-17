import { deployUniV2Contract } from "../../../utils";

const networkName = "base";
const name = "UniswapAdapter";
const factory = "0x8909Dc15e40173Ff4699343b6eB8132c65e18eC6";
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
