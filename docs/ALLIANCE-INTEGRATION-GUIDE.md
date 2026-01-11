# Real-World Alliances Integration Guide

## Overview

This guide provides step-by-step instructions for integrating the Real-World Alliances infrastructure with existing ScrollVerse dApps, protocols, and systems.

---

## Table of Contents

1. [Integration with ScrollVerseDAO](#integration-with-scrollversedao)
2. [Integration with CosmicRevenueEngine](#integration-with-cosmicrevenueengine)
3. [Integration with ProtocolRegistry](#integration-with-protocolregistry)
4. [Integration with Sovereign TV App](#integration-with-sovereign-tv-app)
5. [Integration with Existing NFT Contracts](#integration-with-existing-nft-contracts)
6. [Frontend Integration](#frontend-integration)
7. [API Integration](#api-integration)

---

## Integration with ScrollVerseDAO

### Purpose
Enable governance over alliance certification, parameter updates, and dispute resolution.

### Implementation Steps

#### 1. Register Alliance Contracts with DAO

```solidity
// In deployment script or governance proposal
const scrollVerseDAO = await ethers.getContractAt("ScrollVerseDAO", DAO_ADDRESS);

// Create proposal to recognize alliance registry
const targets = [allianceRegistryAddress];
const values = [0];
const calldatas = [
  allianceRegistry.interface.encodeFunctionData("certifyAlliance", [allianceId])
];
const description = "Certify Global Real Estate Alliance - SSL v1.0 Compliant";

const proposalId = await scrollVerseDAO.propose(
  targets,
  values,
  calldatas,
  description
);

console.log("Proposal created:", proposalId);
```

#### 2. Alliance Certification via DAO Vote

```solidity
// Alliance.sol - Add DAO integration
contract Alliance {
    address public immutable DAO_ADDRESS;
    
    modifier onlyDAO() {
        require(msg.sender == DAO_ADDRESS, "Only DAO");
        _;
    }
    
    function submitForCertification() external onlyOwner {
        // Create DAO proposal for certification
        IScrollVerseDAO(DAO_ADDRESS).propose(
            [address(this)],
            [0],
            [abi.encodeWithSignature("certify()")],
            string(abi.encodePacked(
                "Certify Alliance: ", 
                allianceName,
                " - SSL v1.0 Compliance Verified"
            ))
        );
    }
}
```

#### 3. DAO Governance for Parameter Changes

```solidity
// Example: Propose Zakat percentage update (with timelock)
function proposeZakatUpdate(uint256 newPercentage) external onlyDAO {
    require(newPercentage >= MIN_ZAKAT_BPS, "Below minimum");
    
    // Create timelock operation
    uint256 timelockId = treasuryRouter.proposeZakatPercentageUpdate(
        newPercentage
    );
    
    emit ZakatUpdateProposed(timelockId, newPercentage);
}
```

---

## Integration with CosmicRevenueEngine

### Purpose
Aggregate alliance yields into the unified revenue engine for comprehensive tracking.

### Implementation Steps

#### 1. Register Alliance as Revenue Stream

```solidity
// CosmicRevenueEngine.sol - Add alliance revenue stream type
enum RevenueStreamType {
    NFT_SALES,
    TOKEN_FEES,
    STAKING_REWARDS,
    DAO_TREASURY,
    SATELLITE_SERVICES,
    CONTENT_LICENSING,
    TECH_LICENSING,
    ZAKAT_RETURNS,
    DEFI_FEES,
    ALLIANCE_YIELD  // NEW
}

// Register alliance treasury router
function registerAllianceStream(
    string memory allianceName,
    address treasuryRouterAddress
) external onlyOwner {
    uint256 streamId = _streamCounter++;
    
    revenueStreams[streamId] = RevenueStream({
        name: allianceName,
        streamType: RevenueStreamType.ALLIANCE_YIELD,
        sourceAddress: treasuryRouterAddress,
        isActive: true,
        totalRevenue: 0
    });
    
    emit RevenueStreamRegistered(streamId, allianceName, treasuryRouterAddress);
}
```

#### 2. Forward Alliance Yields to Revenue Engine

```solidity
// AllianceTreasuryRouter.sol - Add revenue engine integration
address public revenueEngineAddress;

function _distributeYield(uint256 amount) internal override {
    // Calculate distributions
    uint256 zakatAmount = (amount * zakatPercentageBPS) / BASIS_POINTS;
    uint256 sovereignAmount = amount - zakatAmount;
    
    // Route to Zakat treasury
    _transfer(ZAKAT_TREASURY, zakatAmount);
    
    // Route to Sovereign beneficiary through Revenue Engine
    if (revenueEngineAddress != address(0)) {
        ICosmicRevenueEngine(revenueEngineAddress).receiveAllianceYield{
            value: sovereignAmount
        }(allianceId);
    } else {
        _transfer(SOVEREIGN_BENEFICIARY, sovereignAmount);
    }
    
    emit YieldDistributed(sovereignAmount, zakatAmount, block.timestamp);
}
```

#### 3. Track Alliance Metrics in Revenue Engine

```solidity
// Track alliance-specific metrics
struct AllianceMetrics {
    uint256 allianceId;
    uint256 totalYield;
    uint256 totalZakat;
    uint256 assetCount;
    uint256 assetValueUSD;
    uint256 lastDistribution;
}

mapping(uint256 => AllianceMetrics) public allianceMetrics;

function receiveAllianceYield(uint256 allianceId) external payable {
    require(msg.value > 0, "No yield");
    
    allianceMetrics[allianceId].totalYield += msg.value;
    allianceMetrics[allianceId].lastDistribution = block.timestamp;
    
    // Forward to sovereign beneficiary
    _transfer(SOVEREIGN, msg.value);
    
    emit AllianceYieldReceived(allianceId, msg.value);
}
```

---

## Integration with ProtocolRegistry

### Purpose
Register alliance contracts in the unified protocol registry for discoverability.

### Implementation Steps

#### 1. Register Alliance Contracts

```solidity
// ProtocolRegistry.sol integration
const protocolRegistry = await ethers.getContractAt(
  "ProtocolRegistry",
  REGISTRY_ADDRESS
);

// Register RealWorldAllianceRegistry
await protocolRegistry.registerProtocol(
  "RealWorldAllianceRegistry",
  "1.0.0",
  allianceRegistryAddress,
  ["alliance", "ssl-v1", "asset-tokenization"],
  "ipfs://QmAllianceRegistryMetadata..."
);

// Register AllianceTreasuryRouter
await protocolRegistry.registerProtocol(
  "AllianceTreasuryRouter",
  "1.0.0",
  treasuryRouterAddress,
  ["treasury", "yield-distribution", "zakat"],
  "ipfs://QmTreasuryRouterMetadata..."
);

// Register AllianceAssetBridge
await protocolRegistry.registerProtocol(
  "AllianceAssetBridge",
  "1.0.0",
  assetBridgeAddress,
  ["asset-tokenization", "nft", "erc721"],
  "ipfs://QmAssetBridgeMetadata..."
);
```

#### 2. Query Registered Alliances

```solidity
// Frontend query example
const protocolRegistry = new ethers.Contract(
  REGISTRY_ADDRESS,
  REGISTRY_ABI,
  provider
);

// Get all alliance contracts
const allianceProtocols = await protocolRegistry.getProtocolsByTag("alliance");

// Get specific alliance details
const allianceDetails = await protocolRegistry.getProtocol(
  allianceRegistryAddress
);
```

---

## Integration with Sovereign TV App

### Purpose
Display alliance information, assets, and yield data in the Sovereign TV interface.

### Implementation Steps

#### 1. Add Alliance Section to App Navigation

```jsx
// sovereign-tv-app/src/components/Navigation.jsx
import AllianceIcon from '@mui/icons-material/Business';

const navigationItems = [
  // ... existing items
  {
    label: 'Real-World Alliances',
    path: '/alliances',
    icon: <AllianceIcon />,
    roles: ['user', 'admin']
  }
];
```

#### 2. Create Alliance Dashboard Component

```jsx
// sovereign-tv-app/src/components/AllianceDashboard.jsx
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '../hooks/useWeb3';

const AllianceDashboard = () => {
  const { provider, signer } = useWeb3();
  const [alliances, setAlliances] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadAlliances();
  }, [provider]);
  
  const loadAlliances = async () => {
    const registry = new ethers.Contract(
      ALLIANCE_REGISTRY_ADDRESS,
      ALLIANCE_REGISTRY_ABI,
      provider
    );
    
    const totalAlliances = await registry.getTotalAlliances();
    const allianceData = [];
    
    for (let i = 0; i < totalAlliances; i++) {
      const alliance = await registry.getAlliance(i);
      const assets = await registry.getAllianceAssets(i);
      const yieldDist = await registry.getYieldDistribution(i);
      
      allianceData.push({
        id: i,
        ...alliance,
        assets,
        yieldDistribution: yieldDist
      });
    }
    
    setAlliances(allianceData);
    setLoading(false);
  };
  
  return (
    <Container>
      <Typography variant="h4">Real-World Alliances</Typography>
      <Grid container spacing={3}>
        {alliances.map(alliance => (
          <Grid item xs={12} md={6} lg={4} key={alliance.id}>
            <AllianceCard alliance={alliance} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
```

#### 3. Integrate Alliance Data in Metrics

```jsx
// Add alliance metrics to dashboard
const DashboardMetrics = () => {
  const [metrics, setMetrics] = useState({
    totalAlliances: 0,
    totalAssetValue: 0,
    totalYieldDistributed: 0
  });
  
  useEffect(() => {
    loadMetrics();
  }, []);
  
  const loadMetrics = async () => {
    const registry = new ethers.Contract(
      ALLIANCE_REGISTRY_ADDRESS,
      ALLIANCE_REGISTRY_ABI,
      provider
    );
    
    const totalAlliances = await registry.getTotalAlliances();
    
    let totalAssetValue = 0;
    let totalYield = 0;
    
    for (let i = 0; i < totalAlliances; i++) {
      const assets = await registry.getAllianceAssets(i);
      const yieldDist = await registry.getYieldDistribution(i);
      
      totalAssetValue += assets.reduce((sum, asset) => 
        sum + asset.valuationUSD, 0
      );
      totalYield += parseFloat(ethers.formatEther(yieldDist.totalDistributed));
    }
    
    setMetrics({
      totalAlliances,
      totalAssetValue,
      totalYieldDistributed: totalYield
    });
  };
  
  return (
    <Grid container spacing={3}>
      <MetricCard title="Total Alliances" value={metrics.totalAlliances} />
      <MetricCard title="Asset Value (USD)" value={`$${metrics.totalAssetValue.toLocaleString()}`} />
      <MetricCard title="Yield Distributed (ETH)" value={metrics.totalYieldDistributed} />
    </Grid>
  );
};
```

---

## Integration with Existing NFT Contracts

### Purpose
Enable existing NFTs to route royalties through alliance treasury infrastructure.

### Implementation Steps

#### 1. Update NFT Contract to Support Alliance Royalties

```solidity
// Existing NFT contract - add alliance royalty support
import "./interfaces/IAllianceTreasuryRouter.sol";

contract ExistingNFT is ERC721, ERC721Royalty {
    address public allianceTreasuryRouter;
    
    function setAllianceRoyalties(
        address _allianceTreasuryRouter,
        uint96 royaltyBPS
    ) external onlyOwner {
        require(royaltyBPS >= 250, "Below SSL minimum");
        allianceTreasuryRouter = _allianceTreasuryRouter;
        
        // Set default royalty to route through alliance treasury
        _setDefaultRoyalty(allianceTreasuryRouter, royaltyBPS);
    }
    
    // Override transfer to trigger royalty distribution
    function _update(address to, uint256 tokenId, address auth)
        internal
        override
        returns (address)
    {
        address from = super._update(to, tokenId, auth);
        
        // If transfer includes payment and alliance router is set
        if (allianceTreasuryRouter != address(0) && msg.value > 0) {
            // Forward to alliance treasury router for SSL-compliant distribution
            IAllianceTreasuryRouter(allianceTreasuryRouter).distributeBalance{
                value: msg.value
            }();
        }
        
        return from;
    }
}
```

#### 2. Migrate Existing NFT Royalties

```javascript
// Migration script
async function migrateNFTRoyalties() {
  const existingNFT = await ethers.getContractAt("ExistingNFT", NFT_ADDRESS);
  
  // Update royalty recipient to alliance treasury router
  const tx = await existingNFT.setAllianceRoyalties(
    ALLIANCE_TREASURY_ROUTER_ADDRESS,
    250 // 2.5%
  );
  
  await tx.wait();
  
  console.log("NFT royalties migrated to alliance treasury");
}
```

---

## Frontend Integration

### Web3 Hooks for Alliance Interaction

```typescript
// hooks/useAlliance.ts
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from './useWeb3';

export const useAlliance = (allianceId: number) => {
  const { provider } = useWeb3();
  const [alliance, setAlliance] = useState<Alliance | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadAlliance();
  }, [allianceId, provider]);
  
  const loadAlliance = async () => {
    const registry = new ethers.Contract(
      ALLIANCE_REGISTRY_ADDRESS,
      ALLIANCE_REGISTRY_ABI,
      provider
    );
    
    const allianceData = await registry.getAlliance(allianceId);
    const assets = await registry.getAllianceAssets(allianceId);
    const yieldDist = await registry.getYieldDistribution(allianceId);
    const compliant = await registry.verifySSLCompliance(allianceId);
    
    setAlliance({
      ...allianceData,
      assets,
      yieldDistribution: yieldDist,
      sslCompliant: compliant
    });
    setLoading(false);
  };
  
  return { alliance, loading, reload: loadAlliance };
};

// hooks/useTreasuryRouter.ts
export const useTreasuryRouter = (routerAddress: string) => {
  const { provider, signer } = useWeb3();
  const [balance, setBalance] = useState('0');
  const [stats, setStats] = useState<TreasuryStats | null>(null);
  
  const loadBalance = async () => {
    const bal = await provider.getBalance(routerAddress);
    setBalance(ethers.formatEther(bal));
  };
  
  const loadStats = async () => {
    const router = new ethers.Contract(
      routerAddress,
      TREASURY_ROUTER_ABI,
      provider
    );
    
    const statsData = await router.getTreasuryStats();
    setStats(statsData);
  };
  
  const distribute = async () => {
    const router = new ethers.Contract(
      routerAddress,
      TREASURY_ROUTER_ABI,
      signer
    );
    
    const tx = await router.distributeBalance();
    await tx.wait();
    
    await loadBalance();
    await loadStats();
  };
  
  useEffect(() => {
    loadBalance();
    loadStats();
    
    // Poll every 15 seconds
    const interval = setInterval(() => {
      loadBalance();
      loadStats();
    }, 15000);
    
    return () => clearInterval(interval);
  }, [routerAddress]);
  
  return { balance, stats, distribute };
};
```

---

## API Integration

### REST API Endpoints

```javascript
// api/alliances.js
const express = require('express');
const { ethers } = require('ethers');
const router = express.Router();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const registry = new ethers.Contract(
  process.env.ALLIANCE_REGISTRY_ADDRESS,
  ALLIANCE_REGISTRY_ABI,
  provider
);

// GET /api/alliances - List all alliances
router.get('/', async (req, res) => {
  try {
    const total = await registry.getTotalAlliances();
    const alliances = [];
    
    for (let i = 0; i < total; i++) {
      const alliance = await registry.getAlliance(i);
      alliances.push({
        id: i,
        name: alliance.name,
        status: alliance.status,
        contractAddress: alliance.contractAddress
      });
    }
    
    res.json({ alliances, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/alliances/:id - Get alliance details
router.get('/:id', async (req, res) => {
  try {
    const allianceId = parseInt(req.params.id);
    
    const alliance = await registry.getAlliance(allianceId);
    const assets = await registry.getAllianceAssets(allianceId);
    const yieldDist = await registry.getYieldDistribution(allianceId);
    const compliant = await registry.verifySSLCompliance(allianceId);
    
    res.json({
      id: allianceId,
      ...alliance,
      assets,
      yieldDistribution: yieldDist,
      sslCompliant: compliant
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

---

## GraphQL Integration (The Graph)

### Subgraph Schema

```graphql
# schema.graphql
type Alliance @entity {
  id: ID!
  allianceId: BigInt!
  name: String!
  allianceType: AllianceType!
  status: AllianceStatus!
  contractAddress: Bytes!
  zakatPercentage: BigInt!
  registrationTimestamp: BigInt!
  certificationTimestamp: BigInt!
  assets: [Asset!]! @derivedFrom(field: "alliance")
  yieldDistributions: [YieldDistribution!]! @derivedFrom(field: "alliance")
}

type Asset @entity {
  id: ID!
  tokenId: BigInt!
  alliance: Alliance!
  assetType: AssetType!
  description: String!
  valuationUSD: BigInt!
  status: AssetStatus!
}

type YieldDistribution @entity {
  id: ID!
  alliance: Alliance!
  timestamp: BigInt!
  totalAmount: BigInt!
  sovereignAmount: BigInt!
  zakatAmount: BigInt!
  transactionHash: Bytes!
}

enum AllianceType {
  ASSET_TOKENIZATION
  SERVICE_PARTNERSHIP
  REVENUE_SHARE
  HYBRID
}

enum AllianceStatus {
  PENDING
  CERTIFIED
  SUSPENDED
  REVOKED
}

enum AssetType {
  REAL_ESTATE
  INTELLECTUAL_PROPERTY
  COMMODITY
  SERVICE
  EQUITY
  OTHER
}

enum AssetStatus {
  PENDING
  VERIFIED
  ACTIVE
  SUSPENDED
}
```

### Query Examples

```graphql
# Get all certified alliances
query GetCertifiedAlliances {
  alliances(where: { status: CERTIFIED }) {
    id
    name
    allianceType
    zakatPercentage
    assets {
      id
      description
      valuationUSD
    }
    yieldDistributions {
      totalAmount
      timestamp
    }
  }
}

# Get alliance yield history
query GetAllianceYieldHistory($allianceId: BigInt!) {
  alliance(id: $allianceId) {
    name
    yieldDistributions(orderBy: timestamp, orderDirection: desc) {
      timestamp
      totalAmount
      sovereignAmount
      zakatAmount
      transactionHash
    }
  }
}
```

---

## Testing Integration

### Integration Test Example

```javascript
// test/integration/alliance-integration.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Alliance Integration Tests", function () {
  let allianceRegistry;
  let treasuryRouter;
  let scrollVerseDAO;
  let cosmicRevenueEngine;
  
  before(async function () {
    // Deploy all contracts
    // ... deployment code
  });
  
  it("Should integrate alliance with DAO governance", async function () {
    // Register alliance
    const tx = await allianceRegistry.registerAlliance(
      "Test Alliance",
      0, // ASSET_TOKENIZATION
      assetBridgeAddress,
      250,
      signers,
      3,
      7,
      "OpenZeppelin",
      "Delaware, USA"
    );
    
    const receipt = await tx.wait();
    const allianceId = receipt.events[0].args.allianceId;
    
    // Submit for DAO certification
    const proposalTx = await scrollVerseDAO.propose(
      [allianceRegistryAddress],
      [0],
      [allianceRegistry.interface.encodeFunctionData("certifyAlliance", [allianceId])],
      "Certify Test Alliance"
    );
    
    // ... vote and execute
    
    expect(await allianceRegistry.isCertified(assetBridgeAddress)).to.be.true;
  });
  
  it("Should route yields to Revenue Engine", async function () {
    // Send ETH to treasury router
    await owner.sendTransaction({
      to: treasuryRouterAddress,
      value: ethers.parseEther("10.0")
    });
    
    // Check revenue engine received sovereign share
    const engineBalance = await cosmicRevenueEngine.getBalance();
    expect(engineBalance).to.equal(ethers.parseEther("9.75"));
  });
});
```

---

**Integration Guide Version**: 1.0  
**Last Updated**: January 11, 2026  
**SSL Version**: 1.0

---

**Sovereign Chais owns every yield**
