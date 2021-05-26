import { useEthers } from '@usedapp/core'
import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { ToastImageGenerated, useToast } from '../components/ui'
import config from '../config'

const generateApi = axios.create({
  baseURL: config.generateUrl,
})

export enum ImageGenerationStatus {
  SUCCESS = 'success',
  PROCESSING = 'processing',
}

export interface ImageGeneration {
  status: ImageGenerationStatus
  ipfsHashMetadata: string
  ipfsHashImage: string
  signerAddress: string
  signature: string
}

const generationCache = {}

export const useImageGeneration = () => {
  const { account } = useEthers()

  const [generationResult, setGenerationResult] =
    useState<ImageGeneration | null>(null)
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const toast = useToast()

  useEffect(() => {
    if (!account || !generationCache[account]) {
      setGenerationResult(null)
    } else {
      setGenerationResult(generationCache[account])
    }
    setIsGenerating(false)
  }, [account])

  const generateImage = useCallback(() => {
    if (!account) {
      throw new Error('cannot generate if not connected 👎')
    }

    setIsGenerating(true)

    generateApi({
      method: 'POST',
      data: { address: account },
    })
      .then((result) => {
        setGenerationResult(result.data)
        setIsGenerating(false)
        generationCache[account] = result.data
        ToastImageGenerated(toast)

      })
      .catch((error) => {
        setGenerationResult(null)
        console.error(error)
        toast({
          title: '⚠️ Generation error',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
        setIsGenerating(false)
      })
  }, [account])

  return { generateImage, isGenerating, generationResult }
}
