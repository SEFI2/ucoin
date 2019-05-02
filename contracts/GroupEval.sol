

pragma solidity ^0.5.0;

import "./oraclize/oraclizeAPI.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";



contract GroupEval is usingOraclize {
	using SafeMath for uint256;

		
	enum State { 
			Available, 
			Deposit,
			Evaluation
	}
	
	struct Student {
		string name;
		uint points;
		address addr;
	}


	State public state;

	Student [] studentsList;
	address groupLeader;

	uint256 totalValue;
	uint256 depositAmount;
	uint256 totalPoints;

	
	mapping (address => bool) voted;
	mapping (address => bool) member;

	
	
	constructor () public {
	}
	
	
	modifier ifAvailableState { 
		require (state == State.Available);
		_;
	}

	modifier ifDepositState {
		require (state == State.Deposit);
		_;	
	}

	modifier ifEvaluationState {
		require (state == State.Evaluation);
		_;
	}

	modifier checkDeposit (uint256 amount) {
		require (amount == depositAmount);
		_;
	}
	
	modifier ifLeader {
		require(msg.sender == groupLeader);
		_;
	}






	function startEvaluation(uint256 amount) 
		public
		ifAvailableState 
	{	
		groupLeader = msg.sender;
		depositAmount = amount;
		state = State.Deposit;
	}



	function deposit(uint256 value, string memory name)
		public	
		ifDepositState
		checkDeposit(value)

	{
		totalValue = totalValue.add(value);
		Student memory st = Student(value, name, msg.sender);
		studentsList.push(st);			
		member[msg.sender] = true;
	}
	


	function closeDeposit() 
		public 
		ifLeader
		ifDepositState

	{
		state = State.Evaluation;
	}


	function findStudent (string memory name)
   		public		
		returns (int) 
	{
		for (int i = 0 ; i < studentsList.length ; ++i) {
			if (studentsList[i].name == name) { 
				return i;
			}	
		}
		return -1;
	}

	function evaluate(uint points, string memory name) 
		public	
		ifEvaluationState
	{
		require(member[msg.sender] == false);
		require(points < 10);
		int studentIdx = findStudent(name);
		require(studentIdx != -1);
		Student memory s = studentsList[studentIdx];

		require (voted[msg.sender][s.addr] == false);
		
		studentsList[studentIdx].points = s.points.add(points);
		totalPoints = totalPoints.add(points);

		voted[msg.sender][s.addr] = true;
	} 

	function endEvaluation()
		public 
		ifLeader
		ifEvaluationState
	{
			
		for (uint i = 0 ; i < studentsList.length ; ++i) {
			uint256 amountToReceive = totalValue.mul(studentsList[i].points).div(totalPoints);
			// _transfer (studentsList[i].addr, amountToReceive);
		}
		state = State.Available;
	}	
}









































