import React from 'react'
import Layout from '../components/Layout'
import Hero from '../components/pages/Hero'
import { Box, Heading, Wrap, WrapItem } from '../components/ui'
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
        <Wrap spacing={16} justify="center" mx={24}>
          <WrapItem flexDirection="column" alignItems="center">
            <Box fontWeight={700} fontSize={24}>
              {minted}
            </Box>
            <Box>Minted</Box>
          </WrapItem>
          <WrapItem flexDirection="column" alignItems="center">
            <Box fontWeight={700} fontSize={24}>
              Ξ {balancePool}
            </Box>
            <Box>Pool</Box>
          </WrapItem>
          <WrapItem flexDirection="column" alignItems="center">
            <Box fontWeight={700} fontSize={24}>
              {holders}
            </Box>
            <Box>Holders</Box>
          </WrapItem>
          <WrapItem flexDirection="column" alignItems="center">
            <Box fontWeight={700} fontSize={24}>
              {burned}
            </Box>
            <Box>Burned</Box>
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
