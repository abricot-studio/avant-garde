import React from 'react'
import { Button as ChakraButton, Text } from '@chakra-ui/react'

export * from '@chakra-ui/react'

export const Button = ({ variant = undefined, children, ...props }) => (
  <ChakraButton variant={variant} {...props}>
    <Text
      layerStyle={variant === 'white' ? 'textGradient' : undefined}
      fontSize={variant !== 'link' ? '1.3rem' : undefined}
      lineHeight={variant !== 'link' ? '24px' : undefined}
      marginBottom={variant !== 'link' ? '2px' : undefined}
      textTransform={variant !== 'link' ? 'lowercase' : undefined}
      sx={variant !== 'link' ? { fontVariant: 'small-caps' } : undefined}
    >
      {children}
    </Text>
  </ChakraButton>
)
