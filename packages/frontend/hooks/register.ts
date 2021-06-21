import { useEthers } from '@usedapp/core'
import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { useToast } from '../components/ui'
import config from '../config'
import * as ga from '../lib/ga'
import { useAuth } from './auth'

const registerApi = axios.create({
  baseURL: config.registerUrl,
})

export enum RegisterStatus {
  SUCCESS = 'success',
  ERROR = 'error',
}

export interface Register {
  status: RegisterStatus
  message: string
}

const registrationCache = {}

export const useRegister = () => {
  const { account } = useEthers()

  const [registrationResult, setRegistrationResult] = useState<Register | null>(
    null
  )
  const [isRegistring, setIsRegistring] = useState<boolean>(false)
  const toast = useToast()
  const { token, auth, isAuthenticating } = useAuth()

  useEffect(() => {
    if (!account || !registrationCache[account]) {
      setRegistrationResult(null)
    } else {
      setRegistrationResult(registrationCache[account])
    }
    setIsRegistring(false)
  }, [account])

  const register = useCallback(() => {
    if (!account) {
      throw new Error('cannot register if not connected 👎')
    }
    setIsRegistring(true)
    if (!token && config.registerAuth) {
      auth()
      return
    }
    ga.event({
      action: 'register_pending',
      params: {
        event_category: 'registration',
        event_label: 'register_pending',
        value: '1',
      },
    })
    registerApi({
      method: 'POST',
      data: {
        address: account,
        token,
      },
    })
      .then((result) => {
        setRegistrationResult(result.data)
        setIsRegistring(false)
        registrationCache[account] = result.data
        toast({
          title:
            result.data.message === 'address already register'
              ? '🔥 Registration done'
              : '🔥 Registration success',
          description:
            result.data.message === 'address already register'
              ? `You're already on the list!`
              : `You're on the list!`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
        ga.event({
          action:
            result.data.message === 'address already register'
              ? 'register_already_success'
              : 'register_success',
          params: {
            event_category: 'registration',
            event_label:
              result.data.message === 'address already register'
                ? 'register_already_success'
                : 'register_success',
            value: '1',
          },
        })
        return false
      })
      .catch((error) => {
        console.error(error)
        setRegistrationResult(null)
        setIsRegistring(false)
        toast({
          title: '⚠️ Registration error',
          description:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
        ga.event({
          action: 'register_failed',
          params: {
            event_category: 'registration',
            event_label: 'register_failed',
            value: '1',
          },
        })
      })
  }, [account, token])

  useEffect(() => {
    if (!token && !isAuthenticating) {
      setIsRegistring(false)
    } else if (account && token && !registrationResult) {
      register()
    }
  }, [account, token, isAuthenticating, registrationResult])

  return { register, isRegistring, registrationResult }
}
