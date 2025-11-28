/**
 * ScrollSoulSBT - Smart Contract Tests
 * 
 * Tests for the ScrollSoulSBT Soulbound Token contract
 * Designed for Gate 4 protocol sovereign minting
 * 
 * @author Chais Hill - OmniTech1
 */

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ScrollSoulSBT", function () {
  let scrollSoulSBT;
  let owner;
  let addr1;
  let addr2;

  const NAME = "ScrollSoul SBT";
  const SYMBOL = "SCROLLSOUL";
  const BASE_URI = "ipfs://QmTestBaseURI/";

  // Sample sovereign minting data
  const SOVEREIGN_NAME = "Iam 👑 King";
  const LINEAGE_ID = 1;
  const COHERENCE_SIGNATURE = "963Hz_Anchor";

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const ScrollSoulSBT = await ethers.getContractFactory("ScrollSoulSBT");
    scrollSoulSBT = await ScrollSoulSBT.deploy(NAME, SYMBOL, BASE_URI);
    await scrollSoulSBT.waitForDeployment();
  });

  describe("Deployment", function () {
    it("should set the correct name and symbol", async function () {
      expect(await scrollSoulSBT.name()).to.equal(NAME);
      expect(await scrollSoulSBT.symbol()).to.equal(SYMBOL);
    });

    it("should set the correct owner", async function () {
      expect(await scrollSoulSBT.owner()).to.equal(owner.address);
    });

    it("should set correct max supply (963)", async function () {
      expect(await scrollSoulSBT.MAX_SUPPLY()).to.equal(963);
    });

    it("should have soulbound enabled by default", async function () {
      expect(await scrollSoulSBT.soulbound()).to.equal(true);
    });

    it("should have minting disabled by default", async function () {
      expect(await scrollSoulSBT.mintActive()).to.equal(false);
    });
  });

  describe("Sovereign Soul Minting", function () {
    beforeEach(async function () {
      await scrollSoulSBT.setMintActive(true);
    });

    it("should mint Sovereign Soul with correct data", async function () {
      await scrollSoulSBT.mintSovereignSoul(
        addr1.address,
        SOVEREIGN_NAME,
        LINEAGE_ID,
        COHERENCE_SIGNATURE
      );
      
      expect(await scrollSoulSBT.balanceOf(addr1.address)).to.equal(1);
      expect(await scrollSoulSBT.ownerOf(0)).to.equal(addr1.address);
      
      const soulData = await scrollSoulSBT.getSoulData(0);
      expect(soulData.sovereignName).to.equal(SOVEREIGN_NAME);
      expect(soulData.lineageID).to.equal(LINEAGE_ID);
      expect(soulData.coherenceSignature963).to.equal(COHERENCE_SIGNATURE);
      expect(soulData.mintTimestamp).to.be.gt(0);
    });

    it("should emit SovereignSoulMinted event with indexed fields", async function () {
      await expect(
        scrollSoulSBT.mintSovereignSoul(
          addr1.address,
          SOVEREIGN_NAME,
          LINEAGE_ID,
          COHERENCE_SIGNATURE
        )
      )
        .to.emit(scrollSoulSBT, "SovereignSoulMinted")
        .withArgs(
          addr1.address,
          0,
          SOVEREIGN_NAME,
          LINEAGE_ID,
          COHERENCE_SIGNATURE,
          (timestamp) => timestamp > 0
        );
    });

    it("should emit Gate4Realization event", async function () {
      await expect(
        scrollSoulSBT.mintSovereignSoul(
          addr1.address,
          SOVEREIGN_NAME,
          LINEAGE_ID,
          COHERENCE_SIGNATURE
        )
      )
        .to.emit(scrollSoulSBT, "Gate4Realization")
        .withArgs(addr1.address, 0, (timestamp) => timestamp > 0);
    });

    it("should reject minting when not active", async function () {
      await scrollSoulSBT.setMintActive(false);
      await expect(
        scrollSoulSBT.mintSovereignSoul(
          addr1.address,
          SOVEREIGN_NAME,
          LINEAGE_ID,
          COHERENCE_SIGNATURE
        )
      ).to.be.revertedWith("Minting not active");
    });

    it("should reject empty sovereign name", async function () {
      await expect(
        scrollSoulSBT.mintSovereignSoul(
          addr1.address,
          "",
          LINEAGE_ID,
          COHERENCE_SIGNATURE
        )
      ).to.be.revertedWith("Sovereign name required");
    });

    it("should reject empty coherence signature", async function () {
      await expect(
        scrollSoulSBT.mintSovereignSoul(
          addr1.address,
          SOVEREIGN_NAME,
          LINEAGE_ID,
          ""
        )
      ).to.be.revertedWith("Coherence signature required");
    });

    it("should only allow owner to mint", async function () {
      await expect(
        scrollSoulSBT.connect(addr1).mintSovereignSoul(
          addr1.address,
          SOVEREIGN_NAME,
          LINEAGE_ID,
          COHERENCE_SIGNATURE
        )
      ).to.be.revertedWithCustomError(scrollSoulSBT, "OwnableUnauthorizedAccount");
    });
  });

  describe("Batch Minting", function () {
    beforeEach(async function () {
      await scrollSoulSBT.setMintActive(true);
    });

    it("should batch mint multiple Sovereign Souls", async function () {
      const recipients = [addr1.address, addr2.address];
      const names = ["Sovereign One", "Sovereign Two"];
      const lineageIDs = [1, 2];
      const signatures = ["963Hz_Anchor", "963Hz_Anchor_2"];

      await scrollSoulSBT.batchMintSovereignSouls(
        recipients,
        names,
        lineageIDs,
        signatures
      );

      expect(await scrollSoulSBT.balanceOf(addr1.address)).to.equal(1);
      expect(await scrollSoulSBT.balanceOf(addr2.address)).to.equal(1);
      expect(await scrollSoulSBT.totalMinted()).to.equal(2);

      const soul1 = await scrollSoulSBT.getSoulData(0);
      const soul2 = await scrollSoulSBT.getSoulData(1);

      expect(soul1.sovereignName).to.equal("Sovereign One");
      expect(soul2.sovereignName).to.equal("Sovereign Two");
    });

    it("should reject array length mismatch", async function () {
      await expect(
        scrollSoulSBT.batchMintSovereignSouls(
          [addr1.address],
          ["Name One", "Name Two"],
          [1],
          ["Sig"]
        )
      ).to.be.revertedWith("Array length mismatch");
    });
  });

  describe("Wallet Mint Tracking", function () {
    beforeEach(async function () {
      await scrollSoulSBT.setMintActive(true);
    });

    it("should track mints by wallet", async function () {
      await scrollSoulSBT.mintSovereignSoul(
        addr1.address,
        SOVEREIGN_NAME,
        LINEAGE_ID,
        COHERENCE_SIGNATURE
      );
      await scrollSoulSBT.mintSovereignSoul(
        addr1.address,
        "Another Sovereign",
        2,
        "963Hz_Anchor_2"
      );

      const walletMints = await scrollSoulSBT.getWalletMints(addr1.address);
      expect(walletMints.length).to.equal(2);
      expect(walletMints[0]).to.equal(0);
      expect(walletMints[1]).to.equal(1);
    });

    it("should return correct mint count for wallet", async function () {
      await scrollSoulSBT.mintSovereignSoul(
        addr1.address,
        SOVEREIGN_NAME,
        LINEAGE_ID,
        COHERENCE_SIGNATURE
      );

      expect(await scrollSoulSBT.getWalletMintCount(addr1.address)).to.equal(1);
      expect(await scrollSoulSBT.getWalletMintCount(addr2.address)).to.equal(0);
    });
  });

  describe("Soul Data Retrieval", function () {
    beforeEach(async function () {
      await scrollSoulSBT.setMintActive(true);
      await scrollSoulSBT.mintSovereignSoul(
        addr1.address,
        SOVEREIGN_NAME,
        LINEAGE_ID,
        COHERENCE_SIGNATURE
      );
    });

    it("should return sovereign name", async function () {
      expect(await scrollSoulSBT.getSovereignName(0)).to.equal(SOVEREIGN_NAME);
    });

    it("should return lineage ID", async function () {
      expect(await scrollSoulSBT.getLineageID(0)).to.equal(LINEAGE_ID);
    });

    it("should return coherence signature", async function () {
      expect(await scrollSoulSBT.getCoherenceSignature(0)).to.equal(COHERENCE_SIGNATURE);
    });

    it("should return mint timestamp", async function () {
      const timestamp = await scrollSoulSBT.getMintTimestamp(0);
      expect(timestamp).to.be.gt(0);
    });

    it("should revert for non-existent token", async function () {
      await expect(scrollSoulSBT.getSoulData(999)).to.be.revertedWith("Token does not exist");
    });
  });

  describe("Soulbound Transfers", function () {
    beforeEach(async function () {
      await scrollSoulSBT.setMintActive(true);
      await scrollSoulSBT.mintSovereignSoul(
        addr1.address,
        SOVEREIGN_NAME,
        LINEAGE_ID,
        COHERENCE_SIGNATURE
      );
    });

    it("should prevent transfers when soulbound", async function () {
      await expect(
        scrollSoulSBT.connect(addr1).transferFrom(addr1.address, addr2.address, 0)
      ).to.be.revertedWith("Soulbound: transfers disabled");
    });

    it("should allow transfers when soulbound is disabled", async function () {
      await scrollSoulSBT.setSoulbound(false);
      
      await scrollSoulSBT.connect(addr1).transferFrom(addr1.address, addr2.address, 0);
      expect(await scrollSoulSBT.ownerOf(0)).to.equal(addr2.address);
    });

    it("should emit SoulboundStatusChanged event", async function () {
      await expect(scrollSoulSBT.setSoulbound(false))
        .to.emit(scrollSoulSBT, "SoulboundStatusChanged")
        .withArgs(false);
    });
  });

  describe("Supply Tracking", function () {
    beforeEach(async function () {
      await scrollSoulSBT.setMintActive(true);
    });

    it("should track total minted", async function () {
      expect(await scrollSoulSBT.totalMinted()).to.equal(0);
      
      await scrollSoulSBT.mintSovereignSoul(
        addr1.address,
        SOVEREIGN_NAME,
        LINEAGE_ID,
        COHERENCE_SIGNATURE
      );
      
      expect(await scrollSoulSBT.totalMinted()).to.equal(1);
    });

    it("should track remaining supply", async function () {
      expect(await scrollSoulSBT.remainingSupply()).to.equal(963);
      
      await scrollSoulSBT.mintSovereignSoul(
        addr1.address,
        SOVEREIGN_NAME,
        LINEAGE_ID,
        COHERENCE_SIGNATURE
      );
      
      expect(await scrollSoulSBT.remainingSupply()).to.equal(962);
    });
  });

  describe("Admin Functions", function () {
    it("should allow owner to toggle minting", async function () {
      await expect(scrollSoulSBT.setMintActive(true))
        .to.emit(scrollSoulSBT, "MintingStatusChanged")
        .withArgs(true);
      
      expect(await scrollSoulSBT.mintActive()).to.equal(true);
    });

    it("should allow owner to update base URI", async function () {
      const newURI = "ipfs://NewBaseURI/";
      
      await expect(scrollSoulSBT.setBaseURI(newURI))
        .to.emit(scrollSoulSBT, "BaseURIUpdated")
        .withArgs(newURI);
    });

    it("should not allow non-owner to update base URI", async function () {
      await expect(
        scrollSoulSBT.connect(addr1).setBaseURI("ipfs://Hacked/")
      ).to.be.revertedWithCustomError(scrollSoulSBT, "OwnableUnauthorizedAccount");
    });
  });
});
