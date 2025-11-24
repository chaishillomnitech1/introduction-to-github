import { expect } from "chai";
import { ethers } from "hardhat";

describe("EmbassyTerraceAnchor", function () {
  let embassyAnchor;
  let owner;
  let addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const EmbassyTerraceAnchor = await ethers.getContractFactory("EmbassyTerraceAnchor");
    embassyAnchor = await EmbassyTerraceAnchor.deploy();
    await embassyAnchor.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct name and symbol", async function () {
      expect(await embassyAnchor.name()).to.equal("EmbassyTerraceAnchor");
      expect(await embassyAnchor.symbol()).to.equal("EMBASSY");
    });

    it("Should set the correct owner", async function () {
      expect(await embassyAnchor.owner()).to.equal(owner.address);
    });
  });

  describe("Minting Physical Anchors", function () {
    it("Should mint a physical anchor NFT", async function () {
      const tokenURI = "ipfs://QmTest/1.json";
      const location = "Embassy Terrace";
      const latitude = 389072; // Scaled coordinate
      const longitude = 770369; // Scaled coordinate
      const layer = 0;

      await embassyAnchor.mintPhysicalAnchor(
        addr1.address,
        tokenURI,
        location,
        latitude,
        longitude,
        layer
      );

      expect(await embassyAnchor.ownerOf(1)).to.equal(addr1.address);
      expect(await embassyAnchor.tokenURI(1)).to.equal(tokenURI);
    });

    it("Should store correct physical anchor properties", async function () {
      const tokenURI = "ipfs://QmTest/1.json";
      const location = "Embassy Terrace";
      const latitude = 389072;
      const longitude = 770369;
      const layer = 1;

      await embassyAnchor.mintPhysicalAnchor(
        addr1.address,
        tokenURI,
        location,
        latitude,
        longitude,
        layer
      );

      const anchor = await embassyAnchor.getPhysicalAnchor(1);
      expect(anchor.location).to.equal(location);
      expect(anchor.latitude).to.equal(latitude);
      expect(anchor.longitude).to.equal(longitude);
      expect(anchor.scrollVerseLayer).to.equal(layer);
      expect(anchor.realWorldAnchorStrength).to.equal(100);
      expect(anchor.isActive).to.equal(true);
    });

    it("Should only allow owner to mint", async function () {
      await expect(
        embassyAnchor.connect(addr1).mintPhysicalAnchor(
          addr1.address,
          "ipfs://test",
          "Test",
          0,
          0,
          0
        )
      ).to.be.reverted;
    });
  });

  describe("Anchor Management", function () {
    beforeEach(async function () {
      await embassyAnchor.mintPhysicalAnchor(
        addr1.address,
        "ipfs://test",
        "Test Location",
        100,
        200,
        0
      );
    });

    it("Should strengthen anchor", async function () {
      await embassyAnchor.strengthenAnchor(1, 50);
      const anchor = await embassyAnchor.getPhysicalAnchor(1);
      expect(anchor.realWorldAnchorStrength).to.equal(150);
    });

    it("Should synchronize layer", async function () {
      await embassyAnchor.synchronizeLayer(1, 1);
      const anchor = await embassyAnchor.getPhysicalAnchor(1);
      expect(anchor.scrollVerseLayer).to.equal(1);
    });

    it("Should check if anchor is active", async function () {
      expect(await embassyAnchor.isAnchorActive(1)).to.equal(true);
    });
  });
});
