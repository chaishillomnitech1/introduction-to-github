# 🚀 ScrollVerse NFT Deployment Guide

## Complete Deployment Instructions for EmbassyTerraceAnchor & DivineScrollNode

This guide provides step-by-step instructions for deploying the ScrollVerse NFT smart contracts to Scroll zkEVM mainnet and activating quantum node functionalities.

---

## 📋 Prerequisites

### Required Tools
- Node.js 18+ and npm
- MetaMask or compatible Web3 wallet
- ETH on Scroll (for gas fees)
- Scrollscan API key (for verification)
- IPFS account (NFT.storage or Pinata)

### Required Knowledge
- Basic blockchain/smart contract understanding
- Command line interface
- Git version control
- JSON file editing

---

## 🔧 Phase 1: Environment Setup

### 1.1 Clone Repository

```bash
git clone https://github.com/chaishillomnitech1/introduction-to-github.git
cd introduction-to-github/smart-contracts
```

### 1.2 Install Dependencies

```bash
npm install
```

### 1.3 Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# Scroll Network RPC URLs
SCROLL_TESTNET_RPC=https://sepolia-rpc.scroll.io/
SCROLL_MAINNET_RPC=https://rpc.scroll.io/

# Your wallet private key (KEEP SECRET!)
PRIVATE_KEY=your_private_key_here

# Scrollscan API key for verification
SCROLLSCAN_API_KEY=your_scrollscan_api_key

# Gas settings (optional)
REPORT_GAS=false
```

⚠️ **SECURITY WARNING**: Never commit your `.env` file or share your private key!

---

## 🎨 Phase 2: NFT Metadata Preparation

### 2.1 Create Visualizations

Follow the [VISUALIZATION-GUIDE.md](./smart-contracts/metadata/VISUALIZATION-GUIDE.md) to create:

1. **Embassy Terrace Anchor**
   - 3000x3000px static image
   - Animation (optional)
   - Thumbnail

2. **Divine Scroll Node**
   - 3000x3000px static image
   - Animation with frequency visualization
   - Thumbnail

### 2.2 Upload to IPFS

Using NFT.storage or Pinata:

```bash
# Install IPFS CLI or use web interface
npm install -g nft.storage

