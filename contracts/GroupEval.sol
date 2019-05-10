

pragma solidity ^0.5.0;

import "./oraclize/oraclizeAPI.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./UCoin.sol";



contract GroupEval is usingOraclize {
	using SafeMath for uint256;

	UCoin ucoin;

	mapping (uint => Group) groupTable;
	uint groupIDCounter = 0;
	uint256 MIN_DEPOSIT_AMOUNT = 10;

	constructor (address ucoinAddress) public {
		ucoin = UCoin(ucoinAddress);
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
		Member [] memberList; 
		uint256 depositAmount;
		uint maxPointsToUse;
		uint totalPoints;
		bool exists;
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
		return true;
	}
	
	function receiveToken(address user, uint256 val) 
		private returns (bool) {
		return true;
	}

	function getBalance(address user) 
		private returns (uint256) {
		return 0;	
	}


	function registerMember(uint groupID, string memory name) 
		private returns (bool) {
		Group storage g = groupTable[groupID];
		
		require (getBalance(msg.sender) >= g.depositAmount);
		require(receiveToken(msg.sender, g.depositAmount));
		require (findStudentName(g, name) == -1);

		Member memory member = Member(name, msg.sender, 0, 0);
		g.memberList.push(member);		
	
		//emit memberRegistered(name, msg.sender);
	
		return true;
	}	

	function generateGroupID () 
		private returns (uint) {
		return groupIDCounter ++;
	}

	function initEvaluation(uint256 amount, string memory name) 
		public
	{	
		require(amount > MIN_DEPOSIT_AMOUNT);
		require (getBalance(msg.sender) >= amount);

		uint groupID = generateGroupID();
			
		Group memory g;
		g.groupLeader = msg.sender;
		g.depositAmount = amount;
		g.state = State.Deposit;
		g.exists = true;
		groupTable[groupID] = g;
		
		require(registerMember(groupID, name));	
		
		// emit signalGroupID(groupID);	
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
		
		Group memory g = groupTable[groupID];
		g.state = State.Evaluation;
		// specify the max amount of points that a group member can use
		g.maxPointsToUse = g.memberList.length;
		// emit signalMaxPoints(g.maxPointsToUse);
	}


	function findStudentName (Group memory g, string memory name)
   		private		
		returns (int) {
		for (int i = 0 ; i < g.memberList.length ; ++i) {
			if (g.memberList[uint(i)].name == name) { 
				return i;
			}	
		}
		return -1;
	}

	function findStudentAddress(Group memory g, address addr) 
		private 
		returns (int) {
		for (int i = 0 ; i < g.memberList.length ; ++i) {
			if (g.memberList[uint(i)].addr == addr) { 
				return i;
			}	
		}
		return -1;
	}

	function evaluate(uint groupID, uint points, string memory name) 
		public	
		ifGroupExists(groupID)
		ifEvaluationState(groupID)
	{

		Group memory g = groupTable[groupID];
		
		// check if sender is registered to group
		int pointsSenderIdx = findStudentAddress(g, msg.sender);	
		require(pointsSenderIdx != -1);	
		Member memory pointsSender = g.memberList[uint(pointsSenderIdx)];

		// check if the sender of points can sent
		// requested amount of points
		require(points + pointsSender.sentPoints < g.maxPointsToUse);
		
		// check if the receiver exists with given name
		int pointsReceiverIdx = findStudentName(g, name);
		require(pointsReceiverIdx != -1);
		Member memory pointsReceiver = g.memberList[uint(pointsReceiverIdx)];
		

		pointsReceiver.points += points;
		g.totalPoints += points;
	} 


	function endEvaluation(uint groupID)
		public 
		ifGroupExists(groupID)
		ifGroupLeader(groupID)
		ifEvaluationState(groupID)
	{
		Group memory g = groupTable[groupID];
		
		for (int i = 0 ; i < g.memberList.length ; ++i) {
			sendToken(g.memberList[i].addr, g.depositAmount); 
		}	
		
		delete groupTable[groupID];

		g.state = State.Available;
	}	
}









































