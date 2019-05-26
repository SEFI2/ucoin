import "openzeppelin-solidity/contracts/math/SafeMath.sol";
//import "./oraclizeAPI.sol";
import './UCoin.sol';

contract Lottery {
	using SafeMath for uint256;

	UCoin public ucoin;
	bool ucoinInit;


	mapping (uint => Game) gameTable;
	mapping (bytes32 => uint) queryToGame;

	uint gameIDCounter = 1000;
	uint256 MIN_DEPOSIT_AMOUNT = 10;
	address creator;


	constructor () public {
		creator = msg.sender;
		//OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);

		//oraclize_setProof(proofType_Ledger);
	}
	
	modifier onlyCreator {
		require (msg.sender == creator);
		_;
	}

	function initUCoinAddress(address UCoinAddress) 
		onlyCreator 
		public {
		ucoin = UCoin(UCoinAddress);
		ucoinInit = true;
	}
		
	struct Game {
		address gameLeader;
		mapping (uint => address) playerList;
		uint playerCurIdx;

		uint256 depositAmount;
		bool exists;
	}

	
	modifier ifucoinInit {
		require (ucoinInit == true, "UCoin is not initialized");
		_;
	}	

	modifier ifGameExists (uint gameID) {
		require (gameTable[gameID].exists == true, "Given groupID doesn't exist");
		_;
	}
	modifier ifGameLeader(uint gameID) {
		require (gameTable[gameID].gameLeader == msg.sender, "Sender must be a leader of a group");
		_;
	}


	function sendToken(address user, uint256 val) 
		private returns (bool) {
		return ucoin.transfer(user, val);
	}
	
	function receiveToken(address user, uint256 val) 
		private returns (bool) {
		return ucoin.receiveToken(user, val);
	}

	function getBalance(address user) 
		private returns (uint256) {
		return ucoin.balanceOf(user);	
	}
	
	event playerRegistered(address player);
	event announceGameID(uint gameID);
	event debuggerEvent(string msg);


	function registerPlayer(uint gameID) 
		private {
		Game storage g = gameTable[gameID];

		require (getBalance(msg.sender) >= g.depositAmount, "Balance must be greater than depositAmount");
		require(receiveToken(msg.sender, g.depositAmount), "Cannot receiveToken");

		gameTable[gameID].playerList[g.playerCurIdx] = msg.sender;
		g.playerCurIdx ++;		
	}	

	function generateGameID () 
		private returns (uint) {
		return gameIDCounter ++;
	}

	function initGame(uint256 amount) 
		public
		ifucoinInit
	{	
		emit debuggerEvent("Initializing Game");
		require(amount > MIN_DEPOSIT_AMOUNT, "Required amount is less than MIN_DEPOSIT_AMOUNT");
		require (getBalance(msg.sender) >= amount, "Balance is less than promised deposit");

		uint gameID = generateGameID();
			
		Game memory g;
		g.gameLeader = msg.sender;
		g.depositAmount = amount;
		g.exists = true;
		gameTable[gameID] = g;
		registerPlayer(gameID);	

		emit announceGameID(gameID);	
	}
	
	
	function deposit(uint gameID)
		public	
		ifGameExists(gameID)
	{
		registerPlayer(gameID);		
	}
   
	uint seed = 0;
	function random(Game storage g) internal returns (uint) {
    	seed = uint(keccak256(abi.encodePacked(g.playerList[g.playerCurIdx - 1], seed, now)));
    	return seed % g.playerCurIdx;
    }

	function endGame(uint gameID)
		public 
		ifGameExists(gameID)
		ifGameLeader(gameID)
	{
		Game storage g = gameTable[gameID];

    	uint randomNumber = random(g);
							
		uint256 amountToSend = g.depositAmount.mul(g.playerCurIdx);
		
		sendToken(g.playerList[randomNumber], amountToSend);

		for (uint i = 0 ; i < g.playerCurIdx ; ++i) {
			delete gameTable[gameID].playerList[i];
		}		
		delete gameTable[gameID];
	
	}

	
    /*
	function endGame(uint gameID)
	 	public 
	 	ifGameExists(gameID)
		ifGameLeader(gameID)
	
	{
		Game storage g = gameTable[gameID];

		uint N = 7; 
        uint delay = 0; 
        uint callbackGas = 200000; 
        bytes32 queryId = oraclize_newRandomDSQuery(delay, N, callbackGas);
		
		queryToGame[queryId] = gameID;
		gameTable[gameID].exists = false;

	}

	
	function __callback(
        bytes32 _queryId,
        string memory _result,
        bytes memory _proof
    )
        public
    {
        require(msg.sender == oraclize_cbAddress());
        require(oraclize_randomDS_proofVerify__returnCode(_queryId, _result, _proof) == 0);
       	require(queryToGame[_queryId] >= 1000);
				
		uint gameID = queryToGame[_queryId];
		
		Game storage g = gameTable[gameID];

		uint maxRange = g.playerCurIdx;
       	uint randomNumber = uint(keccak256(abi.encodePacked(_result))) % maxRange;
		
		uint256 amountToSend = g.depositAmount.mul(g.playerCurIdx);
		sendToken(g.playerList[randomNumber], amountToSend);

		for (uint i = 0 ; i < g.playerCurIdx ; ++i) {
			delete gameTable[gameID].playerList[i];
		}		
		delete gameTable[gameID];
	}	
	*/
}









