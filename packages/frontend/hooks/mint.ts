import { useContractCall, useEthers } from '@usedapp/core'
import { useCallback, useMemo, useState } from 'react'
import { ToastImageMinted, useToast } from '../components/ui'
import { getContractFromProvider } from '../lib/contracts'
import { useAuth } from './authContext'
import { useContract } from './contracts'

export interface AvantGardeTokenMintPrice {
  currentPrice: string
  fees: string
  total: string
}
export interface AvantGardeTokenTotalSupply {
  current: string
}

export const useMintPrice = (): AvantGardeTokenMintPrice | false => {
  const { address, abiInterface } = useContract()

  const callRes = useContractCall(
    address &&
      abiInterface && {
        abi: abiInterface,
        address,
        method: 'currentMintPrice',
        args: [],
      }
  )

  return useMemo<AvantGardeTokenMintPrice | false>(
    () =>
      callRes && {
        currentPrice: callRes[0].toString(),
        fees: callRes[1].toString(),
        total: callRes[0].add(callRes[1]).toString(),
      },
    [callRes]
  )
}

export const useTokenTotalSupply = (): AvantGardeTokenTotalSupply | false => {
  const { address, abiInterface } = useContract()

  const callRes = useContractCall(
    address &&
      abiInterface && {
        abi: abiInterface,
        address,
        method: 'totalSupply',
        args: [],
      }
  )

  return useMemo<AvantGardeTokenTotalSupply | false>(
    () =>
      callRes && {
        current: callRes.toString(),
      },
    [callRes]
  )
}

export const useMint = () => {
  const { account, library, chainId } = useEthers()
  const [isMinting, setIsMinting] = useState<boolean>(false)
  const [mintTx, setMintTx] = useState<string | null>(null)
  const [minted, setMinted] = useState<boolean>(false)
  const tokenMintPrice = useMintPrice()
  const { accountTokenStartPollingMint } = useAuth()
  const toast = useToast()

  const mint = useCallback(
    (generationResult) => {
      if (!account || !tokenMintPrice) {
        throw new Error('cannot call mint if not connected 👎')
      }

      setIsMinting(true)

      getContractFromProvider(library)
        .then((c) => c.connect(library.getSigner()))
        .then((contract) =>
          contract.mint(
            generationResult.ipfsHashMetadata,
            generationResult.signature,
            {
              value: tokenMintPrice.total,
            }
          )
        )
        .then((tx) => {
          setMintTx(tx.hash)
          return library.waitForTransaction(tx.hash)
        })
        .then(() => {
          setMinted(true)
          setIsMinting(false)
          accountTokenStartPollingMint()
          ToastImageMinted(toast, mintTx, chainId)
        })
        .catch((error) => {
          console.error(error)
          let message = error.message
          if (
            error.message.includes(
              'insufficient funds for intrinsic transaction cost'
            )
          ) {
            message = 'Not enough fund'
          }
          toast({
            title: '⚠️ Transaction error',
            description: message,
            status: 'error',
            duration: 20000,
            isClosable: true,
          })
          setIsMinting(false)
        })
    },
    [account, accountTokenStartPollingMint, tokenMintPrice]
  )

  return { mint, minted, mintTx, isMinting }
}

export const useCanMint = () => {
  const { account } = useEthers()
  const { accountToken, accountTokenFetching } = useAuth()

  return useMemo<boolean>(
    () => !account || (!accountTokenFetching && !accountToken),
    [account, accountToken, accountTokenFetching]
  )
}
