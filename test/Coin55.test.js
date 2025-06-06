const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("Coin55", function () {
  let coin55, owner, user;

  beforeEach(async () => {
    [owner, user] = await ethers.getSigners();
    const Coin55 = await ethers.getContractFactory("Coin55");
    coin55 = await upgrades.deployProxy(Coin55, [], { initializer: "initialize", kind: "uups" });
    await coin55.deployed();
  });

  it("should deploy with correct name and symbol", async () => {
    expect(await coin55.name()).to.equal("Nexonith");
    expect(await coin55.symbol()).to.equal("MRB");
  });

  it("should mint initial supply to owner", async () => {
    const supply = await coin55.totalSupply();
    expect(await coin55.balanceOf(owner.address)).to.equal(supply);
  });

  it("should allow user to burn tokens with tax", async () => {
    await coin55.transfer(user.address, ethers.utils.parseEther("1000"));
    await coin55.connect(user).burn(ethers.utils.parseEther("1000"));

    const remaining = await coin55.balanceOf(user.address);
    expect(remaining).to.equal(0);

    const deadAddress = "0x000000000000000000000000000000000000dEaD";
    const tax = ethers.utils.parseEther("20"); // 2%
    expect(await coin55.balanceOf(deadAddress)).to.equal(tax);
  });

  it("should allow owner to set burn tax rate", async () => {
    await coin55.setBurnTaxRate(5);
    expect(await coin55.burnTaxRate()).to.equal(5);
  });
});
