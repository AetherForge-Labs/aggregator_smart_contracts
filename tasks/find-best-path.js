"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("hardhat/config");
const hardhat_1 = require("hardhat");
const addresses = __importStar(require("../misc/addresses.json"));
const DEFAULT_MAX_HOPS = 3;
(0, config_1.task)("find-best-path", "Queries MonagRouter for the best path", async (args, hre) => {
    const q = new Quoter(hre);
    const offer = await q.findBestPath(args);
    console.table(Object.entries(offer));
})
    .addPositionalParam("amountIn", "Amount-in(fixed)")
    .addPositionalParam("tokenIn", "Address of token-in")
    .addPositionalParam("tokenOut", "Address of token-out")
    .addOptionalParam("maxHops", "Max number of hops for a path");
class Quoter {
    constructor(_hre) {
        this.hre = _hre;
        this.assets = this.getKnownAssetsForNetwork(this.hre.network.name);
        // Below needs to be imported inside the task
        this.getERC20Decimals = require("../test/helpers").getERC20Decimals;
    }
    getKnownAssetsForNetwork(networkId) {
        return addresses[networkId].assets;
    }
    async findBestPath(args) {
        const parsedArgs = await this.parseArgs(args);
        return this.getBestOfferFormatted(parsedArgs);
    }
    async parseArgs(args) {
        const tokenIn = this.parseAddress(args.tokenIn);
        const tokenOut = this.parseAddress(args.tokenOut);
        const amountIn = await this.parseFixed(args.amountIn, tokenIn);
        const maxHops = args.maxHops || DEFAULT_MAX_HOPS;
        return { amountIn, tokenIn, tokenOut, maxHops };
    }
    async parseFixed(amountFixed, token) {
        const dec = await this.getDecimalsForTkn(token);
        return this.hre.ethers.utils.parseUnits(amountFixed, dec);
    }
    async formatBN(amountBN, token) {
        const dec = await this.getDecimalsForTkn(token);
        return this.hre.ethers.utils.formatUnits(amountBN, dec);
    }
    parseAddress(addressAlias) {
        if (/0x([0-9a-fA-F]{40})/.test(addressAlias))
            return addressAlias;
        const address = this.assets[addressAlias] || this.assets[addressAlias.toUpperCase()];
        if (address == undefined)
            throw new Error(`Address-alias ${addressAlias} not recognized`);
        return address;
    }
    async getDecimalsForTkn(token) {
        return this.getERC20Decimals(this.hre.ethers.provider, token);
    }
    async getBestOfferFormatted(swapArgs) {
        const bestOffer = await this.getBestOffer(swapArgs);
        const formatted = await this.formatOutput(bestOffer);
        return formatted;
    }
    async getBestOffer(swapArgs) {
        const MonagRouter = await this.hre.ethers.getContract("MonagRouter");
        const offer = await MonagRouter.findBestPath(swapArgs.amountIn, swapArgs.tokenIn, swapArgs.tokenOut, swapArgs.maxHops);
        return offer;
    }
    async formatOutput(offer) {
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
    async getAdapterNames(adapters) {
        return Promise.all(adapters.map((a) => this.getName(a)));
    }
    async getTokenSymbols(tokens) {
        return Promise.all(tokens.map((t) => this.getSymbol(t)));
    }
    async getName(address) {
        const sig = "0x06fdde03"; // byte4(keccak256(name()))
        return this.rawCallToStr(address, sig);
    }
    async getSymbol(address) {
        const sig = "0x95d89b41"; // byte4(keccak256(symbol()))
        return this.rawCallToStr(address, sig);
    }
    async rawCallToStr(to, data) {
        const raw = await this.hre.ethers.provider.call({ to, data });
        return new hardhat_1.ethers.utils.AbiCoder().decode(["string"], raw)[0];
    }
}
