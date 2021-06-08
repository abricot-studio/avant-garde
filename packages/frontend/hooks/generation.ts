import { useEthers } from '@usedapp/core'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ToastImageGenerated, useToast } from '../components/ui'
import config from '../config'

const generateApi = axios.create({
  baseURL: config.generateUrl,
})

export enum ImageGenerationStatus {
  SUCCESS = 'success',
  PROCESSING = 'processing',
  ERROR = 'error',
}

export interface ImageGeneration {
  status: ImageGenerationStatus
  ipfsHashMetadata: string
  ipfsHashImage: string
  signerAddress: string
  signature: string
}

const generationCache = {}
type Timeout = ReturnType<typeof setTimeout>

function useInterval(delay: number) {
  const savedCallback = useRef<Function | null>(null)
  const savedOnError = useRef<Function | null>(null)
  const poll = useRef<Timeout | null>(null)

  const refresh = useCallback(() => {
    savedCallback
      .current()
      .then((shouldContinue) => {
        if (shouldContinue) {
          poll.current = setTimeout(refresh, delay)
        }
      })
      .catch((error) => savedOnError.current(error))
  }, [savedCallback])

  const startPolling = useCallback(() => {
    refresh()
  }, [refresh])

  const stopPolling = useCallback(() => {
    if (poll.current) {
      clearTimeout(poll.current)
      poll.current = null
    }
  }, [])

  const setCallback = ({ callback, onError }) => {
    savedCallback.current = callback
    savedOnError.current = onError
  }
  useEffect(() => {
    return () => stopPolling()
  }, [])

  return {
    setCallback,
    refresh,
    startPolling,
    stopPolling,
  }
}

export const useImageGeneration = () => {
  const { account } = useEthers()

  const [generationResult, setGenerationResult] =
    useState<ImageGeneration | null>(null)
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const toast = useToast()
  const router = useRouter()
  const { startPolling, stopPolling, setCallback } = useInterval(5000)
  useEffect(() => {
    if (!account || !generationCache[account]) {
      setGenerationResult(null)
    } else {
      setGenerationResult(generationCache[account])
    }
    setIsGenerating(false)
    stopPolling()
  }, [account])

  const generateImage = useCallback(() => {
    if (!account) {
      throw new Error('cannot generate if not connected 👎')
    }

    setIsGenerating(true)
    setCallback({
      callback: () =>
        generateApi({
          method: 'POST',
          data: { address: account },
        }).then((result) => {
          if (result.data.status === 'processing') {
            return true
          }
          setGenerationResult(result.data)
          setIsGenerating(false)
          generationCache[account] = result.data
          ToastImageGenerated(toast, router)
          return false
        }),
      onError: (error) => {
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
      },
    })
    startPolling()
  }, [account])

  return { generateImage, isGenerating, generationResult }
}
