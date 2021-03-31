import React, { useMemo } from 'react'
import { useWindowScroll } from 'react-use'
import Link from 'next/link'
import {
  Avatar,
  Button,
  Flex,
  Box,
  HStack,
  Text,
  ButtonProps,
  forwardRef,
  Menu,
  MenuButton,
  MenuList,
  MenuItem as ChakraMenuItem,
  MenuItemProps,
  IconButton,
} from './ui'
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
    />
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
      textTransform="none"
      fontWeight={500}
      fontFamily="'Roboto Mono', sans-serif"
      fontSize={{ base: '0.5rem', sm: '1em', md: '1rem' }}
      rounded="xl"
      size="sm"
      _hover={{
        borderColor: color
      }}
      leftIcon={<NavButtonIcon color={color} />}
      {...props}
    >{children}</Button>
  )
})

const MenuItem = forwardRef<MenuItemProps, "a">( ({ children, color, ...props }, ref) => {
  return (
    <ChakraMenuItem
      as="a"
      pr={6}
      justifyContent="flex-end"
      textStyle="caption"
      cursor="pointer"
      _hover={{
        backgroundColor: "gray.700"
      }}
      _active={{
        backgroundColor: "black"
      }}
      _focus={{
        backgroundColor: "black"
      }}
      {...props}
    >
      {children}
    </ChakraMenuItem>
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
        offset={[0, -17]}
      >
        <MenuButton
          as={Button}
          width="200px"
          variant="outline"
          borderRadius="4rem"
          border="1px"
          borderColor="black"
          backgroundColor="white"
          _hover={{}}
          _active={{}}
          rightIcon={<Avatar size="xs" />}
          zIndex={2}
        >
          { displayAddress(account.address) }
        </MenuButton>
        <MenuList
          minWidth="200px"
          borderRadius="0"
          borderBottomRadius="1rem"
          pt={5}
          mr="2rem"
          zIndex={1}
          background="black"
          color="white"
        >
          <Link passHref href="/myItems">
            <MenuItem>
              My items
            </MenuItem>
          </Link>
          <MenuItem
            onClick={disconnect}
          >Disconnect</MenuItem>
        </MenuList>
      </Menu>
    )
  }

  return (
    <Button
      width="200px"
      variant="outline"
      borderRadius="4rem"
      border="1px"
      borderColor="black"
      onClick={connect}
      leftIcon={<FontAwesomeIcon icon={faWallet} size="1x" />}
      isLoading={isConnecting}
      backgroundColor="white"
      _hover={{}}
      _active={{}}
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
      bg={scrolled && 'header'}
      sx={scrolled ? { backdropFilter: 'blur(10px)' } : undefined}
      borderBottom={scrolled && '1px solid'}
      borderColor="black"
    >
      <Flex
        as="nav"
        px={{ base: '1.5rem', lg: '2rem' }}
        py={{ base: '0.5rem', lg: '1rem' }}
        justify="space-between"
        align="center"
      >

        <Box>
          <Link href="/">
            <Text
              textStyle="appName"
              cursor="pointer"
            >AvantGarde
            </Text>
          </Link>
        </Box>

        <HStack spacing={8}>
        <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
          <Link passHref href="/generator">
            <NavButton color="red" isSelected={router.pathname === '/generator'}>Generator</NavButton>
          </Link>
          <Link passHref href="/about">
            <NavButton color="green" isSelected={router.pathname === '/about'}>About</NavButton>
          </Link>
          <Link passHref href="/gallery">
            <NavButton color="blue" isSelected={router.pathname === '/gallery'}>Gallery</NavButton>
          </Link>
        </HStack>
        <LoginButton />
        </HStack>
      </Flex>
    </Box>
  )
}
