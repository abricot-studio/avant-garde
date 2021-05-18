import { ChainId } from '@usedapp/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import config from '../../config'

const injected = new InjectedConnector({
  supportedChainIds: Object.keys(ChainId)
    .map((k) => ChainId[k])
    .concat([
      56, // bsc
      97, // bsc testnet
      137, // polygon
      80001, // polygon testnet
    ]),
})

export const walletconnect = new WalletConnectConnector({
  rpc: {
    // [ChainId.Mainnet]: `https://mainnet.infura.io/v3/${config.infuraId}`,
    [ChainId.Rinkeby]: `https://rinkeby.infura.io/v3/${config.infuraId}`,
    [ChainId.Kovan]: `https://kovan.infura.io/v3/${config.infuraId}`,
    // [ChainId.Localhost]: `http://localhost:8545`,
  },
  qrcode: true,
  pollingInterval: 15000,
})

export const connectors = {
  injected,
  walletconnect,
}
