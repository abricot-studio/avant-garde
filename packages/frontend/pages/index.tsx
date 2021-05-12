import React from 'react'
import Layout from '../components/Layout'
import Hero from '../components/pages/Hero'
import { Heading } from '../components/ui'
import SEO from '../components/utils/SEO'
import { wrapUrqlClient } from '../lib/graphql'

const seoData = {}

const Home: React.FC = () => {
  return (
    <Layout>
      <SEO data={seoData} />
      <Heading color="transparent" mb={8}>
        Home
      </Heading>
      <Hero />
    </Layout>
  )
}

export default wrapUrqlClient(Home)
