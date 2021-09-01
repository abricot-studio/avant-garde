import React from 'react'
import Layout from '../components/Layout'
import Hero from '../components/pages/Hero'
import { Box, Flex, Heading, Wrap, WrapItem } from '../components/ui'
import SEO from '../components/utils/SEO'
import config from '../config'
import { useHistory } from '../hooks/history'
import { defaultTokensQueryVariables, TokensQuery } from '../hooks/tokens'
import { getSsrClient } from '../lib/graphql'

const seoData = {}

const Home: React.FC = () => {
  const { minted, balancePool, holders, burned } = useHistory()
  return (
    <>
      <SEO data={seoData} />
      <Layout>
        <Heading color="transparent" mb={8} fontFamily="Poppins, sans-serif">
          Home
        </Heading>
        <Hero />
        <Wrap spacing={4} justify="center" mx={12}>
          <WrapItem alignItems="center">
            <Flex flexDirection="column" alignItems="center" mx={4}>
              <Box fontWeight={700} fontSize={24}>
                {minted}
              </Box>
              <Box>Minted</Box>
            </Flex>
            <Flex flexDirection="column" alignItems="center" mx={4}>
              <Box fontWeight={700} fontSize={24}>
                Ξ {balancePool}
              </Box>
              <Box>Pool</Box>
            </Flex>
          </WrapItem>
          <WrapItem  alignItems="center">
            <Flex flexDirection="column" alignItems="center" mx={4}>
              <Box fontWeight={700} fontSize={24}>
                {holders}
              </Box>
              <Box>Holders</Box>
            </Flex>
            <Flex flexDirection="column" alignItems="center" mx={4}>
              <Box fontWeight={700} fontSize={24}>
                {burned}
              </Box>
              <Box>Burned</Box>
            </Flex>
          </WrapItem>
        </Wrap>
      </Layout>
    </>
  )
}

export const getStaticProps = async () => {
  if (config.whitelistMode) {
    return {
      props: {},
    }
  }
  const [ssrClient, ssrCache] = getSsrClient()

  await ssrClient.query(TokensQuery, defaultTokensQueryVariables).toPromise()

  return {
    props: {
      urqlState: ssrCache.extractData(),
    },
    revalidate: 30,
  }
}

export default Home
