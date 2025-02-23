const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MataToken", function () {
  let MataToken;
  let mataToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    // Contract 배포를 위한 설정
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    MataToken = await ethers.getContractFactory("MataToken");
    mataToken = await MataToken.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await mataToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await mataToken.balanceOf(owner.address);
      expect(await mataToken.totalSupply()).to.equal(ownerBalance);
    });

    it("Should have correct total supply", async function () {
      const expectedSupply = ethers.parseEther("10000000000"); // 100억 토큰
      expect(await mataToken.totalSupply()).to.equal(expectedSupply);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      // 100 토큰을 addr1으로 전송
      const transferAmount = ethers.parseEther("100");
      await mataToken.transfer(addr1.address, transferAmount);
      
      expect(await mataToken.balanceOf(addr1.address)).to.equal(transferAmount);

      // addr1에서 addr2로 50 토큰 전송
      await mataToken.connect(addr1).transfer(addr2.address, ethers.parseEther("50"));
      expect(await mataToken.balanceOf(addr2.address)).to.equal(ethers.parseEther("50"));
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await mataToken.balanceOf(owner.address);
      await expect(
        mataToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
      expect(await mataToken.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });
  });

  describe("Burning", function () {
    it("Should allow token burning", async function () {
      const burnAmount = ethers.parseEther("1000");
      await mataToken.burn(burnAmount);
      
      const totalSupplyAfterBurn = await mataToken.totalSupply();
      const expectedSupply = ethers.parseEther("9999999000"); // 100억 - 1000
      expect(totalSupplyAfterBurn).to.equal(expectedSupply);
    });
  });

  describe("Pausable", function () {
    it("Should pause and unpause", async function () {
      await mataToken.pause();
      await expect(
        mataToken.transfer(addr1.address, 100)
      ).to.be.revertedWith("Pausable: paused");
      
      await mataToken.unpause();
      await expect(
        mataToken.transfer(addr1.address, 100)
      ).to.not.be.reverted;
    });

    it("Should not allow non-owners to pause", async function () {
      await expect(
        mataToken.connect(addr1).pause()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});
