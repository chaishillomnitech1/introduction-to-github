/**
 * ScrollVerse Prosperity Protocol Deployment Script
 * 
 * Deploys the governance dashboard contract for monitoring and managing:
 * - Zakat treasury contributions and balances
 * - Collaborator revenue splits and earnings
 * - Yield tracking and distribution
 * - Permission management
 * - Audit trails
 * 
 * @author OmniTech1™
 */

const hre = require("hardhat");

async function main() {
  console.log("\n🌌 ScrollVerse Prosperity Protocol Deployment");
  console.log("═".repeat(60));
  
  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH");
  
  // Get sovereign address from environment or use deployer
  const sovereignAddress = process.env.SOVEREIGN_ADDRESS || deployer.address;
  console.log("👑 Sovereign address:", sovereignAddress);
  
  console.log("\n🚀 Deploying ScrollVerseProsperityProtocol...");
  
  // Deploy the contract
  const ScrollVerseProsperityProtocol = await hre.ethers.getContractFactory("ScrollVerseProsperityProtocol");
  const protocol = await ScrollVerseProsperityProtocol.deploy(sovereignAddress);
  
  await protocol.waitForDeployment();
  const protocolAddress = await protocol.getAddress();
  
  console.log("✅ ScrollVerseProsperityProtocol deployed to:", protocolAddress);
  
  // Verify deployment
  console.log("\n🔍 Verifying deployment...");
  const sovereign = await protocol.SOVEREIGN();
  console.log("   Sovereign:", sovereign);
  
  const zakatBalance = await protocol.zakatTreasuryBalance();
  console.log("   Zakat Treasury Balance:", hre.ethers.formatEther(zakatBalance), "ETH");
  
  const totalRevenue = await protocol.totalRevenueCollected();
  console.log("   Total Revenue Collected:", hre.ethers.formatEther(totalRevenue), "ETH");
  
  const totalYields = await protocol.totalYieldsDistributed();
  console.log("   Total Yields Distributed:", hre.ethers.formatEther(totalYields), "ETH");
  
  // Display role information
  console.log("\n🔐 Role Information:");
  const ADMIN_ROLE = await protocol.ADMIN_ROLE();
  const TREASURY_MANAGER_ROLE = await protocol.TREASURY_MANAGER_ROLE();
  const REVENUE_MANAGER_ROLE = await protocol.REVENUE_MANAGER_ROLE();
  const AUDITOR_ROLE = await protocol.AUDITOR_ROLE();
  
  console.log("   ADMIN_ROLE:", ADMIN_ROLE);
  console.log("   TREASURY_MANAGER_ROLE:", TREASURY_MANAGER_ROLE);
  console.log("   REVENUE_MANAGER_ROLE:", REVENUE_MANAGER_ROLE);
  console.log("   AUDITOR_ROLE:", AUDITOR_ROLE);
  
  // Display deployment summary
  console.log("\n📊 Deployment Summary");
  console.log("═".repeat(60));
  console.log("Contract: ScrollVerseProsperityProtocol");
  console.log("Address:", protocolAddress);
  console.log("Network:", hre.network.name);
  console.log("Deployer:", deployer.address);
  console.log("Sovereign:", sovereignAddress);
  console.log("═".repeat(60));
  
  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    contract: "ScrollVerseProsperityProtocol",
    address: protocolAddress,
    deployer: deployer.address,
    sovereign: sovereignAddress,
    timestamp: new Date().toISOString(),
    roles: {
      ADMIN_ROLE,
      TREASURY_MANAGER_ROLE,
      REVENUE_MANAGER_ROLE,
      AUDITOR_ROLE
    }
  };
  
  console.log("\n💾 Deployment Info (save this):");
  console.log(JSON.stringify(deploymentInfo, null, 2));
  
  // Instructions for verification
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\n🔍 To verify on Etherscan, run:");
    console.log(`npx hardhat verify --network ${hre.network.name} ${protocolAddress} "${sovereignAddress}"`);
  }
  
  console.log("\n✨ Deployment complete!");
  console.log("🌟 ScrollVerse Prosperity Protocol is ready for governance!");
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
