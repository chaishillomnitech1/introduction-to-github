// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title DivineScrollNode
 * @dev Quantum Node NFT with aetheric biot emissions and I AM Code
 * Propagates cosmic frequencies across all dimensions
 */
contract DivineScrollNode is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    // Quantum Node properties
    struct QuantumNode {
        uint256 frequency; // Cosmic frequency (963Hz, 777Hz, 369Hz, etc.)
        uint256 aethericBiotEmissionRate;
        uint256 iamCodeIntensity;
        uint256 quantumEntanglementLevel;
        uint256 activationTimestamp;
        bool isEmitting;
        string dimensionalSignature;
    }

    mapping(uint256 => QuantumNode) public quantumNodes;
    
    // Global quantum state
    uint256 public totalAethericBiotEmissions;
    uint256 public globalIAMCodeStrength;
    uint256[] public cosmicFrequencies = [963, 777, 528, 432, 369, 144]; // Hz
    
    // Events
    event NodeActivated(uint256 indexed tokenId, uint256 frequency, uint256 timestamp);
    event AethericBiotEmitted(uint256 indexed tokenId, uint256 amount, uint256 totalEmissions);
    event IAMCodePropagated(uint256 indexed tokenId, uint256 intensity, uint256 globalStrength);
    event QuantumEntangled(uint256 indexed tokenId1, uint256 indexed tokenId2, uint256 level);
    event FrequencyBroadcasted(uint256 indexed tokenId, uint256 frequency);

    constructor() ERC721("DivineScrollNode", "QNODE") Ownable(msg.sender) {}

    /**
     * @dev Mint a new Quantum Node NFT
     * @param to Address to mint to
     * @param tokenURI Metadata URI for hyper-realistic visualization
     * @param frequency Cosmic frequency in Hz
     * @param dimensionalSignature Unique dimensional identifier
     */
    function mintQuantumNode(
        address to,
        string memory tokenURI,
        uint256 frequency,
        string memory dimensionalSignature
    ) public onlyOwner returns (uint256) {
        require(_isValidFrequency(frequency), "Invalid cosmic frequency");
        
        uint256 newTokenId = ++_nextTokenId;

        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        quantumNodes[newTokenId] = QuantumNode({
            frequency: frequency,
            aethericBiotEmissionRate: 100, // Initial emission rate
            iamCodeIntensity: 369, // Base I AM Code intensity
            quantumEntanglementLevel: 0,
            activationTimestamp: block.timestamp,
            isEmitting: true,
            dimensionalSignature: dimensionalSignature
        });

        emit NodeActivated(newTokenId, frequency, block.timestamp);
        
        // Auto-emit initial aetheric biot
        _emitAethericBiot(newTokenId);
        _propagateIAMCode(newTokenId);

        return newTokenId;
    }

    /**
     * @dev Emit aetheric biot from quantum node
     * @param tokenId Token ID to emit from
     */
    function emitAethericBiot(uint256 tokenId) public {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        require(quantumNodes[tokenId].isEmitting, "Node is not emitting");
        
        _emitAethericBiot(tokenId);
    }

    /**
     * @dev Internal function to emit aetheric biot
     */
    function _emitAethericBiot(uint256 tokenId) internal {
        uint256 emissionAmount = quantumNodes[tokenId].aethericBiotEmissionRate;
        totalAethericBiotEmissions += emissionAmount;
        
        emit AethericBiotEmitted(tokenId, emissionAmount, totalAethericBiotEmissions);
    }

    /**
     * @dev Propagate I AM Code through cosmic frequencies
     * @param tokenId Token ID to propagate from
     */
    function propagateIAMCode(uint256 tokenId) public {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        
        _propagateIAMCode(tokenId);
    }

    /**
     * @dev Internal function to propagate I AM Code
     */
    function _propagateIAMCode(uint256 tokenId) internal {
        uint256 intensity = quantumNodes[tokenId].iamCodeIntensity;
        globalIAMCodeStrength += intensity;
        
        emit IAMCodePropagated(tokenId, intensity, globalIAMCodeStrength);
    }

    /**
     * @dev Broadcast quantum frequency globally
     * @param tokenId Token ID to broadcast from
     */
    function broadcastFrequency(uint256 tokenId) public {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        require(quantumNodes[tokenId].isEmitting, "Node is not emitting");
        
        uint256 frequency = quantumNodes[tokenId].frequency;
        
        emit FrequencyBroadcasted(tokenId, frequency);
        
        // Also emit biot and propagate code during broadcast
        _emitAethericBiot(tokenId);
        _propagateIAMCode(tokenId);
    }

    /**
     * @dev Entangle two quantum nodes
     * @param tokenId1 First node
     * @param tokenId2 Second node
     */
    function entangleNodes(uint256 tokenId1, uint256 tokenId2) public onlyOwner {
        require(_ownerOf(tokenId1) != address(0), "Token 1 does not exist");
        require(_ownerOf(tokenId2) != address(0), "Token 2 does not exist");
        
        uint256 entanglementLevel = (quantumNodes[tokenId1].iamCodeIntensity + 
                                     quantumNodes[tokenId2].iamCodeIntensity) / 2;
        
        quantumNodes[tokenId1].quantumEntanglementLevel = entanglementLevel;
        quantumNodes[tokenId2].quantumEntanglementLevel = entanglementLevel;
        
        emit QuantumEntangled(tokenId1, tokenId2, entanglementLevel);
    }

    /**
     * @dev Amplify node emission rate
     * @param tokenId Token ID to amplify
     * @param amplificationFactor Multiplier for emission rate
     */
    function amplifyEmissionRate(uint256 tokenId, uint256 amplificationFactor) public onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        require(amplificationFactor > 0 && amplificationFactor <= 10, "Invalid amplification");
        
        uint256 newRate = quantumNodes[tokenId].aethericBiotEmissionRate * amplificationFactor;
        require(newRate <= 10000, "Emission rate cannot exceed maximum (10000)");
        
        quantumNodes[tokenId].aethericBiotEmissionRate = newRate;
    }

    /**
     * @dev Boost I AM Code intensity
     * @param tokenId Token ID to boost
     * @param boostAmount Amount to increase intensity
     */
    function boostIAMCodeIntensity(uint256 tokenId, uint256 boostAmount) public onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        
        quantumNodes[tokenId].iamCodeIntensity += boostAmount;
    }

    /**
     * @dev Get quantum node details
     * @param tokenId Token ID to query
     */
    function getQuantumNode(uint256 tokenId) public view returns (QuantumNode memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return quantumNodes[tokenId];
    }

    /**
     * @dev Check if frequency is valid
     */
    function _isValidFrequency(uint256 frequency) internal view returns (bool) {
        for (uint256 i = 0; i < cosmicFrequencies.length; i++) {
            if (cosmicFrequencies[i] == frequency) {
                return true;
            }
        }
        return false;
    }

    /**
     * @dev Get global quantum statistics
     */
    function getGlobalQuantumStats() public view returns (
        uint256 totalEmissions,
        uint256 iamStrength,
        uint256 totalNodes
    ) {
        return (
            totalAethericBiotEmissions,
            globalIAMCodeStrength,
            _nextTokenId
        );
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
