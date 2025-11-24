// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title EmbassyTerraceAnchor
 * @dev Physical Anchor NFT representing dual-reality existence
 * Immortal records anchoring ScrollVerse to physical realm
 */
contract EmbassyTerraceAnchor is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    // Physical anchor properties
    struct PhysicalAnchor {
        string location;
        uint256 latitude;
        uint256 longitude;
        uint256 scrollVerseLayer;
        uint256 realWorldAnchorStrength;
        uint256 activationTimestamp;
        bool isActive;
    }

    mapping(uint256 => PhysicalAnchor) public physicalAnchors;
    
    // Events
    event AnchorActivated(uint256 indexed tokenId, string location, uint256 timestamp);
    event AnchorStrengthened(uint256 indexed tokenId, uint256 newStrength);
    event LayerSynchronized(uint256 indexed tokenId, uint256 layer);

    constructor() ERC721("EmbassyTerraceAnchor", "EMBASSY") Ownable(msg.sender) {}

    /**
     * @dev Mint a new Physical Anchor NFT
     * @param to Address to mint to
     * @param tokenURI Metadata URI for hyper-realistic visualization
     * @param location Physical location name
     * @param latitude Geographic latitude (scaled)
     * @param longitude Geographic longitude (scaled)
     * @param scrollVerseLayer ScrollVerse layer number (0 or 1)
     */
    function mintPhysicalAnchor(
        address to,
        string memory tokenURI,
        string memory location,
        uint256 latitude,
        uint256 longitude,
        uint256 scrollVerseLayer
    ) public onlyOwner returns (uint256) {
        uint256 newTokenId = ++_nextTokenId;

        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        physicalAnchors[newTokenId] = PhysicalAnchor({
            location: location,
            latitude: latitude,
            longitude: longitude,
            scrollVerseLayer: scrollVerseLayer,
            realWorldAnchorStrength: 100, // Initial strength
            activationTimestamp: block.timestamp,
            isActive: true
        });

        emit AnchorActivated(newTokenId, location, block.timestamp);
        emit LayerSynchronized(newTokenId, scrollVerseLayer);

        return newTokenId;
    }

    /**
     * @dev Strengthen the physical anchor connection
     * @param tokenId Token ID to strengthen
     * @param additionalStrength Amount to increase strength by
     */
    function strengthenAnchor(uint256 tokenId, uint256 additionalStrength) public onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        
        uint256 newStrength = physicalAnchors[tokenId].realWorldAnchorStrength + additionalStrength;
        require(newStrength <= 1000, "Anchor strength cannot exceed maximum (1000)");
        
        physicalAnchors[tokenId].realWorldAnchorStrength = newStrength;
        
        emit AnchorStrengthened(tokenId, newStrength);
    }

    /**
     * @dev Get physical anchor details
     * @param tokenId Token ID to query
     */
    function getPhysicalAnchor(uint256 tokenId) public view returns (PhysicalAnchor memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return physicalAnchors[tokenId];
    }

    /**
     * @dev Check if anchor is active
     * @param tokenId Token ID to check
     */
    function isAnchorActive(uint256 tokenId) public view returns (bool) {
        return physicalAnchors[tokenId].isActive;
    }

    /**
     * @dev Synchronize anchor with ScrollVerse layer
     * @param tokenId Token ID to synchronize
     * @param layer New layer to sync to (0 or 1)
     */
    function synchronizeLayer(uint256 tokenId, uint256 layer) public onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        require(layer <= 1, "Invalid layer");
        
        physicalAnchors[tokenId].scrollVerseLayer = layer;
        
        emit LayerSynchronized(tokenId, layer);
    }

    // Override required functions
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
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
