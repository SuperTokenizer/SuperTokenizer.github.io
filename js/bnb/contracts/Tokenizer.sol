// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenFactory{
    mapping(address => address[]) public tokens;
    function newToken(string memory name, string memory symbol, uint256 maxSupply) public{
        address token = address(new Tokenization(name, symbol, maxSupply));
        tokens[msg.sender].push(token);
    }
}

contract Tokenization is ERC20 {
    address public owner;
    uint256 public totalSupplyCap;
    uint256 public totalDistributed;
    
    constructor(
        string memory name,
        string memory symbol,
        uint256 supplyCap
    ) ERC20(name, symbol) {
        owner = tx.origin;
        totalSupplyCap = supplyCap;
        _mint(owner, totalSupplyCap);
    }

    modifier onlyOwner() {
        require(tx.origin == owner, "Only the owner can call this function");
        _;
    }

    function sendTokens(address reciever,uint256 amount) external onlyOwner {
        require(totalDistributed + amount <= totalSupplyCap, "Exceeds supply cap");
        totalDistributed += amount;
        _transfer(owner, reciever, amount);
    }
}
