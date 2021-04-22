import React from 'react'
import { ActionButton, Box, Button, Center, Link as CLink, Heading, IconButton, HStack, VStack, Wrap, WrapItem } from '../ui'
import { TokenImage, ImageFrame, defaultSize } from '../tokens/TokenImage'
import Link from 'next/link'
import { useWeb3 } from '../../contexts/Web3Context'
import { useToken } from '../../hooks/tokens'
import { useContract } from '../../hooks/contracts'
import { URLs } from '../../lib/constants'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDiscord, faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { faFileSignature } from '@fortawesome/free-solid-svg-icons'

export default function Hero() {
  const { account } = useWeb3();
  const { token } = useToken(account?.address)

  return (
    <Box
      as="section"
      my={8}
      position="relative"
    >
      <Center
        h={defaultSize}
        position="absolute"
        opacity="0.8"
        w="100%"
      >
        {token ?
          <Box opacity="0.5">
            <TokenImage avantGardeToken={token} />
          </Box>
          :
          <ImageFrame />
        }
      </Center>

      <Center
        h={defaultSize}
        flexDirection="column"
        mx={8}
      >
        <Heading
          as="h3"
          textStyle="h3"
          textAlign="center"
          fontSize={{ base: '1.2rem', sm: '1.4em', md: '1.8rem' }}
          position="relative"
          lineHeight={2}
        >
          Mint unique NFTs based on your ethereum address
          <br/>
          Generated by deep-learning algorithms
        </Heading>
      </Center>

      <Wrap spacing={8} justify="center" mt={8} mx={16}>

        <WrapItem>
          {
            token ?
              <Link passHref href={`/gallery`}>
                <ActionButton
                  as="a"
                  w="12rem"
                >Gallery</ActionButton>
              </Link>
              :
              <Link passHref href="/generator">
                <ActionButton
                  as="a"
                  w="12rem"
                >Generate yours</ActionButton>
              </Link>
          }
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
            >Learn more</Button>
          </Link>
        </WrapItem>
      </Wrap>
    </Box>
  )
}
