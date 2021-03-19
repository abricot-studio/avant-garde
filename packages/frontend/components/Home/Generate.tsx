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
  const { mint, isMinting } = useMint();

  if(generationResult.status === ImageGenerationStatus.PROCESSING) {
    // TODO poll
    return (
      <p>Your image is being generated</p>
    );
  } else if(generationResult.status === ImageGenerationStatus.SUCCESS) {
    return (
      <Box>
        <Image src={getIpfsUrl(generationResult.ipfsHashImage)} boxSize={200} />

        <Button
          onClick={() => mint(generationResult)}
          isLoading={isMinting}
          loadingText="Minting token..."
        >
          Mint token
        </Button>
      </Box>
    );
  }

  return (<p>Invalid generation status</p>);
}

export default function Generate() {
  const { address } = useWeb3();
  const { generateImage, isGenerating, generationResult } = useImageGeneration();

  if(!address) return <LoginToGenerate/>;

  return (
    <Box as="section" mb={12}>
      {generationResult ?
        <GenerationResult generationResult={generationResult}/>
        :
        <Box>
          <p>You image is not generated yet</p>
          <Button
            onClick={() => generateImage(address)}
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
