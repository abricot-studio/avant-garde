import { useEthers } from '@usedapp/core'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { useToast } from '../components/ui'
import config from '../config'
const inviteApi = axios.create({
  baseURL: `${config.baseUrl}/api/invite`,
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
  const router = useRouter()
  const toast = useToast()
  const { account } = useEthers()
  const [invites, setInvites] = useState<Invite[]>([])
  const [inviteCode, setInviteCode] = useState(
    (router.query.inviteCode as string) || ''
  )
  const [isFetchingInvites, setIsFetchingInvites] = useState<boolean>(false)

  useEffect(() => {
    if (!account) {
      setInvites([])
    }
  }, [account])

  useEffect(() => {
    if (router.query.inviteCode && router.query.inviteCode.length > 0) {
      setInviteCode(router.query.inviteCode as string)
    }
  }, [router.query])

  const getInvites = useCallback(
    (account, session, token) => {
      if (!account || !session || !token) {
        throw new Error(
          'cannot get invites if not connected or token not minted 👎'
        )
      }
      if (isFetchingInvites) {
        return
      }
      setIsFetchingInvites(true)
      inviteApi({
        method: 'POST',
        data: {
          address: account,
          token: session,
        },
      })
        .then((result) => {
          if (result.data.status === InviteStatus.SUCCESS) {
            setInvites(result.data.inviteCodes)
            setIsFetchingInvites(false)
            return true
          }
        })
        .catch((error) => {
          console.error(error)
          setInvites([])
          setIsFetchingInvites(false)
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
    },
    [isFetchingInvites]
  )

  return {
    invites,
    setInvites,
    getInvites,
    isFetchingInvites,
    inviteCode,
    setInviteCode,
  }
}
