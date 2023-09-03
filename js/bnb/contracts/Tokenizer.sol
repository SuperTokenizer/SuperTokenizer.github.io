// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Tokenization is ERC20 {
    address public owner;
    uint256 public totalSupplyCap;
    uint256 public totalDistributed;
    
    constructor(
        string memory name,
        string memory symbol,
        uint256 supplyCap
    ) ERC20(name, symbol) {
        owner = msg.sender;
        totalSupplyCap = supplyCap;
        _mint(msg.sender, totalSupplyCap);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    function sendTokens(address reciever,uint256 amount) external onlyOwner {
        require(totalDistributed + amount <= totalSupplyCap, "Exceeds supply cap");
        totalDistributed += amount;
        _transfer(owner, reciever, amount);
    }
}
