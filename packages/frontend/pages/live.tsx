import Link from 'next/link'
import React from 'react'
import { ChartPrice } from '../components/ChartPrice'
import { History } from '../components/History'
import Layout from '../components/Layout'
import { ActionButton, Center, Container } from '../components/ui'
import SEO from '../components/utils/SEO'
import config from '../config'
import { defaultTokensQueryVariables, TokensQuery } from '../hooks/tokens'
import { getSsrClient } from '../lib/graphql'
const seoData = {
  title: 'Live',
}

const Index: React.FC = () => {
  return (
    <>
      <SEO data={seoData} />
      <Layout>
        <History />
        <Container w="90%" maxW="container.md" mt={8}>
          <ChartPrice />
        </Container>
        <Center mt={16}>
          <Link passHref href="/generator">
            <ActionButton as="a" w="12rem">
              Generate yours
            </ActionButton>
          </Link>
        </Center>
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
