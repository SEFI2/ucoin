const UCoin = artifacts.require('./UCoin.sol');
const GroupEval = artifacts.require('./GroupEval.sol');
const Lottery = artifacts.require('./Lottery.sol');



module.exports = async (deployer, network, accounts) => {
	let deployGroupEval = await deployer.deploy(GroupEval);	
	let deployLottery = await deployer.deploy(Lottery);	
	
	 await deployer.deploy(UCoin, [GroupEval.address, Lottery.address]);
	
	let UCoinIn = await UCoin.deployed();
	let GroupEvalIn = await GroupEval.deployed();
	let LotteryIn = await Lottery.deployed();
	
	await GroupEvalIn.initUCoinAddress(UCoinIn.address)
	await UCoinIn.transfer(accounts[1], 1000)
	await UCoinIn.transfer(accounts[2], 1000)
	await UCoinIn.transfer(accounts[3], 999997000)


};                           

