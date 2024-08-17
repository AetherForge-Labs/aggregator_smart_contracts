import { task } from "hardhat/config";
import { ethers } from "hardhat";
import * as addresses from "../misc/addresses.json";

const DEFAULT_MAX_HOPS = 3;

task(
  "find-best-path",
  "Queries MonagRouter for the best path",
  async (args, hre) => {
    const q = new Quoter(hre);
    const offer = await q.findBestPath(args);
    console.table(Object.entries(offer));
  }
)
  .addPositionalParam("amountIn", "Amount-in(fixed)")
  .addPositionalParam("tokenIn", "Address of token-in")
  .addPositionalParam("tokenOut", "Address of token-out")
  .addOptionalParam("maxHops", "Max number of hops for a path");

class Quoter {
  hre: any;
  assets: any;
  getERC20Decimals: any;

  constructor(_hre: any) {
    this.hre = _hre;
    this.assets = this.getKnownAssetsForNetwork(this.hre.network.name);
    // Below needs to be imported inside the task
    this.getERC20Decimals = require("../test/helpers").getERC20Decimals;
  }

  getKnownAssetsForNetwork(networkId: "sepolia" | "monad" | "optimism") {
    return addresses[networkId].assets;
  }

  async findBestPath(args: any) {
    const parsedArgs = await this.parseArgs(args);
    return this.getBestOfferFormatted(parsedArgs);
  }

  async parseArgs(args: any) {
    const tokenIn = this.parseAddress(args.tokenIn);
    const tokenOut = this.parseAddress(args.tokenOut);
    const amountIn = await this.parseFixed(args.amountIn, tokenIn);
    const maxHops = args.maxHops || DEFAULT_MAX_HOPS;
    return { amountIn, tokenIn, tokenOut, maxHops };
  }

  async parseFixed(amountFixed: string, token: string) {
    const dec = await this.getDecimalsForTkn(token);
    return this.hre.ethers.utils.parseUnits(amountFixed, dec);
  }

  async formatBN(amountBN: BigInt, token: string) {
    const dec = await this.getDecimalsForTkn(token);
    return this.hre.ethers.utils.formatUnits(amountBN, dec);
  }

  parseAddress(addressAlias: string) {
    if (/0x([0-9a-fA-F]{40})/.test(addressAlias)) return addressAlias;
    const address =
      this.assets[addressAlias] || this.assets[addressAlias.toUpperCase()];
    if (address == undefined)
      throw new Error(`Address-alias ${addressAlias} not recognized`);
    return address;
  }

  async getDecimalsForTkn(token: string) {
    return this.getERC20Decimals(this.hre.ethers.provider, token);
  }

  async getBestOfferFormatted(swapArgs: any) {
    const bestOffer = await this.getBestOffer(swapArgs);
    const formatted = await this.formatOutput(bestOffer);
    return formatted;
  }

  async getBestOffer(swapArgs: any) {
    const MonagRouter = await this.hre.ethers.getContract("MonagRouter");
    const offer = await MonagRouter.findBestPath(
      swapArgs.amountIn,
      swapArgs.tokenIn,
      swapArgs.tokenOut,
      swapArgs.maxHops
    );
    return offer;
  }

  async formatOutput(offer: any) {
    const amountInBN = offer.amounts[0];
    const amountOutBN = offer.amounts[offer.amounts.length - 1];
    const tokenIn = offer.path[0];
    const tokenOut = offer.path[offer.path.length - 1];
    const [amountInFixed, amountOutFixed] = await Promise.all([
      this.formatBN(amountInBN, tokenIn),
      this.formatBN(amountOutBN, tokenOut),
    ]);
    const adaptersNamed = await this.getAdapterNames(offer.adapters);
    const pathNamed = await this.getTokenSymbols(offer.path);
    return {
      adapters: offer.adapters.join(" => "),
      path: offer.path.join(" => "),
      adaptersNamed: adaptersNamed.join(" => "),
      pathNamed: pathNamed.join(" => "),
      amountIn: amountInFixed,
      amountOut: amountOutFixed,
    };
  }

  async getAdapterNames(adapters: any) {
    return Promise.all(adapters.map((a: any) => this.getName(a)));
  }

  async getTokenSymbols(tokens: any) {
    return Promise.all(tokens.map((t: string) => this.getSymbol(t)));
  }

  async getName(address: string) {
    const sig = "0x06fdde03"; // byte4(keccak256(name()))
    return this.rawCallToStr(address, sig);
  }

  async getSymbol(address: string) {
    const sig = "0x95d89b41"; // byte4(keccak256(symbol()))
    return this.rawCallToStr(address, sig);
  }

  async rawCallToStr(to: String, data: string) {
    const raw = await this.hre.ethers.provider.call({ to, data });
    return new ethers.utils.AbiCoder().decode(["string"], raw)[0];
  }
}
