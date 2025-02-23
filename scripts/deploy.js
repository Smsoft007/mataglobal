const chalk = require('chalk');
const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(chalk.cyan("\n🚀 MATA 토큰 배포를 시작합니다..."));
  console.log(chalk.gray("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
  console.log(chalk.yellow("📝 배포 계정:"), chalk.white(deployer.address));

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(chalk.yellow("💰 계정 잔액:"), chalk.green(ethers.formatEther(balance)), "BNB");

  // 컨트랙트 배포
  const MataToken = await ethers.getContractFactory("MataToken");
  const mataToken = await MataToken.deploy();
  await mataToken.waitForDeployment();

  const mataTokenAddress = await mataToken.getAddress();
  console.log(chalk.yellow("📍 컨트랙트 주소:"), chalk.white(mataTokenAddress));
  console.log(chalk.gray("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));

  // 전송 테스트
  console.log(chalk.cyan("\n🧪 전송 테스트를 시작합니다..."));
  
  // 일반 전송 테스트
  const testAmount = ethers.parseEther("1000");
  console.log(chalk.magenta("\n1️⃣ 일반 전송 테스트"));
  console.log(chalk.yellow("💸 전송 금액:"), chalk.green(ethers.formatEther(testAmount)), "MATA");
  
  const tx1 = await mataToken.transfer(deployer.address, testAmount);
  const receipt1 = await tx1.wait();
  
  console.log(chalk.cyan("\n📊 가스 분석 결과"));
  console.log(chalk.gray("────────────────────────────────"));
  console.log(chalk.yellow("⛽ 사용된 가스:"), chalk.white(receipt1.gasUsed.toString()), "단위");
  console.log(chalk.yellow("💵 가스 가격:"), chalk.white(ethers.formatUnits(receipt1.gasPrice, 'gwei')), "Gwei");
  
  const gasCost1 = BigInt(receipt1.gasUsed) * BigInt(receipt1.gasPrice);
  console.log(chalk.yellow("💰 총 가스 비용:"), chalk.green(ethers.formatEther(gasCost1)), "BNB");
  
  const usdCost1 = Number(ethers.formatEther(gasCost1)) * 300;
  console.log(chalk.yellow("💲 예상 USD 비용:"), chalk.green("$" + usdCost1.toFixed(4)), chalk.gray("(BNB = $300 기준)"));

  // 세금이 있는 전송 테스트
  console.log(chalk.magenta("\n2️⃣ 세금이 있는 전송 테스트"));
  console.log(chalk.yellow("📈 세율:"), chalk.red("5%"));
  console.log(chalk.yellow("💸 전송 금액:"), chalk.green(ethers.formatEther(testAmount)), "MATA");
  
  await mataToken.setTransferTaxRate(500);
  const tx2 = await mataToken.transfer(deployer.address, testAmount);
  const receipt2 = await tx2.wait();
  
  console.log(chalk.cyan("\n📊 가스 분석 결과"));
  console.log(chalk.gray("────────────────────────────────"));
  console.log(chalk.yellow("⛽ 사용된 가스:"), chalk.white(receipt2.gasUsed.toString()), "단위");
  console.log(chalk.yellow("💵 가스 가격:"), chalk.white(ethers.formatUnits(receipt2.gasPrice, 'gwei')), "Gwei");
  
  const gasCost2 = BigInt(receipt2.gasUsed) * BigInt(receipt2.gasPrice);
  console.log(chalk.yellow("💰 총 가스 비용:"), chalk.green(ethers.formatEther(gasCost2)), "BNB");
  
  const usdCost2 = Number(ethers.formatEther(gasCost2)) * 300;
  console.log(chalk.yellow("💲 예상 USD 비용:"), chalk.green("$" + usdCost2.toFixed(4)), chalk.gray("(BNB = $300 기준)"));

  // 비교 분석
  console.log(chalk.magenta("\n📈 비교 분석"));
  console.log(chalk.gray("────────────────────────────────"));
  const gasDiff = Number(receipt2.gasUsed) - Number(receipt1.gasUsed);
  const percentDiff = (gasDiff / Number(receipt1.gasUsed) * 100).toFixed(2);
  console.log(chalk.yellow("🔄 가스 사용량 차이:"), chalk.white(gasDiff), "단위", chalk.gray(`(${percentDiff}% 증가)`));
  
  const costDiff = usdCost2 - usdCost1;
  console.log(chalk.yellow("💱 비용 차이:"), chalk.green("$" + Math.abs(costDiff).toFixed(4)), 
    costDiff > 0 ? chalk.red("(증가)") : chalk.green("(감소)"));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(chalk.red("❌ 오류 발생:"), error);
    process.exit(1);
  });
