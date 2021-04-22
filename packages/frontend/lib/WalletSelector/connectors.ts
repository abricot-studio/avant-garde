import { ChainId } from '@usedapp/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

import { DAppConfig } from '../web3'

const injected = new InjectedConnector({ supportedChainIds: DAppConfig.supportedChains })

export const walletconnect = new WalletConnectConnector({
  rpc: { 1: DAppConfig.readOnlyUrls[ChainId.Mainnet]},
  qrcode: true,
  pollingInterval: 15000
})

export const connectors = {
  injected,
  walletconnect,
}
