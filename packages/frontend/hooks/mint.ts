import { useCallback, useState } from 'react'
import { Contract } from 'ethers'
import { useMemo } from 'react'
import { useMyToken } from './tokens'
import { useWeb3 } from '../contexts/Web3Context'
import abi from '../../contracts/dist/ArbArt.abi.json'
import config from '../config'

export const useMint = () => {
  const { address, provider } = useWeb3();
  const { refresh } = useMyToken(address);
  const [isMinting, setIsMinting] = useState<boolean>(false);

  const contract = useMemo(() =>
      provider ?
        new Contract(config.contractAddress, abi, provider.getSigner())
        :
        null,
    [provider]
  );

  const mint = useCallback((generationResult) => {
    setIsMinting(true);
    contract.mint(generationResult.ipfsHashMetadata, generationResult.signerAddress, generationResult.signature).then(tx =>
      tx.wait()
    ).then(() => {
      refresh();
      setIsMinting(false);
    }).catch(error => {
      console.error(error);
      setIsMinting(false);
    });
  }, [refresh, contract]);

  return { mint, isMinting };
}
