import Link from 'next/link'
import React, { useMemo } from 'react'
import { useWindowScroll } from 'react-use'
import { LogoIcon } from '../../assets/icons'
import { Box, Button, Flex } from '../ui'
import { LoginButton } from './LoginButton'
import { Navigation } from './Navigation'

export function Header() {
  const { y } = useWindowScroll()
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
              fontSize="2rem"
              leftIcon={<LogoIcon />}
              bgColor="transparent"
              textTransform="none"
              _hover={{}}
              _active={{}}
              _focus={{}}
            >
              AvantGarde
            </Button>
          </Link>
        </Box>

        <Navigation />
        <LoginButton />
      </Flex>
    </Box>
  )
}
