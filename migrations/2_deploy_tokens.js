const UCoin = artifacts.require('./UCoin.sol');

module.exports = (deployer) => {
  deployer.deploy(UCoin);
};
