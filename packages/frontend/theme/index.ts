import { ColorMode, extendTheme } from '@chakra-ui/react'

const config = {
  initialColorMode: 'light' as ColorMode,
  useSystemColorMode: false,
}

const styles = {
  global: {
    'html, body': (props) => ({
      color: props.colorMode === 'dark' ? 'white' : '#000000',
      fontFamily: 'Poppins, sans-serif',
      fontSize: ['14px', '16px'],
      fontWeight: 300,
      background: 'theme',
      minHeight: '100vh',
      WebkitTapHighlightColor: 'transparent',
    }),
    a: (props) => ({
      color: props.colorMode === 'dark' ? 'white' : '#000000',
      fontWeight: 300,
      focus: {
        outline: 'none',
        boxShadow: 'none',
      },
    }),
    button: (props) => ({
      color: props.colorMode === 'dark' ? 'white' : '#000000',
      focus: {
        outline: 'none',
        boxShadow: 'none',
      },
    }),
    b: {
      fontWeight: 400,
    },
  },
}

const components = {
  Button: {
    baseStyle: (props) => ({
      color: props.colorMode === 'dark' ? 'white' : '#000000',
      fontWeight: 700,
      textTransform: 'uppercase',
      cursor: 'pointer',
    }),
    variants: {},
  },
}

const layerStyles = {
  skyGradient: {
    bg: 'radial-gradient(82.17% 210.37% at 0.59% 2.48%, #0F214D 0%, #11224D 97.19%)',
  },
  textGradient: {
    bgGradient:
      'linear-gradient(110.78deg, rgba(255, 238, 238, 0.88) -3.19%, rgba(255, 115, 117, 0.82) 1.75%, rgba(227, 115, 255, 0.88) 49.98%, rgba(151, 115, 255, 0.96) 68.97%);',
    bgClip: 'text',
  },
}

const textStyles = {
  h1: (props) => ({
    color: props.colorMode === 'dark' ? 'white' : '#000000',
    fontFamily: '"Roboto Mono", sans-serif',
    fontWeight: 700,
    fontSize: ['1.3rem', '2rem', '3rem'],
  }),
  h2: {
    fontFamily: '"Roboto Mono", sans-serif',
    fontWeight: 600,
    fontSize: ['1.3rem', '2rem', '2.5rem'],
  },
  h3: {
    fontFamily: '"Roboto Mono", sans-serif',
    fontWeight: 600,
    fontSize: ['1.1rem', '1.1rem', '1.2rem'],
    textTransform: 'uppercase',
  },
  h4: {
    fontFamily: "'Roboto Mono', sans-serif",
    fontWeight: 300,
    fontSize: ['1rem', '1rem', '1.5rem'],
  },
  h5: {
    fontFamily: "'Roboto Mono', sans-serif",
    fontWeight: 300,
    fontSize: ['0.6rem', '0.8rem', '0.9rem'],
  },
  semibold: {
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 400,
    fontSize: '1.1rem',
  },
  normal: (props) => ({
    color: props.colorMode === 'dark' ? 'white' : '#000000',
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 300,
    fontSize: '1.1rem',
  }),
  small: {
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 300,
    fontSize: ['0.9rem'],
  },
  caption: {
    fontFamily: "'Roboto Mono', sans-serif",
    fontWeight: 700,
    textTransform: 'lowercase',
    fontSize: ['1rem', '1.2rem', '1.2rem', '1.2rem'],
    fontVariant: 'small-caps',
  },
  appName: (props) => ({
    color: props.colorMode === 'dark' ? 'white' : '#000000',
    fontFamily: '"Roboto Mono", sans-serif',
    fontWeight: 800,
    lineHeight: 1,
    fontSize: '2rem',
  }),
}

const colors = {
  sky: {
    300: '#11224dd3',
    600: '#11224D',
    800: '#0f214d',
  },
  theme: '#f3f3f3',
  reddy: '#FB6B6B',
  yellowy: '#FBE46B',
  greeny: '#6BFB9C',
  bluey: '#6B93FB',
  header: '#ffffff44',
  pink: '#FF45B5',
  pupu: '#BC6BFB',
  red: {
    100: '#FEEBEB',
    200: '#FCC5C5',
    300: '#FA9E9E',
    400: '#F87777',
    500: '#F65151',
    600: '#F42A2A',
    700: '#F31616',
    800: '#D50B0B',
    900: '#4E0404',
  },
}

export default extendTheme({
  config,
  textStyles,
  layerStyles,
  colors,
  styles,
  components,
})
