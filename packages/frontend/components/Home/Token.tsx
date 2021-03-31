import React from 'react'
import { Flex, Box, Heading, HStack, VStack, IconButton } from '../ui'
import { useToken } from '../../hooks/tokens'
import { TokenImage } from '../ui/TokenImage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { faReddit, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons'
import { useRouter } from 'next/router'

export default function Token({ id }) {
  const { token, fetching } = useToken(id)
  const router = useRouter()

  if (fetching) return <Box align="center" >Loading...</Box>
  if (!token) return <Box align="center" >not existings</Box>

  return (
    <Flex
      as="section"
      mb={12}
      direction="column"
      align="center"
    >
      <Heading
        mb={4}
        as="h3"
        textStyle="h3"
        textAlign="center"
        fontSize={{ base: '2rem', sm: '3rem', md: '4rem' }}
        maxWidth="50rem"
      >
        <IconButton
          icon={<FontAwesomeIcon icon={faArrowLeft} size="1x" />}
          aria-label="Back"
          colorScheme="transparent"
          color="grey"
          _hover={{}}
          _focus={{
            outline: "none"
          }}
          onClick={() => router.push('/gallery') }
        />
        {id}
      </Heading>
      <Box>
        <TokenImage
          size={350}
          arbArtToken={token}
        />
        <VStack>
          <HStack justify="space-between">
            <Box>Date</Box>
            <Box>{new Date(token.blockTimestamp * 1000).toISOString()}</Box>
          </HStack>
          <HStack justify="space-between">
            <Box>Current Price</Box>
            <Box>0.1 ETH</Box>
          </HStack>
          <HStack spacing={12}>
            <IconButton
              icon={<FontAwesomeIcon icon={faReddit} size="3x" />}
              aria-label="Back"
              colorScheme="transparent"
              color="black"
              _hover={{}}
              _focus={{
                outline: "none"
              }}
              _active={{
                outline: "none"
              }}
            />
            <IconButton
              icon={<FontAwesomeIcon icon={faTwitter} size="3x" />}
              aria-label="Back"
              colorScheme="transparent"
              color="black"
              _hover={{}}
              _focus={{
                outline: "none"
              }}
              _active={{
                outline: "none"
              }}
            />
            <IconButton
              icon={<FontAwesomeIcon icon={faInstagram} size="3x" />}
              aria-label="Back"
              colorScheme="transparent"
              color="black"
              _hover={{}}
              _focus={{
                outline: "none"
              }}
              _active={{
                outline: "none"
              }}
            />
          </HStack>
        </VStack>
    </Box>
</Flex>
)
}
