const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Tokenizer", () => {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  const deploy = async () => {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Tokenizer = await ethers.getContractFactory("Tokenization");
    const tokenizer = await Tokenizer.deploy("Kshitij", "KSHI", "10000");

    return { tokenizer, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set right name", async () => {
      const { tokenizer } = await loadFixture(deploy);

      expect(await tokenizer.name()).to.equal("Kshitij");
    });

    it("Should set the right owner", async  () => {
      const { tokenizer, owner } = await loadFixture(deploy);

      expect(await tokenizer.owner()).to.equal(owner.address);
    });

    it("Should set right symbol", async  () => {
      const { tokenizer } = await loadFixture(deploy);

      expect(await tokenizer.symbol()).to.equal("KSHI");
    });

    it("Should set right total supply", async  () => {
      const { tokenizer } = await loadFixture(deploy);
      expect(await tokenizer.totalSupply()).to.equal(10000);
    });
  });

  describe("Transfers", function () {
    describe("Validations", function () {
      it("Should revert with the right error if amount exceeds totalSupply", async function () {
        const { tokenizer, owner, otherAccount } = await loadFixture(deploy);

        await expect(tokenizer.connect(owner).sendTokens(otherAccount.address, 100000)).to.be.revertedWith(
          "Exceeds supply cap"
        );
      });

      it("Should revert with the right error if called from another account", async function () {
        const { tokenizer, owner, otherAccount } = await loadFixture(deploy);

        // We can increase the time in Hardhat Network
        //await time.increaseTo(unlockTime);

        // We use lock.connect() to send a transaction from another account
        await expect(tokenizer.connect(otherAccount).sendTokens(owner.address, 10)).to.be.revertedWith(
          "Only the owner can call this function"
        );
      });

      it("Total distributions upgraded", async function () {
        const { tokenizer, owner, otherAccount } = await loadFixture(deploy);

        // Transactions are sent using the first signer by default
        await tokenizer.sendTokens(otherAccount.address, 100);
        expect(await tokenizer.totalDistributed()).to.equal(100);
      });
    });
  });
});
