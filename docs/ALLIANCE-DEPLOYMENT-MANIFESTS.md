# Alliance Deployment Manifests

This directory contains deployment manifests for real-world alliances integrated with the ScrollVerse ecosystem.

## Overview

Alliance manifests define the complete configuration for partnerships that bridge digital and physical assets under the ScrollVerse Sovereign License (SSL v1.0).

## Manifest Templates

### 1. Real Estate Alliance Manifest

```yaml
# Real Estate Alliance Manifest
alliance_name: "Global Property Alliance"
alliance_type: "asset_tokenization"
ssl_version: "1.0"
manifest_version: "1.0.0"

# Alliance Configuration
alliance_config:
  sovereign_beneficiary: "UPDATE_SOVEREIGN_BENEFICIARY_ADDRESS" # REQUIRED: Replace with actual address
  zakat_treasury: "UPDATE_ZAKAT_TREASURY_ADDRESS" # REQUIRED: Replace with actual address
  zakat_percentage: 250  # 2.5% in basis points
  registration_timestamp: null # Set at deployment
  certification_timestamp: null # Set after audit

# Asset Portfolio
assets:
  - asset_id: "RWA-RE-001"
    asset_type: "real_estate"
    description: "Commercial office building - 123 Main St, NYC"
    legal_identifier: "NYC-2026-DEED-12345"
    jurisdiction: "New York, USA"
    valuation_usd: 5000000
    tokenization_standard: "ERC-721"
    contract_address: null # Set at deployment
    royalty_percentage: 250 # 2.5% in basis points
    legal_document_uri: "ipfs://QmXXXXXXXXXXXXXXXXXXXXXX"
    verification_required: true
    asset_owner: "UPDATE_ASSET_OWNER_ADDRESS" # REQUIRED: Replace with actual address
    
  - asset_id: "RWA-RE-002"
    asset_type: "real_estate"
    description: "Residential complex - 456 Oak Ave, LA"
    legal_identifier: "LA-2026-DEED-67890"
    jurisdiction: "California, USA"
    valuation_usd: 8000000
    tokenization_standard: "ERC-1155"
    contract_address: null
    royalty_percentage: 250
    legal_document_uri: "ipfs://QmYYYYYYYYYYYYYYYYYYYYYY"
    verification_required: true
    asset_owner: "UPDATE_ASSET_OWNER_ADDRESS" # REQUIRED: Replace with actual address

# Yield Distribution
yield_distribution:
  sovereign_share_bps: 9750  # 97.5%
  zakat_share_bps: 250       # 2.5%
  alliance_share_bps: 0      # 0%
  distribution_frequency: "monthly"
  auto_distribute: true

# Governance
governance:
  multisig_enabled: true
  signers:
    - "UPDATE_SIGNER_1_ADDRESS" # REQUIRED
    - "UPDATE_SIGNER_2_ADDRESS" # REQUIRED
    - "UPDATE_SIGNER_3_ADDRESS" # REQUIRED
    - "UPDATE_SIGNER_4_ADDRESS" # REQUIRED
    - "UPDATE_SIGNER_5_ADDRESS" # REQUIRED
  signers_required: 3
  timelock_days: 7
  governance_token: null # Optional DAO token

# Compliance
compliance:
  audit_firm: "OpenZeppelin"
  audit_date: null # Set after audit completion
  audit_report_uri: "ipfs://QmZZZZZZZZZZZZZZZZZZZZZZ"
  legal_jurisdiction: "Delaware, USA"
  legal_entity: "ScrollVerse Real Estate Alliance LLC"
  kyc_required: true
  aml_compliant: true
  accredited_investors_only: true
  
# Integration
integration:
  scrollverse_dao: true
  cosmic_revenue_engine: true
  protocol_registry: true
  alliance_registry: true
  treasury_router: true
  
# Deployment
deployment:
  network: "mainnet" # or "sepolia" for testnet
  deployer_address: "UPDATE_DEPLOYER_ADDRESS" # REQUIRED
  gas_price_strategy: "medium"
  verify_on_etherscan: true
```

### 2. Intellectual Property Alliance Manifest

