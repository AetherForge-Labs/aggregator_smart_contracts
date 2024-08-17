import hre from "hardhat";

const networkName = "sepolia";
const adapters = [""];
const trustedTokens = [
  "0x910fb3C2af0D946671Efd65EB412083F7c8Be996", // USDC
  "0x41E5CD6513ee9B21327B13a610C41FF35fF4Ee5B", // USDC_MOVE
];
const wnative = "0xc02df8710Be33901D11A7E2D49B6c841e12B6f76";

async function main() {
  try {
    const monagRouter = await hre.ethers.getContractFactory("MonagRouter");

    // Deploy the contract
    const contract = await monagRouter.deploy(
      adapters,
      trustedTokens,
      "0xa95eB8aB1f4eb5367D35BDbBA577Dbcd6c7b8701",
      wnative
    );

    // Waiting for the deployment transaction to be mined
    await contract.deployed();

    console.log(`router on ${networkName} is deployed to: ${contract.address}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
