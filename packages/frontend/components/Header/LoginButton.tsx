import React from 'react'
import Link from 'next/link'
import {
  Avatar,
  Button,
  forwardRef,
  Menu,
  MenuButton,
  MenuList,
  MenuItem as ChakraMenuItem,
  MenuItemProps,
} from '../ui'
import { useWeb3 } from '../../contexts/Web3Context'
import { WalletIcon } from './Icons'

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

export function LoginButton() {
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
      rounded="full"
      loadingText="Connecting..."
    >
      Connect
    </Button>
  )

}

