import Layout from '../components/Layout'
import SEO from '../components/utils/SEO'
import { Heading } from '../components/ui'
import React, { useEffect } from 'react'
import { useWeb3 } from '../contexts/Web3Context'
import { wrapUrqlClient } from '../lib/graphql'
import { useRouter } from 'next/router'
import { defaultMyTokensQueryVariables, useMyTokens } from '../hooks/tokens'
import Tokens from '../components/Home/Tokens'

const seoData = {
  title: 'My tokens View Brain',
  description:
    'My tokens Mint unique NFTs based on your ethereum address, generated by deep-learning algorithms.',
  keywords:
    'My tokens,nft,defi,ai,machine learning,deep learning,ethereum,crypto,blockchain,ETH',
}

const MyTokensPage: React.FC = () => {

  const { account, isConnecting } = useWeb3()
  const router = useRouter()
  const { tokens, fetching, error } = useMyTokens({
    ...defaultMyTokensQueryVariables,
    address: account.address
  })

  useEffect(() => {

    if(!isConnecting && !account){

      router.push(`/`)

    }

  }, [isConnecting, account])

  if(!account) {

    return (<div></div>)

  }

  return (
    <Layout>
      <SEO data={seoData} />
      <Heading>Your items</Heading>
      <Tokens tokens={tokens} fetching={fetching} error={error}/>
    </Layout>
  )
}

export default wrapUrqlClient(MyTokensPage);
