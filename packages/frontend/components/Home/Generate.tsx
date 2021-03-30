import React from 'react'
import { Box, Button, Image } from '../ui'
import { useImageGeneration, ImageGenerationStatus, ImageGeneration } from '../../hooks/generation'
import { getIpfsUrl } from '../../lib/ipfs'
import { useWeb3 } from '../../contexts/Web3Context'
import { useMint } from '../../hooks/mint'

function LoginToGenerate() {
  return (
    <Box>
      Please login first
    </Box>
  );
}

function GenerationResult({ generationResult }: { generationResult: ImageGeneration }) {
  const { mint, minted, isMinting } = useMint();

  if(generationResult.status === ImageGenerationStatus.PROCESSING) {
    // TODO poll
    return (
      <p>Your image is being generated</p>
    );
  } else if(generationResult.status === ImageGenerationStatus.SUCCESS) {
    return (
      <Box>
        <Image src={getIpfsUrl(generationResult.ipfsHashImage)} boxSize={200} />

        {minted ?
          <Button
            isDisabled
          >
            Mint successful !
          </Button>
          :
          <Button
            onClick={() => mint(generationResult)}
            isLoading={isMinting}
            loadingText="Minting token..."
          >
            Mint token
          </Button>
        }
      </Box>
    );
  }

  return (<p>Invalid generation status</p>);
}

export default function Generate() {
  const { account } = useWeb3();
  const { generateImage, isGenerating, generationResult } = useImageGeneration();

  if(!account) return <LoginToGenerate/>;

  return (
    <Box as="section" mb={12}>
      {generationResult ?
        <GenerationResult generationResult={generationResult}/>
        :
        <Box>
          <p>You image is not generated yet</p>
          <Button
            onClick={() => generateImage(account.address)}
            isLoading={isGenerating}
            loadingText="Generating image"
          >
            Generate image
          </Button>
        </Box>
      }
    </Box>
  )
}
