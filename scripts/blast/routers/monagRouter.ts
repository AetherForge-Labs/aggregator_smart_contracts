import hre from "hardhat";

const networkName = "blast";
const adapters = [];
const trustedTokens = [];
const wnative = "0x4300000000000000000000000000000000000004";

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

    // Wait for the deployment transaction to be mined
    await contract.deployed();

    console.log(
      `sushiswap on ${networkName} is deployed to: ${contract.address}`
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
