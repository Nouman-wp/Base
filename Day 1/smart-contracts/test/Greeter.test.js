const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Greeter", function () {
  let greeter;
  let owner;
  let addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const Greeter = await ethers.getContractFactory("Greeter");
    greeter = await Greeter.deploy("Hello, Base!");
    await greeter.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await greeter.owner()).to.equal(owner.address);
    });

    it("Should set the initial greeting", async function () {
      expect(await greeter.greet()).to.equal("Hello, Base!");
    });
  });

  describe("Greet", function () {
    it("Should return the current greeting", async function () {
      expect(await greeter.greet()).to.equal("Hello, Base!");
    });
  });

  describe("SetGreeting", function () {
    it("Should update the greeting", async function () {
      await greeter.setGreeting("New greeting");
      expect(await greeter.greet()).to.equal("New greeting");
    });

    it("Should emit GreetingChanged event", async function () {
      await expect(greeter.setGreeting("New greeting"))
        .to.emit(greeter, "GreetingChanged")
        .withArgs("Hello, Base!", "New greeting", owner.address);
    });

    it("Should allow anyone to change greeting", async function () {
      await greeter.connect(addr1).setGreeting("Changed by addr1");
      expect(await greeter.greet()).to.equal("Changed by addr1");
    });
  });

  describe("GreetWithName", function () {
    it("Should return personalized greeting", async function () {
      const result = await greeter.greetWithName("Alice");
      expect(result).to.equal("Hello, Base!, Alice!");
    });

    it("Should work with different names", async function () {
      const result = await greeter.greetWithName("Bob");
      expect(result).to.equal("Hello, Base!, Bob!");
    });
  });
});
