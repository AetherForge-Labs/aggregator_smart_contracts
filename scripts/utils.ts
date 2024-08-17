import hre from "hardhat";

export const deployUniV2Contract = async (
  name: string,
  factory: string,
  fee: bigint
) => {
  const contractName = "UniswapV2Adapter";
  const gasEstimate = 120000n;
  const gasLimit = 1600000;

  const Adapter = await hre.ethers.getContractFactory(contractName);

  // Deploy the contract
  const adapter = await Adapter.deploy(name, factory, fee, gasEstimate, {
    gasLimit,
  });

  // Wait for the deployment transaction to be mined
  await adapter.deployed();

  return adapter;
};

export const deployAdapter = async (contractName: string, args: any[]) => {
  console.log(...args, "args");
  const gasLimit = 5000000;
  const Adapter = await hre.ethers.getContractFactory(contractName);

  // Deploy the contract
  const adapter = await Adapter.deploy(...args, { gasLimit });

  // Wait for the deployment transaction to be mined
  await adapter.deployed();

  return adapter;
};
