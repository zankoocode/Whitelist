require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });

const GOERLI = process.env.GOERLI;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: GOERLI,
      accounts: [PRIVATE_KEY],
    },
  },
};