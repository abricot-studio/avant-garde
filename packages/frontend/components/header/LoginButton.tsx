import { shortenAddress, useEthers } from '@usedapp/core'
import Link from 'next/link'
import React from 'react'
import { DefaultAvatarIcon, WalletIcon } from '../../assets/icons'
import config from '../../config'
import { useAuth } from '../../hooks/authContext'
import { useBoxProfile } from '../../hooks/profile'
import { useWalletSelector } from '../../lib/WalletSelector/context'
import {
  Avatar,
  AvatarBadge,
  Badge,
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
  const { accountToken } = useAuth()

  const { invites } = useAuth()

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
          >
            {!config.whitelistMode && accountToken && (
              <AvatarBadge
                w="1rem"
                h="1rem"
                border="none"
                lineHeight="1rem"
                fontSize="0.7rem"
                color="white"
                top={-2}
                right={-1}
                bg="radial-gradient(99.98% 99.98% at 50.02% 99.98%, #FFAB07 0%, #FF3507 100%)"
              >
                {invites.length === 0 ||
                invites.filter((invite) => !invite.used).length === 0
                  ? ''
                  : invites.filter((invite) => !invite.used).length}
              </AvatarBadge>
            )}
          </Avatar>
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
      pr={2}
      rightIcon={
        <Avatar
          size="xs"
          src={boxProfile?.imageUrl}
          w={6}
          h={6}
          icon={<DefaultAvatarIcon w={6} h={6} />}
          bg="white"
        >
          {!config.whitelistMode && accountToken && (
            <AvatarBadge
              w="1rem"
              h="1rem"
              border="none"
              lineHeight="1rem"
              fontSize="0.7rem"
              color="white"
              top={-4}
              right={-2}
              bg="radial-gradient(99.98% 99.98% at 50.02% 99.98%, #FFAB07 0%, #FF3507 100%)"
            >
              {invites.length === 0 ||
              invites.filter((invite) => !invite.used).length === 0
                ? ''
                : invites.filter((invite) => !invite.used).length}
            </AvatarBadge>
          )}
        </Avatar>
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
  const { accountToken, invites } = useAuth()

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
          {!config.whitelistMode && (
            <Link passHref href="/myItems">
              <MenuItem mt={mobile ? 0 : 4} pr={6} justifyContent="flex-end">
                My items
              </MenuItem>
            </Link>
          )}
          {!config.whitelistMode && (
            <Link passHref href="/myInvitations">
              <MenuItem pr={accountToken ? 4 : 6} justifyContent="flex-end">
                {accountToken && (
                  <Badge
                    bg="radial-gradient(99.98% 99.98% at 50.02% 99.98%, #FFAB07 0%, #FF3507 100%)"
                    color="white"
                    rounded="full"
                    w="1rem"
                    h="1rem"
                    fontSize="0.7rem"
                    mr={2}
                    borderRadius="full"
                    textAlign="center"
                    alignSelf="center"
                  >
                    {invites.length === 0 ||
                    invites.filter((invite) => !invite.used).length === 0
                      ? ''
                      : invites.filter((invite) => !invite.used).length}
                  </Badge>
                )}
                My Invitations
              </MenuItem>
            </Link>
          )}
          <MenuItem
            pr={6}
            mt={!mobile && config.whitelistMode ? 4 : 0}
            justifyContent="flex-end"
            onClick={disconnect}
          >
            Disconnect
          </MenuItem>
        </MenuList>
      </Menu>
    )
  }

  return <ConnectButton />
}
