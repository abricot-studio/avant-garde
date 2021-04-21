import { useMemo } from 'react'
import { getExplorerAddressLink } from '@usedapp/core'
import { useWeb3 } from '../contexts/Web3Context'
import { getContractInfoFromNetwork } from '../lib/contracts'
import config from '../config'

export const useContract = () => {
  const { account } = useWeb3();

  const chainId = useMemo(() =>
    account?.chainId || config.defaultChainId,
    [account]
  )

  const { address, abi, abiInterface } = useMemo(() =>
      getContractInfoFromNetwork(chainId) || {},
    [chainId]
  )

  const etherscanURL = useMemo(() =>
    address ? getExplorerAddressLink(address, chainId) : '',
    [address, chainId]
  )

  return { address, abi, abiInterface, chainId, etherscanURL };
}
