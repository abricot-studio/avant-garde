import React from 'react'
import Link from 'next/link'
import {
  Avatar,
  Button,
  IconButton,
  forwardRef,
  Menu,
  MenuButton,
  MenuList,
  MenuItem as ChakraMenuItem,
  MenuItemProps,
  useBreakpointValue,
} from '../ui'
import { WalletIcon } from './Icons'
import { shortenAddress, useEthers } from '@usedapp/core'
import { useWalletSelector } from '../../lib/WalletSelector/context'

export const MenuItem = forwardRef<MenuItemProps, "a">( ({ children, color, ...props }, ref) => {
  return (
    <ChakraMenuItem
      as="a"
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

function MainButton({ account }) {
  const mobile = useBreakpointValue({ base: true, md: false })

  if(mobile) {
    return (
      <MenuButton
        as={IconButton}
        variant="outline"
        rounded="full"
        backgroundColor="white"
        textTransform="none"
        _hover={{}}
        icon={<Avatar size="sm" />}
        zIndex={2}
      >
        { shortenAddress(account) }
      </MenuButton>
    )
  }

  return (
    <MenuButton
      as={Button}
      width="170px"
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
      { shortenAddress(account) }
    </MenuButton>
  )
}

function ConnectButton() {
  const { isConnecting, open } = useWalletSelector()

  const mobile = useBreakpointValue({ base: true, md: false })

  if(mobile) {
    return (
      <IconButton
        aria-label="connect"
        variant="outline"
        border="1px"
        borderColor="black"
        onClick={open}
        icon={<WalletIcon w={6} h={6} />}
        isLoading={isConnecting}
        backgroundColor="white"
        rounded="full"
        size="md"
      />
    )
  }

  return (
    <Button
      px={4}
      variant="outline"
      border="1px"
      borderColor="black"
      onClick={open}
      leftIcon={<WalletIcon w={6} h={6} />}
      isLoading={isConnecting}
      backgroundColor="white"
      textTransform="uppercase"
      fontWeight={300}
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

export function LoginButton() {
  const mobile = useBreakpointValue({ base: true, lg: false })
  const { disconnect } = useWalletSelector();
  const { account } = useEthers()

  if (account) {
    return (
      <Menu
        offset={mobile ? undefined : [0, -25]}
        placement="bottom"
      >
        <MainButton account={account} />
        <MenuList
          zIndex={1}
          bg="black"
          color="white"
          borderRadius={mobile ? "1rem" : 0}
          borderBottomRadius="1rem"
          minWidth="170px"
          overflow="hidden"
        >
          <Link passHref href="/myItems">
            <MenuItem
              mt={mobile ? 0 : 4}
              pr={6}
              justifyContent="flex-end"
            >
              My items
            </MenuItem>
          </Link>
          <MenuItem
            pr={6}
            justifyContent="flex-end"
            onClick={disconnect}
          >
            Disconnect
          </MenuItem>
        </MenuList>
      </Menu>
    )
  }

  return (
    <ConnectButton />
  )

}

