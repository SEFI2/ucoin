const UCoin = artifacts.require('./UCoin.sol');
const GroupEval = artifacts.require('./GroupEval.sol');


module.exports = async (deployer) => {
	let deployGroupEval = await deployer.deploy(GroupEval);	
	await deployer.deploy(UCoin, [GroupEval.address]);
};                           

