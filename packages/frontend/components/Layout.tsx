import { Box } from './ui'
import Header from './Header'

export default function Layout({ children }) {
  return (
    <Box>
      <Box>
        <Header />
        <main>{children}</main>
      </Box>
    </Box>
  )
}
