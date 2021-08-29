import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import Layout from '../components/Layout'
import Tokens from '../components/tokens/Tokens'
import { Heading } from '../components/ui'
import SEO from '../components/utils/SEO'
import config from '../config'
import {
  defaultTokensQueryVariables,
  TokensQuery,
  useTokens,
} from '../hooks/tokens'
import { getSsrClient } from '../lib/graphql'

const seoData = {
  title: 'Gallery',
}

const Gallery: React.FC = () => {
  const { tokens, fetching, error } = useTokens({
    ...defaultTokensQueryVariables,
  })
  const router = useRouter()
  useEffect(() => {
    if (config.whitelistMode) {
      router.replace(`/`)
    }
  }, [])

  if (config.whitelistMode) {
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
          Newly Minted
        </Heading>
        <Tokens tokens={tokens} fetching={fetching} error={error} />
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

  await ssrClient.query(TokensQuery, {
    first: 5,
  }).toPromise()

  return {
    props: {
      urqlState: ssrCache.extractData(),
    },
    revalidate: 30,
  }
}

export default Gallery
