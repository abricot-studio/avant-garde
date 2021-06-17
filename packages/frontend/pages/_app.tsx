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

// export function reportWebVitals(metric: NextWebVitalsMetric) {
// ga.event({
//   action: `metric_${metric.name}`,
//   params: {
//     event_category:
//       metric.label === 'web-vital' ? 'Web Vitals' : 'Next.js custom metric',
//     value: Math.round(
//       metric.name === 'CLS' ? metric.value * 1000 : metric.value
//     ), // values must be integers
//     event_label: metric.id, // id unique to current page load
//     non_interaction: true, // avoids affecting bounce rate.
//   },
// })
// }

export const mask = (matchedString) =>
  matchedString.replace(
    /[^\/\\]+/g,
    (part) =>
      `*(${encodeURIComponent(
        Buffer.from(part).toString('base64').replace(/==?$/, '')
      )})*`
  )
function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <link rel="manifest" href="manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/favicons/android-chrome-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="180x180"
          href="/favicons/apple-touch-icon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="120x120"
          href="/favicons/apple-touch-icon-152x152.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="152x152"
          href="/favicons/apple-touch-icon-120x120.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="76x76"
          href="/favicons/apple-touch-icon-76x76.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="60x60"
          href="/favicons/apple-touch-icon-60x60.png"
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
          sizes="16x16"
          href="/favicons/favicon-16x16.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicons/apple-touch-icon-180x180.png"
        />
        <link
          rel="mask-icon"
          href="/favicons/safari-pinned-tab.svg"
          color="#ffffff"
        />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />

        {config.enableAnalytics && (
          <>
            <script
              async
              src={`${config.analyticsDomain}/${mask(
                `www.googletagmanager.com/gtag/js?id=${config.analyticsId}`
              )}`}
            ></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${config.analyticsId}', {
              page_path: window.location.pathname,
            });
          `,
              }}
            />
          </>
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
