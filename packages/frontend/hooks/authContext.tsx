import { useEthers } from '@usedapp/core'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import axios from 'axios'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useToast } from '../components/ui'
import config from '../config'
import * as ga from '../lib/ga'
import { wrapUrqlClient } from '../lib/graphql'
import * as store from '../lib/store'
import { AvantGardeToken, useToken } from './tokens'
const inviteApi = axios.create({
  baseURL: config.inviteUrl,
})

export enum InviteStatus {
  SUCCESS = 'success',
  ERROR = 'error',
}

export type IAuthContext = {
  auth: () => void
  isAuthenticating: boolean
  session: string
  invites: Invite[]
  isFetchingInvites: boolean
  accountToken: AvantGardeToken | null
  accountTokenError: Error | null
  accountTokenFetching: boolean
  accountTokenStartPollingMint: any
  accountTokenStartPollingBurn: any
}

export const AuthContext = createContext<IAuthContext>({
  auth: () => {},
  isAuthenticating: false,
  session: null,
  invites: [],
  isFetchingInvites: false,
  accountToken: null,
  accountTokenError: null,
  accountTokenFetching: false,
  accountTokenStartPollingMint: null,
  accountTokenStartPollingBurn: null,
})

export interface Invite {
  code: string
  used: boolean
}
export const AuthContextProvider = wrapUrqlClient(({ children }) => {
  const { account, library, connector } = useEthers()
  const {
    token: accountToken,
    fetching: accountTokenFetching,
    error: accountTokenError,
    startPollingMint: accountTokenStartPollingMint,
    startPollingBurn: accountTokenStartPollingBurn,
  } = useToken(account)
  const [session, setSession] = useState<string>(null)
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false)
  const [invites, setInvites] = useState<Invite[]>([])
  const [isFetchingInvites, setIsFetchingInvites] = useState<boolean>(false)
  const toast = useToast()

  useEffect(() => {
    const storeAuth = store.get(`auth:${account}`)
    if (account && storeAuth && storeAuth !== session && !isAuthenticating) {
      setIsAuthenticating(false)
      setSession(storeAuth)
      setInvites([])
    } else if (
      !config.whitelistMode &&
      account &&
      accountToken &&
      accountToken.id === account.toLowerCase() &&
      !session &&
      !storeAuth &&
      !isAuthenticating &&
      invites.length === 0
    ) {
      setInvites([])
      auth()
    } else if (
      !config.whitelistMode &&
      account &&
      session &&
      storeAuth &&
      accountToken &&
      accountToken.id === account.toLowerCase() &&
      invites.length === 0
    ) {
      setInvites([])
      getInvites()
    } else if (!account || !storeAuth) {
      setIsAuthenticating(false)
      setSession(null)
      setInvites([])
    }
  }, [account, session, accountToken])

  const auth = useCallback(() => {
    if (!account) {
      throw new Error('cannot auth if not connected 👎')
    }

    setIsAuthenticating(true)

    const signer = library.getSigner()
    if (connector instanceof WalletConnectConnector) {
      ga.event({
        action: 'auth_pending_wallet_connect',
        params: {
          event_category: 'authentication',
          event_label: 'auth_pending_wallet_connect',
          value: '1',
        },
      })
      // see https://github.com/WalletConnect/walletconnect-monorepo/issues/462
      connector.walletConnectProvider.connector
        .signPersonalMessage([config.authMessage, account.toLowerCase()])
        .then((signedMessage) => {
          setIsAuthenticating(false)
          store.set(`auth:${account}`, signedMessage)
          setSession(signedMessage)
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
          setIsAuthenticating(false)
          store.set(`auth:${account}`, signedMessage)
          setSession(signedMessage)
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

  const getInvites = useCallback(() => {
    if (!account || !accountToken || !session) {
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
  }, [account, session, accountToken, isFetchingInvites])

  return (
    <AuthContext.Provider
      value={{
        auth,
        isAuthenticating,
        session,
        invites,
        isFetchingInvites,
        accountToken,
        accountTokenFetching,
        accountTokenError,
        accountTokenStartPollingMint,
        accountTokenStartPollingBurn,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
})

export const useAuth = (): IAuthContext => useContext(AuthContext)
