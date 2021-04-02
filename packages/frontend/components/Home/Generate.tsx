import React, { useEffect } from 'react'
import { utils } from 'ethers'
import { ActionButton, Box, Flex } from '../ui'
import { useImageGeneration, ImageGenerationStatus } from '../../hooks/generation'
import { getIpfsUrl } from '../../lib/ipfs'
import { useWeb3 } from '../../contexts/Web3Context'
import { useMint } from '../../hooks/mint'
import { useToken, useTokenMintPrice } from '../../hooks/tokens'
import { useRouter } from 'next/router'
import { ImageFrame } from '../ui/TokenImage'

export default function Generate() {
  const { account, connect, isConnecting } = useWeb3();
  const { token, fetching } = useToken(account?.address)
  const { tokenMintPrice, fetchingMint } = useTokenMintPrice()
  const { generateImage, isGenerating, generationResult } = useImageGeneration();
  const { mint, minted, isMinting } = useMint();
  const router = useRouter()

  useEffect(() => {
    if(token){
      router.push(`/token/${token.id}`)
    }
  }, [token])

  let cta;
  if(token || fetching) {
    cta = (
      <ActionButton
        isLoading
      >
        Loading token...
      </ActionButton>
    );
  } else if(fetchingMint) {
    cta = (
      <ActionButton
        isLoading
      >
        Loading token price...
      </ActionButton>
    );
  } else if(minted) {
    cta = (
      <ActionButton
        isDisabled
      >
        Mint successful !
      </ActionButton>
    );
  } else if(!account) {
    cta = (
      <ActionButton
        onClick={connect}
        isLoading={isConnecting}
      >Connect wallet</ActionButton>
    );
  } else if(generationResult) {
    cta = (
      <ActionButton
        onClick={() => mint(generationResult)}
        isLoading={isMinting}
        loadingText="Minting token..."
      >
        Mint for Ξ {utils.formatEther(utils.parseUnits(tokenMintPrice.total, 'wei') )}
      </ActionButton>
    );
  } else {
    cta = (
      <ActionButton
        onClick={() => generateImage(account.address)}
        isLoading={isGenerating}
        loadingText="Generating image"
      >
        Generate
      </ActionButton>
    )
  }

  const imageSrc = generationResult && generationResult.status === ImageGenerationStatus.SUCCESS && getIpfsUrl(generationResult.ipfsHashImage);
  return (
    <Flex direction="column" align="center">
      <ImageFrame src={imageSrc} isLoading={isGenerating} size={350} />
      <Box mt={8}>
        {cta}
      </Box>
    </Flex>
  )
}
