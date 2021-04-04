import React, { useEffect } from 'react'
import { utils } from 'ethers'
import { ActionButton, Box, Card, Flex, HStack, Text, VStack } from '../ui'
import { useImageGeneration, ImageGenerationStatus } from '../../hooks/generation'
import { getIpfsUrl } from '../../lib/ipfs'
import { useWeb3 } from '../../contexts/Web3Context'
import { useMint } from '../../hooks/mint'
import { useToken, useTokenPriceMint } from '../../hooks/tokens'
import { useRouter } from 'next/router'
import { ImageFrame } from '../ui/TokenImage'

export default function Generate() {
  const { account, connect, isConnecting } = useWeb3();
  const { token, fetching: fetchingToken } = useToken(account?.address)
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
  if(token || fetchingToken) {
    cta = (
      <ActionButton
        isLoading
        loadingText="Loading token..."
     />
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
        loadingText="Connecting wallet..."
      >Connect wallet</ActionButton>
    );
  } else if(generationResult) {
    if(!tokenMintPrice || fetchingMint) {
      cta = (
        <ActionButton
          isLoading
          loadingText="Loading mint price..."
        />
      );
    } else {
      cta = (
        <ActionButton
          onClick={() => mint(generationResult)}
          isLoading={isMinting}
          loadingText="Minting token..."
        >
          Mint for <Text ml={2}>Ξ {utils.formatEther(utils.parseUnits(tokenMintPrice.total, 'wei'))}</Text>
        </ActionButton>
      );
    }
  } else {
    cta = (
      <ActionButton
        onClick={() => generateImage(account.address)}
        isLoading={isGenerating}
        loadingText="~30sec Processing..."
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
      {generationResult &&
        <Card mt={8}>
        <HStack
          justifyContent="center"
        >
          <VStack
            alignItems="start"
          >
            <Flex
              fontWeight={500}
            >
              Price
            </Flex>
            <Flex
              fontWeight={500}
            >
              Platform fees
            </Flex>
          </VStack>
          <VStack
            alignItems="start"
          >
            <Flex>
              <Text ml={4}>Ξ {utils.formatEther(utils.parseUnits(tokenMintPrice.fees, 'wei') )}</Text>
            </Flex>
            <Flex>
              <Text ml={4}>Ξ {utils.formatEther(utils.parseUnits(tokenMintPrice.currentPrice, 'wei') )}</Text>
            </Flex>
          </VStack>
        </HStack>
        </Card>
      }
    </Flex>
  )
}
