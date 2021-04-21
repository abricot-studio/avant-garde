import { useCallback, useMemo, useState } from 'react'
import { getContractFromProvider } from '../lib/contracts'
import { useToast } from '../components/ui'
import { useContract } from './contracts'
import { useContractCall, useEthers } from '@usedapp/core'

export interface AvantGardeTokenBurnPrice {
  currentPrice: string;
}

export const useBurnPrice = (): AvantGardeTokenBurnPrice | false => {

  const { address, abiInterface } = useContract();

  const callRes =
    useContractCall(
      address && abiInterface &&
      {
        abi: abiInterface,
        address,
        method: 'currentBurnPrice',
        args: [],
      }
    )

  return useMemo<AvantGardeTokenBurnPrice | false>(() =>
    callRes &&
    {
      currentPrice: callRes.toString(),
    },
    [callRes]
  )

}

export const useBurn = () => {
  const { library } = useEthers();
  const [isBurning, setIsBurning] = useState<boolean>(false);
  const [burnTx, setBurnTx] = useState<string | null>(null);
  const [burned, setBurned] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(null);
  const toast = useToast()

  const burn = useCallback((tokenId) => {
    if(!library) {
      throw new Error('cannot call burn if not connected 👎')
    }

    setIsBurning(true);
    setError(null);

    getContractFromProvider(library)
      .then(c => c.connect(library.getSigner()))
      .then(contract =>
        contract.burn(tokenId)
      )
      .then(tx => {
        setBurnTx(tx.hash);
        return library.waitForTransaction(tx.hash)
      })
      .then(() => {
        setBurned(true);
        setIsBurning(false);

        toast({
          title: "🔥 Token burnt",
          description: 'You have destroyed your token!',
          status: "success",
          duration: 5000,
          isClosable: true,
        })

      })
      .catch(error => {
        console.error(error);

        toast({
          title: "⚠️ Transaction error",
          description: error.meesage,
          status: "error",
          duration: 20000,
          isClosable: true,
        })

        setError(error);
        setIsBurning(false);
      });
  }, [library]);

  return { burn, burned, burnTx, isBurning, error };
}
