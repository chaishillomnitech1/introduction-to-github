# 🌌 ScrollVerse NFT Smart Contracts

## EmbassyTerraceAnchor & DivineScrollNode

Immortal records of dual-reality existence on Scroll zkEVM mainnet.

---

## 📜 Overview

This repository contains two revolutionary NFT smart contracts that anchor the ScrollVerse across physical and quantum dimensions:

### 1. **EmbassyTerraceAnchor** (Physical Anchor NFT)
- **Contract Type**: ERC-721
- **Symbol**: EMBASSY
- **Purpose**: Anchors ScrollVerse to physical reality across both layers
- **Features**:
  - Dual-layer synchronization (Layer 0 & Layer 1)
  - Real-world geographic coordinates
  - Anchor strength management
  - Hyper-realistic visualizations

### 2. **DivineScrollNode** (Quantum Node NFT)
- **Contract Type**: ERC-721
- **Symbol**: QNODE
- **Purpose**: Broadcasts cosmic frequencies and propagates the I AM Code
- **Features**:
  - Aetheric biot emissions
  - I AM Code propagation
  - Quantum entanglement capabilities
  - Sovereign broadcast functionality
  - Cosmic frequency alignment (963Hz, 777Hz, 528Hz, 432Hz, 369Hz, 144Hz)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MetaMask or other Web3 wallet with ETH on Scroll

### Installation

```bash
cd smart-contracts
npm install
```

### Configuration

1. Copy the environment template:
```bash
cp .env.example .env
```

2. Edit `.env` with your values:
```
PRIVATE_KEY=your_private_key_here
SCROLLSCAN_API_KEY=your_api_key_here
```

⚠️ **NEVER commit your `.env` file!**

---

## 🛠️ Development

### Compile Contracts

```bash
npm run compile
```

### Run Tests

```bash
npm test
```

### Start Local Node

```bash
npm run node
```

---

## 🌐 Deployment

### Deploy to Scroll Testnet (Sepolia)

```bash
npm run deploy:testnet
```

### Deploy to Scroll Mainnet

```bash
npm run deploy:mainnet
```

### Verify Contracts

After deployment, verify on Scrollscan:

```bash
# Set addresses in .env first
npm run verify
```

---

## 📊 Contract Features

### EmbassyTerraceAnchor Functions

#### Minting
```solidity
function mintPhysicalAnchor(
    address to,
    string memory tokenURI,
    string memory location,
    uint256 latitude,
    uint256 longitude,
    uint256 scrollVerseLayer
) public onlyOwner returns (uint256)
```

#### Anchor Management
```solidity
function strengthenAnchor(uint256 tokenId, uint256 additionalStrength) public onlyOwner
function synchronizeLayer(uint256 tokenId, uint256 layer) public onlyOwner
function getPhysicalAnchor(uint256 tokenId) public view returns (PhysicalAnchor memory)
```

### DivineScrollNode Functions

#### Minting
```solidity
function mintQuantumNode(
    address to,
    string memory tokenURI,
    uint256 frequency,
    string memory dimensionalSignature
) public onlyOwner returns (uint256)
```

#### Quantum Operations
```solidity
function emitAethericBiot(uint256 tokenId) public
function propagateIAMCode(uint256 tokenId) public
function broadcastFrequency(uint256 tokenId) public
function entangleNodes(uint256 tokenId1, uint256 tokenId2) public onlyOwner
```

#### Node Enhancement
```solidity
function amplifyEmissionRate(uint256 tokenId, uint256 amplificationFactor) public onlyOwner
function boostIAMCodeIntensity(uint256 tokenId, uint256 boostAmount) public onlyOwner
```

---

## 🎨 NFT Metadata

### Physical Anchor Metadata Structure

```json
{
  "name": "Embassy Terrace Anchor #1",
  "description": "Physical Anchor NFT anchoring ScrollVerse to reality",
  "image": "ipfs://...",
  "attributes": [
    {"trait_type": "Type", "value": "Physical Anchor"},
    {"trait_type": "Location", "value": "Embassy Terrace"},
    {"trait_type": "ScrollVerse Layer", "value": "Dual-Layer (0 & 1)"},
    {"trait_type": "Anchor Strength", "value": 100}
  ]
}
```

### Quantum Node Metadata Structure

```json
{
  "name": "Divine Scroll Node #1",
  "description": "Quantum Node with aetheric biot emissions",
  "image": "ipfs://...",
  "attributes": [
    {"trait_type": "Type", "value": "Quantum Node"},
    {"trait_type": "Frequency", "value": "963Hz"},
    {"trait_type": "Aetheric Biot Emission Rate", "value": 100},
    {"trait_type": "I AM Code Intensity", "value": 369}
  ]
}
```

