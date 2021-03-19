import React from 'react'
import { Box, Heading } from '../ui'
import { useMyToken } from '../../hooks/tokens'
import { useWeb3 } from '../../contexts/Web3Context'
import Generate from './Generate'
import { TokenImage } from '../ui/TokenImage'

export default function MyToken() {
  const { address } = useWeb3();
  const { myToken, fetching, error } = useMyToken(address)

  if (fetching) return <p>Loading...</p>
  if (error) return <p>Oh no... {error.message}</p>

  return (
    <Box as="section" mb={12}>
      <Heading>My image</Heading>
      {myToken ?
        <Box>
          <TokenImage arbArtToken={myToken} />
        </Box>
        :
        <Generate />
      }
    </Box>
  )
}
