import React from 'react'
import { Flex, Box, Heading, HStack, VStack, IconButton } from '../ui'
import { useToken } from '../../hooks/tokens'
import { TokenImage } from '../ui/TokenImage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
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
          onClick={() => router.push('/gallery') }
        />
        {id}
      </Heading>
      <Box>
        <TokenImage arbArtToken={token} />
        <VStack>
          <HStack justify="space-between">
            <Box>Date</Box>
            <Box>01/01/2021</Box>
          </HStack>
          <HStack justify="space-between">
            <Box>Current Price</Box>
            <Box>0.1 ETH</Box>
          </HStack>
        </VStack>
      </Box>
    </Flex>
  )
}
