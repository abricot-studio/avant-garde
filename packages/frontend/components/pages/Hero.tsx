import React from 'react'
import { ActionButton, Box, Button, Center, Link as CLink, Heading, IconButton, HStack, VStack, Wrap, WrapItem } from '../ui'
import { TokenImage, ImageFrame } from '../ui/TokenImage'
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
    <VStack
      as="section"
      my={8}
      position="relative"
      align="center"
    >
      <Box
        position="absolute"
        opacity="0.8"
      >
        {token ?
          <Box opacity="0.5">
            <TokenImage size={350} avantGardeToken={token} />
          </Box>
          :
          <ImageFrame size={350} />
        }
      </Box>

      <Center
        h={350}
        flexDirection="column"
        mb={4}
      >
        <Heading
          as="h3"
          textStyle="h3"
          textAlign="center"
          fontSize={{ base: '1.2rem', sm: '1.6em', md: '1.8rem' }}
          position="relative"
          mb={2}
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
      </Center>

      <HStack spacing={8} justify="center" display={{ base: 'none', md: 'flex' }}>

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

      </HStack>

      <Box pt={8}>
        <Links/>
      </Box>
    </VStack>
  )
}


function LinkItem({ href, icon, label }) {
  return (
    <WrapItem>
      <CLink
        href={href}
        isExternal
      >
        <IconButton
          aria-label={label}
          icon={icon}
          variant="link"
          size="sm"
        />
      </CLink>
    </WrapItem>
  )
}
function Links() {
  const { etherscanURL: contractEtherscanURL } = useContract();

  return (
    <Wrap justify="center">
      <LinkItem
        href={URLs.github}
        label="Github"
        icon={<FontAwesomeIcon icon={faGithub} size="1x" />}
      />
      <LinkItem
        href={URLs.discord}
        label="discord"
        icon={<FontAwesomeIcon icon={faDiscord} size="1x" />}
      />
      <LinkItem
        href={URLs.twitter}
        label="Twitter"
        icon={<FontAwesomeIcon icon={faTwitter} size="1x" />}
      />
      <LinkItem
        href={contractEtherscanURL}
        label="Contracts"
        icon={<FontAwesomeIcon icon={faFileSignature} size="1x" />}
      />
    </Wrap>
  )
}
