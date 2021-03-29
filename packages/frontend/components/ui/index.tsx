import React from 'react'
import { Text } from '@chakra-ui/react'

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
