const UCoin = artifacts.require('./UCoin.sol');

module.exports = (deployer) => {
  deployer.deploy(UCoin, 10000, 'UNIST Coin', 1, 'UCoin');
};
