import { useMemo } from 'react'
import {useWindowScroll} from 'react-use';
import { Button, Flex, Link, Box, HStack, Text } from './ui'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWallet } from '@fortawesome/free-solid-svg-icons'
import { useWeb3 } from '../contexts/Web3Context'


function LoginButton() {
  const { connect, disconnect, isConnecting, isConnected } = useWeb3();

  if(isConnected) {
    return (
      <Button
        variant="solid"
        onClick={disconnect}
        leftIcon={<FontAwesomeIcon icon={faWallet} size="1x" />}
      >
        Disconnect
      </Button>
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
  );
}
export default function Header() {
  const {y} = useWindowScroll();
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
          <Text
            textStyle="h1"
          >
            Ab-Art
          </Text>
        </Link>

        <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
          <LoginButton/>
        </HStack>
      </Flex>
    </Box>
  )
}
