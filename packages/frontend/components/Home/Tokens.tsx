import React from 'react'
import { Box, VStack, Heading, Image } from '../ui'
import { useTokens } from '../../hooks/tokens'
import { getIpfsUrl } from '../../lib/ipfs'

export default function Tokens() {
  const { tokens, fetching, error } = useTokens()

  if (fetching) return <p>Loading...</p>
  if (error) return <p>Oh no... {error.message}</p>

  return (
    <Box as="section" mb={12}>
      <Heading>Existing tokens</Heading>
      <VStack spacing={8}>
        {tokens.map((token) => (
          <Box>
            <Image src={getIpfsUrl(token.metadata.image)} boxSize={200} />
            {token.owner}
          </Box>
        ))}
      </VStack>
    </Box>
  )
}
