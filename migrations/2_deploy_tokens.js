const UCoin = artifacts.require('./UCoin.sol');
const GroupEval = artifacts.require('./GroupEval.sol');
const Lottery = artifacts.require('./Lottery.sol');



module.exports = async (deployer) => {
	let deployGroupEval = await deployer.deploy(GroupEval);	
	let deployLottery = await deployer.deploy(Lottery);	
	
	await deployer.deploy(UCoin, [GroupEval.address, Lottery.address]);
};                           

