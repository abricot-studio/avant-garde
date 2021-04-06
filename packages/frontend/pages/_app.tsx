import Head from 'next/head'
import { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { config as faConfig } from '@fortawesome/fontawesome-svg-core'

import chakraTheme from '../theme'
import GoogleFonts from '../components/utils/Fonts'
import { Web3ContextProvider } from '../contexts/Web3Context'

faConfig.autoAddCss = false

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />

        <link rel="icon" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/favicons/android-icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/favicons/favicon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicons/favicon-16x16.png"
        />

        {process.env.ENABLE_ANALYTICS && (
          <script
            async
            defer
            data-domain="plausible.tech"
            src="https://plausible.tech/js/plausible.js"
            integrity="sha384-A95mlioU57RAFEh+gc9a71Kc08jTjT+ESRKYiJtPoN5ZRsMiDDCWdHQWGk1Q4YGP"
            crossOrigin="anonymous"
          />
        )}
      </Head>

      <GoogleFonts href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;200;300;400;500;600;700;800;900&family=Roboto+Mono:wght@100;200;300;400;500;600;700;800;900&display=swap" />
      <ChakraProvider theme={chakraTheme}>
        <Web3ContextProvider>
          <Component {...pageProps} />
        </Web3ContextProvider>
      </ChakraProvider>
    </>
  )
}

export default App
