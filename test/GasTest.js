const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MataToken Gas Tests", function () {
  let mataToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    
    const MataToken = await ethers.getContractFactory("MataToken");
    mataToken = await MataToken.deploy();
  });

  async function measureGas(transaction) {
    const tx = await transaction;
    const receipt = await tx.wait();
    const gasCost = BigInt(receipt.gasUsed) * BigInt(receipt.effectiveGasPrice);
    return {
      gasUsed: receipt.gasUsed,
      effectiveGasPrice: receipt.effectiveGasPrice,
      gasCost: gasCost
    };
  }

  describe("Gas Costs", function () {
    it("Should measure gas for first transfer", async function () {
      console.log("\nFirst Transfer Gas Analysis:");
      const amount = ethers.parseEther("1000"); // 1000 MATA
      
      const gasInfo = await measureGas(
        mataToken.transfer(addr1.address, amount)
      );
      
      console.log(`Gas Used: ${gasInfo.gasUsed.toString()} units`);
      console.log(`Gas Price: ${ethers.formatUnits(gasInfo.effectiveGasPrice, 'gwei')} Gwei`);
      console.log(`Total Gas Cost: ${ethers.formatEther(gasInfo.gasCost)} BNB`);
      
      // 현재 BNB 가격을 $300로 가정
      const bnbPrice = 300;
      const gasCostUSD = Number(ethers.formatEther(gasInfo.gasCost)) * bnbPrice;
      console.log(`Estimated Cost in USD: $${gasCostUSD.toFixed(4)} (assuming BNB = $${bnbPrice})`);
      
      // 잔액 확인
      const balance = await mataToken.balanceOf(addr1.address);
      expect(balance).to.equal(amount);
    });

    it("Should measure gas for subsequent transfer", async function () {
      console.log("\nSubsequent Transfer Gas Analysis:");
      // 첫 번째 전송
      await mataToken.transfer(addr1.address, ethers.parseEther("2000"));
      
      // 두 번째 전송 (addr1 -> addr2)
      const amount = ethers.parseEther("1000");
      const gasInfo = await measureGas(
        mataToken.connect(addr1).transfer(addr2.address, amount)
      );
      
      console.log(`Gas Used: ${gasInfo.gasUsed.toString()} units`);
      console.log(`Gas Price: ${ethers.formatUnits(gasInfo.effectiveGasPrice, 'gwei')} Gwei`);
      console.log(`Total Gas Cost: ${ethers.formatEther(gasInfo.gasCost)} BNB`);
      
      // 현재 BNB 가격을 $300로 가정
      const bnbPrice = 300;
      const gasCostUSD = Number(ethers.formatEther(gasInfo.gasCost)) * bnbPrice;
      console.log(`Estimated Cost in USD: $${gasCostUSD.toFixed(4)} (assuming BNB = $${bnbPrice})`);
      
      // 잔액 확인
      const balance = await mataToken.balanceOf(addr2.address);
      expect(balance).to.equal(amount);
    });

    it("Should measure gas for transfer with tax", async function () {
      console.log("\nTransfer with Tax Gas Analysis:");
      // 세금율 설정 (5%)
      await mataToken.setTransferTaxRate(500);
      
      const amount = ethers.parseEther("1000");
      const gasInfo = await measureGas(
        mataToken.transfer(addr1.address, amount)
      );
      
      console.log(`Gas Used: ${gasInfo.gasUsed.toString()} units`);
      console.log(`Gas Price: ${ethers.formatUnits(gasInfo.effectiveGasPrice, 'gwei')} Gwei`);
      console.log(`Total Gas Cost: ${ethers.formatEther(gasInfo.gasCost)} BNB`);
      
      // 현재 BNB 가격을 $300로 가정
      const bnbPrice = 300;
      const gasCostUSD = Number(ethers.formatEther(gasInfo.gasCost)) * bnbPrice;
      console.log(`Estimated Cost in USD: $${gasCostUSD.toFixed(4)} (assuming BNB = $${bnbPrice})`);
      
      // 세금이 적용된 금액 확인
      const expectedAmount = amount * 9500n / 10000n; // 5% 세금 제외
      const balance = await mataToken.balanceOf(addr1.address);
      expect(balance).to.equal(expectedAmount);
    });
  });
});
