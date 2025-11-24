import { expect } from "chai";
import { ethers } from "hardhat";

describe("DivineScrollNode", function () {
  let scrollNode;
  let owner;
  let addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const DivineScrollNode = await ethers.getContractFactory("DivineScrollNode");
    scrollNode = await DivineScrollNode.deploy();
    await scrollNode.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct name and symbol", async function () {
      expect(await scrollNode.name()).to.equal("DivineScrollNode");
      expect(await scrollNode.symbol()).to.equal("QNODE");
    });

    it("Should initialize with zero emissions", async function () {
      expect(await scrollNode.totalAethericBiotEmissions()).to.equal(0);
      expect(await scrollNode.globalIAMCodeStrength()).to.equal(0);
    });
  });

  describe("Minting Quantum Nodes", function () {
    it("Should mint a quantum node NFT with valid frequency", async function () {
      const tokenURI = "ipfs://QmTest/1.json";
      const frequency = 963;
      const signature = "∞-Prime";

      await scrollNode.mintQuantumNode(addr1.address, tokenURI, frequency, signature);

      expect(await scrollNode.ownerOf(1)).to.equal(addr1.address);
      expect(await scrollNode.tokenURI(1)).to.equal(tokenURI);
    });

    it("Should reject invalid frequencies", async function () {
      await expect(
        scrollNode.mintQuantumNode(addr1.address, "ipfs://test", 999, "test")
      ).to.be.revertedWith("Invalid cosmic frequency");
    });

    it("Should store correct quantum node properties", async function () {
      await scrollNode.mintQuantumNode(addr1.address, "ipfs://test", 777, "∞-Prime");

      const node = await scrollNode.getQuantumNode(1);
      expect(node.frequency).to.equal(777);
      expect(node.aethericBiotEmissionRate).to.equal(100);
      expect(node.iamCodeIntensity).to.equal(369);
      expect(node.isEmitting).to.equal(true);
      expect(node.dimensionalSignature).to.equal("∞-Prime");
    });

    it("Should auto-emit on mint", async function () {
      await scrollNode.mintQuantumNode(addr1.address, "ipfs://test", 963, "∞");
      
      const stats = await scrollNode.getGlobalQuantumStats();
      expect(stats.totalEmissions).to.be.gt(0);
      expect(stats.iamStrength).to.be.gt(0);
    });
  });

  describe("Aetheric Biot Emissions", function () {
    beforeEach(async function () {
      await scrollNode.mintQuantumNode(addr1.address, "ipfs://test", 963, "∞");
    });

    it("Should emit aetheric biot", async function () {
      const statsBefore = await scrollNode.getGlobalQuantumStats();
      
      await scrollNode.emitAethericBiot(1);
      
      const statsAfter = await scrollNode.getGlobalQuantumStats();
      expect(statsAfter.totalEmissions).to.be.gt(statsBefore.totalEmissions);
    });

    it("Should amplify emission rate", async function () {
      await scrollNode.amplifyEmissionRate(1, 2);
      
      const node = await scrollNode.getQuantumNode(1);
      expect(node.aethericBiotEmissionRate).to.equal(200);
    });
  });

  describe("I AM Code Propagation", function () {
    beforeEach(async function () {
      await scrollNode.mintQuantumNode(addr1.address, "ipfs://test", 369, "∞");
    });

    it("Should propagate I AM Code", async function () {
      const statsBefore = await scrollNode.getGlobalQuantumStats();
      
      await scrollNode.propagateIAMCode(1);
      
      const statsAfter = await scrollNode.getGlobalQuantumStats();
      expect(statsAfter.iamStrength).to.be.gt(statsBefore.iamStrength);
    });

    it("Should boost I AM Code intensity", async function () {
      await scrollNode.boostIAMCodeIntensity(1, 100);
      
      const node = await scrollNode.getQuantumNode(1);
      expect(node.iamCodeIntensity).to.equal(469);
    });
  });

  describe("Quantum Broadcasting", function () {
    beforeEach(async function () {
      await scrollNode.mintQuantumNode(addr1.address, "ipfs://test", 777, "∞");
    });

    it("Should broadcast frequency", async function () {
      const tx = await scrollNode.broadcastFrequency(1);
      const receipt = await tx.wait();
      
      // Check that FrequencyBroadcasted event was emitted
      const event = receipt.logs.find(
        log => scrollNode.interface.parseLog(log)?.name === "FrequencyBroadcasted"
      );
      expect(event).to.not.be.undefined;
    });
  });

  describe("Quantum Entanglement", function () {
    beforeEach(async function () {
      await scrollNode.mintQuantumNode(addr1.address, "ipfs://test1", 963, "∞-1");
      await scrollNode.mintQuantumNode(addr1.address, "ipfs://test2", 777, "∞-2");
    });

    it("Should entangle two nodes", async function () {
      await scrollNode.entangleNodes(1, 2);
      
      const node1 = await scrollNode.getQuantumNode(1);
      const node2 = await scrollNode.getQuantumNode(2);
      
      expect(node1.quantumEntanglementLevel).to.equal(node2.quantumEntanglementLevel);
      expect(node1.quantumEntanglementLevel).to.be.gt(0);
    });
  });

  describe("Global Statistics", function () {
    it("Should track global quantum stats", async function () {
      await scrollNode.mintQuantumNode(addr1.address, "ipfs://test1", 963, "∞-1");
      await scrollNode.mintQuantumNode(addr1.address, "ipfs://test2", 777, "∞-2");
      
      const stats = await scrollNode.getGlobalQuantumStats();
      expect(stats.totalNodes).to.equal(2);
      expect(stats.totalEmissions).to.be.gt(0);
      expect(stats.iamStrength).to.be.gt(0);
    });
  });
});