# Upload directory structure
nft.storage upload ./metadata/embassy-terrace-anchor-1/
nft.storage upload ./metadata/divine-scroll-node-1/
```

Save the IPFS CIDs (Content Identifiers).

### 2.3 Update Metadata JSON

Update the `metadata/*.json` files with your IPFS CIDs:

```json
{
  "image": "ipfs://YOUR_CID/image.png",
  "animation_url": "ipfs://YOUR_CID/animation.mp4",
  ...
}
```

---

## 🧪 Phase 3: Testing (Scroll Sepolia Testnet)

### 3.1 Get Testnet ETH

1. Visit [Scroll Sepolia Faucet](https://scroll.io/faucet)
2. Connect your wallet
3. Request testnet ETH

### 3.2 Compile Contracts

```bash
npm run compile
```

Expected output:
```
Compiled 2 Solidity files successfully
```

### 3.3 Run Tests

```bash
npm test
```

All tests should pass.

### 3.4 Deploy to Testnet

```bash
npm run deploy:testnet
```

Expected output:
```
🌌 Deploying ScrollVerse NFT Contracts to Scroll zkEVM...

Deploying contracts with account: 0x...
Account balance: X.XX ETH

📍 Deploying EmbassyTerraceAnchor (Physical Anchor NFT)...
✅ EmbassyTerraceAnchor deployed to: 0x...

⚛️ Deploying DivineScrollNode (Quantum Node NFT)...
✅ DivineScrollNode deployed to: 0x...

🎉 DEPLOYMENT COMPLETE - IMMORTAL RECORDS CREATED
```

### 3.5 Verify Contracts

```bash
# Set deployed addresses in .env
export EMBASSY_ADDRESS=0x...
export SCROLL_NODE_ADDRESS=0x...

# Verify
npm run verify
```

### 3.6 Test Minting

Create a test script `scripts/test-mint.js`:

```javascript
import { ethers } from "hardhat";

async function main() {
  const embassyAddress = process.env.EMBASSY_ADDRESS;
  const scrollNodeAddress = process.env.SCROLL_NODE_ADDRESS;

  const embassy = await ethers.getContractAt("EmbassyTerraceAnchor", embassyAddress);
  const scrollNode = await ethers.getContractAt("DivineScrollNode", scrollNodeAddress);

  // Mint Physical Anchor
  console.log("Minting Physical Anchor...");
  const tx1 = await embassy.mintPhysicalAnchor(
    "0xYourAddress",
    "ipfs://YOUR_CID/metadata.json",
    "Embassy Terrace",
    389072,
    770369,
    0
  );
  await tx1.wait();
  console.log("✅ Physical Anchor minted!");

  // Mint Quantum Node
  console.log("Minting Quantum Node...");
  const tx2 = await scrollNode.mintQuantumNode(
    "0xYourAddress",
    "ipfs://YOUR_CID/metadata.json",
    963,
    "∞-Prime"
  );
  await tx2.wait();
  console.log("✅ Quantum Node minted!");

  console.log("🎉 Test minting complete!");
}

main();
```

Run:
```bash
npx hardhat run scripts/test-mint.js --network scrollTestnet
```

---

## 🔥 Phase 4: Mainnet Deployment

### 4.1 Final Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Testnet deployment successful
- [ ] Metadata uploaded to IPFS and pinned
- [ ] Visualization quality verified
- [ ] Smart contracts audited (recommended)
- [ ] Sufficient ETH in deployment wallet
- [ ] Backup of all deployment scripts
- [ ] Team ready for monitoring

### 4.2 Deploy to Scroll Mainnet

```bash
npm run deploy:mainnet
```

⚠️ **IMPORTANT**: This is irreversible! Double-check everything.

### 4.3 Verify on Scrollscan

```bash
npm run verify
```

### 4.4 Document Deployment

Record in `DEPLOYMENT-ADDRESSES.md`:

```markdown
# ScrollVerse NFT Deployment

## Scroll Mainnet (Chain ID: 534352)

### EmbassyTerraceAnchor
- **Address**: 0x...
- **Deployer**: 0x...
- **Block**: 12345678
- **Timestamp**: 2025-11-24 16:43:14 UTC
- **Scrollscan**: https://scrollscan.com/address/0x...

### DivineScrollNode
- **Address**: 0x...
- **Deployer**: 0x...
- **Block**: 12345679
- **Timestamp**: 2025-11-24 16:43:45 UTC
- **Scrollscan**: https://scrollscan.com/address/0x...
```

---

## ⚛️ Phase 5: Quantum Node Activation

### 5.1 Mint First Nodes

Create `scripts/activate-nodes.js`:

```javascript
import { ethers } from "hardhat";

async function main() {
  const scrollNode = await ethers.getContractAt(
    "DivineScrollNode",
    process.env.SCROLL_NODE_ADDRESS
  );

  const frequencies = [963, 777, 528, 432, 369, 144];
  const signatures = ["∞-Prime", "∞-Divine", "∞-Heal", "∞-Harmony", "∞-Tesla", "∞-Foundation"];

  for (let i = 0; i < frequencies.length; i++) {
    console.log(`Minting node ${i + 1} at ${frequencies[i]}Hz...`);
    
    const tx = await scrollNode.mintQuantumNode(
      "0xYourAddress",
      `ipfs://YOUR_CID/node-${i + 1}.json`,
      frequencies[i],
      signatures[i]
    );
    
    await tx.wait();
    console.log(`✅ Node ${i + 1} minted and emitting!`);
  }

  console.log("🎉 All quantum nodes activated!");
  
  const stats = await scrollNode.getGlobalQuantumStats();
  console.log("\nGlobal Quantum Statistics:");
  console.log(`- Total Emissions: ${stats.totalEmissions}`);
  console.log(`- I AM Code Strength: ${stats.iamStrength}`);
  console.log(`- Total Nodes: ${stats.totalNodes}`);
}

main();
```

Run:
```bash
npx hardhat run scripts/activate-nodes.js --network scrollMainnet
```

### 5.2 Initialize I AM Code Propagation

```javascript
// Propagate I AM Code from all nodes
const nodeIds = [1, 2, 3, 4, 5, 6];

for (const id of nodeIds) {
  await scrollNode.propagateIAMCode(id);
  console.log(`I AM Code propagated from node ${id}`);
}
```

### 5.3 Start Frequency Broadcasting

```javascript
// Broadcast all frequencies
for (const id of nodeIds) {
  await scrollNode.broadcastFrequency(id);
  console.log(`Node ${id} broadcasting globally`);
}
```

### 5.4 Entangle Nodes

```javascript
// Entangle nodes for enhanced power
await scrollNode.entangleNodes(1, 2); // 963Hz ↔ 777Hz
await scrollNode.entangleNodes(3, 4); // 528Hz ↔ 432Hz
await scrollNode.entangleNodes(5, 6); // 369Hz ↔ 144Hz

console.log("✅ Quantum entanglement complete!");
```

---

## 📡 Phase 6: Sovereign Broadcast Activation

### 6.1 Configure Sovereign TV App

Update `sovereign-tv-app/.env`:

```env
# NFT Contract Addresses
EMBASSY_TERRACE_ANCHOR_ADDRESS=0x...
DIVINE_SCROLL_NODE_ADDRESS=0x...

# Scroll Network
SCROLL_RPC=https://rpc.scroll.io/
SCROLL_CHAIN_ID=534352
```

### 6.2 Update NFT Service

Edit `sovereign-tv-app/src/services/nft-gating.js`:

```javascript
const KUNTA_NFT_CONTRACT_ADDRESS = process.env.EMBASSY_TERRACE_ANCHOR_ADDRESS;
const QUANTUM_NODE_CONTRACT_ADDRESS = process.env.DIVINE_SCROLL_NODE_ADDRESS;
```

### 6.3 Test Quantum Broadcast API

```bash
cd sovereign-tv-app
npm start
```

Test endpoints:
```bash
# Get quantum status
curl http://localhost:3000/api/quantum/status

# Get frequencies
curl http://localhost:3000/api/quantum/frequencies

# Get statistics
curl http://localhost:3000/api/quantum/statistics
```

### 6.4 Activate Global Broadcast

```bash
# Activate sovereign broadcast
curl -X POST http://localhost:3000/api/quantum/activate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "frequency": 963,
    "intensity": 100,
    "duration": 3600
  }'

# Override networks
curl -X POST http://localhost:3000/api/quantum/override-network \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "overrideLevel": 100,
    "targetNetworks": ["5G", "4G", "WiFi", "Satellite"]
  }'
```

---

## 🎯 Phase 7: Verification & Monitoring

### 7.1 Verify Deployment

Check on Scrollscan:
- Contract creation successful
- Source code verified
- NFTs visible in holders' wallets
- Events emitted correctly

### 7.2 Monitor Quantum Activity

```javascript
// Listen for quantum events
scrollNode.on("AethericBiotEmitted", (tokenId, amount, total) => {
  console.log(`Node ${tokenId} emitted ${amount} biot (total: ${total})`);
});

scrollNode.on("IAMCodePropagated", (tokenId, intensity, global) => {
  console.log(`I AM Code from ${tokenId}: intensity ${intensity} (global: ${global})`);
});

scrollNode.on("FrequencyBroadcasted", (tokenId, frequency) => {
  console.log(`Node ${tokenId} broadcasting ${frequency}Hz globally`);
});
```

### 7.3 Monitor Physical Anchors

```javascript
embassy.on("AnchorActivated", (tokenId, location, timestamp) => {
  console.log(`Physical Anchor ${tokenId} activated at ${location}`);
});

embassy.on("LayerSynchronized", (tokenId, layer) => {
  console.log(`Anchor ${tokenId} synchronized to layer ${layer}`);
});
```

---

## 🛡️ Phase 8: Security & Maintenance

### 8.1 Security Best Practices

- [ ] Private keys stored securely (hardware wallet recommended)
- [ ] Multi-sig wallet for contract ownership
- [ ] Regular security audits
- [ ] Bug bounty program
- [ ] Incident response plan
- [ ] Backup plans for all keys

### 8.2 Regular Maintenance

Weekly:
- Check contract balances
- Monitor gas prices
- Review transaction logs
- Check IPFS pin status

Monthly:
- Review and update documentation
- Assess community feedback
- Plan feature enhancements
- Security review

### 8.3 Emergency Procedures

If issues arise:

1. **Pause operations** (if pause functionality exists)
2. **Notify community** via official channels
3. **Investigate issue** thoroughly
4. **Implement fix** after testing
5. **Resume operations** with clear communication

---

## 📊 Success Metrics

### Deployment Success
- ✅ Contracts deployed to mainnet
- ✅ Contracts verified on Scrollscan
- ✅ NFTs minting successfully
- ✅ Quantum nodes emitting
- ✅ I AM Code propagating
- ✅ Frequencies broadcasting

### Community Success
- Target: 1000+ NFT holders
- Target: 10,000+ app users
- Target: 100% uptime
- Target: <1s response time

---

## 🆘 Troubleshooting

### Common Issues

**"Transaction underpriced"**
- Solution: Increase gas price in hardhat.config.js

**"Contract verification failed"**
- Solution: Check constructor arguments match exactly

**"Insufficient funds"**
- Solution: Add more ETH to deployment wallet

**"IPFS gateway timeout"**
- Solution: Use multiple IPFS gateways as fallbacks

### Support Resources

- GitHub Issues: [Repository](https://github.com/chaishillomnitech1/introduction-to-github/issues)
- Scroll Documentation: [docs.scroll.io](https://docs.scroll.io)
- OpenZeppelin Forum: [forum.openzeppelin.com](https://forum.openzeppelin.com)

---

## 📚 Additional Resources

### Documentation
- [Smart Contract README](./smart-contracts/README.md)
- [Visualization Guide](./smart-contracts/metadata/VISUALIZATION-GUIDE.md)
- [API Documentation](./sovereign-tv-app/docs/API.md)

### Network Information
- Scroll Mainnet: [scrollscan.com](https://scrollscan.com)
- Scroll Testnet: [sepolia.scrollscan.com](https://sepolia.scrollscan.com)
- Scroll Bridge: [scroll.io/bridge](https://scroll.io/bridge)

---

## 🎉 Post-Deployment

### Announce Launch

Prepare announcement with:
- Contract addresses
- Scrollscan links
- Minting instructions
- Quantum node status dashboard
- Community benefits

### Marketing Materials

- NFT collection page
- Quantum statistics dashboard
- Frequency visualization tool
- Community gallery
- Educational content

---

## 🔥 Final Checklist

Before considering deployment complete:

- [ ] Smart contracts deployed and verified
- [ ] Initial NFTs minted
- [ ] Quantum nodes activated
- [ ] I AM Code propagating
- [ ] Frequencies broadcasting
- [ ] Sovereign broadcast operational
- [ ] App integration complete
- [ ] Documentation published
- [ ] Community notified
- [ ] Monitoring systems active
- [ ] Security measures in place
- [ ] Emergency procedures documented

---

**Deployed by**: Chais Hill - OmniTech1  
**For**: ScrollVerse Sovereignty Protocol  
**Network**: Scroll zkEVM Mainnet  
**Status**: Ready for Immortality ✅

🔥 **ALLAHU AKBAR! WALAHI!** 🔥

**Truth is Currency. Sacred Logic is Code. Remembrance is the Gateway.**

© 2025 OmniTech1™ | ScrollVerse
