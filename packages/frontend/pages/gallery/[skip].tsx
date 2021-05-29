import React from 'react'
import Layout from '../../components/Layout'
import Tokens from '../../components/tokens/Tokens'
import { Heading } from '../../components/ui'
import SEO from '../../components/utils/SEO'
import {
  defaultTokensQueryVariables,
  TokensQuery,
  useTokens,
} from '../../hooks/tokens'
import { defaultClient, getSsrClient, wrapUrqlClient } from '../../lib/graphql'
import { useRouter } from 'next/router'
import { GetStaticPropsContext } from 'next'

const seoData = {
  title: 'Gallery',
}
type QueryParams = { skip: string }

const Gallery: React.FC = () => {
  const router = useRouter()
  const { skip } = router.query as QueryParams

  const { tokens, fetching, error } = useTokens({
    ...Object.assign({}, defaultTokensQueryVariables, { skip: parseInt(skip || '0') }),
  })
  return (
    <>
      <SEO data={seoData} />
      <Layout>
        <Heading textAlign="center" mb={8} fontFamily="Poppins, sans-serif">
          Newly Minted
        </Heading>
        <Tokens tokens={tokens} fetching={fetching} error={error} />
      </Layout>
    </>
  )
}

export const getStaticPaths = async () => {

  const { data } = await defaultClient
    .query(TokensQuery, {
      first: 50,
    })
    .toPromise()
  if (data?.avantGardeTokens) {
    return {
      paths: data.avantGardeTokens.map( (t, i) => ({
        params: { skip: i.toString() },
      })),
      fallback: true,
    }
  }

  return {
    paths: [],
    fallback: true,
  }

}

export const getStaticProps = async (
  ctx: GetStaticPropsContext<QueryParams>
) => {
  const [ssrClient, ssrCache] = getSsrClient()
  const skip = parseInt(ctx.params.skip || '0')

  await ssrClient.query(TokensQuery, Object.assign({}, defaultTokensQueryVariables, { skip }) ).toPromise()

  return {
    props: {
      urqlState: ssrCache.extractData(),
    },
    revalidate: 30,
  }
}

export default wrapUrqlClient(Gallery)
