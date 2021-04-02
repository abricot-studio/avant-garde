import { useCallback, useState } from 'react'
import { useWeb3 } from '../contexts/Web3Context'
import { getContract } from '../lib/contracts'

export const useBurn = () => {
  const { account } = useWeb3();
  const [isBurning, setIsBurning] = useState<boolean>(false);
  const [burnTx, setBurnTx] = useState<string | null>(null);
  const [burned, setBurned] = useState<boolean>(false);

  const burn = useCallback((tokenId) => {
    if(!account) {
      throw new Error('cannot call burn if not connected 👎')
    }

    setIsBurning(true);

    getContract(account.provider)
      .then(c => c.connect(account.provider.getSigner()))
      .then(contract =>
        contract.burn(tokenId)
      )
      .then(tx => {
        setBurnTx(tx.hash);
        return account.provider.waitForTransaction(tx.hash)
      })
      .then(() => {
        setBurned(true);
        setIsBurning(false);
      })
      .catch(error => {
        console.error(error);
        setIsBurning(false);
      });
  }, [account]);

  return { burn, burned, burnTx, isBurning };
}
