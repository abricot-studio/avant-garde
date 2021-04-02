import React, { useEffect } from 'react'
import { utils } from 'ethers'
import { ActionButton, Box, Flex, Text } from '../ui'
import { useImageGeneration, ImageGenerationStatus } from '../../hooks/generation'
import { getIpfsUrl } from '../../lib/ipfs'
import { useWeb3 } from '../../contexts/Web3Context'
import { useMint } from '../../hooks/mint'
import { useToken, useTokenPriceMint } from '../../hooks/tokens'
import { useRouter } from 'next/router'
import { ImageFrame } from '../ui/TokenImage'

export default function Generate() {
  const { account, connect, isConnecting } = useWeb3();
  const { token, fetching } = useToken(account?.address)
  const { tokenMintPrice, fetching: fetchingMint } = useTokenPriceMint()
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
        borderRadius="1rem"
        border="2px"
        borderColor="#C345FF"
        color="#C345FF"
        bgColor="white"
        px={12}
        rounded="full"
        _hover={{}}
        _active={{}}
      >
        Loading token...
      </ActionButton>
    );
  } else if(fetchingMint) {
    cta = (
      <ActionButton
        isLoading
        borderRadius="1rem"
        border="2px"
        borderColor="#C345FF"
        color="#C345FF"
        bgColor="white"
        px={12}
        rounded="full"
        _hover={{}}
        _active={{}}
      >
        Loading mint price...
      </ActionButton>
    );
  } else if(minted) {
    cta = (
      <ActionButton
        isDisabled
        borderRadius="1rem"
        border="2px"
        borderColor="#C345FF"
        color="#C345FF"
        bgColor="white"
        px={12}
        rounded="full"
        _hover={{}}
        _active={{}}
      >
        Mint successful !
      </ActionButton>
    );
  } else if(!account) {
    cta = (
      <ActionButton
        onClick={connect}
        isLoading={isConnecting}
        borderRadius="1rem"
        border="2px"
        borderColor="#C345FF"
        color="#C345FF"
        bgColor="white"
        px={12}
        rounded="full"
        _hover={{}}
        _active={{}}
      >Connect wallet</ActionButton>
    );
  } else if(generationResult) {
    cta = (
      <ActionButton
        onClick={() => mint(generationResult)}
        isLoading={isMinting}
        loadingText="Minting token..."
        borderRadius="1rem"
        border="2px"
        borderColor="#C345FF"
        color="#C345FF"
        bgColor="white"
        px={12}
        rounded="full"
        _hover={{}}
        _active={{}}
      >
        Mint for <Text ml={4}>Ξ {utils.formatEther(utils.parseUnits(tokenMintPrice.total, 'wei') )}</Text>
      </ActionButton>
    );
  } else {
    cta = (
      <ActionButton
        onClick={() => generateImage(account.address)}
        isLoading={isGenerating}
        loadingText="~30sec Processing..."
        borderRadius="1rem"
        border="2px"
        borderColor="#C345FF"
        color="#C345FF"
        bgColor="white"
        px={12}
        rounded="full"
        _hover={{}}
        _active={{}}
      >
        Generate
      </ActionButton>
    )
  }

  const imageSrc = generationResult && generationResult.status === ImageGenerationStatus.SUCCESS && getIpfsUrl(generationResult.ipfsHashImage);
  return (
    <Flex direction="column" align="center">
      <Box position="absolute" top="35%">
      </Box>
      <ImageFrame
        src={imageSrc}
        isLoading={isGenerating}
        size={350}
        isQuestion={!isGenerating && !generationResult}
      />
      <Box mt={8}>
        {cta}
      </Box>
    </Flex>
  )
}
