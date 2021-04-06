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
  Icon,
} from './ui'
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

export const WalletIcon = (props) => (
  <Icon viewBox="0 0 32 22" fill="none"{...props}>
    <path
      d="M1.01376 5.24242C1.01376 5.24242 0.597348 1 4.34557 1C4.64583 1 18.3679 1 26.0023 1C28.7638 1 31 3.23858 31 6V12.6258C31 14.4659 29.5083 15.9576 27.6682 15.9576V15.9576M1.01376 5.24242C7.79049 5.24242 17.0408 5.24242 22.6716 5.24242C25.433 5.24242 27.6682 7.481 27.6682 10.2424V15.9576M1.01376 5.24242C1.01376 8.50703 1.01376 12.7427 1.01376 16.0002C1.01376 18.7617 3.25234 21 6.01376 21H22.6682C25.4296 21 27.6682 18.719 27.6682 15.9576V15.9576"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"/>
  </Icon>
)

export const LogoIcon = (props) => (
  <Icon viewBox="0 0 42 41" fill="none"{...props}>
    <mask id="mask0" maskUnits="userSpaceOnUse" x="1" y="0" width="40" height="39">
      <path d="M13.1285 25.3301C13.1257 26.9869 12.4211 28.5676 11.184 29.6922C7.3042 33.2192 1.01401 30.5069 1.02263 25.3107L1.04206 13.5974C1.04481 11.9406 1.74943 10.3599 2.9865 9.23535C6.86632 5.7084 13.1565 8.42067 13.1479 13.6169L13.1285 25.3301Z"
            fill="#C4C4C4"/>
      <path d="M40.9762 14.2874C40.9637 21.8455 34.7239 27.9627 27.0391 27.9505C19.3541 27.9384 13.1342 21.8011 13.1467 14.2427L13.1472 13.9527C13.16 6.23438 19.5321 -0.0123932 27.3797 1.84635e-05L40.9999 0.0215599L40.9762 14.2874Z"
            fill="#C4C4C4"/>
      <path d="M40.958 25.3741C40.9553 27.0309 40.2507 28.6116 39.0136 29.7361C35.1338 33.2631 28.8436 30.5508 28.8522 25.3546L28.8717 13.6414C28.8744 11.9846 29.579 10.4039 30.8161 9.27929C34.6959 5.75234 40.9861 8.46461 40.9775 13.6608L40.958 25.3741Z"
            fill="#C4C4C4"/>
      <path d="M28.8458 29.159C28.8368 34.5907 24.3525 38.9869 18.8297 38.9781L1 38.9499L1.03006 20.8339C1.03907 15.4022 5.52337 11.006 11.0461 11.0148L18.8756 11.0271C24.3986 11.0359 28.8686 15.4465 28.8595 20.8784L28.8458 29.159Z"
            fill="#C4C4C4"/>
    </mask>
    <g mask="url(#mask0)">
      <path d="M13.4941 1.94434L13.2612 29.6987L21.2225 21.394L13.4941 1.94434Z" fill="#6B93FB"/>
      <path d="M28.9286 40.7021L29.1615 12.9478L21.2002 21.2524L28.9286 40.7021Z" fill="#6BFB9C"/>
      <path d="M29.1834 13.0893L13.4937 1.94434L21.2221 21.394L29.1834 13.0893Z" fill="#FB6B6B"/>
    </g>
    <path d="M13.1286 26.2627C13.1257 27.9646 12.4066 29.5867 11.1472 30.7315V30.7315C7.25541 34.2694 1.01403 31.5021 1.02275 26.2426L1.04194 14.6766C1.04476 12.9747 1.76396 11.3526 3.02331 10.2077V10.2077C6.9151 6.6699 13.1565 9.43718 13.1478 14.6967L13.1286 26.2627Z"
          stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M40.9582 26.3076C40.9553 28.0095 40.2361 29.6316 38.9768 30.7764V30.7764C35.085 34.3143 28.8436 31.547 28.8523 26.2875L28.8715 14.7215C28.8744 13.0196 29.5936 11.3975 30.8529 10.2527V10.2527C34.7447 6.71482 40.9861 9.48209 40.9774 14.7416L40.9582 26.3076Z"
          stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M40.9999 1.02791L27.3797 1.00637C19.5321 0.993954 13.16 7.24073 13.1472 14.959L13.1467 15.2491C13.1342 22.8075 19.3541 28.9447 27.0391 28.9569C34.7239 28.969 40.9637 22.8519 40.9762 15.2937L40.9999 1.02791ZM40.9999 1.02791L33.5 8.85195M13.1472 25.5718C13.1472 34.4235 1 39.9563 1 39.9563M1 39.9563L18.8297 39.9845C24.3525 39.9932 28.8368 35.5971 28.8458 30.1653L28.8595 21.8847C28.8686 16.4528 24.3986 12.0422 18.8756 12.0335L11.0461 12.0211C5.52337 12.0124 1.03907 16.4085 1.03006 21.8403L1 39.9563Z"
          stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Icon>
)

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
      lineHeight={1}
      fontSize={{ base: '0.5rem', sm: '1rem', md: '1rem' }}
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
        offset={[0, -20]}
      >
        <MenuButton
          as={Button}
          width={{ base: '100px', sm: '200px', md: '200px' }}
          variant="outline"
          rounded="full"
          border="1px"
          borderColor="black"
          backgroundColor="white"
          textTransform="none"
          fontWeight={300}
          fontFamily="Roboto, sans-serif"
          fontSize={{ base: '1rem', sm: '1rem', md: '1rem' }}
          _hover={{}}
          _active={{}}
          rightIcon={<Avatar size="xs" />}
          zIndex={2}
        >
          { displayAddress(account.address) }
        </MenuButton>
        <MenuList
          minWidth={{ base: '100px', sm: '200px', md: '200px' }}
          borderRadius="0"
          borderBottomRadius="1rem"
          mr="2rem"
          zIndex={1}
          background="black"
          color="white"
        >
          <Link passHref href="/myItems">
            <MenuItem
              mt={3}
            >
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
      border="1px"
      borderColor="black"
      onClick={connect}
      leftIcon={<WalletIcon w={6} h={6} />}
      isLoading={isConnecting}
      backgroundColor="white"
      textTransform="uppercase"
      fontWeight={500}
      fontFamily="'Roboto Mono', sans-serif"
      fontSize={{ base: '1rem', sm: '1rem', md: '1rem' }}
      _hover={{}}
      _active={{}}
      rounded="full"
      loadingText="Connecting..."
    >
      Connect
    </Button>
  )

}

export default function Header() {
  const { y } = useWindowScroll()
  const router = useRouter()
  const scrolled = useMemo(() => y > 60, [y])

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
            <Button
              textStyle="appName"
              leftIcon={<LogoIcon />}
              bgColor="transparent"
              textTransform="none"
              _hover={{
              }}
              _active={{
              }}
              _focus={{
              }}
            >AvantGarde
            </Button>
          </Link>
        </Box>

        <HStack spacing={8}>
          <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
            <Link passHref href="/generator">
              <NavButton color="reddy" isSelected={router.pathname === '/generator'}>Generator</NavButton>
            </Link>
            <Link passHref href="/about">
              <NavButton color="greeny" isSelected={router.pathname === '/about'}>About</NavButton>
            </Link>
            <Link passHref href="/gallery">
              <NavButton color="bluey" isSelected={router.pathname === '/gallery'}>Gallery</NavButton>
            </Link>
          </HStack>
          <LoginButton />
        </HStack>
      </Flex>
    </Box>
  )
}
