import { useContractCall, useEthers } from '@usedapp/core'
import { useCallback, useMemo, useState } from 'react'
import { useToast } from '../components/ui'
import { getContractFromProvider } from '../lib/contracts'
import * as ga from '../lib/ga'
import { useAuth } from './authContext'
import { useContract } from './contracts'

export interface AvantGardeTokenBurnPrice {
  currentPrice: string
}

export const useBurnPrice = (): AvantGardeTokenBurnPrice | false => {
  const { address, abiInterface } = useContract()

  const callRes = useContractCall(
    address &&
      abiInterface && {
        abi: abiInterface,
        address,
        method: 'currentBurnPrice',
        args: [],
      }
  )

  return useMemo<AvantGardeTokenBurnPrice | false>(
    () =>
      callRes && {
        currentPrice: callRes.toString(),
      },
    [callRes]
  )
}

export const useBurn = () => {
  const { account, library } = useEthers()
  const [isBurning, setIsBurning] = useState<boolean>(false)
  const [burnTx, setBurnTx] = useState<string | null>(null)
  const [burned, setBurned] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(null)
  const tokenBurnPrice = useBurnPrice()
  const { accountTokenStartPollingBurn } = useAuth()

  const toast = useToast()

  const burn = useCallback(
    (tokenId) => {
      if (!account || !tokenBurnPrice) {
        throw new Error('cannot call burn if not connected 👎')
      }

      ga.event({
        action: 'burning_pending',
        params: {
          event_category: 'burning',
          event_label: 'burning_pending',
          value: '1',
        },
      })
      setIsBurning(true)
      setError(null)

      getContractFromProvider(library)
        .then((c) => c.connect(library.getSigner()))
        .then((contract) => contract.burn(tokenId, tokenBurnPrice.currentPrice))
        .then((tx) => {
          setBurnTx(tx.hash)
          return library.waitForTransaction(tx.hash)
        })
        .then(() => {
          setBurned(true)
          setIsBurning(false)
          accountTokenStartPollingBurn()

          toast({
            title: '🔥 Token burnt',
            description: 'You have destroyed your token!',
            status: 'success',
            duration: 5000,
            isClosable: true,
          })
          ga.event({
            action: 'burning_success',
            params: {
              event_category: 'burning',
              event_label: 'burning_success',
              value: '1',
            },
          })
        })
        .catch((error) => {
          console.error(error)

          toast({
            title: '⚠️ Transaction error',
            description: error.message,
            status: 'error',
            duration: 20000,
            isClosable: true,
          })

          setError(error)
          setIsBurning(false)
          ga.event({
            action: 'burning_error',
            params: {
              event_category: 'burning',
              event_label: 'burning_error',
              value: '1',
            },
          })
        })
    },
    [account, accountTokenStartPollingBurn, tokenBurnPrice]
  )

  return { burn, burned, burnTx, isBurning, error }
}
