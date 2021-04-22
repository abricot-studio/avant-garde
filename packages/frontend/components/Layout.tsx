import { Box } from './ui'
import { Header } from './header'
import { Footer } from './Footer'
import { NetworkChecker } from './utils/NetworkChecker'

export default function Layout({ children }) {
  return (
    <Box
      minHeight="100vh"
      backgroundImage="url(/background.png)"
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      backgroundAttachment="fixed"
      position="relative"
    >
      <Header />

      <Box
        as="main"
        py={8}
      >
        <NetworkChecker>
          {children}
        </NetworkChecker>
      </Box>

      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
      >
        <Footer />
      </Box>
    </Box>
  )
}
