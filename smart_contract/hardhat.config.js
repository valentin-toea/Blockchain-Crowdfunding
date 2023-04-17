require("@nomiclabs/hardhat-waffle");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: "https://eth-rinkeby.alchemyapi.io/v2/eon0OeKCv2yWQG_KUFQ89fqcuJA4QwDQ",
      accounts: [
        "4f8a439ea08658d92387faa93a114a6615441916dcf31005eed6ec906d42d3b9",
      ],
    },
  },
};
