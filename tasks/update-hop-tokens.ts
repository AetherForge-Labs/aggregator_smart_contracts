import { ethers } from "hardhat";
import { task } from "hardhat/config";
import Prompt from "prompt-sync";

const prompt = Prompt({ sigint: true });

task(
  "update-hop-tokens",
  "Updates MonagRouter's hop-tokens according to `deployOptions.json`.'",
  async function (_, hre, __) {
    const networkId = hre.network.name;
    const [deployer] = await hre.ethers.getSigners();
    const MonagRouter = await getRouterContract(networkId);
    const hopTokensWhitelist = await getHopTokensWhitelist(networkId);
    await updateHopTokens(MonagRouter, deployer, hopTokensWhitelist);
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
  const path = `../deployments/${networkId}/MonagRouter.json`;
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

async function updateHopTokens(
  MonagRouter: any,
  deployerSigner: any,
  hopTokensWhitelist: any
) {
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

function getHopTokensWhitelist(networkId: string) {
  const deployOptions = require("../misc/deployOptions");
  if (!deployOptions[networkId] || !deployOptions[networkId].hopTokens)
    throw new Error(
      `Can't find hop-token-whitelist for networkId: ${networkId}`
    );
  return deployOptions[networkId].hopTokens;
}

async function getTrustedTokensForRouter(MonagRouter: any) {
  let trustedTokensCount = await MonagRouter.trustedTokensCount().then(
    (r: any) => r.toNumber()
  );
  return Promise.all(
    [...Array(trustedTokensCount).keys()].map((i) =>
      MonagRouter.TRUSTED_TOKENS(i)
    )
  );
}

async function finale(res: any) {
  console.log(`Transaction pending: ${res.hash}`);
  await res.wait();
  console.log("Done! 🎉");
}
