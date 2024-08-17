import { deployAdapter, addresses } from "../../../utils";

const { factory, quoter } = addresses.monad.uniV3;

const networkName = "monad";
const contractName = "UniswapV3Adapter";
const tags = ["uniswapV3"];
const name = contractName;
const gasEstimate = 300_000;
const quoterGasLimit = 300_000;
const defaultFees = [500, 3_000, 10_000];
const args = [name, gasEstimate, quoterGasLimit, quoter, factory, defaultFees];

export default deployAdapter(
  networkName,
  tags,
  contractName,
  contractName,
  args
);
