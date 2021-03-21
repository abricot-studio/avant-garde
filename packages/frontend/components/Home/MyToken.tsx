import React from 'react'
import { Flex, Box, Heading } from '../ui'
import { useMyToken } from '../../hooks/tokens'
import Generate from './Generate'
import { TokenImage } from '../ui/TokenImage'

export default function MyToken() {
  const { myToken, fetching } = useMyToken()

  if (fetching) return <p>Loading...</p>

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
        My image
      </Heading>
      {myToken ?
        <Box>
          <TokenImage arbArtToken={myToken} />
        </Box>
        :
        <Generate />
      }
    </Flex>
  )
}
