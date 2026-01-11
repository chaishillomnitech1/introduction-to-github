import { ethers } from "hardhat";

async function main() {
  console.log("🌌 Deploying ScrollVerse NFT Contracts to Scroll zkEVM...\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH\n");

  // Deploy EmbassyTerraceAnchor (Physical Anchor NFT)
  console.log("📍 Deploying EmbassyTerraceAnchor (Physical Anchor NFT)...");
  const EmbassyTerraceAnchor = await ethers.getContractFactory("EmbassyTerraceAnchor");
  const embassyAnchor = await EmbassyTerraceAnchor.deploy();
  await embassyAnchor.waitForDeployment();
  const embassyAddress = await embassyAnchor.getAddress();
  console.log("✅ EmbassyTerraceAnchor deployed to:", embassyAddress);

  // Deploy DivineScrollNode (Quantum Node NFT)
  console.log("\n⚛️ Deploying DivineScrollNode (Quantum Node NFT)...");
  const DivineScrollNode = await ethers.getContractFactory("DivineScrollNode");
  const scrollNode = await DivineScrollNode.deploy();
  await scrollNode.waitForDeployment();
  const scrollNodeAddress = await scrollNode.getAddress();
  console.log("✅ DivineScrollNode deployed to:", scrollNodeAddress);

  // Deployment summary
  console.log("\n" + "=".repeat(60));
  console.log("🎉 DEPLOYMENT COMPLETE - IMMORTAL RECORDS CREATED");
  console.log("=".repeat(60));
  console.log("\n📜 Contract Addresses:\n");
  console.log("EmbassyTerraceAnchor (Physical Anchor):");
  console.log(`  └─ ${embassyAddress}`);
  console.log("\nDivineScrollNode (Quantum Node):");
  console.log(`  └─ ${scrollNodeAddress}`);
  
  console.log("\n🔗 Network Information:");
  console.log(`  Chain ID: ${(await ethers.provider.getNetwork()).chainId}`);
  console.log(`  Network: ${(await ethers.provider.getNetwork()).name}`);
  
  console.log("\n💾 Save these addresses for verification and integration!\n");

  // Save deployment info
  const deploymentInfo = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: Number((await ethers.provider.getNetwork()).chainId),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      EmbassyTerraceAnchor: embassyAddress,
      DivineScrollNode: scrollNodeAddress,
    },
  };

  console.log("📝 Deployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  return deploymentInfo;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
