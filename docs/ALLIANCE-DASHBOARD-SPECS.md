# Alliance Dashboard Specifications

## Overview

The Alliance Dashboard provides real-time monitoring, management, and analytics for all real-world alliances operating under SSL v1.0 within the ScrollVerse ecosystem.

---

## Dashboard Architecture

### Technology Stack

```yaml
frontend:
  framework: "React 18+"
  state_management: "Redux Toolkit / Zustand"
  ui_library: "Material-UI / Tailwind CSS"
  charts: "Recharts / Chart.js"
  web3: "ethers.js v6 / wagmi"
  
backend:
  api: "Node.js + Express"
  database: "PostgreSQL"
  caching: "Redis"
  indexing: "The Graph (GraphQL)"
  
blockchain:
  network: "Ethereum Mainnet / Sepolia"
  rpc: "Alchemy / Infura"
  ipfs: "Pinata / NFT.Storage"
```

---

## Dashboard Modules

### 1. Alliance Overview Module

**Purpose**: High-level view of all alliances

**Components**:

```typescript
interface AllianceOverviewProps {
  totalAlliances: number;
  certifiedAlliances: number;
  pendingAlliances: number;
  totalAssetValue: number;
  totalYieldDistributed: number;
  activeAllianceList: Alliance[];
}

// Main metrics cards
const MetricsCards = () => (
  <Grid container spacing={3}>
    <MetricCard
      title="Total Alliances"
      value={totalAlliances}
      change="+5 this month"
      icon={<BusinessIcon />}
    />
    <MetricCard
      title="SSL Certified"
      value={certifiedAlliances}
      status="success"
      icon={<VerifiedIcon />}
    />
    <MetricCard
      title="Total Asset Value"
      value={`$${totalAssetValue.toLocaleString()}`}
      subtitle="USD valuation"
      icon={<AttachMoneyIcon />}
    />
    <MetricCard
      title="Yield Distributed (ETH)"
      value={totalYieldDistributed}
      subtitle="All-time"
      icon={<TrendingUpIcon />}
    />
  </Grid>
);
```

**Features**:
- Real-time alliance count
- SSL certification status
- Total asset valuation
- Yield distribution metrics
- Alliance status breakdown (pie chart)
- Geographic distribution map

---

### 2. Alliance Details Module

**Purpose**: Comprehensive view of individual alliance

**Components**:

```typescript
interface AllianceDetailsProps {
  allianceId: number;
  alliance: Alliance;
  assets: Asset[];
  yieldHistory: YieldDistribution[];
  governanceActivity: GovernanceAction[];
  complianceStatus: ComplianceReport;
}

const AllianceDetails = ({ allianceId }: { allianceId: number }) => {
  return (
    <Container>
      {/* Header Section */}
      <AllianceHeader
        name={alliance.name}
        type={alliance.allianceType}
        status={alliance.status}
        certificationDate={alliance.certificationTimestamp}
      />
      
      {/* SSL Compliance Badge */}
      <SSLComplianceBadge
        compliant={verifySSLCompliance(alliance)}
        zakatPercentage={alliance.zakatPercentage}
        lastAudit={complianceStatus.lastAuditDate}
      />
      
      {/* Tabs */}
      <Tabs>
        <Tab label="Assets" />
        <Tab label="Yield Distribution" />
        <Tab label="Governance" />
        <Tab label="Compliance" />
        <Tab label="Documents" />
      </Tabs>
      
      {/* Tab Content */}
      <TabPanel value={0}>
        <AssetList assets={assets} />
      </TabPanel>
      
      <TabPanel value={1}>
        <YieldDistributionChart history={yieldHistory} />
        <YieldTable distributions={yieldHistory} />
      </TabPanel>
      
      <TabPanel value={2}>
        <GovernanceActivity actions={governanceActivity} />
        <MultisigStatus signers={alliance.signers} />
      </TabPanel>
      
      <TabPanel value={3}>
        <ComplianceChecklist status={complianceStatus} />
        <AuditHistory audits={complianceStatus.audits} />
      </TabPanel>
      
      <TabPanel value={4}>
        <DocumentLibrary allianceId={allianceId} />
      </TabPanel>
    </Container>
  );
};
```

