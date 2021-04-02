import React from 'react'
import { Image, Box, ScaleFade, Text, Flex } from './index'
import { getIpfsUrl } from '../../lib/ipfs'
import { ArbArtToken, useMetadata } from '../../hooks/tokens'

export function TokenImage({ arbArtToken, size }: { arbArtToken: ArbArtToken, size: number }) {
  const metadata = useMetadata(arbArtToken);

  return (<ImageFrame size={size} src={metadata && getIpfsUrl(metadata.image)}/>)
}

export function ImageFrame({ src, size = 250, isLoading, isQuestion }: { src?: string, size?: number, isLoading?: boolean, isQuestion?: boolean }) {
  return (
    <Box
      borderRadius="full"
      backgroundColor="white"
      width={size}
      height={size}
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
          <ScaleFade initialScale={0} in={src && !isLoading}>
            <Image
              src={src}
              boxSize="100%"
            />
          </ScaleFade>
          <ScaleFade initialScale={0} in={isLoading}>
            <Box
              bgColor="white"
              opacity={0.5}
              style={{ filter: "blur(20px)" }}>
              <video width="100%" height="100%" autoPlay loop >
                <source src="../TEST-ANIM-AVANTGARDE.webm" type="video/webm"/>
                Your browser does not support the video tag.
              </video>
            </Box>
          </ScaleFade>
        </Box>

        <Box
          boxSize="100%"
          borderRadius="full"
          boxShadow="inset 0px 4px 20px rgba(129, 129, 129, 0.15)"
          position="absolute"
        />
        <Flex
          boxSize="100%"
          position="absolute"
          justify="center"
          align="center"
        >
          {
            isQuestion &&
            <Text
              fontWeight={800}
              color="#f5f4f4"
              fontSize={{ base: '10rem', sm: '10rem', md: '15rem' }}
            >?</Text>
          }
        </Flex>
      </Box>
    </Box>
  )
}
