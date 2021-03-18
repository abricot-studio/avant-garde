import { task, HardhatUserConfig } from "hardhat/config";
import '@nomiclabs/hardhat-waffle'

task('accounts', 'Prints the list of accounts', async (args, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})

task('sample', 'Deploy contract and create some tokens', async (args, hre) => {
  const accounts = await hre.ethers.getSigners()
  const Contract = await hre.ethers.getContractFactory('ArbArt')
  const contract = await Contract.deploy('https://ipfs.ipfs.io/')

  await contract.connect(accounts[0]).mint('aze')
  await contract.connect(accounts[1]).mint('rty')
})

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.1',
      },
    ],
  },
}
export default config;
