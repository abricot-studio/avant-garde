import { Box, Flex } from './ui'
import Header from './Header'

export default function Layout({ children }) {
  return (
    <Box>
      <Box
        height="100vh"
        width="100vw"
        backgroundImage="url(/background.png)"
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        position="absolute"
        zIndex={-1}
      />
      <Box>
        <Header />
        <main>{children}</main>
      </Box>
    </Box>
  )
}
