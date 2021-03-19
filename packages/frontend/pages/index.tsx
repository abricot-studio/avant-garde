import Layout from '../components/Layout'
import SEO from '../components/utils/SEO'
import Hero from '../components/Home/Hero'
import Tokens from '../components/Home/Tokens'
import MyToken from '../components/Home/MyToken'

const seoData = {
  title: 'View Brain',
  description:
    'Mint unique NFTs based on your ethereum address, generated by deep-learning algorithms.',
  keywords:
    'nft,defi,ai,machine learning,deep learning,ethereum,crypto,blockchain,ETH',
}

export default function Home() {
  return (
    <Layout>
      <SEO data={seoData} />
      <Hero />
      <MyToken />
      <Tokens />
    </Layout>
  )
}
