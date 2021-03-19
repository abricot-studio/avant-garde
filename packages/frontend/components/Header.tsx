import React, { useMemo } from 'react'
import { useWindowScroll } from 'react-use'
import { Button, Flex, Link, Box, HStack, Text, Address, Heading } from './ui'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWallet } from '@fortawesome/free-solid-svg-icons'
import { useWeb3 } from '../contexts/Web3Context'


function LoginButton() {
  const { connect, disconnect, isConnecting, address, isConnected } = useWeb3()

  if (isConnected) {
    return (
      <Flex align="center">
        <Box w={200} mr={4}>
          <Address>{address}</Address>
        </Box>
        <Button
          variant="solid"
          onClick={disconnect}
          leftIcon={<FontAwesomeIcon icon={faWallet} size="1x" />}
        >
          Disconnect
        </Button>
      </Flex>
    )
  }

  return (
    <Button
      variant="solid"
      onClick={connect}
      leftIcon={<FontAwesomeIcon icon={faWallet} size="1x" />}
      isLoading={isConnecting}
      loadingText="Connecting..."
    >
      Connect
    </Button>
  )
}
export default function Header() {
  const { y } = useWindowScroll()
  const scrolled = useMemo(() => y > 80, [y])

  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      zIndex={10}
      transition="background-color 0.25s ease 0s;"
      bg={scrolled && 'theme'}
      sx={scrolled ? { backdropFilter: 'blur(10px)' } : undefined}
      borderBottom={scrolled && '1px solid'}
      borderColor="border.300"
    >
      <Flex
        as="nav"
        px={{ base: '1.5rem', lg: '2rem' }}
        py={{ base: '1rem', lg: '1.5rem' }}
        justify="space-between"
        align="center"
      >
        <Link
          onClick={() => window.scroll(0, 0)}
          _hover={{ textDecoration: 'none' }}
        >
          <Heading
            as="h1"
            textStyle="h1"
            textAlign="center"
            layerStyle={'textGradient'}
            fontSize={{ base: '2rem', sm: '3rem', md: '4rem' }}
            maxWidth="50rem"
          >
            View Brain
          </Heading>
        </Link>

        <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
          <LoginButton />
        </HStack>
      </Flex>
    </Box>
  )
}
