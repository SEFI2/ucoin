

pragma solidity ^0.5.0;

import "./oraclize/oraclizeAPI.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";



contract Casino is usingOraclize {
	using SafeMath for uint256;

		
	enum State { 
			Available, 
			Started,
			Finished
	}


	State public state;
	uint256 betValue;	
	address betOwner; 
	address [] playersList;
	uint256 totalValue;

	constructor () public {
		//oraclize_setProof(proofType_Ledger);		
	}
	
	
	modifier ifAvailable {
		require (state  == State.Available);
		_;
	}
	
	modifier ifStarted {
		require (state == State.Started);
		_;
	}
	
	modifier checkValue (uint value) {
		require (value == betValue);
		_;
	}
	
	modifier ifFinished {
		require (state == State.Finished);	
		_;
	}
	modifier checkOwner {
		require (msg.sender == betOwner);
		_;
	}
	

	
	function startGame(uint256 value) 
		public
		ifAvailable 
		payable 
	{	
		// require (value <= balanceOf(msg.sender));
		betOwner = msg.sender;
		betValue = value;
		totalValue = totalValue.add(value);
		playersList.push(msg.sender);
		
	}

	
	function betIn(uint256 value)
		public	
		ifStarted
		checkValue(value)
		payable 
	{
		// require (value <= balanceOf(msg.sender));
		totalValue = totalValue.add(value);
		playersList.push(msg.sender);		
	}

	
	function endGame()
		public 
		ifStarted
		checkOwner
	{
		requestRandom();
		state = State.Finished;
	}	
	
	function generateResults(uint number) 
		internal
		ifFinished
	{
		require(number < playersList.length);
		// uint totalValue = betValue * playersList.length;
	
		address wonAddress = playersList[number];
		for (uint i = 0 ; i < playersList.length ; ++i) {
			// _transfer(playerList[i], wonAddress, betValue);
		}
		state = State.Available;
	}
	

	
	function requestRandom() internal {
		uint countRandom = 4;
		uint delay = 0;
		uint callbackGas = 2000000;
		bytes32 queryId = oraclize_newRandomDSQuery(delay, countRandom, callbackGas);
	}


	// Results from oracle
	function __callback(
		bytes32 _queryId,
		string memory _result,
		bytes memory _proof
	) public {
		require (msg.sender == oraclize_cbAddress());
		require (oraclize_randomDS_proofVerify__returnCode(_queryId, _result, _proof) == 0);
		uint limit = playersList.length;
		uint result = uint(keccak256(abi.encodePacked(_result))) % limit;
	    generateResults(result);	
	}

}
