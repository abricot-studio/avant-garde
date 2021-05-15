import { getExplorerAddressLink, useEthers } from '@usedapp/core'
import { useMemo } from 'react'
import { getContractInfoFromNetwork } from '../lib/contracts'

export const useContract = () => {
  const { chainId } = useEthers()

  const { address, abi, abiInterface } = useMemo(
    () => getContractInfoFromNetwork(chainId) || {},
    [chainId]
  )

  const etherscanURL = useMemo(
    () => (address ? getExplorerAddressLink(address, chainId) : ''),
    [address, chainId]
  )

  return { address, abi, abiInterface, chainId, etherscanURL }
}
