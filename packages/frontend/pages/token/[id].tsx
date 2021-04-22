import { GetStaticPropsContext } from 'next'

import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import Token from '../../components/tokens/Token'
import SEO from '../../components/utils/SEO'
import { defaultClient, getSsrClient, wrapUrqlClient } from '../../lib/graphql'
import { TokenQuery, TokensQuery } from '../../hooks/tokens'
const seoData = {
  title: 'Token',
}


const TokenPage: React.FC = () => {
  const router = useRouter()
  const { id } = router.query

  if(!id || router.isFallback){
    return <p>Loading</p>
  }
  return (
    <Layout>
      <SEO data={seoData} />
      <Token id={id} />
    </Layout>
  )
}


export const getStaticPaths = async () => {
  const { data } = await defaultClient.query(
    TokensQuery,
    {
      first: 50,
    },
  ).toPromise();

  if(data?.avantGardeTokens) {
    return {
      paths: data.avantGardeTokens.map(t => ({
        params: { id: t.id },
      })),
      fallback: true,
    };
  }

  return {
    paths: [],
    fallback: true,
  };
};

type QueryParams = { id: string };
export const getStaticProps  = async (ctx: GetStaticPropsContext<QueryParams>) => {
  const [ssrClient, ssrCache] = getSsrClient();
  const id = ctx.params.id

  await ssrClient.query(
    TokenQuery,
    {
      address: id.toLowerCase(),
    },
  ).toPromise();

  return {
    props: {
      urqlState: ssrCache.extractData(),
    },
    revalidate: 30,
  };
};

export default wrapUrqlClient(TokenPage);

