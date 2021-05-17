import { useEthers } from '@usedapp/core'
import Link from 'next/link'
import React from 'react'
import { useToken } from '../../hooks/tokens'
import { defaultSize, ImageFrame, TokenImage } from '../tokens/TokenImage'
import {
  ActionButton,
  Box,
  Button,
  Center,
  Heading,
  Wrap,
  WrapItem,
} from '../ui'

export default function Hero() {
  const { account } = useEthers()
  const { token } = useToken(account)

  return (
    <Box as="section" my={8} position="relative">
      <Center h={defaultSize} position="absolute" opacity="0.8" w="100%">
        {token ? (
          <Box opacity="0.5">
            <TokenImage avantGardeToken={token} noBurned={true} />
          </Box>
        ) : (
          <ImageFrame />
        )}
      </Center>

      <Center h={defaultSize} flexDirection="column" mx={8}>
        <Heading
          as="h3"
          textStyle="h3"
          textAlign="center"
          fontSize={{ base: '1.2rem', sm: '1.4em', md: '1.8rem' }}
          position="relative"
          lineHeight={2}
        >
          Mint unique NFTs based on your ethereum address
          <br />
          Generated by deep-learning algorithms
        </Heading>
      </Center>

      <Wrap spacing={8} justify="center" mt={8} mx={16}>
        <WrapItem>
          {token ? (
            <Link passHref href={`/gallery`}>
              <ActionButton as="a" w="12rem">
                Gallery
              </ActionButton>
            </Link>
          ) : (
            <Link passHref href="/generator">
              <ActionButton as="a" w="12rem">
                Generate yours
              </ActionButton>
            </Link>
          )}
        </WrapItem>
        <WrapItem>
          <Link passHref href="/about">
            <Button
              as="a"
              variant="outline"
              borderRadius="full"
              border="2px"
              borderColor="pupu"
              bgColor="white"
              px={12}
              rounded="full"
              _hover={{}}
              w="12rem"
            >
              Learn more
            </Button>
          </Link>
        </WrapItem>
      </Wrap>
    </Box>
  )
}
