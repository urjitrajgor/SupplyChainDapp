const AssetsTracker = artifacts.require("AssetsTracker");

module.exports = function(deployer) {
  deployer.deploy(AssetsTracker);
};
