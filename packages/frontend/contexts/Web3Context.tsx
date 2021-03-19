import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import WalletConnectProvider from '@walletconnect/web3-provider'
import { providers } from 'ethers'
import Web3Modal from 'web3modal'

import config from '../config'
import { remove } from '../lib/store'

export const clearWalletConnect = (): void => {
  remove('walletconnect')
  remove('WALLETCONNECT_DEEPLINK_CHOICE')
}

export type Web3ContextType = {
  provider: providers.Web3Provider | null
  connect: () => Promise<void>
  disconnect: () => void
  isConnecting: boolean
  isConnected: boolean
  address: string | null
}

export const Web3Context = createContext<Web3ContextType>({
  provider: null,
  connect: async () => {},
  disconnect: () => undefined,
  isConnecting: false,
  isConnected: false,
  address: null,
})

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: config.infuraId,
    },
  },
}

const web3Modal =
  typeof window !== 'undefined' &&
  new Web3Modal({
    network: 'mainnet',
    cacheProvider: true,
    providerOptions,
  })

interface ExternalEventProvider extends providers.ExternalProvider {
  on?: (any) => void
}

interface Web3ContextProviderOptions {
  children: React.ReactElement
}

export const Web3ContextProvider: React.FC<Web3ContextProviderOptions> = ({
  children,
}) => {
  const [provider, setProvider] = useState<providers.Web3Provider | null>(null)
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [isConnecting, setIsConnecting] = useState<boolean>(false)
  const [address, setAddress] = useState<string | null>(null)
  const calledOnce = useRef<boolean>(false)

  const disconnect = useCallback(() => {
    web3Modal.clearCachedProvider()
    clearWalletConnect()
    setAddress(null)
    setProvider(null)
    setIsConnecting(false)
    setIsConnected(false)
  }, [])

  const connect = useCallback(async () => {
    setIsConnecting(true)

    try {
      const modalProvider = await web3Modal.connect()
      const ethersProvider = new providers.Web3Provider(modalProvider)
      const ethAddress = await ethersProvider.getSigner().getAddress()

      setAddress(ethAddress)
      setProvider(ethersProvider)
      setIsConnecting(false)
      setIsConnected(true)

      if(modalProvider.on) {
        modalProvider.on('accountsChanged', (accounts) => {
          setAddress(accounts[0]);
        })
      }

    } catch (_) {
      setIsConnecting(false)
      disconnect()
    }
  }, [disconnect])

  useEffect(() => {
    if (calledOnce.current) return
    calledOnce.current = true

    if (web3Modal.cachedProvider) {
      connect().catch(() => undefined)
    }
  }, [connect])

  return (
    <Web3Context.Provider
      value={{
        provider,
        connect,
        disconnect,
        isConnected,
        isConnecting,
        address,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

export const useWeb3 = (): Web3ContextType => useContext(Web3Context)
