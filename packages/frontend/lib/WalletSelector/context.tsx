import { useEthers } from '@usedapp/core'
import { UnsupportedChainIdError } from '@web3-react/core'
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector'
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from '@web3-react/walletconnect-connector'
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
            setModalOpen(false)
            setIsConnecting(false)
            ga.event({
              action: 'connection_success',
              params: {
                event_category: 'connection',
                event_label: 'connection_success',
                value: '1',
              },
            })
          })
          .catch((error) => {
            console.log(error)
            if (error instanceof NoEthereumProviderError) {
              ga.event({
                action: 'connection_failed_no_provider',
                params: {
                  event_category: 'connection',
                  event_label: 'connection_failed_no_provider',
                  value: '1',
                },
              })
            } else if (error instanceof UnsupportedChainIdError) {
              ga.event({
                action: 'connection_failed_unsupported_chain',
                params: {
                  event_category: 'connection',
                  event_label: 'connection_failed_unsupported_chain',
                  value: '1',
                },
              })
            } else if (
              error instanceof UserRejectedRequestErrorInjected ||
              error instanceof UserRejectedRequestErrorWalletConnect
            ) {
              ga.event({
                action: 'connection_failed_reject_authorize',
                params: {
                  event_category: 'connection',
                  event_label: 'connection_failed_reject_authorize',
                  value: '1',
                },
              })
            } else {
              ga.event({
                action: 'connection_failed',
                params: {
                  event_category: 'connection',
                  event_label: 'connection_failed',
                  value: '1',
                },
              })
            }

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
              ga.event({
                action: 'connection_authorized',
                params: {
                  event_category: 'connection',
                  event_label: 'connection_authorized',
                  value: '1',
                },
              })
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
