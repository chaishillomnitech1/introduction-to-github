// Sovereign Chais owns every yield
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title ScrollVerseProsperityProtocol
 * @author OmniTech1™
 * @notice Governance dashboard for monitoring and managing all aspects of the ScrollVerse Prosperity Protocol
 * @dev Comprehensive system for Zakat treasury, collaborator revenue splits, and yield management
 * 
 * KEY FUNCTIONALITIES:
 * 1. Track Zakat treasury contributions, collaborator revenue splits, and yields
 * 2. Enable dynamic adjustments to permissions, revenue weights, and overrides
 * 3. Include real-time analytics and audit trails to balance transparency and control
 * 
 * CORE PRINCIPLES:
 * - Sovereign Chais owns every yield (primary beneficiary)
 * - Transparent and auditable revenue tracking
 * - Flexible collaborator management
 * - Dynamic permission and weight adjustments
 * - Complete audit trail for accountability
 */
contract ScrollVerseProsperityProtocol is AccessControl, ReentrancyGuard {
    
    // ========== ROLES ==========
    
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant TREASURY_MANAGER_ROLE = keccak256("TREASURY_MANAGER_ROLE");
    bytes32 public constant REVENUE_MANAGER_ROLE = keccak256("REVENUE_MANAGER_ROLE");
    bytes32 public constant AUDITOR_ROLE = keccak256("AUDITOR_ROLE");
    
    // ========== CONSTANTS ==========
    
    uint256 public constant BASIS_POINTS = 10000; // 100% = 10000 basis points
    uint256 public constant MAX_COLLABORATORS = 100;
    
    // ========== STRUCTS ==========
    
    /// @notice Collaborator information
    struct Collaborator {
        address wallet;
        uint256 revenueWeight; // in basis points (e.g., 1000 = 10%)
        bool isActive;
        uint256 totalEarned;
        uint256 lastDistribution;
        string role;
    }
    
    /// @notice Zakat contribution record
    struct ZakatContribution {
        uint256 amount;
        uint256 timestamp;
        address contributor;
        string source;
    }
    
    /// @notice Yield record
    struct YieldRecord {
        uint256 amount;
        uint256 timestamp;
        string source;
        address token;
    }
    
    /// @notice Audit log entry
    struct AuditLog {
        uint256 timestamp;
        address actor;
        string action;
        string details;
    }
    
    // ========== STATE VARIABLES ==========
    
    /// @notice The sovereign beneficiary address (Chais)
    address public immutable SOVEREIGN;
    
    /// @notice Zakat treasury balance
    uint256 public zakatTreasuryBalance;
    
    /// @notice Total revenue collected
    uint256 public totalRevenueCollected;
    
    /// @notice Total yields distributed
    uint256 public totalYieldsDistributed;
    
    /// @notice Collaborators mapping
    mapping(address => Collaborator) public collaborators;
    
    /// @notice List of all collaborator addresses
    address[] public collaboratorList;
    
    /// @notice Zakat contribution history
    ZakatContribution[] public zakatHistory;
    
    /// @notice Yield history
    YieldRecord[] public yieldHistory;
    
    /// @notice Audit trail
    AuditLog[] public auditTrail;
    
    /// @notice Revenue override flag (allows admin to override normal distribution)
    bool public revenueOverrideActive;
    
    /// @notice Override beneficiary when override is active
    address public overrideBeneficiary;
    
    // ========== EVENTS ==========
    
    event ZakatContributed(address indexed contributor, uint256 amount, string source, uint256 timestamp);
    event YieldRecorded(uint256 amount, string source, address indexed token, uint256 timestamp);
    event RevenueDistributed(address indexed recipient, uint256 amount, uint256 timestamp);
    event CollaboratorAdded(address indexed collaborator, uint256 revenueWeight, string role);
    event CollaboratorUpdated(address indexed collaborator, uint256 newWeight, bool isActive);
    event CollaboratorRemoved(address indexed collaborator);
    event RevenueWeightAdjusted(address indexed collaborator, uint256 oldWeight, uint256 newWeight);
    event PermissionGranted(address indexed account, bytes32 indexed role);
    event PermissionRevoked(address indexed account, bytes32 indexed role);
    event OverrideActivated(address indexed beneficiary);
    event OverrideDeactivated();
    event AuditLogCreated(uint256 indexed logId, address indexed actor, string action);
    event TreasuryWithdrawal(address indexed recipient, uint256 amount, uint256 timestamp);
    
    // ========== CONSTRUCTOR ==========
    
    constructor(address _sovereign) {
        require(_sovereign != address(0), "Invalid sovereign address");
        SOVEREIGN = _sovereign;
        
        // Grant admin role to deployer and sovereign
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(DEFAULT_ADMIN_ROLE, _sovereign);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, _sovereign);
        _grantRole(TREASURY_MANAGER_ROLE, _sovereign);
        _grantRole(REVENUE_MANAGER_ROLE, _sovereign);
        
        _logAudit(msg.sender, "CONTRACT_DEPLOYED", "ScrollVerse Prosperity Protocol initialized");
    }
    
    // ========== ZAKAT TREASURY FUNCTIONS ==========
    
    /**
     * @notice Record a Zakat contribution to the treasury
     * @param amount Amount contributed
     * @param source Description of the contribution source
     */
    function contributeToZakat(uint256 amount, string calldata source) external payable nonReentrant {
        require(msg.value == amount, "Amount mismatch");
        require(amount > 0, "Amount must be positive");
        
        zakatTreasuryBalance += amount;
        totalRevenueCollected += amount;
        
        zakatHistory.push(ZakatContribution({
            amount: amount,
            timestamp: block.timestamp,
            contributor: msg.sender,
            source: source
        }));
        
        emit ZakatContributed(msg.sender, amount, source, block.timestamp);
        _logAudit(msg.sender, "ZAKAT_CONTRIBUTED", string(abi.encodePacked("Amount: ", _uint2str(amount), " Source: ", source)));
    }
    
    /**
     * @notice Get Zakat treasury statistics
     */
    function getZakatStats() external view returns (
        uint256 balance,
        uint256 totalContributions,
        uint256 contributionCount
    ) {
        balance = zakatTreasuryBalance;
        
        uint256 total = 0;
        for (uint256 i = 0; i < zakatHistory.length; i++) {
            total += zakatHistory[i].amount;
        }
        
        return (balance, total, zakatHistory.length);
    }
    
    /**
     * @notice Get recent Zakat contributions
     * @param count Number of recent contributions to retrieve
     */
    function getRecentZakatContributions(uint256 count) external view returns (ZakatContribution[] memory) {
        uint256 length = zakatHistory.length;
        uint256 returnCount = count > length ? length : count;
        
        ZakatContribution[] memory recent = new ZakatContribution[](returnCount);
        
        for (uint256 i = 0; i < returnCount; i++) {
            recent[i] = zakatHistory[length - 1 - i];
        }
        
        return recent;
    }
    
    // ========== COLLABORATOR MANAGEMENT ==========
    
    /**
     * @notice Add a new collaborator with revenue split
     * @param wallet Collaborator's wallet address
     * @param revenueWeight Revenue weight in basis points (e.g., 1000 = 10%)
     * @param role Collaborator's role description
     */
    function addCollaborator(
        address wallet,
        uint256 revenueWeight,
        string calldata role
    ) external onlyRole(ADMIN_ROLE) {
        require(wallet != address(0), "Invalid wallet address");
        require(!collaborators[wallet].isActive, "Collaborator already exists");
        require(collaboratorList.length < MAX_COLLABORATORS, "Max collaborators reached");
        require(revenueWeight <= BASIS_POINTS, "Weight exceeds 100%");
        
        collaborators[wallet] = Collaborator({
            wallet: wallet,
            revenueWeight: revenueWeight,
            isActive: true,
            totalEarned: 0,
            lastDistribution: block.timestamp,
            role: role
        });
        
        collaboratorList.push(wallet);
        
        emit CollaboratorAdded(wallet, revenueWeight, role);
        _logAudit(msg.sender, "COLLABORATOR_ADDED", string(abi.encodePacked("Wallet: ", _addressToString(wallet), " Weight: ", _uint2str(revenueWeight))));
    }
    
    /**
     * @notice Update collaborator's revenue weight
     * @param wallet Collaborator's wallet address
     * @param newWeight New revenue weight in basis points
     */
    function updateCollaboratorWeight(
        address wallet,
        uint256 newWeight
    ) external onlyRole(REVENUE_MANAGER_ROLE) {
        require(collaborators[wallet].isActive, "Collaborator not found");
        require(newWeight <= BASIS_POINTS, "Weight exceeds 100%");
        
        uint256 oldWeight = collaborators[wallet].revenueWeight;
        collaborators[wallet].revenueWeight = newWeight;
        
        emit RevenueWeightAdjusted(wallet, oldWeight, newWeight);
        _logAudit(msg.sender, "WEIGHT_ADJUSTED", string(abi.encodePacked("Collaborator: ", _addressToString(wallet), " Old: ", _uint2str(oldWeight), " New: ", _uint2str(newWeight))));
    }
    
    /**
     * @notice Activate or deactivate a collaborator
     * @param wallet Collaborator's wallet address
     * @param isActive New active status
     */
    function setCollaboratorStatus(
        address wallet,
        bool isActive
    ) external onlyRole(ADMIN_ROLE) {
        require(collaborators[wallet].wallet != address(0), "Collaborator not found");
        
        collaborators[wallet].isActive = isActive;
        
        emit CollaboratorUpdated(wallet, collaborators[wallet].revenueWeight, isActive);
        _logAudit(msg.sender, "COLLABORATOR_STATUS_CHANGED", string(abi.encodePacked("Wallet: ", _addressToString(wallet), " Active: ", isActive ? "true" : "false")));
    }
    
    /**
     * @notice Get all active collaborators
     */
    function getActiveCollaborators() external view returns (address[] memory) {
        uint256 activeCount = 0;
        
        // Count active collaborators
        for (uint256 i = 0; i < collaboratorList.length; i++) {
            if (collaborators[collaboratorList[i]].isActive) {
                activeCount++;
            }
        }
        
        // Create array of active collaborators
        address[] memory active = new address[](activeCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < collaboratorList.length; i++) {
            if (collaborators[collaboratorList[i]].isActive) {
                active[index] = collaboratorList[i];
                index++;
            }
        }
        
        return active;
    }
    
    /**
     * @notice Get collaborator details
     */
    function getCollaboratorDetails(address wallet) external view returns (
        uint256 revenueWeight,
        bool isActive,
        uint256 totalEarned,
        uint256 lastDistribution,
        string memory role
    ) {
        Collaborator memory collab = collaborators[wallet];
        return (
            collab.revenueWeight,
            collab.isActive,
            collab.totalEarned,
            collab.lastDistribution,
            collab.role
        );
    }
    
    // ========== YIELD TRACKING & DISTRIBUTION ==========
    
    /**
     * @notice Record yield generation
     * @param amount Yield amount
     * @param source Yield source description
     * @param token Token address (use address(0) for ETH)
     */
    function recordYield(
        uint256 amount,
        string calldata source,
        address token
    ) external payable onlyRole(TREASURY_MANAGER_ROLE) {
        if (token == address(0)) {
            require(msg.value == amount, "Amount mismatch");
        }
        
        yieldHistory.push(YieldRecord({
            amount: amount,
            timestamp: block.timestamp,
            source: source,
            token: token
        }));
        
        totalRevenueCollected += amount;
        
        emit YieldRecorded(amount, source, token, block.timestamp);
        _logAudit(msg.sender, "YIELD_RECORDED", string(abi.encodePacked("Amount: ", _uint2str(amount), " Source: ", source)));
    }
    
    /**
     * @notice Distribute revenue to collaborators and sovereign
     * @param amount Total amount to distribute
     */
    function distributeRevenue(uint256 amount) external nonReentrant onlyRole(REVENUE_MANAGER_ROLE) {
        require(amount <= address(this).balance, "Insufficient balance");
        require(amount > 0, "Amount must be positive");
        
        address beneficiary = revenueOverrideActive ? overrideBeneficiary : SOVEREIGN;
        uint256 remaining = amount;
        
        // Distribute to active collaborators based on weights
        for (uint256 i = 0; i < collaboratorList.length; i++) {
            address collabAddr = collaboratorList[i];
            Collaborator storage collab = collaborators[collabAddr];
            
            if (collab.isActive && collab.revenueWeight > 0) {
                uint256 share = (amount * collab.revenueWeight) / BASIS_POINTS;
                
                if (share > 0 && remaining >= share) {
                    collab.totalEarned += share;
                    collab.lastDistribution = block.timestamp;
                    remaining -= share;
                    
                    (bool success, ) = collabAddr.call{value: share}("");
                    require(success, "Transfer to collaborator failed");
                    
                    emit RevenueDistributed(collabAddr, share, block.timestamp);
                }
            }
        }
        
        // Send remaining to beneficiary (sovereign or override)
        if (remaining > 0) {
            (bool success, ) = beneficiary.call{value: remaining}("");
            require(success, "Transfer to beneficiary failed");
            
            emit RevenueDistributed(beneficiary, remaining, block.timestamp);
        }
        
        totalYieldsDistributed += amount;
        _logAudit(msg.sender, "REVENUE_DISTRIBUTED", string(abi.encodePacked("Total: ", _uint2str(amount))));
    }
    
    /**
     * @notice Get yield statistics
     */
    function getYieldStats() external view returns (
        uint256 totalCollected,
        uint256 totalDistributed,
        uint256 yieldCount
    ) {
        return (totalRevenueCollected, totalYieldsDistributed, yieldHistory.length);
    }
    
    /**
     * @notice Get recent yield records
     * @param count Number of recent records to retrieve
     */
    function getRecentYields(uint256 count) external view returns (YieldRecord[] memory) {
        uint256 length = yieldHistory.length;
        uint256 returnCount = count > length ? length : count;
        
        YieldRecord[] memory recent = new YieldRecord[](returnCount);
        
        for (uint256 i = 0; i < returnCount; i++) {
            recent[i] = yieldHistory[length - 1 - i];
        }
        
        return recent;
    }
    
    // ========== PERMISSION MANAGEMENT ==========
    
    /**
     * @notice Grant a role to an account
     * @param account Account to grant role to
     * @param role Role to grant
     */
    function grantPermission(address account, bytes32 role) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(role, account);
        emit PermissionGranted(account, role);
        _logAudit(msg.sender, "PERMISSION_GRANTED", string(abi.encodePacked("Account: ", _addressToString(account))));
    }
    
    /**
     * @notice Revoke a role from an account
     * @param account Account to revoke role from
     * @param role Role to revoke
     */
    function revokePermission(address account, bytes32 role) external onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(role, account);
        emit PermissionRevoked(account, role);
        _logAudit(msg.sender, "PERMISSION_REVOKED", string(abi.encodePacked("Account: ", _addressToString(account))));
    }
    
    // ========== OVERRIDE MANAGEMENT ==========
    
    /**
     * @notice Activate revenue override (directs all revenue to override beneficiary)
     * @param beneficiary Override beneficiary address
     */
    function activateOverride(address beneficiary) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(beneficiary != address(0), "Invalid beneficiary");
        
        revenueOverrideActive = true;
        overrideBeneficiary = beneficiary;
        
        emit OverrideActivated(beneficiary);
        _logAudit(msg.sender, "OVERRIDE_ACTIVATED", string(abi.encodePacked("Beneficiary: ", _addressToString(beneficiary))));
    }
    
    /**
     * @notice Deactivate revenue override (returns to normal distribution)
     */
    function deactivateOverride() external onlyRole(DEFAULT_ADMIN_ROLE) {
        revenueOverrideActive = false;
        overrideBeneficiary = address(0);
        
        emit OverrideDeactivated();
        _logAudit(msg.sender, "OVERRIDE_DEACTIVATED", "Revenue distribution restored to normal");
    }
    
    // ========== TREASURY MANAGEMENT ==========
    
    /**
     * @notice Withdraw from Zakat treasury
     * @param recipient Recipient address
     * @param amount Amount to withdraw
     */
    function withdrawFromZakat(
        address recipient,
        uint256 amount
    ) external nonReentrant onlyRole(TREASURY_MANAGER_ROLE) {
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be positive");
        require(amount <= zakatTreasuryBalance, "Insufficient treasury balance");
        require(amount <= address(this).balance, "Insufficient contract balance");
        
        zakatTreasuryBalance -= amount;
        
        (bool success, ) = recipient.call{value: amount}("");
        require(success, "Transfer failed");
        
        emit TreasuryWithdrawal(recipient, amount, block.timestamp);
        _logAudit(msg.sender, "TREASURY_WITHDRAWAL", string(abi.encodePacked("Recipient: ", _addressToString(recipient), " Amount: ", _uint2str(amount))));
    }
    
    // ========== AUDIT TRAIL ==========
    
    /**
     * @notice Get recent audit logs
     * @param count Number of recent logs to retrieve
     */
    function getRecentAuditLogs(uint256 count) external view returns (AuditLog[] memory) {
        uint256 length = auditTrail.length;
        uint256 returnCount = count > length ? length : count;
        
        AuditLog[] memory recent = new AuditLog[](returnCount);
        
        for (uint256 i = 0; i < returnCount; i++) {
            recent[i] = auditTrail[length - 1 - i];
        }
        
        return recent;
    }
    
    /**
     * @notice Get total audit log count
     */
    function getAuditLogCount() external view returns (uint256) {
        return auditTrail.length;
    }
    
    // ========== INTERNAL FUNCTIONS ==========
    
    /**
     * @dev Log an audit entry
     */
    function _logAudit(address actor, string memory action, string memory details) internal {
        uint256 logId = auditTrail.length;
        
        auditTrail.push(AuditLog({
            timestamp: block.timestamp,
            actor: actor,
            action: action,
            details: details
        }));
        
        emit AuditLogCreated(logId, actor, action);
    }
    
    /**
     * @dev Convert uint to string
     */
    function _uint2str(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        
        uint256 temp = value;
        uint256 digits;
        
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        
        bytes memory buffer = new bytes(digits);
        
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        
        return string(buffer);
    }
    
    /**
     * @dev Convert address to string
     */
    function _addressToString(address addr) internal pure returns (string memory) {
        bytes memory data = abi.encodePacked(addr);
        bytes memory alphabet = "0123456789abcdef";
        
        bytes memory str = new bytes(42);
        str[0] = '0';
        str[1] = 'x';
        
        for (uint256 i = 0; i < 20; i++) {
            str[2+i*2] = alphabet[uint8(data[i] >> 4)];
            str[3+i*2] = alphabet[uint8(data[i] & 0x0f)];
        }
        
        return string(str);
    }
    
    // ========== RECEIVE FUNCTION ==========
    
    receive() external payable {
        // Accept ETH transfers
        totalRevenueCollected += msg.value;
    }
}
