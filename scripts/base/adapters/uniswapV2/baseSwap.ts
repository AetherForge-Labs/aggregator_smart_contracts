import { deployUniV2Contract } from "../../../utils";

const networkName = "Base";
const name = "BaseswapAdapter";
const factory = "0xFDa619b6d20975be80A10332cD39b9a4b0FAa8BB";
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
