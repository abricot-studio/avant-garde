import Layout from '../components/Layout'
import SEO from '../components/utils/SEO'
import { Flex, Heading } from '../components/ui'
import Generate from '../components/pages/Generate'
import React from 'react'
import { wrapUrqlClient } from '../lib/graphql'

const seoData = {
  title: 'Generator',
}

const Generator: React.FC = () => {
  return (
    <Layout>
      <SEO data={seoData} />
      <Heading
        color="transparent"
        mb={8}
      >Generator</Heading>
      <Generate />
    </Layout>
  )
}

export default wrapUrqlClient(Generator);
