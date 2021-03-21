import { useCallback, useState } from 'react';
import axios from 'axios';
import config from '../config'

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

  const generateImage = useCallback((address: string) => {
    setIsGenerating(true);

    generateApi({
      method: 'POST',
      data: { address },
    })
      .then(result => {
        setGenerationResult(result.data);
        setIsGenerating(false);
      })
      .catch(error => {
        setGenerationResult(null);
        console.error(error);
      setIsGenerating(false);
    });

  }, []);

  return { generateImage, isGenerating, generationResult };
}
