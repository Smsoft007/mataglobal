require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-chai-matchers");
require("@nomicfoundation/hardhat-ethers");
require('dotenv').config();

const PRIVATE_KEY = process.env.BSC_TESTNET_PRIVATE_KEY || "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: [PRIVATE_KEY]
    },
    bscMainnet: {
      url: "https://bsc-dataseed1.binance.org/",
      chainId: 56,
      accounts: [process.env.BSC_MAINNET_PRIVATE_KEY],
      gasPrice: 5000000000  // 5 Gwei
    }
  },
  etherscan: {
    apiKey: process.env.BSC_SCAN_API_KEY
  }
};
