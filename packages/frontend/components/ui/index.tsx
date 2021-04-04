import React from 'react'
import { Box, Flex, HStack, ButtonProps, forwardRef, Text, Spinner, Button as ChakraButton } from '@chakra-ui/react'

export * from '@chakra-ui/react'

export function Card({ children, ...props }) {
  return (
    <Box
      borderRadius="md"
      bg="white"
      boxShadow="md"
      p={4}
      {...props}
    >
      {children}
    </Box>
  )
}
export function Address({ children, ...props }) {
  return (
    <Text
      isTruncated
      maxWidth="100%"
      {...props}
    >
      {children}
    </Text>
  )
}

export const Button = forwardRef<ButtonProps, "a">( ({ children, ...props }, ref) => {
  return (
    <ChakraButton
      ref={ref}
      _focus={{
        outline: "none"
      }}
      {...props}
    >{children}</ChakraButton>
  )
})

interface ActionButtonProps {
  color?: string;
}
export const ActionButton = forwardRef<ButtonProps & ActionButtonProps, "a">( ({ children, loadingText, isLoading , color = 'pink', ...props }, ref) => {
  return (
    <Button
      ref={ref}
      variant="outline"
      border="0"
      size="md"
      px={0}
      _active={{}}
      _hover={{}}
      isDisabled={isLoading}
      {...props}
    >
      <Box
        p="2px"
        rounded="full"
        w="100%"
        h="100%"
        sx={{
          background: "linear-gradient(60deg, hsl(224, 85%, 66%), hsl(269, 85%, 66%), hsl(314, 85%, 66%), hsl(359, 85%, 66%), hsl(44, 85%, 66%), hsl(89, 85%, 66%), hsl(134, 85%, 66%), hsl(179, 85%, 66%))",
          backgroundSize: "300% 300%",
          backgroundPosition: "0 50%",
          animation: "moveGradient 4s alternate infinite",
          "@keyframes moveGradient": {
            "50%": {
              backgroundPosition: "100% 50%"
            }
          }
        }}
      >
        <Flex
          bg="white"
          rounded="full"
          w="100%"
          h="100%"
          px={12}
          align="center"
          justify="center"
        >
          {isLoading ?
            <HStack>
              <Spinner size="sm" mr={2} />
              <Box>{loadingText}</Box>
            </HStack>
            :
            children
          }
        </Flex>
      </Box>
    </Button>
  )
})
