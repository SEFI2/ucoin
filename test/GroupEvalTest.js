
const truffleAssert = require('truffle-assertions');

const GroupEvalContract = artifacts.require('./GroupEval.sol');
const UCoinContract = artifacts.require('./UCoin.sol');

contract('GroupEval',  (accounts) => {
		let GroupEval
		let UCoin
		let groupID;
		const depositAmount = 123

		it("should init UCoin address", async () => {
			GroupEval = await GroupEvalContract.deployed()
			UCoin = await UCoinContract.deployed()
			await GroupEval.initUCoinAddress(UCoin.address)
			console.log(UCoin.address)
		});


		it("should transfer tokesn", async() => {
			await UCoin.transfer(accounts[1], 10000)
			await UCoin.transfer(accounts[2], 10000)
		})

	
		it('init evaluation', async () =>  {
				const contract_balance = parseInt(await UCoin.balanceOf(GroupEval.address))
				const user_balance = parseInt(await UCoin.balanceOf(accounts[0]))
				
				const initEvalTx = await GroupEval.initEvaluation(depositAmount, 'kadyr')
				const groupIdEvent = GroupEval.announceGroupID()

				truffleAssert.eventEmitted(initEvalTx, 'announceGroupID', (ev) => {
					groupID = parseInt(ev['groupID'])
					return true
				});

				const after_contract_balance = parseInt(await UCoin.balanceOf(GroupEval.address))
				const after_user_balance = parseInt(await UCoin.balanceOf(accounts[0]))

				assert(groupID == 1000)
				assert (contract_balance == after_contract_balance - depositAmount)
				assert (user_balance == after_user_balance + depositAmount)
		});

		it("should deposit to contract", async() => {
			const contract_balance = parseInt(await UCoin.balanceOf(GroupEval.address))
			const murat_balance = parseInt(await UCoin.balanceOf(accounts[1]))
			const kim_balance = parseInt(await UCoin.balanceOf(accounts[2]))

			await GroupEval.deposit(groupID, "murat", {from: accounts[1]})
			await GroupEval.deposit(groupID, "kim", {from: accounts[2]})
			
			const after_contract_balance = parseInt(await UCoin.balanceOf(GroupEval.address))
			const after_murat_balance = parseInt(await UCoin.balanceOf(accounts[1]))
			const after_kim_balance = parseInt(await UCoin.balanceOf(accounts[2]))
			
			assert (contract_balance == after_contract_balance - 2 * depositAmount)
		
			assert (murat_balance == after_murat_balance + depositAmount)
			assert (kim_balance == after_kim_balance + depositAmount)
	
		})

		it("should close the deposit", async() => {
			await GroupEval.closeDeposit(groupID)
		})
			
		it("should evaluate", async() => {
			await GroupEval.evaluate(groupID, 1, "kadyr") // kadyr
			await GroupEval.evaluate(groupID, 1, "murat") // kadyr
			await GroupEval.evaluate(groupID, 1, "kim") // kadyr
	
			await GroupEval.evaluate(groupID, 2, "kadyr", {from: accounts[1]}) // murat
			await GroupEval.evaluate(groupID, 1, "kim", {from: accounts[1]}) // murat

			await GroupEval.evaluate(groupID, 3, "kadyr", {from: accounts[2]}) // kim
													
		})
		
		it("should end evaluation", async() => {
			const contract_balance = parseInt(await UCoin.balanceOf(GroupEval.address))	

			const kadyr_balance = parseInt(await UCoin.balanceOf(accounts[0]))
			const murat_balance = parseInt(await UCoin.balanceOf(accounts[1]))
			const kim_balance = parseInt(await UCoin.balanceOf(accounts[2]))
		
			await GroupEval.endEvaluation(groupID)		
			
			const after_contract_balance = parseInt(await UCoin.balanceOf(GroupEval.address))
			
			const after_kadyr_balance = parseInt(await UCoin.balanceOf(accounts[0]))
			const after_murat_balance = parseInt(await UCoin.balanceOf(accounts[1]))
			const after_kim_balance = parseInt(await UCoin.balanceOf(accounts[2]))
			
			const totalDeposit = depositAmount * 3

			assert(contract_balance == 3 * depositAmount)
			assert(after_contract_balance == 0)
		
			assert(after_kadyr_balance - kadyr_balance == (6 * totalDeposit) / 9)
			assert(after_murat_balance - murat_balance == (1 * totalDeposit) / 9)
			assert(after_kim_balance - kim_balance  == (2 * totalDeposit) / 9)
		})
		

});
