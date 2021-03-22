import 'dotenv/config'
import { HardhatUserConfig } from 'hardhat/types'
import '@nomiclabs/hardhat-waffle'
import "@nomiclabs/hardhat-etherscan"
import 'hardhat-deploy'
import 'hardhat-deploy-ethers'
import 'hardhat-gas-reporter'
import { removeConsoleLog } from 'hardhat-preprocessor'
import 'hardhat-tracer'
import 'solidity-coverage'
import { parseUnits } from 'ethers/lib/utils'

const config: HardhatUserConfig = {
  preprocess: {
    eachLine: removeConsoleLog( (hre) => hre.network.name !== 'localhost' && hre.network.name !== 'hardhat'),
  },
  gasReporter: {
    currency: 'EUR',
    gasPrice: parseUnits('5', 'gwei').toNumber()
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  solidity: {
    compilers: [
      {
        version: '0.8.1',
      },
    ],
  },
  namedAccounts: {
    deployer: 0,
  },
  networks: {
    localhost: {
      url: `http://localhost:8545`,
      accounts: ['0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'] //hardhat 0
    },
    rinkeby: {
      url: `https://eth-ropsten.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      gasPrice: parseUnits('5', 'gwei').toNumber(),
      accounts: [`0x${process.env.RINKEBY_PRIVATE_KEY || 'ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'}`]
    }
  },
}

export default config
