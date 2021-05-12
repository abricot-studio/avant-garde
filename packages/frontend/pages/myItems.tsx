import Layout from '../components/Layout'
import SEO from '../components/utils/SEO'
import { Button, Heading, Box } from '../components/ui'
import React, { useEffect } from 'react'
import { wrapUrqlClient } from '../lib/graphql'
import { useRouter } from 'next/router'
import { defaultMyTokensQueryVariables, useMyTokens } from '../hooks/tokens'
import Tokens from '../components/tokens/Tokens'
import Link from 'next/link'
import { useEthers } from '@usedapp/core'
import { useWalletSelector } from '../lib/WalletSelector/context'

const seoData = {
  title: 'My tokens',
}

const MyTokensPage: React.FC = () => {

  const { isConnecting } = useWalletSelector()
  const { account } = useEthers()
  const router = useRouter()
  const { tokens, fetching, error } = useMyTokens({
    ...defaultMyTokensQueryVariables,
    address: account
  })

  useEffect(() => {

    if(!isConnecting && !account){

      router.push(`/`)

    }

  }, [isConnecting, account])

  if(!account) {

    return (<div></div>)

  }

  return (
    <Layout>
      <SEO data={seoData} />
      <Heading
        textAlign="center"
        mb={8}
      >My items</Heading>
      <Tokens
        tokens={tokens}
        fetching={fetching}
        error={error}
        mine
      />

      {
        <Box
          align="center"
          mt={12}
        >
          <Link passHref href="/gallery">
            <Button
              as="a"
              variant="outline"
              borderRadius="1rem"
              border="2px"
              borderColor="#3DDCC9"
              color="#3DDCC9"
              bgColor="white"
              px={24}
              rounded="full"
              _hover={{}}
              _active={{}}
            >Discover the gallery</Button>
          </Link>
        </Box>
      }

    </Layout>
  )
}

export default wrapUrqlClient(MyTokensPage);
