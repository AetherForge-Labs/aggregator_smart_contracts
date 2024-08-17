"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("hardhat/config");
(0, config_1.task)("list-adapters", "Lists all adapters for the current MonagRouter", async (_, hre, routerAddress) => {
    const monagRouter = await hre.ethers.getContractAt("MonagRouter", routerAddress);
    const adapterLen = await monagRouter.adaptersCount();
    const adapterIndices = Array.from(Array(adapterLen).keys());
    const liveAdapters = await Promise.all(adapterIndices.map(async (i) => {
        const adapter = await monagRouter.ADAPTERS(i);
        const adapterContract = await hre.ethers.getContractAt("MonagAdapter", adapter);
        const name = await adapterContract.name();
        return { adapter, name };
    }));
    console.table(liveAdapters);
});
