import { useEthers } from '@usedapp/core'
import { useCallback, useEffect, useState } from 'react'
import { useToast } from '../components/ui'
import config from '../config'
import * as ga from '../lib/ga'
import * as store from '../lib/store'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

export const useAuth = () => {
  const { account, library, connector } = useEthers()
  const [token, setToken] = useState<string>(null)
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false)
  const toast = useToast()

  useEffect(() => {
    if (account && store.get(`auth:${account}`) !== token && !isAuthenticating) {
      setIsAuthenticating(false)
      setToken(store.get(`auth:${account}`))
    } else if (!token) {
      setToken(null)
    }
  }, [account, token])

  const auth = useCallback(() => {
    if (!account) {
      throw new Error('cannot register if not connected 👎')
    }
    setIsAuthenticating(true)

    const signer = library.getSigner()
    if (connector instanceof WalletConnectConnector) { // see https://github.com/WalletConnect/walletconnect-monorepo/issues/462
      ga.event({
        action: 'auth_pending_wallet_connect',
        params: {
          event_category: 'authentication',
          event_label: 'auth_pending_wallet_connect',
          value: '1',
        },
      })
      connector.walletConnectProvider.connector
        .signPersonalMessage([config.authMessage, account.toLowerCase()])
        .then((signedMessage) => {
          console.log('signedMessage', signedMessage)
          setIsAuthenticating(false)
          store.set(`auth:${account}`, signedMessage)
          setToken(signedMessage)
          ga.event({
            action: 'auth_success_wallet_connect',
            params: {
              event_category: 'authentication',
              event_label: 'auth_success_wallet_connect',
              value: '1',
            },
          })
        })
        .catch((error) => {
          console.error('Authentication error', error)
          setIsAuthenticating(false)
          toast({
            title: '⚠️ Authentication error',
            description: error.message,
            status: 'error',
            duration: 20000,
            isClosable: true,
          })
          ga.event({
            action: 'auth_failed_wallet_connect',
            params: {
              event_category: 'authentication',
              event_label: 'auth_failed_wallet_connect',
              value: '1',
            },
          })
        })
    } else {
      ga.event({
        action: 'auth_pending_injected',
        params: {
          event_category: 'authentication',
          event_label: 'auth_pending_injected',
          value: '1',
        },
      })
      signer
        .signMessage(config.authMessage)
        .then((signedMessage) => {
          console.log('signedMessage', signedMessage)
          setIsAuthenticating(false)
          store.set(`auth:${account}`, signedMessage)
          setToken(signedMessage)
          ga.event({
            action: 'auth_success_injected',
            params: {
              event_category: 'authentication',
              event_label: 'auth_success_injected',
              value: '1',
            },
          })
        })
        .catch((error) => {
          console.error('Authentication error', error)
          setIsAuthenticating(false)
          toast({
            title: '⚠️ Authentication error',
            description: error.message,
            status: 'error',
            duration: 20000,
            isClosable: true,
          })
          ga.event({
            action: 'auth_failed_injected',
            params: {
              event_category: 'authentication',
              event_label: 'auth_failed_injected',
              value: '1',
            },
          })
        })
    }
  }, [account])

  return { auth, isAuthenticating, token }
}
