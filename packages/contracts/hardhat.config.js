require('@nomiclabs/hardhat-waffle');

task('accounts', 'Prints the list of accounts', async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task('sample', 'Deploy contract and create some tokens', async () => {
  const accounts = await ethers.getSigners();
  const Contract = await ethers.getContractFactory('ArbArt');
  const contract = await Contract.deploy();

  await contract.connect(accounts[0]).mint('aze');
  await contract.connect(accounts[1]).mint('rty');
});

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: '0.8.1'
      }
    ]
  }
}
