import hre from "hardhat";

const networkName = "sepolia";
const adapters = [
  "0x11632F9766Ee9d9317F95562a6bD529652ead78f",
  "0x4f1F87d512650f32bf9949C4c5Ef37a3cc891C6D",
  "0x499AA73A1D27e54B33E7DB05ffd22854EC70257E",
];
const trustedTokens = [
  "0x040d1EdC9569d4Bab2D15287Dc5A4F10F56a56B8",
  "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
  "0x69Eb4FA4a2fbd498C257C57Ea8b7655a2559A581",
  "0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F",
  "0xFEa7a6a0B346362BF88A9e4A88416B77a57D6c2A",
  "0xd4d42F0b6DEF4CE0383636770eF773390d85c61A",
  "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
  "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
  "0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0",
  "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
  "0x912CE59144191C1204E64559FE8253a0e49E6548",
];
const wnative = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1";

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

    console.log(`router on ${networkName} is deployed to: ${contract.address}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
