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
        position="fixed"
        zIndex={-1}
      />
      <Box>
        <Header />
        <main>
          <Box py={12}>
            {children}
          </Box>
        </main>
      </Box>
    </Box>
  )
}
