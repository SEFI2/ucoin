
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
			//await UCoin.transfer(accounts[1], 10000)
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

			await GroupEval.deposit(groupID, "murat", {from: accounts[1]})
			
			const after_contract_balance = parseInt(await UCoin.balanceOf(GroupEval.address))
			const after_murat_balance = parseInt(await UCoin.balanceOf(accounts[1]))
			
			assert (contract_balance == after_contract_balance - 1 * depositAmount)
		
			assert (murat_balance == after_murat_balance + depositAmount)
	
		})

		it("should close the deposit", async() => {
			await GroupEval.closeDeposit(groupID)
		})
			
		it("should evaluate", async() => {
			await GroupEval.evaluate(groupID, 1, "kadyr") // kadyr
			await GroupEval.evaluate(groupID, 1, "murat") // kadyr
	
			await GroupEval.evaluate(groupID, 2, "kadyr", {from: accounts[1]}) // murat	
		})
		
		it("should end evaluation", async() => {
			const contract_balance = parseInt(await UCoin.balanceOf(GroupEval.address))	

			const kadyr_balance = parseInt(await UCoin.balanceOf(accounts[0]))
			const murat_balance = parseInt(await UCoin.balanceOf(accounts[1]))
		
			await GroupEval.endEvaluation(groupID)		
			
			const after_contract_balance = parseInt(await UCoin.balanceOf(GroupEval.address))
			
			const after_kadyr_balance = parseInt(await UCoin.balanceOf(accounts[0]))
			const after_murat_balance = parseInt(await UCoin.balanceOf(accounts[1]))
			
			const totalDeposit = depositAmount * 2

			assert(contract_balance == 2 * depositAmount)
			//assert(after_contract_balance == 0)
			
			console.log("Contract balance= ", contract_balance)
			console.log("After Contract balance= ", after_contract_balance)
			
			console.log("Kadyr balance= ", kadyr_balance)
			console.log("After Kadyr balance= ", after_kadyr_balance)
			console.log("Kadyr received = ", after_kadyr_balance - kadyr_balance)
		    console.log("Kadyr need to receive = ", (3 * totalDeposit) / 4)



			console.log("Murate balance= ", murat_balance)
			console.log("After Murate balance= ", after_murat_balance)
			console.log("Murat received = ", after_murat_balance - murat_balance)
			console.log("Kadyr need to receive = ", (1 * totalDeposit) / 4)

			//assert(after_kadyr_balance - kadyr_balance == (3 * totalDeposit) / 4)
			//assert(after_murat_balance - murat_balance == (1 * totalDeposit) / 4)
		})
		

});
