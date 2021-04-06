import Layout from '../components/Layout'
import SEO from '../components/utils/SEO'
import Tokens from '../components/pages/Tokens'
import { defaultTokensQueryVariables, TokensQuery, useTokens } from '../hooks/tokens'
import { getSsrClient, wrapUrqlClient } from '../lib/graphql'
import { Heading } from '../components/ui'
import React from 'react'

const seoData = {
  title: 'Gallery',
}

const Gallery: React.FC = () => {
  const { tokens, fetching, error } = useTokens({
    ...defaultTokensQueryVariables,
  })
  return (
    <Layout>
      <SEO data={seoData} />
      <Heading
        textAlign="center"
        mb={8}
      >Newly minted</Heading>
      <Tokens tokens={tokens} fetching={fetching} error={error}/>
    </Layout>
  )
}

export const getStaticProps = async () => {
  const [ssrClient, ssrCache] = getSsrClient();

  await ssrClient.query(
    TokensQuery,
    defaultTokensQueryVariables,
  ).toPromise();

  return {
    props: {
      urqlState: ssrCache.extractData(),
    },
    revalidate: 30,
  };
};

export default wrapUrqlClient(Gallery);

