import React from 'react'
import { Text, Image, Center, Box } from './index'
import { getIpfsUrl } from '../../lib/ipfs'
import { ArbArtToken, useMetadata } from '../../hooks/tokens'

export function TokenImage({ arbArtToken, size }: { arbArtToken: ArbArtToken, size: number }) {

  const metadata = useMetadata(arbArtToken);

  if(!metadata) {
    return (
      <Text>Loading</Text>
    )
  }

  return (<ImageFrame size={size} src={getIpfsUrl(metadata.image)}/>)
}

export function ImageFrame({ src, size}: { src: string, size: number }) {


  return (
    <Box
      borderRadius="full"
      backgroundColor="white"
      width={size}
      height={size}
      // borderColor="white"
      boxShadow="0px 10px 40px rgba(158, 158, 158, 0.15)"
    >
      <Box
        boxSize="90%"
        position="relative"
        top="5%"
        left="5%"
      >
        <Box
          boxSize="100%"
          borderRadius="full"
          position="absolute"
          overflow="hidden"
        >
          <Image
            src={src}
            boxSize="100%"
          />
        </Box>

        <Box
          boxSize="100%"
          borderRadius="full"
          boxShadow="inset 0px 4px 20px rgba(129, 129, 129, 0.15)"
          position="absolute"
        />
      </Box>
    </Box>
  )
}
