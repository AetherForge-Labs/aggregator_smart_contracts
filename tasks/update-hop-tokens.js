"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const config_1 = require("hardhat/config");
const prompt_sync_1 = __importDefault(require("prompt-sync"));
const prompt = (0, prompt_sync_1.default)({ sigint: true });
(0, config_1.task)("update-hop-tokens", "Updates MonagRouter's hop-tokens according to `deployOptions.json`.'", async function (_, hre, __) {
    const networkId = hre.network.name;
    const [deployer] = await hre.ethers.getSigners();
    const MonagRouter = await getRouterContract(networkId);
    const hopTokensWhitelist = await getHopTokensWhitelist(networkId);
    await updateHopTokens(MonagRouter, deployer, hopTokensWhitelist);
});
async function getRouterContract(networkId) {
    const routerAddress = getRouterAddressForNetworkId(networkId);
    return getRouterContractForAddress(routerAddress);
}
function getRouterAddressForNetworkId(networkId) {
    return getRouterDeployment(networkId).address;
}
function getRouterDeployment(networkId) {
    const path = `../deployments/${networkId}/MonagRouter.json`;
    try {
        return require(path);
    }
    catch {
        throw new Error(`Can't find router deployment for networkID: "${networkId}"`);
    }
}
async function getRouterContractForAddress(routerAddress) {
    return hardhat_1.ethers.getContractAt("MonagRouter", routerAddress);
}
async function updateHopTokens(MonagRouter, deployerSigner, hopTokensWhitelist) {
    const currentHopTokens = await getTrustedTokensForRouter(MonagRouter);
    const allIncluded = haveSameElements(currentHopTokens, hopTokensWhitelist);
    if (allIncluded) {
        console.log("Current hop-tokens match whitelist");
        return;
    }
    showDiff(currentHopTokens, hopTokensWhitelist);
    if (prompt("Proceed to set hop-tokens? y/n") == "y") {
        await MonagRouter.connect(deployerSigner)
            .setTrustedTokens(hopTokensWhitelist)
            .then(finale);
    }
}
function showDiff(currentHopTokens, hopTokensWhitelist) {
    const diff = findDiff(currentHopTokens, hopTokensWhitelist);
    console.log("Difference:");
    console.table(diff);
}
function haveSameElements(arr1, arr2) {
    return (arr2.every((a) => arr1.includes(a)) &&
        arr1.every((a) => arr2.includes(a)));
}
function findDiff(actual, desired) {
    const addTags = (arr, tag) => Object.fromEntries(arr.map((e) => [e, tag]));
    const toRm = actual.filter((e1) => !desired.some((e2) => e1 == e2));
    const toAdd = desired.filter((e1) => !actual.some((e2) => e1 == e2));
    return {
        ...addTags(toAdd, "add"),
        ...addTags(toRm, "rm"),
    };
}
function getHopTokensWhitelist(networkId) {
    const deployOptions = require("../misc/deployOptions");
    if (!deployOptions[networkId] || !deployOptions[networkId].hopTokens)
        throw new Error(`Can't find hop-token-whitelist for networkId: ${networkId}`);
    return deployOptions[networkId].hopTokens;
}
async function getTrustedTokensForRouter(MonagRouter) {
    let trustedTokensCount = await MonagRouter.trustedTokensCount().then((r) => r.toNumber());
    return Promise.all([...Array(trustedTokensCount).keys()].map((i) => MonagRouter.TRUSTED_TOKENS(i)));
}
async function finale(res) {
    console.log(`Transaction pending: ${res.hash}`);
    await res.wait();
    console.log("Done! 🎉");
}
