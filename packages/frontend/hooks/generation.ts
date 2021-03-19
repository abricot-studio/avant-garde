import { useCallback, useState } from 'react';
import axios from 'axios';
import config from '../config'

const generateApi = axios.create({
  baseURL: config.generateUrl
});

export enum TokenGenerationStatus {
  SUCCESS =  'success',
  PROCESSING = 'processing',
}

export interface TokenGeneration {
  status: TokenGenerationStatus;
  ipfsHashMetadata: string;
  ipfsHashImage: string;
  signature: string;
}

export const useImageGeneration = () => {
  const [generationResult, setGenerationResult] = useState<TokenGeneration | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const generateImage = useCallback(async (address: string) => {
    setIsGenerating(true);

    const res = await generateApi({
      method: 'POST',
      data: { address },
    });

    setGenerationResult(res.data);
    setIsGenerating(false);
  }, []);

  return { generateImage, isGenerating, generationResult };
}
