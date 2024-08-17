"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.networkConfig = void 0;
const addresses_json_1 = __importDefault(require("./addresses.json"));
const { sepolia: sep, optimism: opt, monad: nad } = addresses_json_1.default;
exports.networkConfig = {
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
exports.default = exports.networkConfig;
