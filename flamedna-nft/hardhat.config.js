require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    // Local development
    hardhat: {
      chainId: 1337
    },
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    
    // Scroll Networks
    scrollSepolia: {
      url: process.env.SCROLL_SEPOLIA_RPC || "https://sepolia-rpc.scroll.io/",
      chainId: 534351,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    },
    scrollMainnet: {
      url: process.env.SCROLL_MAINNET_RPC || "https://rpc.scroll.io/",
      chainId: 534352,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    },
    
    // Ethereum Networks
    sepolia: {
      url: process.env.SEPOLIA_RPC || `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      chainId: 11155111,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    },
    mainnet: {
      url: process.env.MAINNET_RPC || `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      chainId: 1,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    },
    
    // Polygon Networks
    polygon: {
      url: process.env.POLYGON_RPC || "https://polygon-rpc.com",
      chainId: 137,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    },
    polygonMumbai: {
      url: process.env.MUMBAI_RPC || "https://rpc-mumbai.maticvigil.com",
      chainId: 80001,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    },
    
    // Polygon zkEVM Networks (for ScrollSoulSBT deployment)
    polygonZkEvmTestnet: {
      url: process.env.POLYGON_ZKEVM_TESTNET_RPC || "https://rpc.cardona.zkevm-rpc.com",
      chainId: 2442,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    },
    polygonZkEvmMainnet: {
      url: process.env.POLYGON_ZKEVM_MAINNET_RPC || "https://zkevm-rpc.com",
      chainId: 1101,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  },
  
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY || "",
      sepolia: process.env.ETHERSCAN_API_KEY || "",
      polygon: process.env.POLYGONSCAN_API_KEY || "",
      polygonMumbai: process.env.POLYGONSCAN_API_KEY || "",
      scrollSepolia: process.env.SCROLLSCAN_API_KEY || "",
      scrollMainnet: process.env.SCROLLSCAN_API_KEY || "",
      polygonZkEvmTestnet: process.env.POLYGONSCAN_ZKEVM_API_KEY || "",
      polygonZkEvmMainnet: process.env.POLYGONSCAN_ZKEVM_API_KEY || ""
    },
    customChains: [
      {
        network: "scrollSepolia",
        chainId: 534351,
        urls: {
          apiURL: "https://api-sepolia.scrollscan.com/api",
          browserURL: "https://sepolia.scrollscan.com"
        }
      },
      {
        network: "scrollMainnet",
        chainId: 534352,
        urls: {
          apiURL: "https://api.scrollscan.com/api",
          browserURL: "https://scrollscan.com"
        }
      },
      {
        network: "polygonZkEvmTestnet",
        chainId: 2442,
        urls: {
          apiURL: "https://api-cardona-zkevm.polygonscan.com/api",
          browserURL: "https://cardona-zkevm.polygonscan.com"
        }
      },
      {
        network: "polygonZkEvmMainnet",
        chainId: 1101,
        urls: {
          apiURL: "https://api-zkevm.polygonscan.com/api",
          browserURL: "https://zkevm.polygonscan.com"
        }
      }
    ]
  },
  
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY
  }
};
