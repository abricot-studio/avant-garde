import { WalletSelectorModal } from '../lib/WalletSelector/modal'
import { Footer } from './Footer'
import { Header } from './header'
import { Flex, Box } from './ui'
import { NetworkChecker } from './utils/NetworkChecker'

export default function Layout({ children }) {
  return (
    <Flex
      minHeight="100vh"
      backgroundImage="url(/background.png)"
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      backgroundAttachment="fixed"
      position="relative"
      flexDirection="column"
    >
      <Header />

      <Box as="main" py={8}>
        <NetworkChecker>{children}</NetworkChecker>
      </Box>

      <Footer />

      <WalletSelectorModal />
    </Flex>
  )
}
