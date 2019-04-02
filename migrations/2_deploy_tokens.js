const UCoin = artifacts.require('./UCoin.sol');

module.exports = (deployer) => {
  deployer.deploy(UCoin, 10000, 'Simon Bucks', 1, 'SBX');
};
