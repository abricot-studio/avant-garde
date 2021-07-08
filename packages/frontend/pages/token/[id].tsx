import { GetStaticPropsContext } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Layout from '../../components/Layout'
import Token from '../../components/tokens/Token'
import SEO from '../../components/utils/SEO'
import config from '../../config'
import { TokenQuery, TokensQuery } from '../../hooks/tokens'
import { defaultClient, getSsrClient, wrapUrqlClient } from '../../lib/graphql'
import { getIpfsData, getIpfsUrl } from '../../lib/ipfs'

type QueryParams = { id: string }
type TokenPageProps = { initialMetadata: any }

const TokenPage: React.FC<TokenPageProps> = ({ initialMetadata }) => {
  const router = useRouter()
  const { id } = router.query as QueryParams

  if (router.isFallback) {
    return <p>Loading</p>
  }
  useEffect(() => {
    if (config.whitelistMode) {
      router.replace(`/`)
    }
  }, [])
  const seoData = {
    title: 'Token',
    card: getIpfsUrl(initialMetadata.image),
  }
  if (config.whitelistMode) {
    return <div></div>
  }
  return (
    <>
      <SEO data={seoData} />
      <Layout>
        <Token id={id} />
      </Layout>
    </>
  )
}

export const getStaticPaths = async () => {
  if (config.whitelistMode) {
    return {
      paths: [],
      fallback: true,
    }
  }
  const { data } = await defaultClient
    .query(TokensQuery, {
      first: 10,
    })
    .toPromise()

  if (data?.avantGardeTokens) {
    return {
      paths: data.avantGardeTokens.map((t) => ({
        params: { id: t.id },
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
  const id = ctx.params.id

  const {
    data: { avantGardeToken },
  } = await ssrClient
    .query(TokenQuery, {
      address: id.toLowerCase(),
    })
    .toPromise()

  const initialMetadata = await getIpfsData(avantGardeToken.tokenURI)

  return {
    props: {
      urqlState: ssrCache.extractData(),
      initialMetadata,
    },
    revalidate: 30,
  }
}

export default wrapUrqlClient(TokenPage)
