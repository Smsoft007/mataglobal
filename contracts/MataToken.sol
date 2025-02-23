// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MataToken is ERC20, ERC20Burnable, Pausable {
    address public deployer;
    mapping(address => bool) public administrators;
    
    mapping(address => bool) private _blacklist;
    uint256 private _maxTransferAmount;
    address private _treasuryWallet;
    uint256 private _transferTaxRate;
    
    event AdministratorUpdated(address indexed account, bool isAdmin);
    event Blacklisted(address indexed account, bool value);
    event MaxTransferAmountUpdated(uint256 amount);
    event TreasuryWalletUpdated(address indexed newWallet);
    event TransferTaxRateUpdated(uint256 newRate);
    event TaxCollected(address indexed from, address indexed to, uint256 amount);

    modifier onlyDeployer() {
        require(msg.sender == deployer, "Caller is not the deployer");
        _;
    }

    modifier onlyAdministrator() {
        require(administrators[msg.sender] || msg.sender == deployer, "Caller is not an administrator");
        _;
    }

    constructor() ERC20("MataGlobal", "MATA") {
        deployer = msg.sender;
        administrators[msg.sender] = true;
        _mint(msg.sender, 10000000000 * 10 ** decimals());
        _maxTransferAmount = totalSupply();
        _treasuryWallet = msg.sender;
        _transferTaxRate = 0;
    }

    // 관리자 관리 (배포자만 가능)
    function setAdministrator(address account, bool status) external onlyDeployer {
        require(account != deployer, "Cannot modify deployer status");
        administrators[account] = status;
        emit AdministratorUpdated(account, status);
    }

    // 블랙리스트 관리 (관리자 가능)
    function setBlacklist(address account, bool value) external onlyAdministrator {
        require(account != deployer && !administrators[account], "Cannot blacklist privileged addresses");
        _blacklist[account] = value;
        emit Blacklisted(account, value);
    }

    // 최대 전송 금액 설정 (관리자 가능)
    function setMaxTransferAmount(uint256 amount) external onlyAdministrator {
        require(amount > 0, "Amount must be greater than 0");
        _maxTransferAmount = amount;
        emit MaxTransferAmountUpdated(amount);
    }

    // 재무 지갑 주소 설정 (배포자만 가능)
    function setTreasuryWallet(address newWallet) external onlyDeployer {
        require(newWallet != address(0), "New wallet cannot be zero address");
        _treasuryWallet = newWallet;
        emit TreasuryWalletUpdated(newWallet);
    }

    // 전송 세금율 설정 (배포자만 가능)
    function setTransferTaxRate(uint256 newRate) external onlyDeployer {
        require(newRate <= 1000, "Tax rate cannot exceed 10%");
        _transferTaxRate = newRate;
        emit TransferTaxRateUpdated(newRate);
    }

    // 토큰 회수 (배포자만 가능)
    function recoverTokens(address tokenAddress, uint256 amount) external onlyDeployer {
        if (tokenAddress == address(this)) {
            require(transfer(_treasuryWallet, amount), "Transfer failed");
        } else {
            IERC20 token = IERC20(tokenAddress);
            require(token.transfer(_treasuryWallet, amount), "Transfer failed");
        }
    }

    // 일시정지 (관리자 가능)
    function pause() public onlyAdministrator {
        _pause();
    }

    // 일시정지 해제 (관리자 가능)
    function unpause() public onlyAdministrator {
        _unpause();
    }

    // 대량 전송 (관리자 가능)
    function batchTransfer(address[] calldata recipients, uint256[] calldata amounts) external onlyAdministrator {
        require(recipients.length == amounts.length, "Arrays length mismatch");
        require(recipients.length > 0, "Empty arrays");
        
        for(uint256 i = 0; i < recipients.length; i++) {
            require(transfer(recipients[i], amounts[i]), "Transfer failed");
        }
    }

    // 내부 전송 로직 오버라이드
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override whenNotPaused {
        require(!_blacklist[from] && !_blacklist[to], "Address is blacklisted");
        
        // 배포자와 관리자는 제한 없음
        if(!administrators[from] && from != deployer && !administrators[to] && to != deployer) {
            require(amount <= _maxTransferAmount, "Transfer amount exceeds limit");
        }

        // 배포자와 관리자는 세금 면제
        if (_transferTaxRate > 0 && !administrators[from] && from != deployer) {
            uint256 taxAmount = (amount * _transferTaxRate) / 10000;
            if (taxAmount > 0) {
                super._beforeTokenTransfer(from, _treasuryWallet, taxAmount);
                emit TaxCollected(from, to, taxAmount);
            }
            amount = amount - taxAmount;
        }

        super._beforeTokenTransfer(from, to, amount);
    }

    // 조회 함수들
    function isBlacklisted(address account) public view returns (bool) {
        return _blacklist[account];
    }

    function getMaxTransferAmount() public view returns (uint256) {
        return _maxTransferAmount;
    }

    function getTreasuryWallet() public view returns (address) {
        return _treasuryWallet;
    }

    function getTransferTaxRate() public view returns (uint256) {
        return _transferTaxRate;
    }

    function isAdministrator(address account) public view returns (bool) {
        return administrators[account];
    }
}
