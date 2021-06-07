import { useEthers } from '@usedapp/core'
import React from 'react'
import Layout from '../components/Layout'
import { ActionButton, Box, Heading } from '../components/ui'
import SEO from '../components/utils/SEO'
import { wrapUrqlClient } from '../lib/graphql'
import { useWalletSelector } from '../lib/WalletSelector/context'

const seoData = {
  title: 'Register',
}

const Generator: React.FC = () => {
  const { isConnecting, open } = useWalletSelector()
  const { account } = useEthers()

  return (
    <>
      <SEO data={seoData} />
      <Layout>
        <Heading textAlign="center" mb={8} fontFamily="Poppins, sans-serif">
          Register
        </Heading>
        <Box align="center" mt={8}>
          {account ? (
            <ActionButton loadingText="Registring...">Register</ActionButton>
          ) : (
            <ActionButton
              onClick={open}
              isLoading={isConnecting}
              loadingText="Connecting wallet..."
            >
              Connect wallet
            </ActionButton>
          )}
        </Box>
      </Layout>
    </>
  )
}

export default wrapUrqlClient(Generator)
