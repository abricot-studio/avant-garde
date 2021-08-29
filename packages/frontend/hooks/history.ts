import { useEtherBalance } from '@usedapp/core'
import { formatEther } from 'ethers/lib/utils'
import { useMemo } from 'react'
import { useContract } from './contracts'
import { useTokens } from './tokens'

export const useHistory = () => {
  const { address } = useContract()
  const balancePoolRaw = useEtherBalance(address)
  const { tokens } = useTokens({
    first: 200,
  })
  const balancePool = useMemo(
    () => (balancePoolRaw ? formatEther(balancePoolRaw) : '...'),
    [balancePoolRaw]
  )
  const minted = useMemo(
    () => (Array.isArray(tokens) ? tokens.length : '...'),
    [tokens]
  )
  const holders = useMemo(
    () =>
      Array.isArray(tokens)
        ? tokens.filter((token) => !token.burnTimestamp).length
        : '...',
    [tokens]
  )
  const burned = useMemo(
    () =>
      Array.isArray(tokens)
        ? tokens.filter((token) => token.burnTimestamp).length
        : '...',
    [tokens]
  )
  return {
    minted,
    balancePool,
    holders,
    burned,
  }
}
