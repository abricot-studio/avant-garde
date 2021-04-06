import { useCallback, useState } from 'react';
import axios from 'axios';
import config from '../config'
import { useToast } from '../components/ui'

const generateApi = axios.create({
  baseURL: config.generateUrl
});

export enum ImageGenerationStatus {
  SUCCESS =  'success',
  PROCESSING = 'processing',
}

export interface ImageGeneration {
  status: ImageGenerationStatus;
  ipfsHashMetadata: string;
  ipfsHashImage: string;
  signerAddress: string;
  signature: string;
}

export const useImageGeneration = () => {
  const [generationResult, setGenerationResult] = useState<ImageGeneration | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const toast = useToast()

  const generateImage = useCallback((address: string) => {
    setIsGenerating(true);

    generateApi({
      method: 'POST',
      data: { address },
    })
      .then(result => {
        setGenerationResult(result.data);
        setIsGenerating(false);

        toast({
          title: "🎉 Image generated",
          description: 'Your image have been generated!',
          status: "success",
          duration: 5000,
          isClosable: true,
        })
      })
      .catch(error => {
        setGenerationResult(null);
        console.error(error);
        toast({
          title: "⚠️ Generation error",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        })
      setIsGenerating(false);
    });

  }, []);

  return { generateImage, isGenerating, generationResult };
}
