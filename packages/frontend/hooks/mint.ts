import { useCallback, useState } from 'react'
import { Contract } from 'ethers'
import { useMemo } from 'react'
import { useMyToken, useTokens } from './tokens'
import { useWeb3 } from '../contexts/Web3Context'
import abi from '../../contracts/dist/ArbArt.abi.json'
import config from '../config'

export const useMint = () => {
  const { address, provider } = useWeb3();
  const { refresh: myTokenRefresh } = useMyToken(address);
  const { refresh: tokensRefresh } = useTokens(address);
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
      myTokenRefresh();
      tokensRefresh();
      setIsMinting(false);
    }).catch(error => {
      console.error(error);
      setIsMinting(false);
    });
  }, [myTokenRefresh, tokensRefresh, contract]);

  return { mint, isMinting };
}
