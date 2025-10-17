const hre = require("hardhat");

async function main() {
  console.log("Deploying Greeter contract to Base Sepolia...");

  const initialGreeting = "Hello from Base Sepolia";

  const Greeter = await hre.ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy(initialGreeting);

  await greeter.waitForDeployment();

  const address = await greeter.getAddress();

  console.log(`Greeter contract deployed to: ${address}`);
  console.log(`Initial greeting: "${initialGreeting}"`);
  console.log(`\nVerify contract with:`);
  console.log(`npx hardhat verify --network baseSepolia ${address} "${initialGreeting}"`);

  // Save deployment info
  const fs = require("fs");
  const deploymentInfo = {
    network: "baseSepolia",
    contractAddress: address,
    deployer: (await hre.ethers.getSigners())[0].address,
    initialGreeting: initialGreeting,
    timestamp: new Date().toISOString()
  };

  fs.writeFileSync(
    "deployment-info.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("\nDeployment info saved to deployment-info.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
