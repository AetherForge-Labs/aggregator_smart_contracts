import "dotenv/config";
import { HardhatUserConfig } from "hardhat/config";
// import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "hardhat-contract-sizer";
import "hardhat-deploy-ethers";
import "hardhat-abi-exporter";
import "hardhat-gas-reporter";
import "hardhat-log-remover";
import "hardhat-tracer";
import "hardhat-deploy";

// Tasks
// import "./tasks/update-hop-tokens";
// import "./tasks/update-adapters";
// import "./tasks/verify-contract";
// import "./tasks/find-best-path";
// import "./tasks/find-best-path-wrapped";
// import "./tasks/list-adapters";

const SEPOLIA_RPC = getEnvValSafe("SEPOLIA_RPC");
const MAINET_RPC = getEnvValSafe("MAINET_RPC");
const ARBITRUM_RPC = getEnvValSafe("ARBITRUM_RPC");
const BASE_RPC = getEnvValSafe("BASE_RPC");
const MONAD_RPC = getEnvValSafe("MONAD_RPC");
const SEPOLIA_PK_DEPLOYER = getEnvValSafe("SEPOLIA_PK_DEPLOYER");
const MONAD_PK_DEPLOYER = getEnvValSafe("MONAD_PK_DEPLOYER");
const ARBITRUM_PK_DEPLOYER = getEnvValSafe("ARBITRUM_PK_DEPLOYER");
const ETHERSCAN_API_KEY = getEnvValSafe("ETHERSCAN_API_KEY", false);

function getEnvValSafe(key: string, required = true) {
  const endpoint = process.env[key];
  if (!endpoint && required) throw `Missing env var ${key}`;
  return endpoint;
}

const config: HardhatUserConfig = {
  mocha: {
    timeout: 1e6,
  },

  solidity: {
    compilers: [
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 999,
          },
        },
      },
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 999,
          },
        },
      },
    ],
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
    customChains: [
      {
        network: "base",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org",
        },
      },
      {
        network: "monad",
        chainId: 4113,
        urls: {
          apiURL: "https://explorer.monad.xyz/api",
          browserURL: "https://basescan.org",
        },
      },
    ],
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      // chainId: 43114,
      forking: {
        enabled: true,
        url: BASE_RPC!,
        blockNumber: 13294660,
      },
      accounts: {
        accountsBalance: "10000000000000000000",
        count: 200,
      },
    },
    sepolia: {
      chainId: 11155111,
      url: SEPOLIA_RPC,
      accounts: [SEPOLIA_PK_DEPLOYER!],
    },
    arbitrum: {
      chainId: 42161,
      url: ARBITRUM_RPC,
      accounts: [SEPOLIA_PK_DEPLOYER!],
    },
    base: {
      chainId: 8453,
      url: BASE_RPC,
      accounts: [ARBITRUM_PK_DEPLOYER!],
    },
    monad: {
      chainId: 43113,
      url: MONAD_RPC,
      accounts: [MONAD_PK_DEPLOYER!],
    },
  },
  gasReporter: {
    enabled: false,
    gasPrice: 225,
  },
};

export default config;
