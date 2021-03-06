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
    icon: '/icons/metamask.svg',
    description: 'Easy-to-use browser extension.',
    color: '#E8831D',
  },
  {
    connector: connectors.walletconnect,
    name: 'WalletConnect',
    icon: '/icons/walletConnectIcon.svg',
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    color: '#4196FC',
  },
]
