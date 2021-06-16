import { useEthers } from '@usedapp/core'
import { useCallback, useEffect, useState } from 'react'
import { useToast } from '../components/ui'
import config from '../config'
import * as ga from '../lib/ga'
import * as store from '../lib/store'

export const useAuth = () => {
  const { account, library } = useEthers()
  const [token, setToken] = useState<string>(null)
  const [isConnecting, setIsConnecting] = useState<boolean>(false)
  const toast = useToast()

  useEffect(() => {
    if (account && store.get(`auth:${account}`) !== token && !isConnecting) {
      setIsConnecting(false)
      setToken(store.get(`auth:${account}`))
    } else if (!token) {
      setToken(null)
    }
  }, [account, token])

  const auth = useCallback(() => {
    if (!account) {
      throw new Error('cannot register if not connected 👎')
    }
    ga.event({
      action: 'auth_pending',
      params: {
        event_category: 'authentication',
        event_label: 'auth_pending',
        value: '1',
      },
    })
    setIsConnecting(true)
    const signer = library.getSigner(account)
    signer
      .signMessage(config.authMessage)
      .then((signedMessage) => {
        setIsConnecting(false)
        store.set(`auth:${account}`, signedMessage)
        setToken(signedMessage)
        ga.event({
          action: 'auth_success',
          params: {
            event_category: 'authentication',
            event_label: 'auth_success',
            value: '1',
          },
        })
      })
      .catch((error) => {
        console.error('Authentication error', error)
        setIsConnecting(false)
        toast({
          title: '⚠️ Authentication error',
          description: error.message,
          status: 'error',
          duration: 20000,
          isClosable: true,
        })
        ga.event({
          action: 'auth_failed',
          params: {
            event_category: 'authentication',
            event_label: 'auth_failed',
            value: '1',
          },
        })
      })
  }, [account])

  return { auth, isConnecting, token }
}
