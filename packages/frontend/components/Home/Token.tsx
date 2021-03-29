import React from 'react'
import { Flex, Box, Heading, HStack, VStack } from '../ui'
import { useToken } from '../../hooks/tokens'
import { TokenImage } from '../ui/TokenImage'

export default function Token({ id }) {
  const { token, fetching } = useToken(id)

  if (fetching) return <p>Loading...</p>
  if (!token) return <p>not existings</p>

  return (
    <Flex
      as="section"
      mb={12}
      direction="column"
      align="center"
    >
      <Heading
        mb={4}
      >
        {id}
      </Heading>
      <Box>
        <TokenImage arbArtToken={token} />
        <VStack>
          <HStack justify="space-between">
            <Box>Date</Box>
            <Box>01/01/2021</Box>
          </HStack>
          <HStack justify="space-between">
            <Box>Current Price</Box>
            <Box>0.1 ETH</Box>
          </HStack>
        </VStack>
      </Box>
    </Flex>
  )
}
