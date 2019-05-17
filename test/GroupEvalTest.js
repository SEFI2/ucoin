

const GroupEvalContract = artifacts.require('./GroupEval.sol');
const UCoinContract = artifacts.require('./UCoin.sol');

contract('GroupEval', (accounts) => {
		it("should init UCoin address", async () => {
			const UCoin = UCoinContract.deployed()
			const GroupEval = GroupEvalContract.deployed()
			console.log(GroupEval.ucoin)

			await GroupEval.initUCoinAddress(UCoin.address);
			console.log(GroupEval.ucoin)
				
		});


});
