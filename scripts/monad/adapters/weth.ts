import { deployAdapter, addresses } from "../../utils";

const { WETH } = addresses.monad.assets;

const networkName = "monad";
const tags = ["weth"];
const name = "WETHAdapter";
const contractName = "WNativeAdapter";

const gasEstimate = 80_000;
const wnative = WETH;
const args = [wnative, gasEstimate];

export default deployAdapter(networkName, tags, name, contractName, args);
