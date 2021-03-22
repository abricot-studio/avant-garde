import { HardhatUserConfig } from 'hardhat/config'
import '@nomiclabs/hardhat-waffle'
import 'solidity-coverage'
import 'hardhat-tracer'

const config: HardhatUserConfig = {
  /*
  networks: {
    hardhat: {
      mining: {
        auto: false,
        interval: 5000
      }
    }
  },
  */
  solidity: {
    compilers: [
      {
        version: '0.8.1',
      },
    ],
  },
}

export default config
