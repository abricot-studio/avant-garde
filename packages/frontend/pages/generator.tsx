import React from 'react'
import Layout from '../components/Layout'
import Generate from '../components/pages/Generate'
import { Heading } from '../components/ui'
import SEO from '../components/utils/SEO'
import { wrapUrqlClient } from '../lib/graphql'

const seoData = {
  title: 'Generator',
}

const Generator: React.FC = () => {
  return (
    <Layout>
      <SEO data={seoData} />
      <Heading color="transparent" mb={8}>
        Generator
      </Heading>
      <Generate />
    </Layout>
  )
}

export default wrapUrqlClient(Generator)
