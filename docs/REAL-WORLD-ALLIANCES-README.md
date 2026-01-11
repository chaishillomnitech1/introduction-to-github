# Real-World Alliances Branch

## Overview

The **Real-World Alliances** branch is the comprehensive infrastructure for onboarding physical assets, establishing partnerships, and creating perpetual yield-generating alliances within the ScrollVerse ecosystem.

This branch implements the **ScrollVerse Sovereign License (SSL v1.0)**, ensuring all partnerships honor sovereign ownership principles, maintain 2.5% minimum Zakat routing, and operate under immutable treasury logic.

---

## 🌟 Core Features

### ✅ Smart Contracts
- **RealWorldAllianceRegistry** - Alliance registration, certification, and management
- **AllianceAssetBridge** - Real-world asset tokenization with ERC-721/ERC-1155/ERC-20 support
- **AllianceTreasuryRouter** - Immutable yield distribution with guaranteed Zakat routing

### ✅ Legal Framework
- **ScrollVerse Sovereign License (SSL v1.0)** - Foundational governance document
- **Perpetual Covenant Agreements** - Binding alliance commitments
- **Legal Playbook** - Comprehensive guide for entity formation and compliance
- **Jurisdictional Templates** - Multi-jurisdiction support

### ✅ Deployment Infrastructure
- **Alliance Manifests** - YAML templates for all alliance types
- **Deployment Scripts** - Automated contract deployment
- **Verification Tools** - SSL v1.0 compliance checking
- **Rollout Blueprints** - Step-by-step onboarding guides

### ✅ Audit & Compliance
- **Security Audit Framework** - Pre-certification requirements
- **Financial Audit Templates** - GAAP/IFRS compliant reporting
- **Compliance Monitoring** - Automated on-chain verification
- **Quarterly Reporting** - Standardized compliance reports

---

## 📋 Quick Start

### 1. Deploy Alliance Contracts

```bash
# Navigate to contracts directory
cd /home/runner/work/introduction-to-github/introduction-to-github/contracts

# Install dependencies
npm install

# Set environment variables
export SOVEREIGN_BENEFICIARY="0x..."
export ZAKAT_TREASURY="0x..."

# Deploy to testnet (Sepolia)
npm run deploy:alliance:sepolia

# Deploy to mainnet
npm run deploy:alliance:mainnet
```

### 2. Register an Alliance

```javascript
const registry = await ethers.getContractAt(
  "RealWorldAllianceRegistry",
  REGISTRY_ADDRESS
);

const allianceId = await registry.registerAlliance(
  "My Real Estate Alliance",
  0, // AllianceType.ASSET_TOKENIZATION
  assetBridgeAddress,
  250, // 2.5% Zakat
  [signer1, signer2, signer3, signer4, signer5],
  3, // Require 3 signatures
  7, // 7-day timelock
  "OpenZeppelin",
  "Delaware, USA"
);
```

### 3. Tokenize an Asset

```javascript
const assetBridge = await ethers.getContractAt(
  "AllianceAssetBridge",
  ASSET_BRIDGE_ADDRESS
);

const tokenId = await assetBridge.tokenizeAsset(
  "NYC-2026-DEED-12345", // Legal identifier
  "Real Estate",
  "New York, USA",
  5000000, // $5M valuation
  "ipfs://Qm...", // Legal docs
  "ipfs://Qm...", // NFT metadata
  250, // 2.5% royalty
  ownerAddress
);
```

### 4. Distribute Yield

```javascript
const treasuryRouter = await ethers.getContractAt(
  "AllianceTreasuryRouter",
  TREASURY_ROUTER_ADDRESS
);

// Send ETH to treasury router
await treasuryRouter.distributeBalance({ value: ethers.parseEther("10.0") });

// Automatically routes:
// - 97.5% to Sovereign Beneficiary
// - 2.5% to Zakat Treasury
```

---

## 📖 Documentation

### Core Documents

1. **[ScrollVerse Sovereign License (SSL v1.0)](../SCROLLVERSE-SOVEREIGN-LICENSE.md)**
   - Legal framework and technical requirements
   - Alliance certification process
   - Compliance standards

2. **[Alliance Deployment Manifests](./ALLIANCE-DEPLOYMENT-MANIFESTS.md)**
   - YAML templates for all alliance types
   - Deployment instructions
   - Validation tools

