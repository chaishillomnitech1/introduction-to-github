// Sovereign Chais owns every yield
// Licensed under ScrollVerse Sovereign License (SSL) v1.0
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

/**
 * @title RealWorldAllianceRegistry
 * @author OmniTech1™
 * @notice Registry and management system for real-world asset alliances
 * @dev Implements SSL v1.0 compliance with 2.5% Zakat routing
 * 
 * CORE FUNCTIONS:
 * - Alliance registration and certification
 * - Asset onboarding and verification
 * - Yield distribution routing
 * - Compliance verification
 * - Governance integration
 */
contract RealWorldAllianceRegistry is Ownable, ReentrancyGuard {
    using EnumerableSet for EnumerableSet.AddressSet;
    
    // ========== CONSTANTS ==========
    
    /// @notice ScrollVerse Sovereign License version
    string public constant SSL_VERSION = "1.0";
    
    /// @notice Minimum Zakat percentage (basis points)
    uint256 public constant MIN_ZAKAT_BPS = 250; // 2.5%
    
    /// @notice Basis points denominator
    uint256 public constant BASIS_POINTS = 10000;
    
    /// @notice Sovereign beneficiary address
    address public immutable SOVEREIGN_BENEFICIARY;
    
    /// @notice Zakat treasury address
    address public immutable ZAKAT_TREASURY;
    
    // ========== ENUMS ==========
    
    enum AllianceType {
        ASSET_TOKENIZATION,
        SERVICE_PARTNERSHIP,
        REVENUE_SHARE,
        HYBRID
    }
    
    enum AllianceStatus {
        PENDING,
        CERTIFIED,
        SUSPENDED,
        REVOKED
    }
    
    enum AssetType {
        REAL_ESTATE,
        INTELLECTUAL_PROPERTY,
        COMMODITY,
        SERVICE,
        EQUITY,
        OTHER
    }
    
    // ========== STRUCTS ==========
    
    struct Alliance {
        string name;
        AllianceType allianceType;
        AllianceStatus status;
        address contractAddress;
        uint256 zakatPercentage; // in basis points
        uint256 registrationTimestamp;
        uint256 certificationTimestamp;
        address[] signers;
        uint256 signersRequired;
        uint256 timelockDays;
        string auditFirm;
        uint256 auditDate;
        string legalJurisdiction;
    }
    
    struct Asset {
        AssetType assetType;
        string description;
        uint256 valuationUSD;
        string tokenizationStandard; // ERC-721, ERC-1155, ERC-20
        address tokenContract;
        uint256 onboardingTimestamp;
        bool verified;
    }
    
    struct YieldDistribution {
        uint256 sovereignShareBPS;
        uint256 zakatShareBPS;
        uint256 allianceShareBPS;
        uint256 totalDistributed;
        uint256 lastDistributionTimestamp;
    }
    
    // ========== STATE VARIABLES ==========
    
    /// @notice Mapping of alliance ID to Alliance struct
    mapping(uint256 => Alliance) public alliances;
    
    /// @notice Mapping of alliance ID to array of assets
    mapping(uint256 => Asset[]) public allianceAssets;
    
    /// @notice Mapping of alliance ID to yield distribution
    mapping(uint256 => YieldDistribution) public yieldDistributions;
    
    /// @notice Set of certified alliance contract addresses
    EnumerableSet.AddressSet private certifiedAllianceContracts;
    
    /// @notice Counter for alliance IDs
    uint256 public allianceCounter;
    
    /// @notice Mapping of contract address to alliance ID
    mapping(address => uint256) public contractToAlliance;
    
    // ========== EVENTS ==========
    
    event AllianceRegistered(
        uint256 indexed allianceId,
        string name,
        AllianceType allianceType,
        address contractAddress
    );
    
    event AllianceCertified(
        uint256 indexed allianceId,
        uint256 certificationTimestamp
    );
    
    event AllianceStatusUpdated(
        uint256 indexed allianceId,
        AllianceStatus oldStatus,
        AllianceStatus newStatus
    );
    
    event AssetRegistered(
        uint256 indexed allianceId,
        uint256 assetIndex,
        AssetType assetType,
        string description,
        uint256 valuationUSD
    );
    
    event AssetVerified(
        uint256 indexed allianceId,
        uint256 assetIndex
    );
    
    event YieldDistributed(
        uint256 indexed allianceId,
        uint256 sovereignAmount,
        uint256 zakatAmount,
        uint256 allianceAmount,
        uint256 timestamp
    );
    
    event SSLComplianceVerified(
        uint256 indexed allianceId,
        bool compliant
    );
    
    // ========== CONSTRUCTOR ==========
    
    constructor(
        address _sovereignBeneficiary,
        address _zakatTreasury
    ) Ownable(msg.sender) {
        require(_sovereignBeneficiary != address(0), "Invalid sovereign beneficiary");
        require(_zakatTreasury != address(0), "Invalid zakat treasury");
        
        SOVEREIGN_BENEFICIARY = _sovereignBeneficiary;
        ZAKAT_TREASURY = _zakatTreasury;
    }
    
    // ========== ALLIANCE REGISTRATION ==========
    
    /**
     * @notice Register a new alliance
     * @param name Alliance name
     * @param allianceType Type of alliance
     * @param contractAddress Deployed contract address
     * @param zakatPercentage Zakat percentage in basis points (min 250)
     * @param signers Array of multisig signers
     * @param signersRequired Number of required signers
     * @param timelockDays Timelock period in days
     */
    function registerAlliance(
        string memory name,
        AllianceType allianceType,
        address contractAddress,
        uint256 zakatPercentage,
        address[] memory signers,
        uint256 signersRequired,
        uint256 timelockDays,
        string memory auditFirm,
        string memory legalJurisdiction
    ) external onlyOwner returns (uint256) {
        require(bytes(name).length > 0, "Name required");
        require(contractAddress != address(0), "Invalid contract address");
        require(zakatPercentage >= MIN_ZAKAT_BPS, "Zakat too low");
        require(signersRequired > 0 && signersRequired <= signers.length, "Invalid signers config");
        require(timelockDays >= 7, "Timelock too short");
        
        uint256 allianceId = allianceCounter++;
        
        Alliance storage alliance = alliances[allianceId];
        alliance.name = name;
        alliance.allianceType = allianceType;
        alliance.status = AllianceStatus.PENDING;
        alliance.contractAddress = contractAddress;
        alliance.zakatPercentage = zakatPercentage;
        alliance.registrationTimestamp = block.timestamp;
        alliance.signers = signers;
        alliance.signersRequired = signersRequired;
        alliance.timelockDays = timelockDays;
        alliance.auditFirm = auditFirm;
        alliance.legalJurisdiction = legalJurisdiction;
        
        contractToAlliance[contractAddress] = allianceId;
        
        // Initialize yield distribution
        YieldDistribution storage yieldDist = yieldDistributions[allianceId];
        yieldDist.zakatShareBPS = zakatPercentage;
        yieldDist.sovereignShareBPS = BASIS_POINTS - zakatPercentage;
        
        emit AllianceRegistered(allianceId, name, allianceType, contractAddress);
        
        return allianceId;
    }
    
    /**
     * @notice Certify an alliance after audit and verification
     * @param allianceId Alliance identifier
     */
    function certifyAlliance(uint256 allianceId) external onlyOwner {
        Alliance storage alliance = alliances[allianceId];
        require(alliance.status == AllianceStatus.PENDING, "Not pending");
        require(bytes(alliance.auditFirm).length > 0, "Audit required");
        
        alliance.status = AllianceStatus.CERTIFIED;
        alliance.certificationTimestamp = block.timestamp;
        
        certifiedAllianceContracts.add(alliance.contractAddress);
        
        emit AllianceCertified(allianceId, block.timestamp);
        emit SSLComplianceVerified(allianceId, true);
    }
    
    // ========== ASSET MANAGEMENT ==========
    
    /**
     * @notice Register an asset for an alliance
     * @param allianceId Alliance identifier
     * @param assetType Type of asset
     * @param description Asset description
     * @param valuationUSD Valuation in USD
     * @param tokenizationStandard Token standard (ERC-721, ERC-1155, ERC-20)
     * @param tokenContract Token contract address
     */
    function registerAsset(
        uint256 allianceId,
        AssetType assetType,
        string memory description,
        uint256 valuationUSD,
        string memory tokenizationStandard,
        address tokenContract
    ) external onlyOwner {
        require(allianceId < allianceCounter, "Invalid alliance");
        require(bytes(description).length > 0, "Description required");
        
        Asset memory asset = Asset({
            assetType: assetType,
            description: description,
            valuationUSD: valuationUSD,
            tokenizationStandard: tokenizationStandard,
            tokenContract: tokenContract,
            onboardingTimestamp: block.timestamp,
            verified: false
        });
        
        allianceAssets[allianceId].push(asset);
        uint256 assetIndex = allianceAssets[allianceId].length - 1;
        
        emit AssetRegistered(allianceId, assetIndex, assetType, description, valuationUSD);
    }
    
    /**
     * @notice Verify an asset after due diligence
     * @param allianceId Alliance identifier
     * @param assetIndex Index of asset in alliance's asset array
     */
    function verifyAsset(uint256 allianceId, uint256 assetIndex) external onlyOwner {
        require(assetIndex < allianceAssets[allianceId].length, "Invalid asset index");
        
        allianceAssets[allianceId][assetIndex].verified = true;
        
        emit AssetVerified(allianceId, assetIndex);
    }
    
    // ========== YIELD DISTRIBUTION ==========
    
    /**
     * @notice Distribute yield according to SSL v1.0 requirements
     * @param allianceId Alliance identifier
     */
    function distributeYield(uint256 allianceId) external payable nonReentrant {
        require(msg.value > 0, "No yield to distribute");
        require(allianceId < allianceCounter, "Invalid alliance");
        
        Alliance storage alliance = alliances[allianceId];
        require(alliance.status == AllianceStatus.CERTIFIED, "Not certified");
        
        YieldDistribution storage yieldDist = yieldDistributions[allianceId];
        
        uint256 zakatAmount = (msg.value * yieldDist.zakatShareBPS) / BASIS_POINTS;
        uint256 sovereignAmount = (msg.value * yieldDist.sovereignShareBPS) / BASIS_POINTS;
        uint256 allianceAmount = msg.value - zakatAmount - sovereignAmount;
        
        // Transfer to Zakat treasury
        (bool zakatSuccess, ) = ZAKAT_TREASURY.call{value: zakatAmount}("");
        require(zakatSuccess, "Zakat transfer failed");
        
        // Transfer to Sovereign beneficiary
        (bool sovereignSuccess, ) = SOVEREIGN_BENEFICIARY.call{value: sovereignAmount}("");
        require(sovereignSuccess, "Sovereign transfer failed");
        
        // Transfer alliance share if applicable
        if (allianceAmount > 0) {
            (bool allianceSuccess, ) = alliance.contractAddress.call{value: allianceAmount}("");
            require(allianceSuccess, "Alliance transfer failed");
        }
        
        yieldDist.totalDistributed += msg.value;
        yieldDist.lastDistributionTimestamp = block.timestamp;
        
        emit YieldDistributed(allianceId, sovereignAmount, zakatAmount, allianceAmount, block.timestamp);
    }
    
    // ========== SSL COMPLIANCE ==========
    
    /**
     * @notice Verify SSL v1.0 compliance for an alliance
     * @param allianceId Alliance identifier
     * @return compliant Whether alliance is SSL compliant
     */
    function verifySSLCompliance(uint256 allianceId) external view returns (bool compliant) {
        Alliance storage alliance = alliances[allianceId];
        
        compliant = alliance.zakatPercentage >= MIN_ZAKAT_BPS &&
                    alliance.status == AllianceStatus.CERTIFIED &&
                    alliance.signersRequired >= 3 &&
                    alliance.timelockDays >= 7;
        
        return compliant;
    }
    
    /**
     * @notice Get SSL version
     */
    function getSSLVersion() external pure returns (string memory) {
        return SSL_VERSION;
    }
    
    /**
     * @notice Get sovereign beneficiary
     */
    function getSovereignBeneficiary() external view returns (address) {
        return SOVEREIGN_BENEFICIARY;
    }
    
    /**
     * @notice Get Zakat percentage for an alliance
     */
    function getZakatPercentage(uint256 allianceId) external view returns (uint256) {
        return alliances[allianceId].zakatPercentage;
    }
    
    // ========== VIEW FUNCTIONS ==========
    
    /**
     * @notice Get alliance details
     */
    function getAlliance(uint256 allianceId) external view returns (Alliance memory) {
        return alliances[allianceId];
    }
    
    /**
     * @notice Get all assets for an alliance
     */
    function getAllianceAssets(uint256 allianceId) external view returns (Asset[] memory) {
        return allianceAssets[allianceId];
    }
    
    /**
     * @notice Get yield distribution info
     */
    function getYieldDistribution(uint256 allianceId) external view returns (YieldDistribution memory) {
        return yieldDistributions[allianceId];
    }
    
    /**
     * @notice Get total number of alliances
     */
    function getTotalAlliances() external view returns (uint256) {
        return allianceCounter;
    }
    
    /**
     * @notice Check if contract is certified
     */
    function isCertified(address contractAddress) external view returns (bool) {
        return certifiedAllianceContracts.contains(contractAddress);
    }
    
    // ========== ADMIN FUNCTIONS ==========
    
    /**
     * @notice Update alliance status
     */
    function updateAllianceStatus(uint256 allianceId, AllianceStatus newStatus) external onlyOwner {
        Alliance storage alliance = alliances[allianceId];
        AllianceStatus oldStatus = alliance.status;
        alliance.status = newStatus;
        
        if (newStatus == AllianceStatus.CERTIFIED) {
            certifiedAllianceContracts.add(alliance.contractAddress);
        } else {
            certifiedAllianceContracts.remove(alliance.contractAddress);
        }
        
        emit AllianceStatusUpdated(allianceId, oldStatus, newStatus);
    }
}
