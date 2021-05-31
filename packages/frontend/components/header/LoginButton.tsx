import { shortenAddress, useEthers } from '@usedapp/core'
import Link from 'next/link'
import React from 'react'
import { DefaultAvatarIcon, WalletIcon } from '../../assets/icons'
import { useBoxProfile } from '../../hooks/profile'
import { useWalletSelector } from '../../lib/WalletSelector/context'
import {
  Avatar,
  Button,
  forwardRef,
  IconButton,
  Menu,
  MenuButton,
  MenuItem as ChakraMenuItem,
  MenuItemProps,
  MenuList,
  useBreakpointValue,
} from '../ui'

export const MenuItem = forwardRef<MenuItemProps, 'a'>(
  ({ children, color, ...props }, ref) => {
    return (
      <ChakraMenuItem
        as="a"
        textStyle="caption"
        cursor="pointer"
        _hover={{
          backgroundColor: 'gray.700',
        }}
        _active={{
          backgroundColor: 'black',
        }}
        _focus={{
          backgroundColor: 'black',
        }}
        {...props}
      >
        {children}
      </ChakraMenuItem>
    )
  }
)

function MainButton({ account }) {
  const boxProfile = useBoxProfile()
  const mobile = useBreakpointValue({ base: true, md: false })

  if (mobile) {
    return (
      <MenuButton
        as={IconButton}
        variant="outline"
        border="2px"
        borderColor="black"
        rounded="full"
        backgroundColor="white"
        textTransform="none"
        _hover={{}}
        icon={
          <Avatar
            size="sm"
            src={boxProfile?.imageUrl}
            icon={<DefaultAvatarIcon w={8} h={8} />}
            bg="white"
          />
        }
        zIndex={2}
      />
    )
  }

  return (
    <MenuButton
      as={Button}
      width="170px"
      variant="outline"
      rounded="full"
      border="2px"
      borderColor="black"
      backgroundColor="white"
      fontWeight={300}
      fontFamily="Poppins, sans-serif"
      textTransform="lowercase"
      fontSize="0.8rem"
      _hover={{}}
      _focus={{}}
      _active={{}}
      pr={1}
      rightIcon={
        <Avatar
          size="xs"
          src={boxProfile?.imageUrl}
          w={8}
          h={8}
          icon={<DefaultAvatarIcon w={8} h={8} />}
          bg="white"
        />
      }
      zIndex={2}
    >
      {boxProfile?.name || shortenAddress(account)}
    </MenuButton>
  )
}

function ConnectButton() {
  const { isConnecting, open } = useWalletSelector()

  const mobile = useBreakpointValue({ base: true, md: false })

  if (mobile) {
    return (
      <IconButton
        aria-label="connect"
        variant="outline"
        border="2px"
        borderColor="black"
        fontFamily="Poppins, sans-serif"
        fontWeight={600}
        fontSize="0.8rem"
        onClick={open}
        icon={<WalletIcon w={7} h={7} />}
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
      border="2px"
      borderColor="black"
      onClick={open}
      leftIcon={<WalletIcon w={8} h={8} />}
      isLoading={isConnecting}
      backgroundColor="white"
      textTransform="uppercase"
      fontWeight={600}
      fontFamily="Poppins, sans-serif"
      fontSize="0.8rem"
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
  const { disconnect } = useWalletSelector()
  const { account } = useEthers()

  if (account) {
    return (
      <Menu offset={mobile ? undefined : [0, -25]} placement="bottom">
        <MainButton account={account} />
        <MenuList
          zIndex={1}
          bg="black"
          color="white"
          borderRadius={mobile ? '1rem' : 0}
          borderBottomRadius="1rem"
          minWidth="170px"
          overflow="hidden"
        >
          <Link passHref href="/myItems">
            <MenuItem mt={mobile ? 0 : 4} pr={6} justifyContent="flex-end">
              My items
            </MenuItem>
          </Link>
          <MenuItem pr={6} justifyContent="flex-end" onClick={disconnect}>
            Disconnect
          </MenuItem>
        </MenuList>
      </Menu>
    )
  }

  return <ConnectButton />
}