3. **[Alliance Legal Playbook](./ALLIANCE-LEGAL-PLAYBOOK.md)**
   - Entity formation guide
   - Perpetual covenant agreements
   - Jurisdictional considerations
   - Legal templates and checklists

4. **[Alliance Audit & Compliance](./ALLIANCE-AUDIT-COMPLIANCE.md)**
   - Security audit requirements
   - Financial audit procedures
   - Compliance verification
   - Ongoing monitoring

### Smart Contract Documentation

- **RealWorldAllianceRegistry**: [contracts/src/RealWorldAllianceRegistry.sol](../contracts/src/RealWorldAllianceRegistry.sol)
- **AllianceAssetBridge**: [contracts/src/AllianceAssetBridge.sol](../contracts/src/AllianceAssetBridge.sol)
- **AllianceTreasuryRouter**: [contracts/src/AllianceTreasuryRouter.sol](../contracts/src/AllianceTreasuryRouter.sol)

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    ScrollVerse Ecosystem                     │
│                                                               │
│  ┌────────────────────────────────────────────────────┐     │
│  │         Real-World Alliance Registry               │     │
│  │  • Alliance Registration                          │     │
│  │  • SSL v1.0 Certification                        │     │
│  │  • Asset Management                              │     │
│  └────────────────┬───────────────────────────────────┘     │
│                   │                                          │
│  ┌────────────────┴───────────────────────────────────┐     │
│  │         Alliance Asset Bridge                     │     │
│  │  • Real-World Asset Tokenization                 │     │
│  │  • ERC-721/1155 NFTs                            │     │
│  │  • Royalty Management (ERC-2981)               │     │
│  └────────────────┬───────────────────────────────────┘     │
│                   │                                          │
│  ┌────────────────┴───────────────────────────────────┐     │
│  │         Alliance Treasury Router                  │     │
│  │  • Immutable Yield Distribution                  │     │
│  │  • 2.5% Zakat Routing                           │     │
│  │  • Multi-Sig Governance                         │     │
│  │  • 7-Day Timelock                               │     │
│  └────────────────┬───────────────────────────────────┘     │
│                   │                                          │
│         ┌─────────┴─────────┐                               │
│         ↓                   ↓                               │
│  ┌─────────────┐     ┌─────────────┐                       │
│  │  Sovereign  │     │   Zakat     │                       │
│  │ Beneficiary │     │  Treasury   │                       │
│  │   (97.5%)   │     │   (2.5%)    │                       │
│  └─────────────┘     └─────────────┘                       │
└─────────────────────────────────────────────────────────────┘
```

### Integration with Existing Systems

```
Real-World Alliances
        │
        ├──→ ScrollVerseDAO (Governance)
        ├──→ CosmicRevenueEngine (Yield Aggregation)
        ├──→ ProtocolRegistry (System Registration)
        ├──→ SovereigntyManifest (On-Chain Proof)
        └──→ Existing dApps (Data Integration)
