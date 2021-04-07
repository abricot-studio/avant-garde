import React, { useMemo } from 'react'
import { useWindowScroll } from 'react-use'
import Link from 'next/link'
import {
  Button,
  Flex,
  Box,
  HStack,
  ButtonProps,
  forwardRef,
} from '../ui'
import { useRouter } from 'next/router'
import { LogoIcon } from './Icons'
import { LoginButton } from './LoginButton'

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
      leftIcon={
        <Box
          w={4}
          h={4}
          background={color}
        />
      }
      {...props}
    >{children}</Button>
  )
})


export function Header() {
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
              _hover={{}}
              _active={{}}
              _focus={{}}
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
