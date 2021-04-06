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
  connect: () => Promise<void>
  disconnect: () => void
  isConnecting: boolean
  account: Web3Account | null
}

export const Web3Context = createContext<Web3ContextType>({
  connect: async () => {},
  disconnect: () => undefined,
  isConnecting: false,
  account: null,
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

interface Web3Account {
  provider: providers.Web3Provider
  address: string,
  chainId: number,
}

interface Web3ContextProviderOptions {
  children: React.ReactElement
}

export const Web3ContextProvider: React.FC<Web3ContextProviderOptions> = ({
                                                                            children,
                                                                          }) => {
  const [web3AccountData, setWeb3AccountData] = useState<Web3Account | null>(null)
  const [isConnecting, setIsConnecting] = useState<boolean>(true)
  const calledOnce = useRef<boolean>(false)

  const disconnect = useCallback(() => {
    setWeb3AccountData(null)
    setIsConnecting(false)
    web3Modal.clearCachedProvider()
    clearWalletConnect()
  }, [])


  const setWeb3Provider = useCallback((ethereum: providers.ExternalProvider) => {
    const provider = new providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    signer.getAddress()
      .then(address =>
        provider.getNetwork()
          .then(network => {
            setWeb3AccountData({
              provider,
              address,
              chainId: network.chainId,
            })
            setIsConnecting(false)
          })
      )
      .catch(console.error);
  }, []);


  const connect = useCallback(async () => {
    setIsConnecting(true)

    try {
      const modalProvider = await web3Modal.connect()
      setWeb3Provider(modalProvider);

      if(modalProvider.on) {
        modalProvider.on('accountsChanged', () => setWeb3Provider(modalProvider))
        modalProvider.on('chainChanged', () => setWeb3Provider(modalProvider))
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
    } else {
      setIsConnecting(false)
    }
  }, [connect])

  return (
    <Web3Context.Provider
      value={{
        account: web3AccountData,
        connect,
        disconnect,
        isConnecting,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

export const useWeb3 = (): Web3ContextType => useContext(Web3Context)
