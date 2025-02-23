// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SimpleToken is ERC20 {
    constructor() ERC20("MATA Token", "MATA") {
        _mint(msg.sender, 10000000000 * 10 ** decimals()); // 100억 개로 수정
    }
}
