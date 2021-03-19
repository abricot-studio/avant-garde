import React from 'react'
import { Box, VStack, Heading, Image } from '../ui'
import { useMyToken } from '../../hooks/tokens'
import { getIpfsUrl } from '../../lib/ipfs'
import { useWeb3 } from '../../contexts/Web3Context'
import Generate from './Generate'

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
          <Image src={getIpfsUrl(myToken.metadata.image)} boxSize={200} />
        </Box>
        :
        <Generate />
      }
    </Box>
  )
}
