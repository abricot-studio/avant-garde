import React from 'react'
import Layout from '../components/Layout'
import { Home } from '../components/pages/Home'
import SEO from '../components/utils/SEO'
import config from '../config'
import { defaultTokensQueryVariables, TokensQuery } from '../hooks/tokens'
import { getSsrClient } from '../lib/graphql'

const seoData = {}

const Index: React.FC = () => {
  return (
    <>
      <SEO data={seoData} />
      <Layout>
        <Home />
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

export default Index
