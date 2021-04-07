import { useCallback, useState } from 'react'
import { useWeb3 } from '../contexts/Web3Context'
import { getContractFromProvider } from '../lib/contracts'
import { AvantGardeTokenMintPrice, useToken, fetchTokenPriceMint } from './tokens'
import { useToast } from '../components/ui'

export const useMint = () => {
  const { account } = useWeb3();
  const [isMinting, setIsMinting] = useState<boolean>(false);
  const [mintTx, setMintTx] = useState<string | null>(null);
  const [minted, setMinted] = useState<boolean>(false);
  const { startPolling } = useToken(account?.address)
  const toast = useToast()

  const mint = useCallback((generationResult) => {
    if(!account) {
      throw new Error('cannot call mint if not connected 👎')
    }

    setIsMinting(true);

    fetchTokenPriceMint(account.provider)
      .then( (avantGardeTokenMintPrice: AvantGardeTokenMintPrice) =>
        getContractFromProvider(account.provider)
          .then(c => c.connect(account.provider.getSigner()))
          .then(contract =>
            contract.mint(generationResult.ipfsHashMetadata, generationResult.signature, {
              value: avantGardeTokenMintPrice.total
            })
          )
          .then(tx => {
            setMintTx(tx.hash);
            return account.provider.waitForTransaction(tx.hash)
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
      )
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
  }, [account, startPolling]);

  return { mint, minted, mintTx, isMinting };
}
