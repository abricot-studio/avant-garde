import { useEthers } from '@usedapp/core'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { useToast } from '../components/ui'
import config from '../config'
import * as ga from '../lib/ga'
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
  const [errorGetInvites, setErrorGetInvites] = useState<Error | null>(null)
  const [inviteCode, setInviteCode] = useState(
    (router.query.inviteCode as string) || ''
  )
  const [isFetchingInvites, setIsFetchingInvites] = useState<boolean>(false)

  useEffect(() => {
    if (!account) {
      setInvites([])
      setErrorGetInvites(null)
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
      ga.event({
        action: 'get_invite_pending',
        params: {
          event_category: 'invite',
          event_label: 'get_invite_pending',
          value: '1',
        },
      })
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
            ga.event({
              action: 'get_invite_success',
              params: {
                event_category: 'invite',
                event_label: 'get_invite_success',
                value: '1',
              },
            })
            return true
          }
        })
        .catch((error) => {
          console.error(error)
          setInvites([])
          setIsFetchingInvites(false)
          if (error?.response?.data?.message === 'token invalid') {
            setErrorGetInvites(new Error('token_invalid'))
            ga.event({
              action: 'get_invite_error_token',
              params: {
                event_category: 'invite',
                event_label: 'get_invite_error_token',
                value: '1',
              },
            })
          } else if (error?.response?.data?.message?.length > 0) {
            setErrorGetInvites(new Error(error.response.data.message))
          } else {
            console.error(error)
            setErrorGetInvites(error)
          }
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
          ga.event({
            action: 'get_invite_error',
            params: {
              event_category: 'invite',
              event_label: 'get_invite_error',
              value: '1',
            },
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
    errorGetInvites,
    inviteCode,
    setInviteCode,
  }
}
