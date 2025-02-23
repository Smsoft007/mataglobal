const hre = require("hardhat");

async function main() {
  console.log("🚀 Simple MATA 토큰 배포 시작...");
  
  const [deployer] = await ethers.getSigners();
  console.log("📝 배포 지갑:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 현재 잔액:", ethers.formatEther(balance), "BNB");

  // 컨트랙트 배포
  const SimpleToken = await ethers.getContractFactory("SimpleToken");
  console.log("⏳ 컨트랙트 배포 중...");
  
  const token = await SimpleToken.deploy();
  await token.waitForDeployment();
  
  const tokenAddress = await token.getAddress();
  console.log("✅ 배포 완료!");
  console.log("📍 컨트랙트 주소:", tokenAddress);
  console.log("\n토큰 정보:");
  console.log("이름:", await token.name());
  console.log("심볼:", await token.symbol());
  console.log("총 공급량:", ethers.formatEther(await token.totalSupply()), "MATA");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ 배포 중 오류 발생:", error);
    process.exit(1);
  });
