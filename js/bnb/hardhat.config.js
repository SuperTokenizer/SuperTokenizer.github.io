require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    bnb: {
      url: 'https://bsc.getblock.io/c9ab71b2-f363-4225-833c-b299c292bcb2/testnet/',
      accounts: [`0x1efa61372264b615f88b5c77935a43b074a66dd68a43ccb5c3eaf917918e6d44`],
    },
  },

  // // We don<t need following ethescan block for deployment, but we need it for smart contract verification (upload).
  etherscan: {
    apiKey: process.env.ETHERSCAN_KEY,
  },
};
