import { useEthers } from '@usedapp/core'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import Layout from '../components/Layout'
import Tokens from '../components/tokens/Tokens'
import { ActionButton, Box, Heading } from '../components/ui'
import SEO from '../components/utils/SEO'
import config from '../config'
import {
  defaultMyTokensQueryVariables,
  useMyTokens,
  useToken,
} from '../hooks/tokens'
import { wrapUrqlClient } from '../lib/graphql'
import { useWalletSelector } from '../lib/WalletSelector/context'

const seoData = {
  title: 'My tokens',
}

const MyTokensPage: React.FC = () => {
  const { isConnecting } = useWalletSelector()
  const { account } = useEthers()
  const router = useRouter()
  const { token } = useToken(account)
  const { tokens, fetching, error } = useMyTokens({
    ...defaultMyTokensQueryVariables,
    address: account,
  })

  useEffect(() => {
    if ((!isConnecting && !account) || config.whitelistMode) {
      router.push(`/`)
    }
  }, [isConnecting, account])

  if (!account || config.whitelistMode) {
    return <div></div>
  }

  return (
    <>
      <SEO data={seoData} />
      <Layout>
        <Heading
          textAlign="center"
          mb={8}
          fontFamily="Poppins, sans-serif"
          as="h1"
        >
          My items
        </Heading>
        <Tokens tokens={tokens} fetching={fetching} error={error} mine />
        <Box align="center" mt={12}>
          {token ? (
            <Link passHref href="/gallery">
              <ActionButton as="a" w="12rem">
                Gallery
              </ActionButton>
            </Link>
          ) : (
            <Link passHref href="/generator">
              <ActionButton as="a" w="12rem">
                Generate yours
              </ActionButton>
            </Link>
          )}
        </Box>
      </Layout>
    </>
  )
}

export default wrapUrqlClient(MyTokensPage)
