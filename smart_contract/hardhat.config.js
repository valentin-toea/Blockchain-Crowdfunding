require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  networks: {
    hardhat: {},
    local: {
      url: "HTTP://127.0.0.1:8545",
      accounts: [
        "78a1608a4503405bb5f8d08783ecd03342f0b0d0c69eed91b76b93a9cc7f0e8f",
        "fbcb9660802fdac2348f67f9c15aab568a101c441dc59b74d7fc7e6c96df58f8",
      ],
    },
  },
  solidity: "0.8.0",
};
