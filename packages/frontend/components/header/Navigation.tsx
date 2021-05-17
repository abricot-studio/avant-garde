import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useMemo } from 'react'
import {
  Box,
  Button,
  ButtonProps,
  forwardRef,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  Text,
  useBreakpointValue,
} from '../ui'
import { MenuItem } from './LoginButton'

interface NavButtonProps {
  color: string
  isSelected: boolean
}

export const NavButtonIcon = ({ color }) => <Box w={4} h={4} background={color} />

const NavButton = forwardRef<NavButtonProps & ButtonProps, 'a'>(
  ({ children, color, isSelected, ...props }, ref) => {
    return (
      <Button
        as="a"
        ref={ref}
        variant="outline"
        border="1px"
        borderColor={isSelected ? color : 'transparent'}
        textTransform="none"
        fontWeight={500}
        fontFamily="Poppins, sans-serif"
        lineHeight={1}
        fontSize="1rem"
        rounded="xl"
        size="sm"
        _hover={{
          borderColor: color,
        }}
        leftIcon={<NavButtonIcon color={color} />}
        {...props}
      >
        {children}
      </Button>
    )
  }
)

export const pagePaths = ['/generator', '/about', '/gallery']

export const getPageStuff = (pathname) => {
  if (pathname === '/') {
    return ['Home', 'black']
  }
  if (pathname === '/generator') {
    return ['Generator', 'reddy']
  }
  if (pathname === '/about') {
    return ['About', 'greeny']
  }
  if (pathname === '/gallery') {
    return ['Gallery', 'bluey']
  }
  if (pathname === '/myItems') {
    return ['My Items', 'black']
  }
  if (pathname.startsWith('/token/')) {
    return ['Details', 'black']
  }
  return ['', '']
}

export function Navigation() {
  const mobile = useBreakpointValue({ base: true, lg: false })
  const router = useRouter()

  if (mobile) {
    return null
  }

  return (
    <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
      {pagePaths.map((pagePath) => (
        <Link passHref href={pagePath} key={pagePath}>
          <NavButton
            color={getPageStuff(pagePath)[1]}
            isSelected={router.pathname === pagePath}
          >
            {getPageStuff(pagePath)[0]}
          </NavButton>
        </Link>
      ))}
    </HStack>
  )
}
