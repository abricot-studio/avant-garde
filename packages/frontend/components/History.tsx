import React from 'react'
import { useHistory } from '../hooks/history'
import { Box, Card, Wrap, WrapItem } from './ui'

export function History() {
  const { minted, balancePool, holders, burned } = useHistory()
  return (
    <Wrap spacing={4} justify="center" mx={12}>
      <WrapItem alignItems="center">
        <Card
          flexDirection="column"
          alignItems="center"
          mx={4}
          w={40}
          rounded="10%"
        >
          <Box textAlign="center" fontSize={32}>
            ⛏
          </Box>
          <Box fontWeight={700} fontSize={32} textAlign="center">
            {minted}
          </Box>
          <Box fontWeight="400" textAlign="center">
            Minted
          </Box>
        </Card>
        <Card
          flexDirection="column"
          alignItems="center"
          mx={4}
          w={40}
          rounded="10%"
        >
          <Box textAlign="center" fontSize={32}>
            💎
          </Box>
          <Box fontWeight={700} fontSize={32} textAlign="center">
            Ξ{' '}
            {Number.isNaN(parseFloat(balancePool))
              ? balancePool
              : Math.floor(parseFloat(balancePool) * 100) / 100}
          </Box>
          <Box fontWeight="400" textAlign="center">
            Pool
          </Box>
        </Card>
      </WrapItem>
      <WrapItem alignItems="center">
        <Card
          flexDirection="column"
          alignItems="center"
          mx={4}
          w={40}
          rounded="10%"
        >
          <Box textAlign="center" fontSize={32}>
            💘
          </Box>
          <Box fontWeight={700} fontSize={32} textAlign="center">
            {holders}
          </Box>
          <Box fontWeight="400" textAlign="center">
            Holders
          </Box>
        </Card>
        <Card
          flexDirection="column"
          alignItems="center"
          mx={4}
          w={40}
          rounded="10%"
        >
          <Box textAlign="center" fontSize={32}>
            🔥
          </Box>
          <Box fontWeight={700} fontSize={32} textAlign="center">
            {burned}
          </Box>
          <Box fontWeight="400" textAlign="center">
            Burned
          </Box>
        </Card>
      </WrapItem>
    </Wrap>
  )
}
