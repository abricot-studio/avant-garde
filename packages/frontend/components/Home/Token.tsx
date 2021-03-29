import React from 'react'
import { Flex, Box, Heading } from '../ui'
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
      </Box>
    </Flex>
  )
}
