async function main() {
  const QuestoStorage = await ethers.getContractFactory("QuestoStorage");

  // Start deployment, returning a promise that resolves to a contract object
  const questo_storage = await QuestoStorage.deploy();
  console.log("Contract deployed to address:", questo_storage.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