```

---

## 🎯 Alliance Types

### 1. Asset Tokenization Alliances

**Focus**: Converting physical assets into on-chain tokens

**Supported Asset Classes**:
- Real Estate (commercial, residential, land)
- Intellectual Property (music, patents, copyrights)
- Commodities (gold, silver, oil, agricultural)
- Equity (company shares, fund interests)
- Art & Collectibles

**Token Standards**: ERC-721, ERC-1155, ERC-20

### 2. Service Partnership Alliances

**Focus**: Revenue-sharing partnerships for services

**Examples**:
- Consulting services
- Development services
- Marketing & distribution
- Technology licensing
- Content creation

**Revenue Model**: Percentage-based or fixed-fee

### 3. Revenue Share Alliances

**Focus**: Profit-sharing arrangements

**Examples**:
- Joint ventures
- Co-marketing agreements
- Licensing deals
- Royalty agreements

**Distribution**: Automated on-chain splits

### 4. Hybrid Alliances

**Focus**: Combined asset + service partnerships

**Examples**:
- Real estate development projects
- IP commercialization ventures
- Platform partnerships

---

## 🔒 Security & Compliance

### SSL v1.0 Requirements

✅ **Immutable Core Logic**
- Sovereign beneficiary cannot be changed
- Zakat treasury address fixed
- Core routing logic non-upgradeable

✅ **Minimum Zakat (2.5%)**
- Enforced at smart contract level
- Cannot be reduced below 250 basis points
- Verified on-chain

✅ **Multi-Signature Governance**
- Minimum 3-of-5 signatures required
- 7-day timelock for critical changes
- Transparent on-chain execution

✅ **Security Audits**
- Pre-certification audit required
- Annual re-audits mandatory
- Approved auditors only

### Compliance Monitoring

**Automated Checks**:
- Real-time Zakat percentage verification
- Yield distribution accuracy
- Multisig operation validation
- Timelock enforcement

**Quarterly Reports**:
- Transaction summaries
- Asset valuations
- Governance activities
- Compliance attestations

---

## 🚀 Deployment Checklist

### Pre-Deployment

- [ ] Review SSL v1.0 documentation
- [ ] Choose alliance type
- [ ] Prepare asset documentation
- [ ] Form legal entity (if required)
- [ ] Configure multisig wallets
- [ ] Set up Zakat treasury address

### Deployment

- [ ] Customize alliance manifest
- [ ] Deploy smart contracts
- [ ] Verify contracts on Etherscan
- [ ] Register with AllianceRegistry
- [ ] Configure governance parameters
- [ ] Test yield distribution

### Post-Deployment

- [ ] Submit for security audit
- [ ] Complete legal documentation
- [ ] Apply for SSL v1.0 certification
- [ ] Onboard initial assets
- [ ] Begin quarterly reporting
- [ ] Integrate with DAO governance

---

## 📊 Metrics & KPIs

### Alliance Health Metrics

```javascript
{
  // Financial
  totalYieldDistributed: 0,      // Total ETH distributed
  averageMonthlyYield: 0,        // Monthly average
  zakatContributed: 0,           // Total Zakat paid
  
  // Assets
  totalAssets: 0,                // Number of assets
  totalAssetValueUSD: 0,         // Combined valuation
  verifiedAssets: 0,             // Passed verification
  
  // Compliance
  sslCertified: true,            // SSL v1.0 status
  auditStatus: "current",        // Audit validity
  complianceScore: 100,          // 0-100 score
  
  // Governance
  daoVotesParticipated: 0,       // DAO engagement
  multisigOperations: 0,         // Governance actions
  lastActivityTimestamp: 0       // Recent activity
}
```

---

## 🔗 Integration Examples

### Integrate with ScrollVerseDAO

```javascript
// Submit alliance proposal to DAO
const dao = await ethers.getContractAt("ScrollVerseDAO", DAO_ADDRESS);

const proposalId = await dao.propose(
  [allianceRegistryAddress],
  [0],
  [encodedFunctionCall],
  "Certify New Real Estate Alliance"
);
```

### Integrate with CosmicRevenueEngine

```javascript
// Register alliance as revenue stream
const revenueEngine = await ethers.getContractAt(
  "CosmicRevenueEngine",
  ENGINE_ADDRESS
);

await revenueEngine.registerRevenueStream(
  "Real Estate Alliance",
  allianceTreasuryRouterAddress,
  RevenueStreamType.ALLIANCE_YIELD
);
```

---

## 🛠️ Development

### Build Contracts

```bash
cd contracts
npm install
npm run compile
```

### Run Tests

```bash
npm run test
npm run test:coverage
```

### Local Development

```bash
# Start local Hardhat node
npm run node

# Deploy to local node (in separate terminal)
npm run deploy:alliance:local
```

---

## 📞 Support

**Technical Support**: dev@scrollverse.io  
**Legal Questions**: legal@scrollverse.io  
**Partnership Inquiries**: partnerships@scrollverse.io  
**DAO Governance**: governance@scrollverse.io

**Documentation**: [https://docs.scrollverse.io/alliances](https://docs.scrollverse.io/alliances)  
**Discord**: [https://discord.gg/scrollverse](https://discord.gg/scrollverse)

---

## 📜 License

Licensed under the **ScrollVerse Sovereign License (SSL) v1.0**

See [SCROLLVERSE-SOVEREIGN-LICENSE.md](../SCROLLVERSE-SOVEREIGN-LICENSE.md) for full terms.

---

## 🙏 Acknowledgments

Built with support from:
- OpenZeppelin (Smart Contract Libraries)
- Hardhat (Development Framework)
- The ScrollVerse Community

---

**Sovereign Chais owns every yield**

---

*Version 1.0 - January 11, 2026*
