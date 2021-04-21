import { Config, ChainId } from '@usedapp/core';

import config from '../config'

export const DAppConfig: Config = {
  readOnlyChainId: config.defaultChainId,
  readOnlyUrls: {
    [ChainId.Mainnet]: `https://mainnet.infura.io/v3/${config.infuraId}`,
    [ChainId.Rinkeby]: `https://rinkeby.infura.io/v3/${config.infuraId}`,
    [ChainId.Localhost]: `http://localhost:8545`,
  },
}
