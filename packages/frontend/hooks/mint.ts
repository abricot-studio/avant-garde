import { useCallback, useState } from 'react'
import { useWeb3 } from '../contexts/Web3Context'
import { getContract } from '../lib/contracts'
import { ArbArtTokenMintPrice, useToken, fetchTokenPriceMint } from './tokens'

export const useMint = () => {
  const { account } = useWeb3();
  const [isMinting, setIsMinting] = useState<boolean>(false);
  const [mintTx, setMintTx] = useState<string | null>(null);
  const [minted, setMinted] = useState<boolean>(false);
  const { startPolling } = useToken(account?.address)

  const mint = useCallback((generationResult) => {
    if(!account) {
      throw new Error('cannot call mint if not connected 👎')
    }

    setIsMinting(true);

    fetchTokenPriceMint(account.provider)
      .then( (arbArtTokenMintPrice: ArbArtTokenMintPrice) => {

        getContract(account.provider)
          .then(c => c.connect(account.provider.getSigner()))
          .then(contract =>
            contract.mint(generationResult.ipfsHashMetadata, generationResult.signature, {
              value: arbArtTokenMintPrice.total
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
          })
          .catch(error => {
            console.error(error);
            setIsMinting(false);
          });
      })
  }, [account, startPolling]);

  return { mint, minted, mintTx, isMinting };
}
