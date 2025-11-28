/**
 * ScrollSoulSBT - Polygon zkEVM Testnet Deployment Script
 * 
 * Deploys ScrollSoulSBT contract to Polygon zkEVM Cardona testnet
 * for Gate 4 protocol sovereign minting within the ScrollVerse ecosystem
 * 
 * Usage:
 *   npx hardhat run scripts/deploy-scrollsoul-zkevm-testnet.js --network polygonZkEvmTestnet
 * 
 * @author Chais Hill - OmniTech1
 */

const hre = require("hardhat");

async function main() {
  console.log("=".repeat(60));
  console.log("ScrollSoulSBT - Polygon zkEVM Testnet Deployment");
  console.log("=".repeat(60));
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("\nDeploying contracts with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");
  
  // Deployment parameters
  const config = {
    scrollSoulSBT: {
      name: "ScrollSoul SBT",
      symbol: "SCROLLSOUL",
      baseURI: process.env.SCROLLSOUL_BASE_URI || "ipfs://QmScrollSoulPlaceholder/"
    }
  };
  
  console.log("\n--- Deployment Configuration ---");
  console.log("Network:", hre.network.name);
  console.log("ScrollSoulSBT Name:", config.scrollSoulSBT.name);
  console.log("ScrollSoulSBT Symbol:", config.scrollSoulSBT.symbol);
  console.log("Base URI:", config.scrollSoulSBT.baseURI);
  
  // Deploy ScrollSoulSBT
  console.log("\n--- Deploying ScrollSoulSBT ---");
  const ScrollSoulSBT = await hre.ethers.getContractFactory("ScrollSoulSBT");
  const scrollSoulSBT = await ScrollSoulSBT.deploy(
    config.scrollSoulSBT.name,
    config.scrollSoulSBT.symbol,
    config.scrollSoulSBT.baseURI
  );
  
  await scrollSoulSBT.waitForDeployment();
  const scrollSoulSBTAddress = await scrollSoulSBT.getAddress();
  console.log("ScrollSoulSBT deployed to:", scrollSoulSBTAddress);
  
  // Enable minting
  console.log("\n--- Enabling Minting ---");
  const enableTx = await scrollSoulSBT.setMintActive(true);
  await enableTx.wait();
  console.log("Minting enabled successfully");
  
  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("DEPLOYMENT COMPLETE - GATE 4 PROTOCOL READY");
  console.log("=".repeat(60));
  console.log("\nContract Address:");
  console.log("  ScrollSoulSBT:", scrollSoulSBTAddress);
  console.log("\nNetwork:", hre.network.name);
  console.log("Chain ID:", (await hre.ethers.provider.getNetwork()).chainId.toString());
  
  // Verification instructions
  console.log("\n--- Verification Command ---");
  console.log(`npx hardhat verify --network ${hre.network.name} ${scrollSoulSBTAddress} "${config.scrollSoulSBT.name}" "${config.scrollSoulSBT.symbol}" "${config.scrollSoulSBT.baseURI}"`);
  
  // Explorer URLs
  console.log("\n--- Explorer URLs ---");
  if (hre.network.name === "polygonZkEvmTestnet") {
    console.log("Testnet Explorer:", `https://cardona-zkevm.polygonscan.com/address/${scrollSoulSBTAddress}`);
  } else if (hre.network.name === "polygonZkEvmMainnet") {
    console.log("Mainnet Explorer:", `https://zkevm.polygonscan.com/address/${scrollSoulSBTAddress}`);
  }
  
  // Sample mint instructions
  console.log("\n--- Sample Mint Command ---");
  console.log("After verification, use the following parameters to mint:");
  console.log("  sovereignName: 'Iam 👑 King'");
  console.log("  lineageID: 1");
  console.log("  coherenceSignature963: '963Hz_Anchor'");
  
  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      ScrollSoulSBT: {
        address: scrollSoulSBTAddress,
        ...config.scrollSoulSBT
      }
    },
    gate4Protocol: {
      status: "active",
      sovereignMintingEnabled: true
    }
  };
  
  console.log("\n--- Deployment Info (JSON) ---");
  console.log(JSON.stringify(deploymentInfo, null, 2));
  
  return deploymentInfo;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
