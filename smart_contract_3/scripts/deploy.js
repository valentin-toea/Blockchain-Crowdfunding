async function main() {
  // We get the contract to deploy
  const Crowdfunding = await ethers.getContractFactory("Crowdfunding");
  const crowdfundingInstance = await Crowdfunding.deploy();

  await crowdfundingInstance.deployed();

  console.log("Greeter deployed to:", crowdfundingInstance.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
