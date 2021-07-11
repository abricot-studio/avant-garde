import { useEthers } from '@usedapp/core'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
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
import { ImageGeneration, useImageGeneration } from './generation'
import { Invite, useInvite } from './invite'
import { AvantGardeToken, useToken } from './tokens'

export type IAuthContext = {
  auth: () => void
  isAuthenticating: boolean
  session: string
  invites: Invite[]
  inviteCode: string
  setInviteCode: Function
  isFetchingInvites: boolean
  generateImage: Function
  isGeneratingImage: boolean
  generationResult: ImageGeneration | null
  errorGenerating: Error | null
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
  inviteCode: '',
  setInviteCode: () => {},
  isFetchingInvites: false,
  generateImage: () => {},
  isGeneratingImage: false,
  generationResult: null,
  errorGenerating: null,
  accountToken: null,
  accountTokenError: null,
  accountTokenFetching: false,
  accountTokenStartPollingMint: null,
  accountTokenStartPollingBurn: null,
})

export const AuthContextProvider = wrapUrqlClient(({ children }) => {
  const toast = useToast()
  const { account, library, connector } = useEthers()
  const {
    token: accountToken,
    fetching: accountTokenFetching,
    error: accountTokenError,
    startPollingMint: accountTokenStartPollingMint,
    startPollingBurn: accountTokenStartPollingBurn,
  } = useToken(account)
  const {
    invites,
    setInvites,
    getInvites,
    isFetchingInvites,
    inviteCode,
    setInviteCode,
  } = useInvite()
  const {
    generateImage,
    isGenerating: isGeneratingImage,
    generationResult,
    errorGenerating,
  } = useImageGeneration()
  const [session, setSession] = useState<string>(null)
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false)

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
      getInvites(account, session, accountToken)
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

  return (
    <AuthContext.Provider
      value={{
        auth,
        isAuthenticating,
        session,
        invites,
        inviteCode,
        setInviteCode,
        isFetchingInvites,
        generateImage,
        isGeneratingImage,
        generationResult,
        errorGenerating,
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