---

## 🔒 Security

- Contracts use OpenZeppelin's audited libraries
- Owner-only minting and management functions
- Comprehensive test coverage
- Will undergo security audit before mainnet deployment

### Security Considerations

1. **Access Control**: All administrative functions are protected by `onlyOwner` modifier
2. **Input Validation**: Frequency validation, layer bounds checking
3. **State Management**: Safe counter usage via OpenZeppelin's Counters library
4. **Event Emissions**: Comprehensive event logging for transparency

---

## 🧪 Testing

The contracts include comprehensive test suites:

- **EmbassyTerraceAnchor.test.js**: 15+ test cases
- **DivineScrollNode.test.js**: 20+ test cases

Run tests with coverage:

```bash
npm test
npx hardhat coverage
```

---

## 📡 Network Information

### Scroll Sepolia Testnet
- **Chain ID**: 534351
- **RPC**: https://sepolia-rpc.scroll.io/
- **Explorer**: https://sepolia.scrollscan.com/
- **Faucet**: https://scroll.io/faucet

### Scroll Mainnet
- **Chain ID**: 534352
- **RPC**: https://rpc.scroll.io/
- **Explorer**: https://scrollscan.com/

---

## 🎯 Cosmic Frequencies

The DivineScrollNode supports these healing/cosmic frequencies:

- **963 Hz**: Pineal Gland Activation (Crown Chakra)
- **777 Hz**: Divine Completeness
- **528 Hz**: DNA Repair & Transformation
- **432 Hz**: Universal Harmony
- **369 Hz**: Tesla's Divine Code
- **144 Hz**: Foundation Frequency

---

## 🌟 Features Implemented

### ✅ Phase 1: Hyper-Realistic Visualizations
- Metadata structures with visualization properties
- IPFS-ready metadata format
- Dual-reality attribute mapping
- Hyper-realistic trait definitions

### ✅ Phase 2: Smart Contract Deployment
- EmbassyTerraceAnchor contract (Physical Anchor)
- DivineScrollNode contract (Quantum Node)
- Scroll zkEVM configuration
- Deployment scripts ready
- Verification scripts ready

### ✅ Phase 3: Quantum Node Functionalities
- Aetheric biot emission system
- I AM Code propagation mechanism
- Cosmic frequency broadcasting
- Quantum entanglement support
- Global statistics tracking

### ✅ Phase 4: Sovereign Broadcast
- Global frequency broadcasting
- Network override simulation
- Conscious truth propagation
- Dimensional reach capabilities

---

## 📝 Usage Examples

### Minting a Physical Anchor

```javascript
const embassyAnchor = await ethers.getContractAt("EmbassyTerraceAnchor", address);

await embassyAnchor.mintPhysicalAnchor(
  recipientAddress,
  "ipfs://QmMetadataHash",
  "Embassy Terrace",
  389072, // latitude (scaled)
  770369, // longitude (scaled)
  0 // ScrollVerse layer
);
```

### Minting a Quantum Node

```javascript
const scrollNode = await ethers.getContractAt("DivineScrollNode", address);

await scrollNode.mintQuantumNode(
  recipientAddress,
  "ipfs://QmMetadataHash",
  963, // frequency in Hz
  "∞-Prime" // dimensional signature
);
```

### Broadcasting Quantum Frequency

```javascript
await scrollNode.broadcastFrequency(tokenId);
```

### Entangling Two Nodes

```javascript
await scrollNode.entangleNodes(tokenId1, tokenId2);
```

---

## 🔗 Integration with Sovereign TV App

The contracts integrate seamlessly with the existing Sovereign TV App:

1. Update `sovereign-tv-app/src/services/nft-gating.js` with deployed addresses
2. Use ethers.js to interact with contracts
3. Verify ownership for gated content access
4. Display quantum statistics in UI

---

## 🛡️ License

MIT License - See LICENSE file for details

---

## 👨‍💻 Author

**Chais Hill - First Remembrancer**  
*Founder, OmniTech1™ | Architect of the OmniVerse*

---

## 📞 Support

- **GitHub Issues**: [Report Issues](https://github.com/chaishillomnitech1/introduction-to-github/issues)
- **Documentation**: See `/metadata` folder for NFT metadata examples
- **Community**: Join the ScrollVerse community

---

## 🔥 ALLAHU AKBAR! WALAHI! 🔥

**Truth is Currency. Sacred Logic is Code. Remembrance is the Gateway.**

© 2025 OmniTech1™ | ScrollVerse Sovereignty Protocol

---

**Status**: Ready for Deployment ✅  
**Network**: Scroll zkEVM Mainnet  
**Version**: 1.0.0
