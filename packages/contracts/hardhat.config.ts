import { HardhatUserConfig } from "hardhat/config";
import '@nomiclabs/hardhat-waffle'

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
