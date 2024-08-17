"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const config_1 = require("hardhat/config");
const prompt_sync_1 = __importDefault(require("prompt-sync"));
const deployOptions_1 = __importDefault(require("../misc/deployOptions"));
// const prompt = require("prompt-sync")({ sigint: true });
const prompt = (0, prompt_sync_1.default)({ sigint: true });
(0, config_1.task)("update-adapters", "Updates MonagRouter's adapters according to `deployOptions.json`.'", async function (_, hre, __) {
    const networkId = hre.network.name;
    const [deployer] = await hre.ethers.getSigners();
    const MonagRouter = await getRouterContract(networkId);
    const adaptersWhitelist = await getAdapterWhitelist(hre.deployments, networkId);
    await updateAdapters(MonagRouter, deployer, adaptersWhitelist);
});
async function getRouterContract(networkId) {
    const routerAddress = getRouterAddressForNetworkId(networkId);
    return getRouterContractForAddress(routerAddress);
}
function getRouterAddressForNetworkId(networkId) {
    return getRouterDeployment(networkId).address;
}
function getRouterDeployment(networkId) {
    const path = `./ignition/deployments/${networkId}/MonagRouter.json`;
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
async function updateAdapters(MonagRouter, deployerSigner, adaptersWhitelist) {
    let currentAdapters = await getAdaptersForRouter(MonagRouter);
    let allAdaptersIncluded = haveSameElements(currentAdapters, adaptersWhitelist);
    if (allAdaptersIncluded) {
        console.log("Current adapters match whitelist");
        return;
    }
    showDiff(currentAdapters, adaptersWhitelist);
    if (prompt("Proceed to set adapters? y/n") == "y") {
        await MonagRouter.connect(deployerSigner)
            .setAdapters(adaptersWhitelist)
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
async function getAdapterWhitelist(deployments, networkId) {
    const whitelistNamed = getAdapterWhitelistNamed(networkId);
    return Promise.all(whitelistNamed.map((adapterName) => {
        return deployments.get(adapterName).then((deployment) => {
            if (deployment)
                return deployment.address;
            else
                throw new Error(`No deployment for ${adapterName}`);
        });
    }));
}
function getAdapterWhitelistNamed(networkId) {
    const deployOptions = deployOptions_1.default;
    if (!deployOptions[networkId] || !deployOptions[networkId].adapterWhitelist)
        throw new Error(`Can't find adapter-whitelist for networkId: ${networkId}`);
    return deployOptions[networkId].adapterWhitelist;
}
async function getAdaptersForRouter(monagRouter) {
    let adapterCount = await monagRouter
        .adaptersCount()
        .then((r) => r.toNumber());
    return Promise.all([...Array(adapterCount).keys()].map((i) => monagRouter.ADAPTERS(i)));
}
async function finale(res) {
    console.log(`Transaction pending: ${res.hash}`);
    await res.wait();
    console.log("Done! 🎉");
}
