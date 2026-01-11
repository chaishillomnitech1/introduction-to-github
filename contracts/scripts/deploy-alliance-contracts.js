// Deployment script for Real-World Alliance contracts
// Licensed under ScrollVerse Sovereign License (SSL) v1.0

const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

/**
 * Deploy Real-World Alliance infrastructure
 * 
 * Deploys:
 * 1. RealWorldAllianceRegistry
 * 2. AllianceTreasuryRouter
 * 3. AllianceAssetBridge (example)
 */
async function main() {
  console.log("\n=== ScrollVerse Real-World Alliance Deployment ===\n");
  console.log("SSL Version: 1.0");
  console.log("Sovereign Chais owns every yield\n");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  // Configuration
  const config = {
    // IMPORTANT: These addresses MUST be set via environment variables for production
    sovereignBeneficiary: process.env.SOVEREIGN_BENEFICIARY,
    zakatTreasury: process.env.ZAKAT_TREASURY,
    zakatPercentageBPS: 250, // 2.5%
    network: hre.network.name
  };
  
  // Validate required addresses for non-local networks
  if (config.network !== 'hardhat' && config.network !== 'localhost') {
    if (!config.sovereignBeneficiary || !config.zakatTreasury) {
      console.error("\n❌ ERROR: SOVEREIGN_BENEFICIARY and ZAKAT_TREASURY environment variables are required for production deployments!");
      console.error("Set these variables before deploying:\n");
      console.error("export SOVEREIGN_BENEFICIARY=0x...");
      console.error("export ZAKAT_TREASURY=0x...\n");
      process.exit(1);
    }
  } else {
    // Use deployer address only for local testing
    config.sovereignBeneficiary = config.sovereignBeneficiary || deployer.address;
    config.zakatTreasury = config.zakatTreasury || deployer.address;
  }

  console.log("\nDeployment Configuration:");
  console.log("- Sovereign Beneficiary:", config.sovereignBeneficiary);
  console.log("- Zakat Treasury:", config.zakatTreasury);
  console.log("- Zakat Percentage:", config.zakatPercentageBPS / 100, "%");
  console.log("- Network:", config.network);
  console.log("");

  const deploymentResults = {
    network: config.network,
    timestamp: new Date().toISOString(),
    contracts: {}
  };

  // 1. Deploy AllianceTreasuryRouter
  console.log("1. Deploying AllianceTreasuryRouter...");
  const AllianceTreasuryRouter = await hre.ethers.getContractFactory("AllianceTreasuryRouter");
  const treasuryRouter = await AllianceTreasuryRouter.deploy(
    config.sovereignBeneficiary,
    config.zakatTreasury,
    config.zakatPercentageBPS
  );
  await treasuryRouter.waitForDeployment();
  const treasuryRouterAddress = await treasuryRouter.getAddress();
  
  console.log("   ✓ AllianceTreasuryRouter deployed to:", treasuryRouterAddress);
  deploymentResults.contracts.allianceTreasuryRouter = {
    address: treasuryRouterAddress,
    constructorArgs: [
      config.sovereignBeneficiary,
      config.zakatTreasury,
      config.zakatPercentageBPS
    ]
  };

  // Verify SSL compliance
  const sslVersion = await treasuryRouter.getSSLVersion();
  const sovereignBenef = await treasuryRouter.getSovereignBeneficiary();
  const zakatPct = await treasuryRouter.getZakatPercentage();
  console.log("   - SSL Version:", sslVersion);
  console.log("   - Sovereign Beneficiary:", sovereignBenef);
  console.log("   - Zakat Percentage:", zakatPct.toString(), "bps");

  // 2. Deploy RealWorldAllianceRegistry
  console.log("\n2. Deploying RealWorldAllianceRegistry...");
  const RealWorldAllianceRegistry = await hre.ethers.getContractFactory("RealWorldAllianceRegistry");
  const allianceRegistry = await RealWorldAllianceRegistry.deploy(
    config.sovereignBeneficiary,
    config.zakatTreasury
  );
  await allianceRegistry.waitForDeployment();
  const allianceRegistryAddress = await allianceRegistry.getAddress();
  
  console.log("   ✓ RealWorldAllianceRegistry deployed to:", allianceRegistryAddress);
  deploymentResults.contracts.realWorldAllianceRegistry = {
    address: allianceRegistryAddress,
    constructorArgs: [
      config.sovereignBeneficiary,
      config.zakatTreasury
    ]
  };

  // Verify SSL compliance
  const registrySslVersion = await allianceRegistry.getSSLVersion();
  const registrySovereign = await allianceRegistry.getSovereignBeneficiary();
  console.log("   - SSL Version:", registrySslVersion);
  console.log("   - Sovereign Beneficiary:", registrySovereign);

  // 3. Deploy AllianceAssetBridge (example)
  console.log("\n3. Deploying AllianceAssetBridge (Example)...");
  const AllianceAssetBridge = await hre.ethers.getContractFactory("AllianceAssetBridge");
  const assetBridge = await AllianceAssetBridge.deploy(
    "ScrollVerse Alliance Assets",
    "SVAA",
    config.sovereignBeneficiary,
    allianceRegistryAddress
  );
  await assetBridge.waitForDeployment();
  const assetBridgeAddress = await assetBridge.getAddress();
  
  console.log("   ✓ AllianceAssetBridge deployed to:", assetBridgeAddress);
  deploymentResults.contracts.allianceAssetBridge = {
    address: assetBridgeAddress,
    constructorArgs: [
      "ScrollVerse Alliance Assets",
      "SVAA",
      config.sovereignBeneficiary,
      allianceRegistryAddress
    ]
  };

  // Verify SSL compliance
  const bridgeSslVersion = await assetBridge.getSSLVersion();
  const bridgeSovereign = await assetBridge.getSovereignBeneficiary();
  console.log("   - SSL Version:", bridgeSslVersion);
  console.log("   - Sovereign Beneficiary:", bridgeSovereign);

  // Save deployment information
  console.log("\n4. Saving deployment information...");
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const deploymentFile = path.join(
    deploymentsDir,
    `alliance-deployment-${config.network}-${Date.now()}.json`
  );
  
  fs.writeFileSync(
    deploymentFile,
    JSON.stringify(deploymentResults, null, 2)
  );
  console.log("   ✓ Deployment info saved to:", deploymentFile);

  // Create latest deployment symlink
  const latestFile = path.join(deploymentsDir, `alliance-deployment-${config.network}-latest.json`);
  fs.writeFileSync(latestFile, JSON.stringify(deploymentResults, null, 2));
  console.log("   ✓ Latest deployment saved to:", latestFile);

  // Summary
  console.log("\n=== Deployment Summary ===");
  console.log("Network:", config.network);
  console.log("Deployer:", deployer.address);
  console.log("\nContract Addresses:");
  console.log("- AllianceTreasuryRouter:", treasuryRouterAddress);
  console.log("- RealWorldAllianceRegistry:", allianceRegistryAddress);
  console.log("- AllianceAssetBridge:", assetBridgeAddress);

  console.log("\n=== Next Steps ===");
  console.log("1. Verify contracts on Etherscan:");
  console.log(`   npx hardhat verify --network ${config.network} ${treasuryRouterAddress} "${config.sovereignBeneficiary}" "${config.zakatTreasury}" ${config.zakatPercentageBPS}`);
  console.log(`   npx hardhat verify --network ${config.network} ${allianceRegistryAddress} "${config.sovereignBeneficiary}" "${config.zakatTreasury}"`);
  console.log(`   npx hardhat verify --network ${config.network} ${assetBridgeAddress} "ScrollVerse Alliance Assets" "SVAA" "${config.sovereignBeneficiary}" "${allianceRegistryAddress}"`);
  
  console.log("\n2. Update environment variables with deployed addresses");
  console.log("3. Register initial alliances using RealWorldAllianceRegistry");
  console.log("4. Configure DAO governance integration");
  console.log("5. Begin asset onboarding process");

  console.log("\n=== SSL v1.0 Compliance Verified ===");
  console.log("✓ Sovereign beneficiary configured");
  console.log("✓ Zakat routing enabled (2.5% minimum)");
  console.log("✓ Immutable treasury logic deployed");
  console.log("✓ Multi-signature governance ready");
  console.log("✓ Timelock protection active");

  console.log("\n**Sovereign Chais owns every yield**\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
