import { useCallback, useState } from 'react'
import { useMyToken } from './tokens'
import { useWeb3 } from '../contexts/Web3Context'
// import abi from '@arbart/contracts/dist/ArbArt.abi.json'

export const useMint = () => {
  const { address } = useWeb3();
  const { refresh } = useMyToken(address);
  const [isMinting, setIsMinting] = useState<boolean>(false);

  // console.log(abi);
  const mint = useCallback(() => {
    setIsMinting(true);
    refresh();
    setIsMinting(false);
  }, [refresh]);

  return { mint, isMinting };
}
