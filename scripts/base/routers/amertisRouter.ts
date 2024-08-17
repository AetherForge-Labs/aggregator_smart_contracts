import hre from "hardhat";

const networkName = "base";
const adapters = [
  "0x0EcA59317D878c4802B4908f1D11b74878F92Ff1",
  "0x097Bc64c69Ba822A6A4f42Be20af17335f1C23dB",
  "0x26f0154AAb98CA4Da9f790922cE7b03933522ddD",
  "0x70C06f33aF9d28446730e08645E8098b7f740276",
  "0x921e73dd55d4Fa716547ffd2FdBDb4CC0926AB01",
  "0x2197976c16702A812AB9d7A806300c80F1534e5d",
  "0x636A193BF59c8719749F76096Ec444f1638D98E9",
];
const trustedTokens = [
  "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
  "0x22e6966B799c4D5B13BE962E1D117b56327FDa66",
  "0x4c5d8A75F3762c1561D96f177694f67378705E98",
  "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed",
  "0xA7d68d155d17cB30e311367c2Ef1E82aB6022b67",
  "0x4200000000000000000000000000000000000006",
  "0x24fcFC492C1393274B6bcd568ac9e225BEc93584",
  "0x78a087d713Be963Bf307b18F2Ff8122EF9A63ae9",
  "0xFF0C532FDB8Cd566Ae169C1CB157ff2Bdc83E105",
];
const wnative = "0x4200000000000000000000000000000000000006";

async function main() {
  try {
    const monagRouter = await hre.ethers.getContractFactory("AmertisRouter");

    // Deploy the contract
    const contract = await monagRouter.deploy(
      adapters,
      trustedTokens,
      "0x520370dDEF0cDAece31Bc119FBaC632FcfB1241e",
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
