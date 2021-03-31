import React from 'react'
import { ButtonProps, forwardRef, Text, Button as ChakraButton } from '@chakra-ui/react'

export * from '@chakra-ui/react'

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
export const ActionButton = forwardRef<ButtonProps & ActionButtonProps, "a">( ({ children, color = 'pink', ...props }, ref) => {
  return (
    <Button
      ref={ref}
      variant="outline"
      border="2px"
      color={color}
      borderColor={color}
      borderRadius="4rem"
      size="lg"
      _hover={{}}
      {...props}
    >{children}</Button>
  )
})
