

import "../ehtereum-api/oraclizeAPI.sol"
import "./UCoin.sol"



contract Casion is oraclizeAPI {
	
		
	enum State { 
			Started, 
			Available 
	};
	struct Player {
		address addr;
		uint guessNumber;
	}
	
	public constant uint GUESS_LIMIT = 10;



	State public state;
	uint betValue;	
	address betOwner; 
	Player[] playersList;

	constructor () public {
		oraclize_setProof(proofType_Ledger);		
	}
	
	
	modifier ifAvailable {
		require (state  == State.Available);
	}
	
	modifier ifStarted {
		require (state == State.Started);
	}
	
	modifier checkValue {
		require (msg.value == betValue);
	}

	modifier checkOwner {
		require (msg.sender == betOwner);
	}
	
	modifier checkGuess (uint8 guess) {
		require (guess >= 0 && guess < GUESS_LIMIT);
	}

	
	function startGame(uint8 guess) 
		ifAvailable 
		payable 
	{	
		betOwner = msg.sender;
		betValue = msg.value;

		playersList.push(msg.sender);
	}

	
	function betIn(uint8 guess)
		ifStarted
		checkValue
		payable 
	{
		playersList.push(msg.sender);		
	}

	
	function endGame()
		ifStarted
		checkOwner
	{
		state = State.Finished;
		requestRandom(GUESS_LIMIT);
		
	}	
	
	function generateResults(uint number) 
		ifFinished
	{

		uint totalValue = betValue * playersList.length;
		
		for (uint i = 0 ; i < playersList.length; ++i) {
			if (to	
		}	


	}
	

	
	function requestRandom(uint x) internal {
		uint countRandom = 1;
		uint delay = 0;
		uint callbackGas = 2000000;
		bytes32 queryId = oraclize_newRandomDSQuery(delay, N, callbackGas);
	}

	// Results from oracle
	function __callback(
		bytes32 _queryId,
		string memory _result,
		bytes memory _proof
	) public {
		require (msg.sender == oraclize_cbAddress());
		require (oraclize_randomDS_proofVerify_returnCode(_queryId, _result, _proof) == 0);
		uint result = uint(keccak256(abi.encodePacked(_result))) % GUESS_LIMIT;
	    generateResults(result);	
	}

	function update() 
		payable 
		

}
