
const hre = require("hardhat");

async function main() {


  const Whitelist = await hre.ethers.getContractFactory("WhitelistContract");
  const whitelist = await Whitelist.deploy();

  await whitelist.deployed();

  console.log(
    ` deployed to ${whitelist.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