```yaml
# Intellectual Property Alliance Manifest
alliance_name: "Creative IP Alliance"
alliance_type: "asset_tokenization"
ssl_version: "1.0"
manifest_version: "1.0.0"

# Alliance Configuration
alliance_config:
  sovereign_beneficiary: "0x0000000000000000000000000000000000000000"
  zakat_treasury: "0x0000000000000000000000000000000000000000"
  zakat_percentage: 250
  registration_timestamp: null
  certification_timestamp: null

# Asset Portfolio
assets:
  - asset_id: "RWA-IP-001"
    asset_type: "intellectual_property"
    description: "Music catalog - 100 tracks by Artist Name"
    legal_identifier: "USPTO-2026-COPYRIGHT-12345"
    jurisdiction: "USA"
    valuation_usd: 1000000
    tokenization_standard: "ERC-1155"
    contract_address: null
    royalty_percentage: 500 # 5% for IP
    legal_document_uri: "ipfs://QmIPIPIPIPIPIPIPIPIPIPIP"
    verification_required: true
    asset_owner: "UPDATE_ASSET_OWNER_ADDRESS" # REQUIRED
    
  - asset_id: "RWA-IP-002"
    asset_type: "intellectual_property"
    description: "Software patent - Blockchain optimization algorithm"
    legal_identifier: "USPTO-2026-PATENT-67890"
    jurisdiction: "USA"
    valuation_usd: 2500000
    tokenization_standard: "ERC-721"
    contract_address: null
    royalty_percentage: 500
    legal_document_uri: "ipfs://QmPATENTPATENTPATENTPATENT"
    verification_required: true
    asset_owner: "UPDATE_ASSET_OWNER_ADDRESS" # REQUIRED

# Yield Distribution
yield_distribution:
  sovereign_share_bps: 9500  # 95%
  zakat_share_bps: 250       # 2.5%
  alliance_share_bps: 250    # 2.5%
  distribution_frequency: "quarterly"
  auto_distribute: true

# Governance
governance:
  multisig_enabled: true
  signers:
    - "0x0000000000000000000000000000000000000001"
    - "0x0000000000000000000000000000000000000002"
    - "0x0000000000000000000000000000000000000003"
  signers_required: 2
  timelock_days: 7

# Compliance
compliance:
  audit_firm: "Certik"
  audit_date: null
  audit_report_uri: "ipfs://QmAUDITAUDITAUDITAUDIT"
  legal_jurisdiction: "Delaware, USA"
  legal_entity: "ScrollVerse IP Alliance LLC"
  kyc_required: false
  aml_compliant: true
  
# Integration
integration:
  scrollverse_dao: true
  cosmic_revenue_engine: true
  protocol_registry: true
  alliance_registry: true
  treasury_router: true
```

### 3. Service Partnership Alliance Manifest

```yaml
# Service Partnership Alliance Manifest
alliance_name: "Global Services Alliance"
alliance_type: "service_partnership"
ssl_version: "1.0"
manifest_version: "1.0.0"

# Alliance Configuration
alliance_config:
  sovereign_beneficiary: "0x0000000000000000000000000000000000000000"
  zakat_treasury: "0x0000000000000000000000000000000000000000"
  zakat_percentage: 250
  registration_timestamp: null
  certification_timestamp: null

# Service Offerings
services:
  - service_id: "SVC-001"
    service_type: "consulting"
    description: "Blockchain architecture consulting"
    pricing_model: "hourly"
    base_rate_usd: 250
    revenue_share_enabled: true
    
  - service_id: "SVC-002"
    service_type: "development"
    description: "Smart contract development"
    pricing_model: "project"
    base_rate_usd: 50000
    revenue_share_enabled: true

# Yield Distribution
yield_distribution:
  sovereign_share_bps: 8000  # 80%
  zakat_share_bps: 250       # 2.5%
  alliance_share_bps: 1750   # 17.5%
  distribution_frequency: "monthly"
  auto_distribute: true

# Governance
governance:
  multisig_enabled: true
  signers:
    - "0x0000000000000000000000000000000000000001"
    - "0x0000000000000000000000000000000000000002"
    - "0x0000000000000000000000000000000000000003"
  signers_required: 2
  timelock_days: 7

# Compliance
compliance:
  audit_firm: "Trail of Bits"
  audit_date: null
  legal_jurisdiction: "Delaware, USA"
  legal_entity: "ScrollVerse Services Alliance LLC"
  
# Integration
integration:
  scrollverse_dao: true
  protocol_registry: true
  alliance_registry: true
  treasury_router: true
```

## Deployment Instructions

1. **Customize Manifest**
   - Copy appropriate template
   - Update all placeholder addresses
   - Set asset details and valuations
   - Configure governance parameters

2. **Legal Verification**
   - Obtain legal documentation
   - Upload to IPFS
   - Update `legal_document_uri` fields
   - Complete KYC/AML if required

3. **Deploy Contracts**
   ```bash
   cd /home/runner/work/introduction-to-github/introduction-to-github/contracts
   npm run deploy:alliance -- --manifest path/to/manifest.yaml --network mainnet
   ```

4. **Register Alliance**
   - Submit to RealWorldAllianceRegistry
   - Wait for certification approval
   - Begin asset onboarding

5. **Security Audit**
   - Engage approved auditor
   - Address findings
   - Upload audit report to IPFS
   - Update manifest

6. **Activate Alliance**
   - Complete DAO governance vote
   - Receive SSL v1.0 certification
   - Begin yield distribution

## Validation

Before deployment, validate your manifest:

```bash
npm run validate:manifest -- path/to/manifest.yaml
```

## Support

For assistance with alliance deployment:
- Review SSL v1.0 documentation: [SCROLLVERSE-SOVEREIGN-LICENSE.md](../SCROLLVERSE-SOVEREIGN-LICENSE.md)
- Contact: support@scrollverse.io
- DAO Governance: [ScrollVerseDAO](../contracts/src/ScrollVerseDAO.sol)
