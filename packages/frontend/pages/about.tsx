import React from 'react'
import Layout from '../components/Layout'
import { About } from '../components/pages/About'
import SEO from '../components/utils/SEO'
import { wrapUrqlClient } from '../lib/graphql'

const seoData = {
  title: 'About',
}

function AboutPage() {
  return (
    <Layout>
      <SEO data={seoData} />
      <About />
    </Layout>
  )
}

export default wrapUrqlClient(AboutPage)
