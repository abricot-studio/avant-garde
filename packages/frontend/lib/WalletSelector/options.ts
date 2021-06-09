import { AbstractConnector } from '@web3-react/abstract-connector'
import { connectors } from './connectors'

interface WalletOptions {
  connector?: AbstractConnector
  name: string
  icon: any
  description: string
  color: string
  primary?: true
  deepLink?: string
}

export const options: WalletOptions[] = [
  {
    connector: connectors.injected,
    name: 'MetaMask',
    icon: require('./icons/metamask.svg').default,
    description: 'Easy-to-use browser extension.',
    color: '#E8831D',
    deepLink: 'https://metamask.app.link/dapp/'
  },
  {
    connector: connectors.walletconnect,
    name: 'WalletConnect',
    icon: require('./icons/walletConnectIcon.svg').default,
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    color: '#4196FC',
  },
]
