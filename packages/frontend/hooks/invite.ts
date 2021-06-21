import { useEthers } from '@usedapp/core'
import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { useToast } from '../components/ui'
import config from '../config'
import { useAuth } from './auth'
import { useToken } from './tokens'

const inviteApi = axios.create({
  baseURL: config.inviteUrl,
})

export enum InviteStatus {
  SUCCESS = 'success',
  ERROR = 'error',
}

export interface Invite {
  code: string
  used: boolean
}

export const useInvite = () => {
  const { account } = useEthers()
  const { token } = useToken(account)
  const [invitesResult, setInvitesResult] = useState<Invite[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const toast = useToast()
  const { token: authToken, auth, isAuthenticating } = useAuth()

  const getInvites = useCallback(() => {
    if (!account || !token) {
      throw new Error(
        'cannot get invites if not connected or token not minted 👎'
      )
    }
    setIsLoading(true)
    if (!authToken) {
      auth()
      return
    }
    inviteApi({
      method: 'POST',
      data: {
        address: account,
        token: authToken,
      },
    })
      .then((result) => {
        if (result.data.status === InviteStatus.SUCCESS) {
          setInvitesResult(result.data.inviteCodes)
          setIsLoading(false)
          return true
        }
      })
      .catch((error) => {
        console.error(error)
        setInvitesResult(null)
        setIsLoading(false)
        toast({
          title: '⚠️ Error to get invitation',
          description:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      })
  }, [account, authToken, token])

  useEffect(() => {
    if (account && token && invitesResult && invitesResult.length === 0) {
      getInvites()
    }
  }, [account, authToken, isAuthenticating, token, invitesResult])

  return { getInvites, isLoading, invites: invitesResult }
}
