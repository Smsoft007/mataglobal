const chalk = require('chalk');

async function main() {
  console.log(chalk.cyan("\n🚀 MATA 토큰 메인넷 배포 시작..."));
  console.log(chalk.gray("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));

  const [deployer] = await ethers.getSigners();
  console.log(chalk.yellow("📝 배포 지갑:"), chalk.white(deployer.address));

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(chalk.yellow("💰 현재 잔액:"), chalk.green(ethers.formatEther(balance)), "BNB");

  // 현재 가스 가격 확인
  const gasPrice = await ethers.provider.getGasPrice();
  console.log(chalk.yellow("⛽ 현재 가스 가격:"), chalk.white(ethers.formatUnits(gasPrice, 'gwei')), "Gwei");

  // 컨트랙트 배포 예상 가스 계산
  const MataToken = await ethers.getContractFactory("MataToken");
  const deploymentGas = await ethers.provider.estimateGas(
    MataToken.getDeployTransaction()
  );

  // 예상 배포 비용 계산
  const estimatedCost = deploymentGas * gasPrice;
  console.log(chalk.yellow("\n📊 배포 예상 비용:"));
  console.log(chalk.gray("────────────────────────────────"));
  console.log(chalk.yellow("⛽ 예상 가스 사용량:"), chalk.white(deploymentGas.toString()), "단위");
  console.log(chalk.yellow("💰 예상 비용:"), chalk.green(ethers.formatEther(estimatedCost)), "BNB");
  
  // BNB 현재 가격 (예시: $300)
  const bnbPrice = 300;
  const usdCost = Number(ethers.formatEther(estimatedCost)) * bnbPrice;
  console.log(chalk.yellow("💲 USD 예상 비용:"), chalk.green("$" + usdCost.toFixed(2)), chalk.gray("(BNB = $300 기준)"));

  // 배포 진행 여부 확인
  console.log(chalk.red("\n⚠️ 주의: 실제 메인넷 배포를 진행하시겠습니까?"));
  console.log(chalk.gray("이 작업은 실제 BNB를 소모합니다."));
  console.log(chalk.gray("배포를 진행하려면 스크립트의 주석을 해제하세요."));

  /* 실제 배포 코드 - 주석 해제 후 사용
  console.log(chalk.cyan("\n🔄 컨트랙트 배포 중..."));
  const mataToken = await MataToken.deploy();
  await mataToken.waitForDeployment();

  const mataTokenAddress = await mataToken.getAddress();
  console.log(chalk.green("\n✅ 배포 완료!"));
  console.log(chalk.yellow("📍 컨트랙트 주소:"), chalk.white(mataTokenAddress));
  
  // BSCScan 인증을 위한 안내
  console.log(chalk.cyan("\n📋 다음 단계:"));
  console.log(chalk.gray("1. BSCScan에서 컨트랙트 확인"));
  console.log(chalk.gray("2. 소스코드 인증"));
  console.log(chalk.gray("3. 토큰 정보 업데이트"));
  */
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(chalk.red("❌ 오류 발생:"), error);
    process.exit(1);
  });
