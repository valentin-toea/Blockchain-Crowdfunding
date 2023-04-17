const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();

    expect(await greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});

describe("CampainFactory", function () {
  it("Should create campaign contract and store correct data", async function () {
    /*.............*/

    const testCampaign = {
      title: "Test Campaign",
      description: "this is a test campaign",
      availableFor: 5, // days
      goal: 10000,
      minimumContribution: 100,
    };

    const tx = await campaignFactory.startProject(
      testCampaign.title,
      testCampaign.description,
      testCampaign.availableFor,
      testCampaign.goal,
      testCampaign.minimumContribution
    );

    await tx.wait();

    const allCampaigns = await campaignFactory.returnAllProjects();
    const Campaign = await ethers.getContractFactory(
      "contracts/Crowdfunding.sol:Project"
    );

    const campaign = await Campaign.attach(allCampaigns[0]);
    const createdCampaign = await campaign.getDetails();

    expect(createdCampaign).to.exist;
    expect(createdCampaign.projectTitle).to.eq(testCampaign.title);

    const daysFromContract = (() => {
      return (
        (ethers.BigNumber.from(createdCampaign.deadline).toNumber() -
          new Date() / 1000) /
        (24 * 60 * 60)
      );
    })();

    expect(daysFromContract).to.be.approximately(
      testCampaign.availableFor,
      0.9
    );
  });
});
