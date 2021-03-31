import { Box } from './ui'
import Header from './Header'

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
        <Box py={12}>
          {children}
        </Box>
      </main>
    </Box>
  )
}
