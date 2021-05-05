import { useMemo, useCallback, useState } from 'react'
import { useContractCall, useEthers } from '@usedapp/core'

import { useToast } from '../components/ui'
import { getContractFromProvider } from '../lib/contracts'
import { useContract } from './contracts'
import { useToken } from './tokens'

export interface AvantGardeTokenMintPrice {
  currentPrice: string;
  fees: string;
  total: string;
}
export interface AvantGardeTokenTotalSupply {
  current: string;
}

export const useMintPrice = (): AvantGardeTokenMintPrice | false => {

  const { address, abiInterface } = useContract();

  const callRes =
    useContractCall(
      address && abiInterface &&
      {
        abi: abiInterface,
        address,
        method: 'currentMintPrice',
        args: [],
      }
    )

  return useMemo<AvantGardeTokenMintPrice | false>(() =>
    callRes &&
    {
      currentPrice: callRes[0].toString(),
      fees: callRes[1].toString(),
      total: callRes[0].add(callRes[1]).toString()
    },
    [callRes]
  )

}

export const useTokenTotalSupply = (): AvantGardeTokenTotalSupply | false => {

  const { address, abiInterface } = useContract();

  const callRes =
    useContractCall(
      address && abiInterface &&
      {
        abi: abiInterface,
        address,
        method: 'totalSupply',
        args: [],
      }
    )

  return useMemo<AvantGardeTokenTotalSupply | false>(() =>
    callRes &&
    {
      current: callRes.toString(),
    },
    [callRes]
  )

}

export const useMint = () => {
  const { account, library } = useEthers();
  const [isMinting, setIsMinting] = useState<boolean>(false);
  const [mintTx, setMintTx] = useState<string | null>(null);
  const [minted, setMinted] = useState<boolean>(false);
  const tokenMintPrice = useMintPrice()
  const { startPolling } = useToken(account)
  const toast = useToast()

  const mint = useCallback((generationResult) => {
    if(!account || !tokenMintPrice) {
      throw new Error('cannot call mint if not connected 👎')
    }

    setIsMinting(true);

    getContractFromProvider(library)
      .then(c => c.connect(library.getSigner()))
      .then(contract =>
        contract.mint(generationResult.ipfsHashMetadata, generationResult.signature, {
          value: tokenMintPrice.total
        })
      )
      .then(tx => {
        setMintTx(tx.hash);
        return library.waitForTransaction(tx.hash)
      })
      .then(() => {
        setMinted(true);
        setIsMinting(false);
        startPolling();

        toast({
          title: "🎉 Token minted",
          description: 'Your image have been minted on the blockchain!',
          status: "success",
          duration: 5000,
          isClosable: true,
        })
      })
      .catch(error => {
        console.error(error);
        toast({
          title: "⚠️ Transaction error",
          description: error.message,
          status: "error",
          duration: 20000,
          isClosable: true,
        })
        setIsMinting(false);
      });
  }, [account, startPolling, tokenMintPrice]);

  return { mint, minted, mintTx, isMinting };
}

export const useCanMint = () => {
  const { account } = useEthers();
  const { token, fetching } = useToken(account)

  return useMemo<boolean>(() =>
    !account || !fetching && !token,
    [account, token, fetching]
  );
}
