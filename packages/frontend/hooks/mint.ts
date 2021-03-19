import { useCallback, useState } from 'react'
import { useMyToken } from './tokens'
import { useWeb3 } from '../contexts/Web3Context'

export const useMint = () => {
  const { address } = useWeb3();
  const { refresh } = useMyToken(address);
  const [isMinting, setIsMinting] = useState<boolean>(false);

  const mint = useCallback(() => {
    setIsMinting(true);
    refresh();
    setIsMinting(false);
  }, [refresh]);

  return { mint, isMinting };
}
