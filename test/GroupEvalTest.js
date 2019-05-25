

const GroupEvalContract = artifacts.require('./GroupEval.sol');
const UCoinContract = artifacts.require('./UCoin.sol');

contract('GroupEval', (accounts) => {
		let GroupEval
		let UCoin
		it("should init UCoin address", async () => {
			GroupEval = await GroupEvalContract.deployed()
			UCoin = await UCoinContract.deployed()
			await GroupEval.initUCoinAddress(UCoin.address)
			console.log(UCoin.address)
		});
			
		it('init evaluation', async () =>  {
				const contract_balance = parseInt(await UCoin.balanceOf(GroupEval.address))
				const user_balance = parseInt(await UCoin.balanceOf(accounts[0]))
				
				await GroupEval.initEvaluation(123, 'kadyr')
				
				const after_contract_balance = parseInt(await UCoin.balanceOf(GroupEval.address))
				const after_user_balance = parseInt(await UCoin.balanceOf(accounts[0]))
				
				//console.log(contract_balance)
				//console.log(after_contract_balance)
				
				//console.log(user_balance)
				//console.log(after_user_balance)



				assert (contract_balance == after_contract_balance - 123)
				assert (user_balance == after_user_balance + 123)
	
		});


});
