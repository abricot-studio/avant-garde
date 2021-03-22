import 'dotenv/config'
import { HardhatUserConfig } from 'hardhat/types'
import '@nomiclabs/hardhat-waffle'
import 'hardhat-deploy'
import 'hardhat-deploy-ethers'
// import 'hardhat-gas-reporter'
import 'hardhat-tracer'
import 'solidity-coverage'

const config: HardhatUserConfig = {
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
    local: {
      url: `http://localhost:8545`,
      accounts: ['0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'] //hardhat 0
    },
    ropsten: {
      url: `https://eth-ropsten.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [`0x${process.env.ROPSTEN_PRIVATE_KEY}`]
    }
  },
}

export default config
