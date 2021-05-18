import { ChakraProvider } from '@chakra-ui/react'
import { config as faConfig } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { DAppProvider } from '@usedapp/core'
import { AppProps } from 'next/app'
import Head from 'next/head'
import GoogleFonts from '../components/utils/Fonts'
import config from '../config'
import { WalletSelectorContextProvider } from '../lib/WalletSelector/context'
import { DAppConfig } from '../lib/web3'
import chakraTheme from '../theme'

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

        {config.enableAnalytics && (
          <script
            async
            defer
            data-domain="beta.avant-garde.gallery"
            src="https://plausible.mooni.tech/js/plausible.js"
            integrity="sha384-A95mlioU57RAFEh+gc9a71Kc08jTjT+ESRKYiJtPoN5ZRsMiDDCWdHQWGk1Q4YGP"
            crossOrigin="anonymous"
          />
        )}
      </Head>

      <GoogleFonts href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap&family=Roboto+Mono:wght@100;200;300;400;500;600;700;800;900&display=swap" />
      <ChakraProvider theme={chakraTheme}>
        <DAppProvider config={DAppConfig}>
          <WalletSelectorContextProvider>
            <Component {...pageProps} />
          </WalletSelectorContextProvider>
        </DAppProvider>
      </ChakraProvider>
    </>
  )
}

export default App
