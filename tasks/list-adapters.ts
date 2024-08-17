import { task } from "hardhat/config";

task(
  "list-adapters",
  "Lists all adapters for the current MonagRouter",
  async (_, hre, routerAddress) => {
    const monagRouter = await hre.ethers.getContractAt(
      "MonagRouter",
      routerAddress as unknown as string
    );

    const adapterLen = await monagRouter.adaptersCount();
    const adapterIndices = Array.from(Array(adapterLen).keys());
    const liveAdapters = await Promise.all(
      adapterIndices.map(async (i) => {
        const adapter = await monagRouter.ADAPTERS(i);
        const adapterContract = await hre.ethers.getContractAt(
          "MonagAdapter",
          adapter
        );
        const name = await adapterContract.name();
        return { adapter, name };
      })
    );
    console.table(liveAdapters);
  }
);
