import { deployUniV2Contract } from "../../../utils";

const networkName = "sepolia";
const name = "UniswapAdapter";
const factory = "0x5C346464d33F90bABaf70dB6388507CC889C1070";
const fee = BigInt(3);

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