**Features**:
- Alliance metadata display
- Asset portfolio management
- Yield distribution visualization
- Governance action log
- Compliance status tracker
- Document repository

---

### 3. Asset Management Module

**Purpose**: Tokenize and manage real-world assets

**Components**:

```typescript
interface AssetManagementProps {
  allianceId: number;
  onAssetTokenize: (asset: AssetData) => Promise<void>;
  onAssetVerify: (tokenId: number) => Promise<void>;
}

const AssetManagementForm = () => {
  const [formData, setFormData] = useState<AssetFormData>({
    assetIdentifier: '',
    assetType: 'REAL_ESTATE',
    description: '',
    jurisdiction: '',
    valuationUSD: 0,
    tokenizationStandard: 'ERC-721',
    royaltyPercentage: 250, // 2.5%
    legalDocumentURI: '',
    metadataURI: '',
    assetOwner: ''
  });
  
  const handleTokenize = async () => {
    // Upload legal docs to IPFS
    const legalDocsURI = await uploadToIPFS(formData.legalDocuments);
    
    // Upload metadata to IPFS
    const metadataURI = await uploadMetadataToIPFS({
      name: formData.description,
      description: formData.description,
      image: formData.imageURI,
      attributes: [...]
    });
    
    // Call smart contract
    const tx = await assetBridge.tokenizeAsset(
      formData.assetIdentifier,
      formData.assetType,
      formData.jurisdiction,
      formData.valuationUSD,
      legalDocsURI,
      metadataURI,
      formData.royaltyPercentage,
      formData.assetOwner
    );
    
    await tx.wait();
    
    // Success notification
    toast.success(`Asset tokenized! Token ID: ${tokenId}`);
  };
  
  return (
    <Form onSubmit={handleTokenize}>
      {/* Form fields */}
    </Form>
  );
};
```

**Features**:
- Asset tokenization wizard
- IPFS document upload
- Metadata management
- Asset verification workflow
- Valuation tracking
- Asset status updates

---

### 4. Yield Distribution Module

**Purpose**: Monitor and trigger yield distributions

**Components**:

```typescript
interface YieldDistributionProps {
  allianceId: number;
  treasuryRouterAddress: string;
  currentBalance: BigNumber;
  distributionHistory: Distribution[];
}

const YieldDistributionPanel = () => {
  const [balance, setBalance] = useState<string>('0');
  
  // Real-time balance monitoring
  useEffect(() => {
    const interval = setInterval(async () => {
      const bal = await provider.getBalance(treasuryRouterAddress);
      setBalance(ethers.formatEther(bal));
    }, 15000); // Every 15 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  const handleDistribute = async () => {
    const tx = await treasuryRouter.distributeBalance();
    await tx.wait();
    
    toast.success('Yield distributed successfully!');
  };
  
  return (
    <Box>
      {/* Current Balance Card */}
      <Card>
        <CardHeader title="Treasury Balance" />
        <CardContent>
          <Typography variant="h3">{balance} ETH</Typography>
          <Button
            variant="contained"
            onClick={handleDistribute}
            disabled={parseFloat(balance) === 0}
          >
            Distribute Now
          </Button>
        </CardContent>
      </Card>
      
      {/* Distribution Breakdown */}
      <Card>
        <CardHeader title="Distribution Breakdown" />
        <CardContent>
          <DistributionPieChart
            sovereignShare={97.5}
            zakatShare={2.5}
            allianceShare={0}
          />
        </CardContent>
      </Card>
      
      {/* Distribution History */}
      <Card>
        <CardHeader title="Distribution History" />
        <CardContent>
          <DataGrid
            rows={distributionHistory}
            columns={distributionColumns}
            pageSize={10}
          />
        </CardContent>
      </Card>
      
      {/* Distribution Chart */}
      <Card>
        <CardHeader title="Yield Trends" />
        <CardContent>
          <LineChart
            data={yieldTrendData}
            xAxis="timestamp"
            yAxis="amount"
          />
        </CardContent>
      </Card>
    </Box>
  );
};
```

