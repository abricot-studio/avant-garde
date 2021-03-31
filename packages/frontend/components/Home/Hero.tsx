import React from 'react'
import { Box, Heading, VStack } from '../ui'
import { ImageFrame } from '../ui/TokenImage'

export default function Hero() {
  return (
    <VStack
      as="section"
      my={8}
      position="relative"
      minHeight="400px"
      align="center"
      justify="center"
    >
      <Box
        position="absolute"
        mt={9}
      >
        <ImageFrame size={350} />
      </Box>

      <Heading
        as="h3"
        textStyle="h3"
        textAlign="center"
        fontSize={{ base: '1.2rem', sm: '1.6em', md: '1.8rem' }}
        position="relative"
      >
        Mint unique NFTs based on your ethereum address
      </Heading>

      <Heading
        as="h3"
        textStyle="h3"
        textAlign="center"
        fontSize={{ base: '1.2rem', sm: '1.6rem', md: '1.8rem' }}
        position="relative"
      >
        Generated by deep-learning algorithms
      </Heading>
    </VStack>
  )
}
