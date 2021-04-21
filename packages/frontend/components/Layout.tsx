import { Box } from './ui'
import { Header } from './Header'
import { NetworkChecker } from './utils/NetworkChecker'
import { WalletSelectorModal } from '../lib/WalletSelector/modal'

export default function Layout({ children }) {
  return (
    <Box
      minHeight="100vh"
      backgroundImage="url(/background.png)"
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      backgroundAttachment="fixed"
    >
      <Header />
      <main>
        <Box py={8}>
          <NetworkChecker>
            {children}
          </NetworkChecker>
        </Box>
      </main>
      <WalletSelectorModal />
    </Box>
  )
}
