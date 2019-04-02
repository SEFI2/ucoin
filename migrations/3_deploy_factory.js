const UCoinFactory =
  artifacts.require('./UCoinFactory.sol');

module.exports = (deployer) => {
  deployer.deploy(UCoinFactory);
};
