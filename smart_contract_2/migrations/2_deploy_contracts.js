var CrowdfundingContract = artifacts.require("./Crowdfunding.sol");
var ProjectContract = artifacts.require("./Project.sol");

module.exports = function (deployer) {
  deployer.deploy(CrowdfundingContract);
  deployer.deploy(ProjectContract);
};
