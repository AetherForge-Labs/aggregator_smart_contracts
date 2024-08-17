import hre from "hardhat";
import { deployAdapter } from "../../../utils";

const networkName = "sepolia";
const contractName = "UniswapV3Adapter";
const qouter = "0x6Cdcd65e03c1CEc3730AeeCd45bc140D57A25C77";
const factory = "0x792edAdE80af5fC680d96a2eD80A44247D2Cf6Fd";
const name = contractName;
const gasEstimate = 300_000;
const quoterGasLimit = 300_000;
const defaultFees = [500, 3_000, 10_000];
const args = [name, gasEstimate, quoterGasLimit, qouter, factory, defaultFees];

const main = async () => {
  try {
    const contract = await deployAdapter(contractName, args);

    console.log(
      `${name} on ${networkName} is deployed to: ${contract.address}`
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

main();
