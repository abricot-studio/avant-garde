import { useEthers } from '@usedapp/core'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import * as ga from '../ga'
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
      ga.event({
        action: 'disconnect',
        params: {
          event_category: 'connection',
          event_label: 'success',
          value: '1',
        },
      })
      clearWalletConnect()
      deactivate()
      setIsConnecting(false)
      setModalOpen(false)
    }, [deactivate])

    const connect = useCallback(
      (connector) => {
        ga.event({
          action: 'connection_pending',
          params: {
            event_category: 'connection',
            event_label: 'connect_pending',
            value: '1',
          },
        })
        setIsConnecting(true)
        activate(connector, undefined, true)
          .then(() => {
            ga.event({
              action: 'connection_success',
              params: {
                event_category: 'connection',
                event_label: 'connection_success',
                value: '1',
              },
            })
            setModalOpen(false)
            setIsConnecting(false)
          })
          .catch((error) => {
            ga.event({
              action: 'connection_failed',
              params: {
                event_category: 'connection',
                event_label: 'connection_failed',
                value: '1',
              },
            })
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
              ga.event({
                action: 'connection_authorized',
                params: {
                  event_category: 'connection',
                  event_label: 'connection_authorized',
                  value: '1',
                },
              })
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
