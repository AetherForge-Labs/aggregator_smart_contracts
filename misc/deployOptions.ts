import addresses from "./addresses.json";

interface AdapterWhitelist {
  [key: string]: string[];
}

interface HopTokens {
  [key: string]: string[];
}

interface Assets {
  [key: string]: string;
}

interface NetworkConfig {
  minimalAdapterWhitelist?: string[];
  adapterWhitelist: string[];
  hopTokens: string[];
  wnative: string;
}

const { sepolia: sep, optimism: opt, monad: nad } = addresses;

export const networkConfig: { [key: string]: NetworkConfig } = {
  sepolia: {
    adapterWhitelist: [
      // 'BalancerV2Adapter',
      "Curve3cryptoAdapter",
      "Curve2stableAdapter",
      "CurveFraxVstAdapter",
      "CurveFraxBpAdapter",
      "CurveMetaAdapter",
      "DodoV1Adapter",
      "DodoV2Adapter",
      "GmxAdapter",
      // 'SaddleArbUsdAdapter',
      // 'SaddleArbUsdV2Adapter',
      "SushiswapAdapter",
      "SwaprAdapter",
      "UniswapV3Adapter",
      "LiquidityBook2Adapter",
      // 'LiquidityBookAdapter',
      // 'KyberElasticAdapter',
      "WoofiV2Adapter",
      // 'OreoswapAdapter',
      "CamelotAdapter",
      "WETHAdapter",
      // 'CamelotAlgebraAdapter',
      // 'ArbiDexAdapter',
      "RamsesV2Adapter",
      "PancakeV3Adapter",
      "WombatAdapter",
      "Curve2crvUsdFrax",
      "Curve2crvUsdUsdc",
      "Curve2crvUsdUsdce",
      "Curve2crvUsdUsdt",
    ],
    hopTokens: [
      sep.assets.WETH,
      sep.assets.WBTC,
      sep.assets.USDC,
      sep.assets.USDCe,
      sep.assets.ARB,
      sep.assets.USDT,
      sep.assets.DAI,
    ],
    wnative: sep.assets.WETH,
  },
  monad: {
    adapterWhitelist: [
      "BeethovenxAdapter",
      "CurveMetaSUSDCRVAdapter",
      "CurveSethAdapter",
      "Curve3stableAdapter",
      "CurveWstethAdapter",

      "SaddleFraxBPAdapter",
      "SaddleMetaFraxAdapter",
      "SaddleMetaSUSDAdapter",
      "SaddleOptUsdAdapter",

      "KyberElasticAdapter",
      "ZipswapAdapter",
      "UniswapV3Adapter",
      "VelodromeAdapter",
      "WoofiV2Adapter",
    ],
    hopTokens: [
      nad.assets.WETH,
      nad.assets.WBTC,
      nad.assets.USDC,
      nad.assets.USDT,
      nad.assets.DAI,
    ],
    wnative: nad.assets.WETH,
  },
};

export default networkConfig;
