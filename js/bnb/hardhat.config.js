require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    bnb: {
      url: process.env.RPC_KEY,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  },

  // // We don<t need following ethescan block for deployment, but we need it for smart contract verification (upload).
  etherscan: {
    apiKey: process.env.ETHERSCAN_KEY,
  },
};
