import React from 'react'
import { Text, Image, Center } from './index'
import { getIpfsUrl } from '../../lib/ipfs'
import { ArbArtToken, useMetadata } from '../../hooks/tokens'

export function TokenImage({ arbArtToken }: { arbArtToken: ArbArtToken }) {
  const metadata = useMetadata(arbArtToken);

  if(!metadata) {
    return (
      <Text>Loading</Text>
    )
  }

  return (
    <Center
      borderRadius="full"
      backgroundColor="#FFFFFF"
      width={400}
      height={400}
      borderColor="white"
      boxShadow="0px 10px 40px rgba(158, 158, 158, 0.15)"
    >
      <Image
        src={getIpfsUrl(metadata.image)}
        boxSize={350}
        borderRadius="full"
      />
    </Center>
  )
}
