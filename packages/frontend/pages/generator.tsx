import React from 'react'
import Layout from '../components/Layout'
import Generate from '../components/pages/Generate'
import { Heading } from '../components/ui'
import SEO from '../components/utils/SEO'
const domain = process.env.APP_URL || 'https://avant-garde.gallery'

const seoData = {
  title: 'Generator',
  card: `${domain}/bannerInvite.png`,
}

const Generator: React.FC = () => {
  return (
    <>
      <SEO data={seoData} />
      <Layout>
        <Heading
          color="transparent"
          mb={8}
          fontFamily="Poppins, sans-serif"
          as="h1"
        >
          Generator
        </Heading>
        <Generate />
      </Layout>
    </>
  )
}

export default Generator
