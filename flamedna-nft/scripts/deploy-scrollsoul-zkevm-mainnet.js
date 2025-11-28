/**
 * ScrollSoulSBT - Polygon zkEVM Mainnet Deployment Script
 * 
 * Deploys ScrollSoulSBT contract to Polygon zkEVM mainnet
 * for Gate 4 protocol sovereign minting within the ScrollVerse ecosystem
 * 
 * WARNING: This script deploys to MAINNET. Ensure you have:
 * - Tested thoroughly on testnet
 * - Verified contract code
 * - Sufficient ETH for deployment
 * 
 * Usage:
 *   npx hardhat run scripts/deploy-scrollsoul-zkevm-mainnet.js --network polygonZkEvmMainnet
 * 
 * @author Chais Hill - OmniTech1
 */

const hre = require("hardhat");

async function main() {
  console.log("=".repeat(60));
  console.log("ScrollSoulSBT - Polygon zkEVM MAINNET Deployment");
  console.log("=".repeat(60));
  console.log("\n⚠️  WARNING: DEPLOYING TO MAINNET ⚠️");
  console.log("Ensure you have tested on testnet first!\n");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");
  
  // Safety check
  if (balance < hre.ethers.parseEther("0.01")) {
    console.error("WARNING: Low balance! Consider adding more ETH for deployment.");
  }
  
  // Deployment parameters - production values
  const config = {
    scrollSoulSBT: {
      name: "ScrollSoul SBT",
      symbol: "SCROLLSOUL",
      baseURI: process.env.SCROLLSOUL_BASE_URI || "ipfs://QmScrollSoulMainnet/"
    }
  };
  
  console.log("\n--- Deployment Configuration ---");
  console.log("Network:", hre.network.name);
  console.log("Chain ID:", (await hre.ethers.provider.getNetwork()).chainId.toString());
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
  
  // Note: Minting is NOT enabled by default on mainnet for safety
  console.log("\n⚠️  Minting is DISABLED by default for safety");
  console.log("Call setMintActive(true) when ready to enable minting");
  
  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("MAINNET DEPLOYMENT COMPLETE - GATE 4 PROTOCOL");
  console.log("=".repeat(60));
  console.log("\nContract Address:");
  console.log("  ScrollSoulSBT:", scrollSoulSBTAddress);
  console.log("\nNetwork:", hre.network.name);
  console.log("Chain ID:", (await hre.ethers.provider.getNetwork()).chainId.toString());
  
  // Verification instructions
  console.log("\n--- IMPORTANT: Verify Contract ---");
  console.log(`npx hardhat verify --network ${hre.network.name} ${scrollSoulSBTAddress} "${config.scrollSoulSBT.name}" "${config.scrollSoulSBT.symbol}" "${config.scrollSoulSBT.baseURI}"`);
  
  // Explorer URLs
  console.log("\n--- Explorer URL ---");
  console.log("Mainnet Explorer:", `https://zkevm.polygonscan.com/address/${scrollSoulSBTAddress}`);
  
  // Post-deployment steps
  console.log("\n--- Post-Deployment Steps ---");
  console.log("1. Verify contract on Polygonscan");
  console.log("2. Set correct base URI if different from placeholder");
  console.log("3. Enable minting when ready: setMintActive(true)");
  console.log("4. Test mint with sample sovereign data");
  
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
      status: "deployed",
      sovereignMintingEnabled: false,
      note: "Enable minting with setMintActive(true)"
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
