import { extendTheme, ColorMode } from '@chakra-ui/react'

const config = {
  initialColorMode: 'light' as ColorMode,
  useSystemColorMode: false,
}

const styles = {
  global: {
    'html, body': {
      fontFamily: '"Roboto", sans-serif',
      fontSize: ['14px', '16px'],
      fontWeight: 300,
    },
    a: {
      color: '#000000',
      fontWeight: 300,
      _focus: {
        outline: 'none'
      }
    },
    b: {
      fontWeight: 400,
    },
  },
}

const components = {
  Button: {
    baseStyle: {
      fontWeight: 700,
      textTransform: 'uppercase',
      cursor: 'pointer'
    },
    variants: {},
  },
}

const layerStyles = {
  skyGradient: {
    bg:
      'radial-gradient(82.17% 210.37% at 0.59% 2.48%, #0F214D 0%, #11224D 97.19%)',
  },
  textGradient: {
    bgGradient:
      'linear-gradient(110.78deg, rgba(255, 238, 238, 0.88) -3.19%, rgba(255, 115, 117, 0.82) 1.75%, rgba(227, 115, 255, 0.88) 49.98%, rgba(151, 115, 255, 0.96) 68.97%);',
    bgClip: 'text',
  },
}

const textStyles = {
  h1: {
    fontFamily: '"Roboto Mono", sans-serif',
    fontWeight: 700,
    fontSize: ['1.3rem', '2rem', '3rem'],
  },
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
  semibold: {
    fontFamily: '"Roboto", sans-serif',
    fontWeight: 400,
    fontSize: '1.1rem',
  },
  normal: {
    fontFamily: '"Roboto", sans-serif',
    fontWeight: 300,
    fontSize: '1.1rem',
  },
  small: {
    fontFamily: '"Roboto", sans-serif',
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
  appName: {
    fontFamily: '"Roboto Mono", sans-serif',
    fontWeight: 300,
    textTransform: 'uppercase',
    letterSpacing: '0.14rem',
    lineHeight: 1,
    fontSize: ['1.8rem', '2rem', '2.5rem', '2.5rem'],
  },
}

const colors = {
  sky: {
    300: '#11224dd3',
    600: '#11224D',
    800: '#0f214d',
  },
  theme: '#ffffff',
  red: '#FB6B6B',
  green: '#6BFB9C',
  blue: '#6B93FB',
}

export default extendTheme({
  config,
  textStyles,
  layerStyles,
  colors,
  styles,
  components,
})
