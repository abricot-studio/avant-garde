import Layout from '../components/Layout'
import SEO from '../components/utils/SEO'
import { Button, Heading, Box, ActionButton, Center } from '../components/ui'
import React, { useEffect } from 'react'
import { useWeb3 } from '../contexts/Web3Context'
import { wrapUrqlClient } from '../lib/graphql'
import { useRouter } from 'next/router'
import { defaultMyTokensQueryVariables, useCanMint, useMyTokens } from '../hooks/tokens'
import Tokens from '../components/pages/Tokens'
import Link from 'next/link'

const seoData = {
  title: 'My tokens',
}

const MyTokensPage: React.FC = () => {

  const { account, isConnecting } = useWeb3()
  const router = useRouter()
  const { tokens, fetching, error } = useMyTokens({
    ...defaultMyTokensQueryVariables,
    address: account?.address
  })
  const canMint = useCanMint();

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
      >Your items</Heading>
      <Tokens
        tokens={tokens}
        fetching={fetching}
        error={error}
        mine
      />

      {
        canMint ?
        <Center mt={8}>
          <Link passHref href="/generator">
            <ActionButton
              as="a"
            >Generate yours</ActionButton>
          </Link>
        </Center>
          :
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
