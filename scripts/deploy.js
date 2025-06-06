const { ethers, upgrades } = require("hardhat");

async function main() {
  const Coin55 = await ethers.getContractFactory("Coin55");
  console.log("Deploying Coin55 (UUPS upgradeable)...");
  const coin55 = await upgrades.deployProxy(Coin55, [], {
    initializer: "initialize",
    kind: "uups"
  });
  await coin55.deployed();
  console.log("Coin55 deployed to:", coin55.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
