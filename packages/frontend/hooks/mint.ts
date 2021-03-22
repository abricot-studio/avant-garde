import { useCallback, useState } from 'react'
import { useMemo } from 'react'
import { useWeb3 } from '../contexts/Web3Context'
import { getContract } from '../lib/contracts'

export const useMint = () => {
  const { account } = useWeb3();
  const [isMinting, setIsMinting] = useState<boolean>(false);

  const contract = useMemo(() =>
      account ?
        getContract(account.provider.getSigner())
        :
        null,
    [account]
  );

  const mint = useCallback((generationResult) => {
    if(!account || !contract) {
      throw new Error('cannot call mint if not connected 👎')
    }

    setIsMinting(true);

    contract.mint(generationResult.ipfsHashMetadata, generationResult.signerAddress, generationResult.signature).then(tx =>
      account.provider.waitForTransaction(tx.hash)
    ).then(() => {
      setIsMinting(false);
    }).catch(error => {
      console.error(error);
      setIsMinting(false);
    });
  }, [account, contract]);

  return { mint, isMinting };
}
