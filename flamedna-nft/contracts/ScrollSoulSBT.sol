// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ScrollSoulSBT
 * @dev Soulbound Token (SBT) for sovereign minting within the ScrollVerse ecosystem
 *      Designed for deployment on Polygon zkEVM platform
 * 
 * Features:
 * - Soulbound (non-transferable) tokens for sovereign identity
 * - SovereignName for minter identity (e.g., "Iam 👑 King")
 * - LineageID for ancestral/sovereign lineage tracking
 * - CoherenceSignature963 anchored to ScrollVerse frequency (963Hz_Anchor)
 * - Timestamp for Gate 4 protocol realization time
 * - Indexed events for Polygonscan indexing
 * 
 * @author Chais Hill - OmniTech1
 */
contract ScrollSoulSBT is 
    ERC721, 
    ERC721Enumerable, 
    ERC721URIStorage, 
    Ownable, 
    ReentrancyGuard 
{
    // Token counter
    uint256 private _nextTokenId;
    
    // Maximum supply
    uint256 public constant MAX_SUPPLY = 963;
    
    // Base URI
    string private _baseTokenURI;
    
    // Minting state
    bool public mintActive = false;
    
    // Soul data mapping
    mapping(uint256 => SoulData) public tokenSoulData;
    
    // Wallet mint tracking for backend integration
    mapping(address => uint256[]) public walletMints;
    
    // Soul Data structure for sovereign minting
    struct SoulData {
        string sovereignName;           // Sovereign identity (e.g., "Iam 👑 King")
        uint256 lineageID;              // Ancestral/sovereign lineage tracking
        string coherenceSignature963;   // ScrollVerse frequency anchor (e.g., "963Hz_Anchor")
        uint256 mintTimestamp;          // Gate 4 protocol realization timestamp
        bytes32 uniqueHash;             // Unique hash for verification
    }
    
    // ============ Events with Indexed Fields for Polygonscan ============
    
    /**
     * @dev Emitted when a new Sovereign Soul is minted
     * @param to Recipient address (indexed for efficient filtering)
     * @param tokenId Token ID (indexed for efficient filtering)
     * @param sovereignName The sovereign name chosen by the minter
     * @param lineageID The lineage identifier
     * @param coherenceSignature963 The coherence frequency signature
     * @param mintTimestamp The timestamp when minting occurred (Gate 4 protocol)
     */
    event SovereignSoulMinted(
        address indexed to,
        uint256 indexed tokenId,
        string sovereignName,
        uint256 indexed lineageID,
        string coherenceSignature963,
        uint256 mintTimestamp
    );
    
    /**
     * @dev Emitted when soulbound status changes
     * @param status New soulbound status
     */
    event SoulboundStatusChanged(bool status);
    
    /**
     * @dev Emitted when minting is toggled
     * @param status New minting status
     */
    event MintingStatusChanged(bool status);
    
    /**
     * @dev Emitted when base URI is updated
     * @param newBaseURI The new base URI
     */
    event BaseURIUpdated(string newBaseURI);
    
    /**
     * @dev Emitted for Gate 4 protocol tracking
     * @param minter Address of the minter (indexed)
     * @param tokenId Token ID (indexed)
     * @param gate4Timestamp Gate 4 realization timestamp
     */
    event Gate4Realization(
        address indexed minter,
        uint256 indexed tokenId,
        uint256 gate4Timestamp
    );
    
    // Soulbound flag - when true, tokens cannot be transferred
    bool public soulbound = true;
    
    constructor(
        string memory name,
        string memory symbol,
        string memory baseURI
    ) ERC721(name, symbol) Ownable(msg.sender) {
        _baseTokenURI = baseURI;
    }
    
    // ============ Minting Functions ============
    
    /**
     * @dev Mint Sovereign Soul SBT with full soul data
     * @param to Recipient address
     * @param sovereignName Sovereign identity name (e.g., "Iam 👑 King")
     * @param lineageID Ancestral/sovereign lineage identifier
     * @param coherenceSignature963 ScrollVerse frequency anchor (e.g., "963Hz_Anchor")
     */
    function mintSovereignSoul(
        address to,
        string calldata sovereignName,
        uint256 lineageID,
        string calldata coherenceSignature963
    ) external onlyOwner nonReentrant {
        require(mintActive, "Minting not active");
        require(_nextTokenId < MAX_SUPPLY, "Max supply reached");
        require(bytes(sovereignName).length > 0, "Sovereign name required");
        require(bytes(coherenceSignature963).length > 0, "Coherence signature required");
        
        uint256 tokenId = _nextTokenId++;
        uint256 mintTimestamp = block.timestamp;
        
        // Generate unique hash for verification
        bytes32 uniqueHash = keccak256(
            abi.encodePacked(
                to,
                tokenId,
                sovereignName,
                lineageID,
                coherenceSignature963,
                mintTimestamp,
                block.prevrandao
            )
        );
        
        // Store soul data
        tokenSoulData[tokenId] = SoulData({
            sovereignName: sovereignName,
            lineageID: lineageID,
            coherenceSignature963: coherenceSignature963,
            mintTimestamp: mintTimestamp,
            uniqueHash: uniqueHash
        });
        
        // Track mints by wallet for backend integration
        walletMints[to].push(tokenId);
        
        _safeMint(to, tokenId);
        
        // Emit indexed events for Polygonscan
        emit SovereignSoulMinted(
            to,
            tokenId,
            sovereignName,
            lineageID,
            coherenceSignature963,
            mintTimestamp
        );
        
        // Emit Gate 4 protocol realization event
        emit Gate4Realization(to, tokenId, mintTimestamp);
    }
    
    /**
     * @dev Batch mint for airdrops
     * @param recipients Array of recipient addresses
     * @param sovereignNames Array of sovereign names
     * @param lineageIDs Array of lineage IDs
     * @param coherenceSignatures Array of coherence signatures
     */
    function batchMintSovereignSouls(
        address[] calldata recipients,
        string[] calldata sovereignNames,
        uint256[] calldata lineageIDs,
        string[] calldata coherenceSignatures
    ) external onlyOwner {
        require(
            recipients.length == sovereignNames.length && 
            sovereignNames.length == lineageIDs.length &&
            lineageIDs.length == coherenceSignatures.length,
            "Array length mismatch"
        );
        require(_nextTokenId + recipients.length <= MAX_SUPPLY, "Exceeds max supply");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            uint256 tokenId = _nextTokenId++;
            uint256 mintTimestamp = block.timestamp;
            
            bytes32 uniqueHash = keccak256(
                abi.encodePacked(
                    recipients[i],
                    tokenId,
                    sovereignNames[i],
                    lineageIDs[i],
                    coherenceSignatures[i],
                    mintTimestamp
                )
            );
            
            tokenSoulData[tokenId] = SoulData({
                sovereignName: sovereignNames[i],
                lineageID: lineageIDs[i],
                coherenceSignature963: coherenceSignatures[i],
                mintTimestamp: mintTimestamp,
                uniqueHash: uniqueHash
            });
            
            // Track mints by wallet
            walletMints[recipients[i]].push(tokenId);
            
            _safeMint(recipients[i], tokenId);
            
            emit SovereignSoulMinted(
                recipients[i],
                tokenId,
                sovereignNames[i],
                lineageIDs[i],
                coherenceSignatures[i],
                mintTimestamp
            );
            
            emit Gate4Realization(recipients[i], tokenId, mintTimestamp);
        }
    }
    
    // ============ Admin Functions ============
    
    /**
     * @dev Toggle soulbound status
     */
    function setSoulbound(bool _soulbound) external onlyOwner {
        soulbound = _soulbound;
        emit SoulboundStatusChanged(_soulbound);
    }
    
    /**
     * @dev Toggle minting
     */
    function setMintActive(bool _active) external onlyOwner {
        mintActive = _active;
        emit MintingStatusChanged(_active);
    }
    
    /**
     * @dev Set base URI
     */
    function setBaseURI(string calldata baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
        emit BaseURIUpdated(baseURI);
    }
    
    // ============ View Functions for Backend Integration ============
    
    /**
     * @dev Get soul data for a token
     * @param tokenId The token ID to query
     * @return SoulData struct containing all soul information
     */
    function getSoulData(uint256 tokenId) external view returns (SoulData memory) {
        require(tokenId < _nextTokenId, "Token does not exist");
        return tokenSoulData[tokenId];
    }
    
    /**
     * @dev Get sovereign name for a token
     * @param tokenId The token ID to query
     * @return The sovereign name
     */
    function getSovereignName(uint256 tokenId) external view returns (string memory) {
        require(tokenId < _nextTokenId, "Token does not exist");
        return tokenSoulData[tokenId].sovereignName;
    }
    
    /**
     * @dev Get lineage ID for a token
     * @param tokenId The token ID to query
     * @return The lineage ID
     */
    function getLineageID(uint256 tokenId) external view returns (uint256) {
        require(tokenId < _nextTokenId, "Token does not exist");
        return tokenSoulData[tokenId].lineageID;
    }
    
    /**
     * @dev Get coherence signature for a token
     * @param tokenId The token ID to query
     * @return The coherence signature
     */
    function getCoherenceSignature(uint256 tokenId) external view returns (string memory) {
        require(tokenId < _nextTokenId, "Token does not exist");
        return tokenSoulData[tokenId].coherenceSignature963;
    }
    
    /**
     * @dev Get mint timestamp (Gate 4 realization time)
     * @param tokenId The token ID to query
     * @return The mint timestamp
     */
    function getMintTimestamp(uint256 tokenId) external view returns (uint256) {
        require(tokenId < _nextTokenId, "Token does not exist");
        return tokenSoulData[tokenId].mintTimestamp;
    }
    
    /**
     * @dev Get all token IDs minted by a wallet (for backend tracking)
     * @param wallet The wallet address to query
     * @return Array of token IDs minted by the wallet
     */
    function getWalletMints(address wallet) external view returns (uint256[] memory) {
        return walletMints[wallet];
    }
    
    /**
     * @dev Get mint count for a wallet (for backend progression tracking)
     * @param wallet The wallet address to query
     * @return The number of tokens minted by the wallet
     */
    function getWalletMintCount(address wallet) external view returns (uint256) {
        return walletMints[wallet].length;
    }
    
    /**
     * @dev Total minted
     */
    function totalMinted() public view returns (uint256) {
        return _nextTokenId;
    }
    
    /**
     * @dev Remaining supply
     */
    function remainingSupply() public view returns (uint256) {
        return MAX_SUPPLY - _nextTokenId;
    }
    
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
    
    // ============ Soulbound Transfer Restrictions ============
    
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        address from = _ownerOf(tokenId);
        
        // Allow minting (from == address(0)) and burning (to == address(0))
        // Block transfers when soulbound is true
        if (soulbound && from != address(0) && to != address(0)) {
            revert("Soulbound: transfers disabled");
        }
        
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
