import React from 'react'
import Layout from '../components/Layout'
import Tokens from '../components/tokens/Tokens'
import { Heading } from '../components/ui'
import SEO from '../components/utils/SEO'
import {
  defaultTokensQueryVariables,
  TokensQuery,
  useTokens,
} from '../hooks/tokens'
import { getSsrClient, wrapUrqlClient } from '../lib/graphql'

const seoData = {
  title: 'Gallery',
}

const Gallery: React.FC = () => {
  const { tokens, fetching, error } = useTokens({
    ...defaultTokensQueryVariables,
  })
  return (
    <>
      <SEO data={seoData} />
      <Layout>
        <Heading
          textAlign="center"
          mb={8}
        >
          Newly Minted
        </Heading>
        <Tokens tokens={tokens} fetching={fetching} error={error} />
      </Layout>
    </>
  )
}

export const getStaticProps = async () => {
  const [ssrClient, ssrCache] = getSsrClient()

  await ssrClient.query(TokensQuery, defaultTokensQueryVariables).toPromise()

  return {
    props: {
      urqlState: ssrCache.extractData(),
    },
    revalidate: 30,
  }
}

export default wrapUrqlClient(Gallery)
