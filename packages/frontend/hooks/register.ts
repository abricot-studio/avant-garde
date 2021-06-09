import { useEthers } from '@usedapp/core'
import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { useToast } from '../components/ui'
import config from '../config'

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

  const [registrationResult, setRegistrationResult] = useState<Register | null>(null)
  const [isRegistring, setIsRegistring] = useState<boolean>(false)
  const toast = useToast()

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
    registerApi({
      method: 'POST',
      data: { address: account },
    }).then((result) => {
      setRegistrationResult(result.data)
      setIsRegistring(false)
      registrationCache[account] = result.data
      toast({
        title: result.data.message === 'address already register' ? '🔥 Registration done' : '🔥 Registration success',
        description: result.data.message === 'address already register' ? `You're already on the list!` : `You're on the list!`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      return false
    }).catch( (error) => {
      setRegistrationResult(null)
      console.error(error)
      toast({
        title: '⚠️ Registration error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      setIsRegistring(false)
    })
  }, [account])

  return { register, isRegistring, registrationResult }
}
