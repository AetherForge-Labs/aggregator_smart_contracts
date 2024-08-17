import { ethers } from "hardhat";
import { expect } from "chai";
import { BigNumber, Contract } from "ethers";
import { SignerWithAddress } from "hardhat-deploy-ethers/signers";

describe("MonagRouter Tests", function () {
  let monagRouter: Contract;
  let trustedTokens: string[];
  let user1: any;
  let user2: any;
  let uniswapV2Adapter: Contract;
  let pancakeswapV2Adapter: Contract;
  let baseswapV2Adapter: Contract;
  let sushiswapAdapter: Contract;
  let uniswapV3Adapter: Contract;
  let pancakeswapV3Adapter: Contract;
  let uniswapV2CA: string;
  let pancakeV2CA: string;
  let baseswapV2CA: string;
  let uniswapV3CA: string;
  let pancakeswapV3CA: string;
  let sushiswapCA: string;
  let routerCA: string;
  let amountIn: bigint;
  let amountInReturned: bigint;
  let amountOut: bigint;
  let adapterUsed: string[];
  let pathUsed: string[];
  let gasEstimatedToBeUsed: bigint;

  before(async function () {
    // Get accounts from Hardhat
    [user1, user2] = await ethers.getSigners();
    console.log(user1.address, user2.address, "user accounts");
    // const contractName = "UniswapV2Adapter";
    // const gasEstimate = ethers.BigNumber.from(120000);
    const gasLimit = 16000000; // Manually specify gas limit

    // sushiswap
    const SushiV2Adapter = await ethers.getContractFactory("UniswapV2Adapter");
    sushiswapAdapter = await SushiV2Adapter.deploy(
      "UniswapV2Adapter",
      "0x71524B4f93c58fcbF659783284E38825f0622859",
      3n,
      1600000,
      { gasLimit }
    );
    await sushiswapAdapter.deployed();
    await sushiswapAdapter.deployTransaction.wait();
    sushiswapCA = sushiswapAdapter.address;

    // uniswap
    const UniswapV2Adapter = await ethers.getContractFactory(
      "UniswapV2Adapter"
    );
    uniswapV2Adapter = await UniswapV2Adapter.deploy(
      "UniswapAdapter",
      "0x8909Dc15e40173Ff4699343b6eB8132c65e18eC6",
      3n,
      1600000,
      { gasLimit }
    );
    await uniswapV2Adapter.deployed();
    uniswapV2CA = uniswapV2Adapter.address;

    // pancakeswap
    const PancakeswapAdapter = await ethers.getContractFactory(
      "UniswapV2Adapter"
    );
    pancakeswapV2Adapter = await PancakeswapAdapter.deploy(
      "PancakeSwapAdapter",
      "0x02a84c1b3BBD7401a5f7fa98a384EBC70bB5749E",
      3n,
      1600000,
      { gasLimit }
    );
    await pancakeswapV2Adapter.deployed();
    pancakeV2CA = pancakeswapV2Adapter.address;

    // baseswap
    const BaseswapAdapter = await ethers.getContractFactory("UniswapV2Adapter");
    baseswapV2Adapter = await BaseswapAdapter.deploy(
      "BaseswapAdapter",
      "0xFDa619b6d20975be80A10332cD39b9a4b0FAa8BB",
      3n,
      1600000,
      { gasLimit }
    );
    await baseswapV2Adapter.deployed();
    baseswapV2CA = baseswapV2Adapter.address;

    // pancake v3
    const PancakeswapV3Adapter = await ethers.getContractFactory(
      "PancakeV3Adapter"
    );
    pancakeswapV3Adapter = await PancakeswapV3Adapter.deploy(
      "PancakeV3Adapter",
      385_000,
      385_000 - 60_000,
      "0xB048Bbc1Ee6b733FFfCFb9e9CeF7375518e25997",
      "0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865",
      [100, 500, 2500, 10_000]
    );
    await pancakeswapV3Adapter.deployed();
    pancakeswapV3CA = pancakeswapV3Adapter.address;

    // uniswap v3
    const UniswapV3Adapter = await ethers.getContractFactory(
      "UniswapV3Adapter"
    );
    uniswapV3Adapter = await UniswapV3Adapter.deploy(
      "UniswapV3Adapter",
      300_000,
      300_000,
      "0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a",
      "0x33128a8fC17869897dcE68Ed026d694621f6FDfD",
      [500, 3_000, 10_000],
      {
        gasLimit,
      }
    );
    await uniswapV3Adapter.deployed();
    uniswapV3CA = uniswapV3Adapter.address;

    // weth
    const WethAdapter = await ethers.getContractFactory("WNativeAdapter");
    const wethAdapter = await WethAdapter.deploy(
      "WETHAdapter",
      "0x4200000000000000000000000000000000000006",
      80_000
    );
    await wethAdapter.deployed();
    const wethCA = wethAdapter.address;

    // Router
    trustedTokens = [
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

    // Deploy MonagRouter contract
    const MonagRouter = await ethers.getContractFactory("AmertisRouter");
    monagRouter = await MonagRouter.deploy(
      [
        sushiswapCA,
        uniswapV2CA,
        pancakeV2CA,
        baseswapV2CA,
        uniswapV3CA,
        pancakeswapV3CA,
        wethCA,
      ],
      trustedTokens,
      user1.address,
      wnative
    );
    await monagRouter.deployed();
    routerCA = monagRouter.address;

    console.log(sushiswapCA);
    console.log(uniswapV2CA);
    console.log(baseswapV2CA);
    console.log(pancakeV2CA);
    console.log(uniswapV3CA);
    console.log(wethCA, "weth");
    console.log(pancakeswapV3CA);
    console.log(routerCA);
  });

  describe("findBestPathWithGas", function () {
    console.log("running");
    it("should return the best path with gas", async function () {
      const fee = BigInt(3); // Fee represented in 1e4 format
      const FEE_DENOMINATOR = BigInt(1e4);
      amountIn = ethers.utils.parseEther("0.004").toBigInt(); // Input amount
      console.log(amountIn, "amount in");
      const tokenIn = "0x4200000000000000000000000000000000000006"; // Token input address
      const tokenOut = "0xFF0C532FDB8Cd566Ae169C1CB157ff2Bdc83E105"; // Token output address
      const maxSteps = 2; // Max steps
      const gasPrice = 120000; // Gas price

      console.log(
        amountIn,
        tokenIn,
        tokenOut,
        maxSteps,
        gasPrice,
        "in here in here"
      );

      // console.log(monagRouter, "monag router")v;
      const [amounts, adapters, path, gasEstimate] =
        await monagRouter.findBestPathWithGas(
          amountIn,
          tokenIn,
          tokenOut,
          maxSteps,
          gasPrice
        );
      amountInReturned = BigInt(amounts[0]);
      amountOut = BigInt(amounts[amounts.length - 1]);
      adapterUsed = adapters;
      pathUsed = path;
      gasEstimatedToBeUsed = BigInt(gasEstimate);

      const tokenOutDecimal = await getTokenDecimals(path[1]);

      console.log(
        ethers.utils
          .formatUnits(amountOut.toString(), tokenOutDecimal)
          .toString(),
        "value of amount out"
      );

      console.log(
        amountInReturned,
        amountOut,
        adapterUsed,
        pathUsed,
        gasEstimatedToBeUsed
      );

      // Assertions
      expect(amountInReturned).equal(amountIn);
      console.log(
        "----------------------------------------------------------------"
      );
      console.log("next case");
      console.log(
        "----------------------------------------------------------------"
      );
    });
  });
  describe("swapNoSplitFromNative", function () {
    it("should swap tokens without splitting", async function () {
      console.log(
        amountInReturned,
        amountOut,
        adapterUsed,
        pathUsed,
        gasEstimatedToBeUsed,
        "second describe"
      );
      const fee = BigInt(30); // Fee represented in 1e4 format
      // const FEE_DENOMINATOR = BigInt(1e4);
      amountOut = calculateSlippageAdjustedOutput(amountOut, 5);

      // Call swapNoSplit function
      const tx = await monagRouter.swapNoSplitFromNative(
        // [amountInReturned, amountOut, pathUsed, adapterUsed],
        [amountInReturned, amountOut, pathUsed, adapterUsed],
        user1.address,
        fee,
        {
          gasLimit: gasEstimatedToBeUsed,
          value: amountIn,
        }
      );

      // Wait for the transaction to be mined
      await tx.wait();

      await checkERC20Balance(user1.address, pathUsed[0]);

      await checkERC20Balance(user1.address, pathUsed[1]);

      // Log the transaction hash
      console.log("Transaction Hash:", tx.hash);
    });
  });
  describe("swapToNative Tests", function () {
    it("should swap tokens back to ETH", async function () {
      const fee = BigInt(30); // Fee represented in 1e4 format
      const amountIn = amountOut; // Use the amountOut from the previous test
      const tokenIn = pathUsed[pathUsed.length - 1]; // Token input address is the last token in the pathUsed array
      const tokenOut = "0x4200000000000000000000000000000000000006"; // Token output address is the wrapped native token (WETH)
      const maxSteps = 2; // Max steps
      const gasPrice = 120000; // Gas price

      console.log(
        amountIn,
        tokenIn,
        tokenOut,
        maxSteps,
        gasPrice,
        "swapToNative"
      );

      // Find the best path to swap tokens back to ETH
      const [amounts, adapters, path, gasEstimate] =
        await monagRouter.findBestPathWithGas(
          amountIn,
          tokenIn,
          tokenOut,
          maxSteps,
          gasPrice
        );

      const amountOutReturned = BigInt(amounts[amounts.length - 1]); // Amount of ETH returned

      // Assertions
      expect(amountOutReturned > 0).to.be.true; // Ensure that amountOutReturned is greater than 0

      // Call the swapNoSplitToNative function
      const tx = await monagRouter.swapNoSplitToNative(
        [amountIn, amountOutReturned, path, adapters],
        user1.address,
        fee,
        {
          gasLimit: gasEstimate,
        }
      );

      // Wait for the transaction to be mined
      await tx.wait();

      // Log the transaction hash
      console.log("Transaction Hash:", tx.hash);
    });
  });
});

async function checkERC20Balance(walletAddress, erc20Address) {
  // Get ERC20 contract instance
  const erc20ABI = ["function balanceOf(address) view returns (uint256)"];
  const erc20Contract = new ethers.Contract(
    erc20Address,
    erc20ABI,
    ethers.provider
  );

  // Connect to wallet
  const wallet = await ethers.getSigner(walletAddress);

  // Call balanceOf function
  const balance = await erc20Contract.balanceOf(walletAddress);
  console.log(`ERC20 Balance of ${walletAddress}: ${balance.toString()}`);
  return balance;
}

async function getTokenDecimals(tokenAddress: string): Promise<bigint> {
  // Get ERC20 contract instance
  const erc20ABI = ["function decimals() view returns (uint8)"];
  const erc20Contract = new ethers.Contract(
    tokenAddress,
    erc20ABI,
    ethers.provider
  );

  // Call decimals function
  const decimals = await erc20Contract.decimals();

  return BigInt(decimals);
}

export function calculateSlippageAdjustedOutput(
  expectedOutput: bigint,
  slippagePercentage = 10
) {
  console.log(slippagePercentage, "slippage %");
  const slippageAmount = BigInt(
    Math.round((slippagePercentage / 100) * Number(expectedOutput))
  );
  const adjustedOutput = expectedOutput - slippageAmount;
  console.log(
    expectedOutput,
    slippageAmount,
    "expectedOutput -> slippageAmount"
  );
  console.log(adjustedOutput, "adjustedOutput ");
  return adjustedOutput;
}
