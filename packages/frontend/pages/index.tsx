import Layout from '../components/Layout'
import SEO from '../components/utils/SEO'
import Hero from '../components/pages/Hero'
import React from 'react'
import { wrapUrqlClient } from '../lib/graphql'
import { Heading } from '../components/ui'

const seoData = {}

const Home: React.FC = () => {
  return (
    <Layout>
      <SEO data={seoData} />
      <Heading
        color="transparent"
        mb={8}
      >Home</Heading>
      <Hero />
    </Layout>
  )
}

export default wrapUrqlClient(Home);
