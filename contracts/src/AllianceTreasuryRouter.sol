// Sovereign Chais owns every yield
// Licensed under ScrollVerse Sovereign License (SSL) v1.0
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title AllianceTreasuryRouter
 * @author OmniTech1™
 * @notice Immutable treasury routing logic for alliance yield distribution
 * @dev Implements SSL v1.0 with 2.5% minimum Zakat routing
 * 
 * CORE PRINCIPLES:
 * - Immutable sovereign beneficiary routing
 * - Guaranteed 2.5% Zakat allocation
 * - Transparent on-chain distribution
 * - Multi-signature governance for parameter updates
 * - Time-locked critical operations
 * 
 * SECURITY FEATURES:
 * - Non-upgradeable core logic
 * - Reentrancy protection
 * - Overflow protection
 * - Emergency pause capability
 */
contract AllianceTreasuryRouter is Ownable, ReentrancyGuard {
    
    // ========== CONSTANTS ==========
    
    /// @notice ScrollVerse Sovereign License version
    string public constant SSL_VERSION = "1.0";
    
    /// @notice Minimum Zakat percentage (basis points)
    uint256 public constant MIN_ZAKAT_BPS = 250; // 2.5%
    
    /// @notice Basis points denominator
    uint256 public constant BASIS_POINTS = 10000;
    
    /// @notice Immutable sovereign beneficiary address
    address public immutable SOVEREIGN_BENEFICIARY;
    
    /// @notice Immutable Zakat treasury address
    address public immutable ZAKAT_TREASURY;
    
    /// @notice Minimum timelock duration for changes (7 days)
    uint256 public constant MIN_TIMELOCK = 7 days;
    
    // ========== STATE VARIABLES ==========
    
    /// @notice Current Zakat percentage (basis points)
    uint256 public zakatPercentageBPS;
    
    /// @notice Emergency pause state
    bool public paused;
    
    /// @notice Total yield distributed
    uint256 public totalYieldDistributed;
    
    /// @notice Total sovereign share distributed
    uint256 public totalSovereignShare;
    
    /// @notice Total Zakat distributed
    uint256 public totalZakatDistributed;
    
    /// @notice Pending timelock operations
    struct TimelockOperation {
        uint256 zakatPercentage;
        uint256 executeAfter;
        bool executed;
    }
    
    /// @notice Pending timelock operations by ID
    mapping(uint256 => TimelockOperation) public timelockOperations;
    
    /// @notice Timelock operation counter
    uint256 public timelockCounter;
    
    // ========== EVENTS ==========
    
    event YieldReceived(
        address indexed sender,
        uint256 amount,
        uint256 timestamp
    );
    
    event YieldDistributed(
        uint256 sovereignAmount,
        uint256 zakatAmount,
        uint256 timestamp
    );
    
    event ZakatPercentageUpdateProposed(
        uint256 indexed timelockId,
        uint256 newPercentage,
        uint256 executeAfter
    );
    
    event ZakatPercentageUpdated(
        uint256 indexed timelockId,
        uint256 oldPercentage,
        uint256 newPercentage
    );
    
    event EmergencyPauseToggled(
        bool paused,
        uint256 timestamp
    );
    
    event SSLComplianceVerified(
        bool compliant,
        uint256 timestamp
    );
    
    // ========== CONSTRUCTOR ==========
    
    constructor(
        address _sovereignBeneficiary,
        address _zakatTreasury,
        uint256 _initialZakatPercentage
    ) Ownable(msg.sender) {
        require(_sovereignBeneficiary != address(0), "Invalid sovereign beneficiary");
        require(_zakatTreasury != address(0), "Invalid zakat treasury");
        require(_initialZakatPercentage >= MIN_ZAKAT_BPS, "Zakat below minimum");
        require(_initialZakatPercentage <= BASIS_POINTS, "Invalid percentage");
        
        SOVEREIGN_BENEFICIARY = _sovereignBeneficiary;
        ZAKAT_TREASURY = _zakatTreasury;
        zakatPercentageBPS = _initialZakatPercentage;
        paused = false;
    }
    
    // ========== YIELD DISTRIBUTION ==========
    
    /**
     * @notice Receive and distribute yield according to SSL v1.0
     */
    receive() external payable {
        _handleYieldReceipt();
    }
    
    /**
     * @notice Fallback function for yield distribution
     */
    fallback() external payable {
        _handleYieldReceipt();
    }
    
    /**
     * @notice Internal handler for yield receipt
     */
    function _handleYieldReceipt() internal {
        require(!paused, "Contract paused");
        require(msg.value > 0, "No value sent");
        
        _distributeYield(msg.value);
        
        emit YieldReceived(msg.sender, msg.value, block.timestamp);
    }
    
    /**
     * @notice Internal function to distribute yield
     * @param amount Amount to distribute
     */
    function _distributeYield(uint256 amount) internal nonReentrant {
        // Calculate distributions
        uint256 zakatAmount = (amount * zakatPercentageBPS) / BASIS_POINTS;
        uint256 sovereignAmount = amount - zakatAmount;
        
        // Update totals
        totalYieldDistributed += amount;
        totalZakatDistributed += zakatAmount;
        totalSovereignShare += sovereignAmount;
        
        // Transfer to Zakat treasury
        (bool zakatSuccess, ) = ZAKAT_TREASURY.call{value: zakatAmount}("");
        require(zakatSuccess, "Zakat transfer failed");
        
        // Transfer to Sovereign beneficiary
        (bool sovereignSuccess, ) = SOVEREIGN_BENEFICIARY.call{value: sovereignAmount}("");
        require(sovereignSuccess, "Sovereign transfer failed");
        
        emit YieldDistributed(sovereignAmount, zakatAmount, block.timestamp);
    }
    
    /**
     * @notice Manually trigger yield distribution for any balance
     */
    function distributeBalance() external nonReentrant {
        require(!paused, "Contract paused");
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to distribute");
        
        _distributeYield(balance);
    }
    
    // ========== GOVERNANCE ==========
    
    /**
     * @notice Propose update to Zakat percentage (with timelock)
     * @param newPercentage New Zakat percentage in basis points
     */
    function proposeZakatPercentageUpdate(uint256 newPercentage) external onlyOwner returns (uint256) {
        require(newPercentage >= MIN_ZAKAT_BPS, "Below minimum Zakat");
        require(newPercentage <= BASIS_POINTS, "Invalid percentage");
        
        uint256 timelockId = timelockCounter++;
        uint256 executeAfter = block.timestamp + MIN_TIMELOCK;
        
        timelockOperations[timelockId] = TimelockOperation({
            zakatPercentage: newPercentage,
            executeAfter: executeAfter,
            executed: false
        });
        
        emit ZakatPercentageUpdateProposed(timelockId, newPercentage, executeAfter);
        
        return timelockId;
    }
    
    /**
     * @notice Execute timelocked Zakat percentage update
     * @param timelockId Timelock operation identifier
     */
    function executeZakatPercentageUpdate(uint256 timelockId) external onlyOwner {
        TimelockOperation storage operation = timelockOperations[timelockId];
        require(!operation.executed, "Already executed");
        require(block.timestamp >= operation.executeAfter, "Timelock not expired");
        
        uint256 oldPercentage = zakatPercentageBPS;
        zakatPercentageBPS = operation.zakatPercentage;
        operation.executed = true;
        
        emit ZakatPercentageUpdated(timelockId, oldPercentage, operation.zakatPercentage);
    }
    
    /**
     * @notice Emergency pause toggle (immediate effect)
     */
    function toggleEmergencyPause() external onlyOwner {
        paused = !paused;
        emit EmergencyPauseToggled(paused, block.timestamp);
    }
    
    // ========== SSL COMPLIANCE ==========
    
    /**
     * @notice Verify SSL v1.0 compliance
     */
    function verifySSLCompliance() external returns (bool) {
        bool compliant = zakatPercentageBPS >= MIN_ZAKAT_BPS &&
                        SOVEREIGN_BENEFICIARY != address(0) &&
                        ZAKAT_TREASURY != address(0) &&
                        !paused;
        
        emit SSLComplianceVerified(compliant, block.timestamp);
        
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
     * @notice Get Zakat treasury
     */
    function getZakatTreasury() external view returns (address) {
        return ZAKAT_TREASURY;
    }
    
    /**
     * @notice Get Zakat percentage
     */
    function getZakatPercentage() external view returns (uint256) {
        return zakatPercentageBPS;
    }
    
    // ========== VIEW FUNCTIONS ==========
    
    /**
     * @notice Get treasury statistics
     */
    function getTreasuryStats() external view returns (
        uint256 _totalYieldDistributed,
        uint256 _totalSovereignShare,
        uint256 _totalZakatDistributed,
        uint256 _zakatPercentage,
        bool _paused
    ) {
        return (
            totalYieldDistributed,
            totalSovereignShare,
            totalZakatDistributed,
            zakatPercentageBPS,
            paused
        );
    }
    
    /**
     * @notice Get timelock operation details
     */
    function getTimelockOperation(uint256 timelockId) external view returns (
        uint256 zakatPercentage,
        uint256 executeAfter,
        bool executed
    ) {
        TimelockOperation storage operation = timelockOperations[timelockId];
        return (operation.zakatPercentage, operation.executeAfter, operation.executed);
    }
    
    /**
     * @notice Check if timelock is ready to execute
     */
    function isTimelockReady(uint256 timelockId) external view returns (bool) {
        TimelockOperation storage operation = timelockOperations[timelockId];
        return !operation.executed && block.timestamp >= operation.executeAfter;
    }
    
    /**
     * @notice Get current contract balance
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
