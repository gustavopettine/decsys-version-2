import { ethers } from "hardhat";

async function main() {
  const KYCStorage = await ethers.getContractFactory("KYCStorage");
  const kycStorage = await KYCStorage.deploy();

  await kycStorage.deployed();
  // await kycStorage.deployTransaction.wait();

  console.log("KYCStorage deployed to:", kycStorage.address);
  console.log("KYCStorage deployed to HASH:", kycStorage.deployTransaction.hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
