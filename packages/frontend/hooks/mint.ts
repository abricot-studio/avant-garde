import { useCallback, useState } from 'react'
import { useWeb3 } from '../contexts/Web3Context'
import { getContract } from '../lib/contracts'

export const useMint = () => {
  const { account } = useWeb3();
  const [isMinting, setIsMinting] = useState<boolean>(false);

  const mint = useCallback((generationResult) => {
    if(!account) {
      throw new Error('cannot call mint if not connected 👎')
    }

    setIsMinting(true);

    getContract(account.provider)
      .then(c => c.connect(account.provider.getSigner()))
      .then(contract =>
        contract.mint(generationResult.ipfsHashMetadata, generationResult.signerAddress, generationResult.signature).then(tx =>
          account.provider.waitForTransaction(tx.hash)
        ))
      .then(() => {
        setIsMinting(false);
      })
      .catch(error => {
        console.error(error);
        setIsMinting(false);
      });
  }, [account]);

  return { mint, isMinting };
}
