import { CloseIcon } from '@chakra-ui/icons'
import {
  Box,
  BoxProps,
  Button as ChakraButton,
  ButtonProps,
  Center,
  Flex,
  forwardRef,
  HStack,
  IconButton as ChakraIconButton,
  IconButtonProps,
  Link as CLink,
  Spinner,
  Text,
} from '@chakra-ui/react'
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getExplorerTransactionLink } from '@usedapp/core'
import React, { MouseEventHandler } from 'react'

export * from '@chakra-ui/react'

export function Card({ children, ...props }) {
  return (
    <Box borderRadius="md" bg="white" boxShadow="md" p={4} {...props}>
      {children}
    </Box>
  )
}
export function Address({ children, ...props }) {
  return (
    <Text isTruncated maxWidth="100%" {...props}>
      {children}
    </Text>
  )
}

export const Button = forwardRef<ButtonProps, 'a'>(
  ({ children, ...props }, ref) => {
    return (
      <ChakraButton
        ref={ref}
        fontWeight={600}
        size="md"
        textTransform="none"
        color="black"
        sx={{
          userSelect: 'none',
          touchCallout: 'none',
        }}
        _focus={{
          outline: 'none',
          boxShadow: 'none',
        }}
        _active={{
          outline: 'none',
        }}
        lineHeight={1}
        {...props}
      >
        {children}
      </ChakraButton>
    )
  }
)
export const IconButton = forwardRef<IconButtonProps, 'a'>(
  ({ children, ...props }, ref) => {
    return (
      <ChakraIconButton
        ref={ref}
        _hover={{}}
        lineHeight={1}
        color="black"
        sx={{
          userSelect: 'none',
          touchCallout: 'none',
        }}
        _focus={{
          outline: 'none',
        }}
        _active={{
          outline: 'none',
        }}
        {...props}
      >
        {children}
      </ChakraIconButton>
    )
  }
)

interface ActionButtonProps {
  color?: string
}
export const ActionButton = forwardRef<ButtonProps & ActionButtonProps, 'a'>(
  (
    { children, loadingText, isLoading, color = 'pink', px = 12, ...props },
    ref
  ) => {
    return (
      <Button
        ref={ref}
        variant="outline"
        border="0"
        size="md"
        fontWeight={600}
        color="black"
        px={0}
        sx={{
          userSelect: 'none',
          touchCallout: 'none',
        }}
        _active={{
          outline: 'none',
        }}
        _hover={{
          outline: 'none',
        }}
        isDisabled={isLoading}
        {...props}
      >
        <Box
          p="2px"
          rounded="full"
          w="100%"
          h="100%"
          sx={{
            background:
              'linear-gradient(60deg, hsl(224, 85%, 66%), hsl(269, 85%, 66%), hsl(314, 85%, 66%), hsl(359, 85%, 66%), hsl(44, 85%, 66%), hsl(89, 85%, 66%), hsl(134, 85%, 66%), hsl(179, 85%, 66%))',
            backgroundSize: '300% 300%',
            backgroundPosition: '0 50%',
            animation: 'moveGradient 4s alternate infinite',
            '@keyframes moveGradient': {
              '50%': {
                backgroundPosition: '100% 50%',
              },
            },
          }}
        >
          <Flex
            bg="white"
            rounded="full"
            w="100%"
            h="100%"
            px={px}
            align="center"
            justify="center"
          >
            {isLoading ? (
              <HStack>
                <Spinner size="sm" mr={2} />
                <Box>{loadingText}</Box>
              </HStack>
            ) : (
              children
            )}
          </Flex>
        </Box>
      </Button>
    )
  }
)

interface ToastContainerProps {
  onClose: MouseEventHandler
}

export const ToastContainer = forwardRef<BoxProps & ToastContainerProps, 'div'>(
  ({ children, onClose, ...props }, ref) => {
    return (
      <Box color="white" p={2} bg="green.500" rounded="md" ref={ref} {...props}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          icon={<CloseIcon />}
          backgroundColor="transparent"
          rounded="full"
          size="xs"
          float="right"
        />
        {children}
      </Box>
    )
  }
)

export const ToastImageGenerated = (toast, router) => {
  const t = toast({
    render: () => (
      <ToastContainer onClose={() => toast.close(t)}>
        <Box>
          <Text textAlign="center" fontWeight={700}>
            {' '}
            🎉 Image generated
          </Text>
          <Text textAlign="center">Your image has been generated!</Text>
          <Center>
            <Button
              color="white"
              bg="transparent"
              size="sm"
              _hover={{}}
              _active={{}}
              _focus={{}}
              onClick={() => {
                router.push('/generator')
                toast.close(t)
              }}
            >
              Open
            </Button>
          </Center>
        </Box>
      </ToastContainer>
    ),
    status: 'success',
    duration: 5000,
    isClosable: true,
  })
}

export const ToastImageMinted = (toast, mintTx, chainId) => {
  const t = toast({
    render: () => (
      <Box color="white" p={2} bg="green.500" rounded="md">
        <IconButton
          aria-label="close"
          onClick={() => toast.close(t)}
          icon={<CloseIcon />}
          backgroundColor="transparent"
          rounded="full"
          size="xs"
          float="right"
        />
        <Text textAlign="center" fontWeight={700}>
          {' '}
          🎉 Token minted
        </Text>
        <Text textAlign="center">
          Your image have been minted on the blockchain!{' '}
        </Text>
        <Center>
          <CLink
            href={getExplorerTransactionLink(mintTx, chainId)}
            isExternal
            color="#6B93FB"
          >
            <Button
              rightIcon={<FontAwesomeIcon icon={faExternalLinkAlt} size="1x" />}
              color="white"
              bg="transparent"
              size="sm"
              _hover={{}}
              _active={{}}
              _focus={{}}
            >
              Open Transaction
            </Button>
          </CLink>
        </Center>
      </Box>
    ),
    status: 'success',
    duration: 5000,
    isClosable: true,
  })
}

export function SocialLink({ href, icon, label, ...props }) {
  return (
    <CLink href={href} isExternal {...props}>
      <IconButton
        icon={icon}
        aria-label={label}
        border="none"
        borderRadius="full"
        size="lg"
        backgroundColor="white"
        _hover={{}}
        _focus={{
          outline: 'none',
        }}
        _active={{
          outline: 'none',
        }}
        boxShadow="0px 4px 4px rgba(0, 0, 0, 0.15)"
      />
    </CLink>
  )
}
