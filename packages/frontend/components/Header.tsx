import React, { useMemo } from 'react'
import { useWindowScroll } from 'react-use'
import Link from 'next/link'
import { Avatar, Button, Flex, Box, HStack, Heading, ButtonProps, forwardRef, Menu, MenuButton, MenuList, MenuItem } from './ui'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWallet } from '@fortawesome/free-solid-svg-icons'
import { useWeb3 } from '../contexts/Web3Context'
import { useRouter } from 'next/router'

function NavButtonIcon({ color }){
  return (
    <Box
      w={4}
      h={4}
      background={color}
    ></Box>
  )
}

interface NavButtonProps {
  color: string;
  isSelected: boolean;
}

const NavButton = forwardRef<NavButtonProps & ButtonProps, "a">( ({ children, color, isSelected, ...props }, ref) => {

  return (
    <Button
      as="a"
      ref={ref}
      variant="outline"
      border="1px"
      borderColor={isSelected ? color : "transparent"}
      rounded="xl"
      _hover={{
        borderColor: color
      }}
      leftIcon={<NavButtonIcon color={color} />}
      {...props}
    >{children}</Button>
  )
})

function displayAddress(address: string){

  return `${address.slice(0, 8)}...${address.slice(address.length - 5, address.length)}`

}

function LoginButton() {
  const { connect, disconnect, isConnecting, account } = useWeb3()

  if (account) {
    return (
      <Menu
        matchWidth={true}
      >
        <MenuButton
          as={Button}
          rightIcon={<Avatar size="xs" />}
        >
          { displayAddress(account.address) }
        </MenuButton>
        <MenuList>
          <Link passHref href="/myItems">
            <MenuItem as="a">
              My items
            </MenuItem>
          </Link>
          <MenuItem as="a" onClick={disconnect}>Disconnect</MenuItem>
        </MenuList>
      </Menu>
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
  const router = useRouter()
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

        <Link href="/">
          <Heading
            as="h1"
            textStyle="h1"
            textAlign="center"
            fontSize={{ base: '2rem', sm: '3rem', md: '4rem' }}
            maxWidth="50rem"
          >AvantGarde
          </Heading>
        </Link>

        <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
          <Link passHref href="/generator">
            <NavButton color="red" isSelected={router.pathname === '/generator'}>Generator</NavButton>
          </Link>
          <Link passHref href="/about">
            <NavButton color="green" isSelected={router.pathname === '/about'}>About</NavButton>
          </Link>
          <Link passHref href="/gallery">
            <NavButton color="blue" isSelected={router.pathname === '/gallery'}>Gallery</NavButton>
          </Link>
          <LoginButton />
        </HStack>
      </Flex>
    </Box>
  )
}
