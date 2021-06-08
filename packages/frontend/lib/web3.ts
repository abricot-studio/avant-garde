import { ChainId, Config } from '@usedapp/core'
import config from '../config'

export const DAppConfig: Config = {
  supportedChains: Object.keys(ChainId)
    .map((k) => ChainId[k])
    .concat([
      56, // bsc
      97, // bsc testnet
      137, // polygon
      80001, // polygon testnet
    ]),
  readOnlyChainId: config.defaultChainId,
  readOnlyUrls: {
    [ChainId.Mainnet]: `https://mainnet.infura.io/v3/${config.infuraId}`,
    [ChainId.Rinkeby]: `https://rinkeby.infura.io/v3/${config.infuraId}`,
    [ChainId.Kovan]: `https://kovan.infura.io/v3/${config.infuraId}`,
    // [ChainId.Localhost]: `http://localhost:8545`,
  },
}
