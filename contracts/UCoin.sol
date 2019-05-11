/*
Implements EIP20 token standard: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md
.*/


pragma solidity ^0.5.0;





import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";


contract UCoin is ERC20, ERC20Detailed {
	string public constant COIN_NAME = "UCoin";
	string public constant COIN_SYMBOL = "UCoin";
	uint8 public constant DECIMALS = 5;
	uint256 public constant INITIAL_SUPPLY = 10000 * (10 ** uint256(DECIMALS));
	

	constructor () public ERC20Detailed(COIN_NAME, COIN_SYMBOL, DECIMALS) {
		_mint(msg.sender, INITIAL_SUPPLY);
	}
			
	
}
