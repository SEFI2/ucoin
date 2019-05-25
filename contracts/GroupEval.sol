import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import './UCoin.sol';

contract GroupEval {
	using SafeMath for uint256;

	UCoin public ucoin;
	bool ucoinInit;


	mapping (uint => Group) groupTable;
	uint groupIDCounter = 0;
	uint256 MIN_DEPOSIT_AMOUNT = 10;
	address creator;
	

	constructor () public {
		creator = msg.sender;
	}
	
//	constructor(address UCoinAddress) 
//		public {
//		ucoin = UCoin(UCoinAddress);
//		ucoinInit = true;
//	}

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

	enum State { 
			Available, 
			Deposit,
			Evaluation
	}
		
	struct Member {
		string name;
		address addr;
		uint receivedPoints;
		uint sentPoints;
	}

	struct Group {
		State state;
		address groupLeader;
		mapping (uint => Member) memberList;
		uint memberCurIdx;

		uint256 depositAmount;
		uint maxPointsToUse;
		uint totalPoints;
		bool exists;
	}

    function compareStrings (string memory a, string memory b) 
	   private pure returns (bool) {
  		return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }
	
	modifier ifucoinInit {
		require (ucoinInit == true);
		_;
	}	

	modifier ifGroupExists (uint groupID) {
		require (groupTable[groupID].exists == false);
		_;
	}
	modifier ifGroupLeader(uint groupID) {
		require (groupTable[groupID].groupLeader == msg.sender);
		_;
	}


	modifier ifDepositState(uint groupID) {
		require (groupTable[groupID].state == State.Deposit);
		_;
	}
	modifier ifEvaluationState(uint groupID) {
		require (groupTable[groupID].state == State.Evaluation);
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
	
	event memberRegistered(string name, address member);
	event announceGroupID(uint groupID);
	event debuggerEvent(string msg);


	function registerMember(uint groupID, string memory name) 
		private returns (bool) {
		Group storage g = groupTable[groupID];
		emit debuggerEvent("in register member");

		require (getBalance(msg.sender) >= g.depositAmount, "Balance must be greater than depositAmount");
		require(receiveToken(msg.sender, g.depositAmount), "Cannot receiveToken");
		//require (findStudentName(g, name) == -1, name);

		Member memory member = Member(name, msg.sender, 0, 0);
		groupTable[groupID].memberList[g.memberCurIdx] = member;
		g.memberCurIdx ++;		
	
		emit memberRegistered(name, msg.sender);
	
		return true;
	}	

	function generateGroupID () 
		private returns (uint) {
		return groupIDCounter ++;
	}

	function initEvaluation(uint256 amount, string memory name) 
		public
		ifucoinInit
	{	
		emit debuggerEvent("initEvaluation");
		require(amount > MIN_DEPOSIT_AMOUNT, "Required amount is less than MIN_DEPOSIT_AMOUNT");
		require (getBalance(msg.sender) >= amount, "Balance is less than promised deposit");

		uint groupID = generateGroupID();
			
		Group memory g;
		g.groupLeader = msg.sender;
		g.depositAmount = amount;
		g.state = State.Deposit;
		g.exists = true;
		groupTable[groupID] = g;
		
		//registerMember(groupID, name);		
		require(registerMember(groupID, name), "Cannot register the member");	
		
		emit announceGroupID(groupID);	
	}
	
	
	function deposit(uint groupID, string memory name)
		public	
		ifGroupExists(groupID)
		ifGroupLeader(groupID)
		ifDepositState(groupID)
	{
		require (registerMember(groupID, name));		
	}
	


	function closeDeposit(uint groupID) 
		public 
		ifGroupExists(groupID)
		ifGroupLeader(groupID)
		ifDepositState (groupID)
	{
		
		Group storage g = groupTable[groupID];
		g.state = State.Evaluation;
		// specify the max amount of points that a group member can use
		g.maxPointsToUse = g.memberCurIdx;
		// emit signalMaxPoints(g.maxPointsToUse);
	}


	function findStudentName (Group storage g, string memory name)
   		private	
		view	
		returns (int) {

		for (uint i = 0 ; i < g.memberCurIdx ; ++i) {
			if (compareStrings(g.memberList[i].name, name)) { 
				return int(i);
			}	
		}
		return -1;
	}

	function findStudentAddress(Group storage g, address addr) 
		private
	    view	
		returns (int) {
		for (uint i = 0 ; i < g.memberCurIdx ; ++i) {
			if (g.memberList[i].addr == addr) { 
				return int(i);
			}	
		}
		return -1;
	}

	function evaluate(uint groupID, uint points, string memory name) 
		public	
		ifGroupExists(groupID)
		ifEvaluationState(groupID)
	{

		Group storage g = groupTable[groupID];
		
		// check if sender is registered to group
		int pointsSenderIdx = findStudentAddress(g, msg.sender);	
		require(pointsSenderIdx != -1);	
		Member storage pointsSender = g.memberList[uint(pointsSenderIdx)];

		// check if the sender of points can sent
		// requested amount of points
		require(points + pointsSender.sentPoints < g.maxPointsToUse);
		
		// check if the receiver exists with given name
		int pointsReceiverIdx = findStudentName(g, name);
		require(pointsReceiverIdx != -1);
		Member storage pointsReceiver = g.memberList[uint(pointsReceiverIdx)];
		

		pointsSender.sentPoints += points;
		pointsReceiver.receivedPoints += points;
		g.totalPoints += points;
	} 


	function endEvaluation(uint groupID)
		public 
		ifGroupExists(groupID)
		ifGroupLeader(groupID)
		ifEvaluationState(groupID)
	{
		Group storage g = groupTable[groupID];
		
		for (uint i = 0 ; i < g.memberCurIdx ; ++i) {
			sendToken(g.memberList[i].addr, g.depositAmount); 
		}	
		
		for (uint i = 0 ; i < g.memberCurIdx ; ++i) {
			delete groupTable[groupID].memberList[i];
		}		
		delete groupTable[groupID];
		g.state = State.Available;
	}	
}









