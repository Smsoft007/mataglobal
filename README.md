# MataGlobal (MATA) Token

## Overview
MataGlobal (MATA) is a BEP20 token implemented on the Binance Smart Chain (BSC). This project contains the smart contract for the MATA token with a total supply of 10 billion tokens.

## Token Details
- **Name:** MataGlobal
- **Symbol:** MATA
- **Total Supply:** 10,000,000,000 (10 billion) MATA
- **Decimals:** 18
- **Network:** Binance Smart Chain (BSC)
- **Token Standard:** BEP20

## Technical Stack
- Solidity (Smart Contract Language)
- Truffle/Hardhat (Development Framework)
- OpenZeppelin (Smart Contract Library)
- Web3.js/Ethers.js (Blockchain Interaction)

## Smart Contract Features
- BEP20 Standard Compliance
- Fixed Total Supply
- Burnable
- Pausable
- Ownership Control
- Transfer and Approve Functions

## Development Setup
1. Install Dependencies
```bash
npm install
```

2. Configure Environment
```bash
# Create .env file with following variables
BSC_TESTNET_PRIVATE_KEY=your_private_key
BSC_MAINNET_PRIVATE_KEY=0x1F634f80F81296995c377ACfBbF8C67a48E89ecD
BSC_SCAN_API_KEY=e1a7a1d315612111bc418fdf2c7b281a97bd17c274595ce12c9f0848f2976df0
```

3. Compile Contracts
```bash
npx hardhat compile
```

4. Run Tests
```bash
npx hardhat test
```

## Deployment
1. Deploy to BSC Testnet
```bash
npx hardhat run scripts/deploy.js --network bscTestnet
```

2. Deploy to BSC Mainnet
```bash
npx hardhat run scripts/deploy.js --network bscMainnet
```

## Security
- Smart contract will be audited by reputable security firms
- Implementation follows best practices and security patterns
- All functions are properly tested

## Gas Analysis Results

### 1. Normal Transfer
- ⛽ Gas Usage: 35,870 units
- 💰 Estimated Cost: 0.0000051 BNB ($0.0015)
- ⚡ Processing Speed: Instant

### 2. Transfer with Tax (5% tax rate)
- ⛽ Gas Usage: 36,071 units
- 💰 Estimated Cost: 0.0000040 BNB ($0.0012)
- 🔄 Additional Gas: 201 units (0.56% increase)

## Tested Features

✅ **Basic Transfer Function**
- Normal token transfer
- Accurate balance reflection
- Gas optimization confirmed

✅ **Tax Function**
- Tax rate setting (up to 10%)
- Automatic tax collection
- Transfer to treasury wallet

✅ **Gas Efficiency**
- Efficient compared to BSC average
- Minimal gas usage compared to additional features
- Stable processing speed

## Additional Testable Items

🔄 **Upcoming Tests**
1. Blacklist Function
   - Account registration/removal
   - Transfer blocking confirmation

2. Maximum Transfer Amount Limit
   - Limit setting/change
   - Exceeding transfer attempt

3. Batch Transfer (Multiple Account Transfer)
   - Simultaneous transfer to multiple accounts
   - Gas efficiency measurement

## License
MIT License

## Disclaimer
This token is created for use within the MataGlobal ecosystem. Please ensure you understand the risks involved with cryptocurrency tokens before participating.
