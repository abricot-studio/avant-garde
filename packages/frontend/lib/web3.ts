import { Config, ChainId } from '@usedapp/core';

import config from '../config'

export const DAppConfig: Config = {
  supportedChains: [ChainId.Mainnet, ChainId.Rinkeby, ChainId.Kovan, ChainId.Localhost],
  readOnlyChainId: config.defaultChainId,
  readOnlyUrls: {
    [ChainId.Mainnet]: `https://mainnet.infura.io/v3/${config.infuraId}`,
    [ChainId.Rinkeby]: `https://rinkeby.infura.io/v3/${config.infuraId}`,
    [ChainId.Kovan]: `https://kovan.infura.io/v3/${config.infuraId}`,
    [ChainId.Localhost]: `http://localhost:8545`,
  },
}
