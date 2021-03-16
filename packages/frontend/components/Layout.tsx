import { Box } from './ui'

export default function Layout({ children }) {
  return (
    <Box>
      <Box>
        <main>{children}</main>
      </Box>
    </Box>
  )
}
