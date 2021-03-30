import { ColorModeScript } from '@chakra-ui/react'
import NextDocument, { Html, Head, Main, NextScript } from 'next/document'
import theme from '../theme'
import { Flex } from '../components/ui'

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Flex
            direction="column"
            minHeight="100vh"
            minWidth="100vw"
            backgroundImage="url(/background.png)"
            backgroundSize="cover"
            backgroundRepeat="no-repeat"
          >
            <Main />
            <NextScript />
          </Flex>
        </body>
      </Html>
    )
  }
}
