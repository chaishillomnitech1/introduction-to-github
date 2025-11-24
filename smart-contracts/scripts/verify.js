import { run } from "hardhat";

async function main() {
  console.log("🔍 Verifying contracts on Scrollscan...\n");

  // Replace these with your deployed contract addresses
  const EMBASSY_TERRACE_ANCHOR_ADDRESS = process.env.EMBASSY_ADDRESS || "YOUR_EMBASSY_ADDRESS";
  const DIVINE_SCROLL_NODE_ADDRESS = process.env.SCROLL_NODE_ADDRESS || "YOUR_SCROLL_NODE_ADDRESS";

  try {
    console.log("Verifying EmbassyTerraceAnchor...");
    await run("verify:verify", {
      address: EMBASSY_TERRACE_ANCHOR_ADDRESS,
      constructorArguments: [],
    });
    console.log("✅ EmbassyTerraceAnchor verified!\n");
  } catch (error) {
    console.log("❌ EmbassyTerraceAnchor verification failed:", error.message, "\n");
  }

  try {
    console.log("Verifying DivineScrollNode...");
    await run("verify:verify", {
      address: DIVINE_SCROLL_NODE_ADDRESS,
      constructorArguments: [],
    });
    console.log("✅ DivineScrollNode verified!\n");
  } catch (error) {
    console.log("❌ DivineScrollNode verification failed:", error.message, "\n");
  }

  console.log("🎉 Verification process complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Verification failed:", error);
    process.exit(1);
  });
