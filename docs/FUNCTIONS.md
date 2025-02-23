# MATA Token 기능 문서

## 권한 구조

### 배포자(Deployer)
- 컨트랙트 배포 시 자동으로 지정됨
- 변경 불가능한 최고 권한
- 모든 관리자 기능 사용 가능

### 관리자(Administrator)
- 배포자가 지정/해제 가능
- 일상적인 운영 관리 담당

## 배포자 전용 기능

### 관리자 관리
```solidity
function setAdministrator(address account, bool status) external onlyDeployer
```
- 관리자 권한을 부여하거나 철회
- 배포자는 관리자 권한 변경 불가
- 이벤트: `AdministratorUpdated(address indexed account, bool isAdmin)`

### 재무 지갑 설정
```solidity
function setTreasuryWallet(address newWallet) external onlyDeployer
```
- 세금을 받을 지갑 주소 설정
- 영주소(0x0)로 설정 불가
- 이벤트: `TreasuryWalletUpdated(address indexed newWallet)`

### 전송 세금율 설정
```solidity
function setTransferTaxRate(uint256 newRate) external onlyDeployer
```
- 토큰 전송 시 적용될 세금율 설정
- 최대 10%(1000) 설정 가능
- 이벤트: `TransferTaxRateUpdated(uint256 newRate)`

### 토큰 회수
```solidity
function recoverTokens(address tokenAddress, uint256 amount) external onlyDeployer
```
- 컨트랙트에 잘못 전송된 토큰을 회수
- MATA 토큰 및 다른 BEP20 토큰 회수 가능

## 관리자 기능

### 블랙리스트 관리
```solidity
function setBlacklist(address account, bool value) external onlyAdministrator
```
- 특정 주소를 블랙리스트에 추가/제거
- 배포자와 관리자는 블랙리스트 등록 불가
- 이벤트: `Blacklisted(address indexed account, bool value)`

### 최대 전송 금액 설정
```solidity
function setMaxTransferAmount(uint256 amount) external onlyAdministrator
```
- 1회 전송 시 최대 전송 가능 금액 설정
- 0보다 큰 값만 설정 가능
- 이벤트: `MaxTransferAmountUpdated(uint256 amount)`

### 일시정지 기능
```solidity
function pause() public onlyAdministrator
function unpause() public onlyAdministrator
```
- 전체 토큰 전송 기능을 일시정지/해제
- 비상 상황이나 보안 문제 발생 시 사용

### 대량 전송
```solidity
function batchTransfer(address[] calldata recipients, uint256[] calldata amounts) external onlyAdministrator
```
- 여러 주소로 한 번에 토큰 전송
- 에어드랍이나 보상 지급 시 사용
- recipients와 amounts 배열 길이는 동일해야 함

## 조회 기능 (누구나 사용 가능)

### 블랙리스트 확인
```solidity
function isBlacklisted(address account) public view returns (bool)
```
- 특정 주소의 블랙리스트 상태 확인

### 최대 전송 금액 확인
```solidity
function getMaxTransferAmount() public view returns (uint256)
```
- 현재 설정된 최대 전송 가능 금액 확인

### 재무 지갑 주소 확인
```solidity
function getTreasuryWallet() public view returns (address)
```
- 현재 설정된 재무 지갑 주소 확인

### 전송 세금율 확인
```solidity
function getTransferTaxRate() public view returns (uint256)
```
- 현재 설정된 전송 세금율 확인

### 관리자 권한 확인
```solidity
function isAdministrator(address account) public view returns (bool)
```
- 특정 주소의 관리자 권한 보유 여부 확인

## 특별 권한

### 전송 제한 면제
- 배포자와 관리자는 최대 전송 금액 제한에서 제외
- 블랙리스트에 등록될 수 없음

### 세금 면제
- 배포자와 관리자의 전송은 세금이 부과되지 않음

## 이벤트

모든 주요 상태 변경은 이벤트를 발생시킵니다:
- `AdministratorUpdated`: 관리자 권한 변경
- `Blacklisted`: 블랙리스트 상태 변경
- `MaxTransferAmountUpdated`: 최대 전송 금액 변경
- `TreasuryWalletUpdated`: 재무 지갑 주소 변경
- `TransferTaxRateUpdated`: 전송 세금율 변경
- `TaxCollected`: 세금 징수
