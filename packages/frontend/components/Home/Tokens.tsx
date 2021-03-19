import React from 'react'
import { Box, VStack, Heading } from '../ui'
import { useTokens } from '../../hooks/tokens'
import { TokenImage } from '../ui/TokenImage'

export default function Tokens() {
  const { tokens, fetching, error } = useTokens()

  if (fetching) return <p>Loading...</p>
  if (error) return <p>Oh no... {error.message}</p>

  return (
    <Box as="section" mb={12}>
      <Heading>Existing tokens</Heading>
      <VStack spacing={8}>
        {tokens.map((token) => (
          <Box key={token.id}>
            <TokenImage arbArtToken={token} />
            {token.owner}
          </Box>
        ))}
      </VStack>
    </Box>
  )
}
