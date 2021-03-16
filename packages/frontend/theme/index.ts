import { extendTheme, ColorMode } from '@chakra-ui/react'

const config = {
  initialColorMode: 'dark' as ColorMode,
  useSystemColorMode: false,
}

const styles = {
  global: {
    'html, body': {
      fontFamily: '"Lato", sans-serif',
      fontSize: '16px',
      fontWeight: 300,
      background: 'theme',
    },
    a: {
      color: '#FFFEF2',
      fontWeight: 300,
    },
    b: {
      fontWeight: 400,
    },
  },
}

const components = {
  Button: {
    baseStyle: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 700,
      textTransform: 'uppercase',
    },
    variants: {
      outline: {
        border: '1px solid',
        borderColor: 'rgba(255, 238, 238, 0.68)',
      },
      fluo: {
        bg:
          'linear-gradient(110.78deg, rgba(255, 238, 238, 0.68) -3.19%, rgba(255, 115, 117, 0.82) 1.75%, rgba(227, 115, 255, 0.68) 49.98%, rgba(151, 115, 255, 0.76) 68.97%);',
        color: '#FFFEF2',
      },
      white: {
        bg: '#FFFEF2',
        color: 'rgba(151, 115, 255, 0.76)',
      },
      link: {
        textTransform: 'initial',
        fontWeight: 300,
      },
    },
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
    fontFamily: '"Montserrat", sans-serif',
    fontWeight: 700,
    fontSize: ['1.3rem', '2rem', '3rem'],
  },
  h2: {
    fontFamily: '"Montserrat", sans-serif',
    fontWeight: 600,
    fontSize: ['1.3rem', '2rem', '2.5rem'],
  },
  h3: {
    fontFamily: '"Montserrat", sans-serif',
    fontWeight: 600,
    fontSize: ['1.1rem', '1.1rem', '1.2rem'],
    textTransform: 'uppercase',
  },
  h4: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 300,
    fontSize: ['1rem', '1rem', '1.5rem'],
  },
  semibold: {
    fontFamily: '"Lato", sans-serif',
    fontWeight: 400,
    fontSize: '1.1rem',
  },
  normal: {
    fontFamily: '"Lato", sans-serif',
    fontWeight: 300,
    fontSize: '1.1rem',
  },
  small: {
    fontFamily: '"Lato", sans-serif',
    fontWeight: 300,
    fontSize: ['0.9rem'],
  },
  caption: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 700,
    textTransform: 'lowercase',
    fontSize: ['1rem', '1.2rem', '1.2rem', '1.2rem'],
    fontVariant: 'small-caps',
  },
  appName: {
    fontFamily: '"Montserrat", sans-serif',
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
  theme: '#4c1145',
}

export default extendTheme({
  config,
  textStyles,
  layerStyles,
  colors,
  styles,
  components,
})
