import { useEthers } from '@usedapp/core'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { remove } from '../store'
import { connectors } from './connectors'

export const clearWalletConnect = (): void => {
  remove('walletconnect')
  remove('WALLETCONNECT_DEEPLINK_CHOICE')
  connectors.walletconnect.walletConnectProvider = undefined
}

export type IWalletSelectorContext = {
  open: () => void
  close: () => void
  connect: (AbstractConnector) => void
  disconnect: () => void
  isConnecting: boolean
  modalOpen: boolean
}

export const WalletSelectorContext = createContext<IWalletSelectorContext>({
  open: () => {},
  close: () => {},
  connect: (_) => {},
  disconnect: () => {},
  isConnecting: true,
  modalOpen: false,
})

interface Web3ContextProviderOptions {
  children: React.ReactElement
}

export const WalletSelectorContextProvider: React.FC<Web3ContextProviderOptions> =
  ({ children }) => {
    const [isConnecting, setIsConnecting] = useState<boolean>(true)
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const calledOnce = useRef<boolean>(false)
    const { activate, deactivate } = useEthers()

    const open = useCallback(() => {
      setModalOpen(true)
    }, [])

    const close = useCallback(() => {
      if (!isConnecting) {
        setModalOpen(false)
      }
    }, [isConnecting])

    const disconnect = useCallback(() => {
      clearWalletConnect()
      deactivate()
      setIsConnecting(false)
      setModalOpen(false)
    }, [deactivate])

    const connect = useCallback(
      (connector) => {
        setIsConnecting(true)
        activate(connector, undefined, true)
          .then(() => {
            setModalOpen(false)
            setIsConnecting(false)
          })
          .catch((error) => {
            console.error(error)
            setIsConnecting(false)
            disconnect()
          })
      },
      [activate, disconnect]
    )

    useEffect(() => {
      if (calledOnce.current) return
      calledOnce.current = true

      connectors.injected.isAuthorized().then((isAuthorized) => {
        if (isAuthorized) {
          activate(connectors.injected)
            .catch(console.error)
            .finally(() => {
              setIsConnecting(false)
            })
        } else {
          setIsConnecting(false)
        }
      })
    }, [])

    return (
      <WalletSelectorContext.Provider
        value={{
          open,
          close,
          connect,
          disconnect,
          isConnecting,
          modalOpen,
        }}
      >
        {children}
      </WalletSelectorContext.Provider>
    )
  }

export const useWalletSelector = (): IWalletSelectorContext =>
  useContext(WalletSelectorContext)