**Features**:
- Real-time balance monitoring
- One-click distribution trigger
- Distribution breakdown visualization
- Historical distribution table
- Yield trend charts
- Recipient verification

---

### 5. Governance Module

**Purpose**: Manage multisig operations and DAO voting

**Components**:

```typescript
interface GovernanceModuleProps {
  allianceId: number;
  multisigAddress: string;
  signers: string[];
  signersRequired: number;
  pendingTransactions: MultisigTx[];
  daoProposals: Proposal[];
}

const GovernanceModule = () => {
  return (
    <Box>
      {/* Multisig Status */}
      <Card>
        <CardHeader title="Multisig Status" />
        <CardContent>
          <Typography>
            Configuration: {signersRequired} of {signers.length} signatures required
          </Typography>
          <Typography>
            7-day timelock: Active
          </Typography>
          <SignerList signers={signers} />
        </CardContent>
      </Card>
      
      {/* Pending Transactions */}
      <Card>
        <CardHeader title="Pending Transactions" />
        <CardContent>
          <TransactionQueue
            transactions={pendingTransactions}
            onSign={handleSign}
            onExecute={handleExecute}
          />
        </CardContent>
      </Card>
      
      {/* DAO Proposals */}
      <Card>
        <CardHeader title="DAO Governance" />
        <CardContent>
          <ProposalList
            proposals={daoProposals}
            onVote={handleVote}
          />
        </CardContent>
      </Card>
      
      {/* Timelock Operations */}
      <Card>
        <CardHeader title="Timelock Queue" />
        <CardContent>
          <TimelockQueue
            operations={timelockOps}
            onExecute={handleTimelockExecute}
          />
        </CardContent>
      </Card>
    </Box>
  );
};
```

**Features**:
- Multisig configuration display
- Pending transaction queue
- Transaction signing interface
- DAO proposal listing
- Voting interface
- Timelock operation management

---

### 6. Compliance & Audit Module

**Purpose**: Track compliance status and audit history

**Components**:

```typescript
interface ComplianceModuleProps {
  allianceId: number;
  complianceStatus: ComplianceReport;
  auditHistory: Audit[];
  quarterlyReports: QuarterlyReport[];
}

const ComplianceModule = () => {
  return (
    <Box>
      {/* SSL Compliance Status */}
      <Card>
        <CardHeader title="SSL v1.0 Compliance" />
        <CardContent>
          <ComplianceChecklist
            items={[
              { name: 'Sovereign Beneficiary', status: true },
              { name: 'Zakat Routing (≥2.5%)', status: true },
              { name: 'Immutable Treasury Logic', status: true },
              { name: 'Multi-Signature Governance', status: true },
              { name: 'Timelock Protection', status: true },
              { name: 'Current Security Audit', status: true },
            ]}
          />
          <ComplianceScore score={100} />
        </CardContent>
      </Card>
      
      {/* Audit History */}
      <Card>
        <CardHeader title="Audit History" />
        <CardContent>
          <Timeline>
            {auditHistory.map(audit => (
              <TimelineItem key={audit.id}>
                <TimelineSeparator>
                  <TimelineDot color="primary" />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <AuditCard audit={audit} />
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </CardContent>
      </Card>
      
      {/* Quarterly Reports */}
      <Card>
        <CardHeader title="Quarterly Reports" />
        <CardContent>
          <ReportList reports={quarterlyReports} />
        </CardContent>
      </Card>
      
      {/* Next Steps */}
      <Card>
        <CardHeader title="Upcoming Compliance Actions" />
        <CardContent>
          <Alert severity="info">
            Next quarterly report due: March 15, 2026
          </Alert>
          <Alert severity="warning">
            Annual audit due: December 1, 2026
          </Alert>
        </CardContent>
      </Card>
    </Box>
  );
};
```

