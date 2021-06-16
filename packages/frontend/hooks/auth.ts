import { useEthers } from '@usedapp/core'
import { useCallback, useEffect, useState } from 'react'
import { useToast } from '../components/ui'
import config from '../config'
import * as ga from '../lib/ga'
import * as store from '../lib/store'

export const useAuth = () => {
  const { account, library } = useEthers()
  const [token, setToken] = useState<string>(null)
  const toast = useToast()

  useEffect(() => {
    if (account && store.get(`auth:${account}`)) {
      setToken(store.get(`auth:${account}`))
    } else {
      setToken(null)
    }
  }, [account])

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

    const signer = library.getSigner(account)
    signer
      .signMessage(config.authMessage)
      .then((signedMessage) => {
        setToken(signedMessage)
        store.set(`auth:${account}`, signedMessage)
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
  }, [account, token])

  return { auth, token }
}
