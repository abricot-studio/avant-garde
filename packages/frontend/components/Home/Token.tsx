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
        <HStack>
          <VStack>
            <div>Date</div>
            <div>Current Price</div>
          </VStack>
          <VStack>
            <div>01/01/2021</div>
            <div>0.1 ETH</div>
          </VStack>
        </HStack>
      </Box>
    </Flex>
  )
}
