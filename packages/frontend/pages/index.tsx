import Layout from '../components/Layout'
import SEO from '../components/utils/SEO'
import Hero from '../components/Home/Hero'
import { Button, HStack } from '../components/ui'
import Link from 'next/link'
import React from 'react'
import { wrapUrqlClient } from '../lib/graphql'

const seoData = {
  title: 'View Brain',
  description:
    'Mint unique NFTs based on your ethereum address, generated by deep-learning algorithms.',
  keywords:
    'nft,defi,ai,machine learning,deep learning,ethereum,crypto,blockchain,ETH',
}

const Home: React.FC = () => {
  return (
    <Layout>
      <SEO data={seoData} />

      <Hero />

      <HStack spacing={8} justify="center" display={{ base: 'none', md: 'flex' }}>

        <Link passHref href="/gallery">
          <Button
            as="a"
            variant="outline"
            borderRadius="1rem"
            border="2px"
            borderColor="#C345FF"
            bgColor="white"
            px={12}
            rounded="full"
            _hover={{}}
            _active={{}}
          >Discover</Button>
        </Link>
        <Link passHref href="/about">
          <Button
            as="a"
            variant="outline"
            borderRadius="1rem"
            border="2px"
            borderColor="#F0FF45"
            bgColor="white"
            px={12}
            rounded="full"
            _hover={{}}
            _active={{}}
          >Learn more</Button>
        </Link>
      </HStack>
    </Layout>
  )
}

export default wrapUrqlClient(Home);
