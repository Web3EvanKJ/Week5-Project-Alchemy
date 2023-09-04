require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.17",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/cydbBiewNjXAFDLuvi5uPaAkyBnN0Qr_",
      accounts: [
        "020ea8372e40b46dd8b8e924a49b05217edb0ff621853f3dc7da115734aafdf9",
      ],
    },
  },
  paths: {
    artifacts: "./app/src/artifacts",
  },
};
