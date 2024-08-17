import { ethers } from "hardhat";
import { task } from "hardhat/config";
import Prompt from "prompt-sync";
import networkConfig from "../misc/deployOptions";
// const prompt = require("prompt-sync")({ sigint: true });
const prompt = Prompt({ sigint: true });

task(
  "update-adapters",
  "Updates MonagRouter's adapters according to `deployOptions.json`.'",
  async function (_, hre, __) {
    const networkId = hre.network.name;
    const [deployer] = await hre.ethers.getSigners();
    const MonagRouter = await getRouterContract(networkId);
    const adaptersWhitelist = await getAdapterWhitelist(
      hre.deployments,
      networkId
    );
    await updateAdapters(MonagRouter, deployer, adaptersWhitelist);
  }
);

async function getRouterContract(networkId: string) {
  const routerAddress = getRouterAddressForNetworkId(networkId);
  return getRouterContractForAddress(routerAddress);
}

function getRouterAddressForNetworkId(networkId: string) {
  return getRouterDeployment(networkId).address;
}

function getRouterDeployment(networkId: string) {
  const path = `./ignition/deployments/${networkId}/MonagRouter.json`;
  try {
    return require(path);
  } catch {
    throw new Error(
      `Can't find router deployment for networkID: "${networkId}"`
    );
  }
}

async function getRouterContractForAddress(routerAddress: string) {
  return ethers.getContractAt("MonagRouter", routerAddress);
}

async function updateAdapters(
  MonagRouter: any,
  deployerSigner: any,
  adaptersWhitelist: any
) {
  let currentAdapters = await getAdaptersForRouter(MonagRouter);
  let allAdaptersIncluded = haveSameElements(
    currentAdapters,
    adaptersWhitelist
  );
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

function showDiff(currentHopTokens: any, hopTokensWhitelist: any) {
  const diff = findDiff(currentHopTokens, hopTokensWhitelist);
  console.log("Difference:");
  console.table(diff);
}

function haveSameElements(arr1: any, arr2: any) {
  return (
    arr2.every((a: any) => arr1.includes(a)) &&
    arr1.every((a: any) => arr2.includes(a))
  );
}

function findDiff(actual: any, desired: any) {
  const addTags = (arr: any, tag: any) =>
    Object.fromEntries(arr.map((e: any) => [e, tag]));
  const toRm = actual.filter((e1: any) => !desired.some((e2: any) => e1 == e2));
  const toAdd = desired.filter(
    (e1: any) => !actual.some((e2: any) => e1 == e2)
  );
  return {
    ...addTags(toAdd, "add"),
    ...addTags(toRm, "rm"),
  };
}

async function getAdapterWhitelist(deployments: any, networkId: string) {
  const whitelistNamed = getAdapterWhitelistNamed(networkId);
  return Promise.all(
    whitelistNamed.map((adapterName: any) => {
      return deployments.get(adapterName).then((deployment: any) => {
        if (deployment) return deployment.address;
        else throw new Error(`No deployment for ${adapterName}`);
      });
    })
  );
}

function getAdapterWhitelistNamed(networkId: string) {
  const deployOptions = networkConfig;
  if (!deployOptions[networkId] || !deployOptions[networkId].adapterWhitelist)
    throw new Error(`Can't find adapter-whitelist for networkId: ${networkId}`);
  return deployOptions[networkId].adapterWhitelist;
}

async function getAdaptersForRouter(monagRouter: any) {
  let adapterCount = await monagRouter
    .adaptersCount()
    .then((r: any) => r.toNumber());
  return Promise.all(
    [...Array(adapterCount).keys()].map((i) => monagRouter.ADAPTERS(i))
  );
}

async function finale(res: any) {
  console.log(`Transaction pending: ${res.hash}`);
  await res.wait();
  console.log("Done! 🎉");
}
