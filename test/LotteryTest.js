
const truffleAssert = require('truffle-assertions');

const LotteryContract = artifacts.require('./Lottery.sol');
const UCoinContract = artifacts.require('./UCoin.sol');

contract('Lottery',  (accounts) => {
		let Lottery
		let UCoin
		let gameID;
		const depositAmount = 123

		it("should init UCoin address", async () => {
			Lottery = await LotteryContract.deployed()
			UCoin = await UCoinContract.deployed()
			await Lottery.initUCoinAddress(UCoin.address)
			console.log(UCoin.address)
		});


		it("should transfer tokesn", async() => {
//			await UCoin.transfer(accounts[1], 10000)
//			await UCoin.transfer(accounts[2], 10000)
		})

	
		it('init game', async () =>  {
				const contract_balance = parseInt(await UCoin.balanceOf(Lottery.address))
				const user_balance = parseInt(await UCoin.balanceOf(accounts[0]))
				
				const initGameTx = await Lottery.initGame(depositAmount)

				truffleAssert.eventEmitted(initGameTx, 'announceGameID', (ev) => {
					gameID = parseInt(ev['gameID'])
					return true
				});

				const after_contract_balance = parseInt(await UCoin.balanceOf(Lottery.address))
				const after_user_balance = parseInt(await UCoin.balanceOf(accounts[0]))

				assert(gameID == 1000)
				assert (contract_balance == after_contract_balance - depositAmount)
				assert (user_balance == after_user_balance + depositAmount)
		});

		it("should deposit to contract", async() => {
			const contract_balance = parseInt(await UCoin.balanceOf(Lottery.address))
			const murat_balance = parseInt(await UCoin.balanceOf(accounts[1]))
			const kim_balance = parseInt(await UCoin.balanceOf(accounts[2]))

			await Lottery.deposit(gameID, {from: accounts[1]})
			await Lottery.deposit(gameID, {from: accounts[2]})
			
			const after_contract_balance = parseInt(await UCoin.balanceOf(Lottery.address))
			const after_murat_balance = parseInt(await UCoin.balanceOf(accounts[1]))
			const after_kim_balance = parseInt(await UCoin.balanceOf(accounts[2]))
			
			assert (contract_balance == after_contract_balance - 2 * depositAmount)
		
			assert (murat_balance == after_murat_balance + depositAmount)
			assert (kim_balance == after_kim_balance + depositAmount)
	
		})
		
		it("should end game", async() => {
			const contract_balance = parseInt(await UCoin.balanceOf(Lottery.address))	

			const kadyr_balance = parseInt(await UCoin.balanceOf(accounts[0]))
			const murat_balance = parseInt(await UCoin.balanceOf(accounts[1]))
			const kim_balance = parseInt(await UCoin.balanceOf(accounts[2]))
		
			await Lottery.endGame(gameID)		
			
			const after_contract_balance = parseInt(await UCoin.balanceOf(Lottery.address))
			
			const after_kadyr_balance = parseInt(await UCoin.balanceOf(accounts[0]))
			const after_murat_balance = parseInt(await UCoin.balanceOf(accounts[1]))
			const after_kim_balance = parseInt(await UCoin.balanceOf(accounts[2]))
			
			const totalDeposit = depositAmount * 3

			assert(contract_balance == 3 * depositAmount)
			assert(after_contract_balance == 0)

			console.log("Contract balance= " + contract_balance)
			console.log("Kadyr balance= " + kadyr_balance)
			console.log("Murat balance= " + murat_balance)
			console.log("Kim balance= " + kim_balance)
			
			console.log("Contract balance= " + after_contract_balance)
			console.log("Kadyr balance= " + after_kadyr_balance)
			console.log("Murat balance= " + after_murat_balance)
			console.log("Kim balance= " + after_kim_balance)


	})
		

});
