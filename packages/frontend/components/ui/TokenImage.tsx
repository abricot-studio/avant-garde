import { Text, Image } from './index'
import { getIpfsUrl } from '../../lib/ipfs'
import React from 'react'
import { ArbArtToken, useMetadata } from '../../hooks/tokens'

export function TokenImage({ arbArtToken }: { arbArtToken: ArbArtToken }) {
  const metadata = useMetadata(arbArtToken);

  if(!metadata) {
    return (
      <Text>Loading</Text>
    )
  }

  return (
    <Image
      src={getIpfsUrl(metadata.image)}
      boxSize={200}
    />
  )
}
