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
    <>
      <SEO data={seoData} />
      <Layout>
        <Heading color="transparent" mb={8} fontFamily="Poppins, sans-serif">
          Generator
        </Heading>
        <Generate />
      </Layout>
    </>
  )
}

export default wrapUrqlClient(Generator)