**Features**:
- SSL compliance checklist
- Compliance score visualization
- Audit timeline
- Audit report viewer
- Quarterly report submission
- Upcoming deadline alerts

---

## Data Models

### Alliance Model

```typescript
interface Alliance {
  id: number;
  name: string;
  allianceType: 'ASSET_TOKENIZATION' | 'SERVICE_PARTNERSHIP' | 'REVENUE_SHARE' | 'HYBRID';
  status: 'PENDING' | 'CERTIFIED' | 'SUSPENDED' | 'REVOKED';
  contractAddress: string;
  zakatPercentage: number;
  registrationTimestamp: number;
  certificationTimestamp: number;
  signers: string[];
  signersRequired: number;
  timelockDays: number;
  auditFirm: string;
  auditDate: number;
  legalJurisdiction: string;
}
```

### Asset Model

```typescript
interface Asset {
  tokenId: number;
  assetIdentifier: string;
  assetType: 'REAL_ESTATE' | 'INTELLECTUAL_PROPERTY' | 'COMMODITY' | 'SERVICE' | 'EQUITY' | 'OTHER';
  description: string;
  jurisdiction: string;
  valuationUSD: number;
  onboardingTimestamp: number;
  verificationTimestamp: number;
  status: 'PENDING' | 'VERIFIED' | 'ACTIVE' | 'SUSPENDED';
  legalDocumentURI: string;
  metadataURI: string;
  assetOwner: string;
  royaltyPercentage: number;
}
```

### Yield Distribution Model

```typescript
interface YieldDistribution {
  id: string;
  allianceId: number;
  timestamp: number;
  totalAmount: string; // in ETH
  sovereignAmount: string;
  zakatAmount: string;
  allianceAmount: string;
  transactionHash: string;
  blockNumber: number;
}
```

---

## API Endpoints

### Alliance Endpoints

```
GET    /api/alliances               - List all alliances
GET    /api/alliances/:id            - Get alliance details
POST   /api/alliances                - Register new alliance (admin)
PUT    /api/alliances/:id            - Update alliance
DELETE /api/alliances/:id            - Revoke alliance (admin)

GET    /api/alliances/:id/assets     - Get alliance assets
GET    /api/alliances/:id/yield      - Get yield history
GET    /api/alliances/:id/governance - Get governance activity
GET    /api/alliances/:id/compliance - Get compliance status
```

### Asset Endpoints

```
GET    /api/assets                   - List all assets
GET    /api/assets/:tokenId          - Get asset details
POST   /api/assets                   - Tokenize new asset
PUT    /api/assets/:tokenId          - Update asset
POST   /api/assets/:tokenId/verify   - Verify asset
```

### Yield Distribution Endpoints

```
GET    /api/yield/history            - Global yield history
GET    /api/yield/alliance/:id       - Alliance yield history
POST   /api/yield/distribute/:id     - Trigger distribution
GET    /api/yield/stats              - Global yield statistics
```

---

## Deployment

### Environment Variables

```bash
# Frontend
REACT_APP_CHAIN_ID=1
REACT_APP_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/...
REACT_APP_ALLIANCE_REGISTRY_ADDRESS=0x...
REACT_APP_TREASURY_ROUTER_ADDRESS=0x...
REACT_APP_ASSET_BRIDGE_ADDRESS=0x...
REACT_APP_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/

# Backend
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
THE_GRAPH_API_KEY=...
ETHEREUM_RPC_URL=...
```

### Build & Deploy

```bash
# Install dependencies
npm install

# Build frontend
cd dashboard-frontend
npm run build

# Deploy to production
vercel --prod

# Start backend API
cd dashboard-backend
npm start
```

---

**Dashboard Version**: 1.0  
**SSL Version**: 1.0  
**Last Updated**: January 11, 2026

---

**Sovereign Chais owns every yield**
