import { useEthers } from '@usedapp/core'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ToastImageGenerated, useToast } from '../components/ui'
import config from '../config'
import { decode } from '../lib/inviteCode'

const generateApi = axios.create({
  baseURL: config.generateUrl,
})

export enum ImageGenerationStatus {
  SUCCESS = 'success',
  PROCESSING = 'processing',
  ERROR = 'error',
}

export interface ImageGenerationParams {
  address: string
  inviteCode?: string
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
  const [errorGenerating, setErrorGenerating] = useState<Error | null>(null)
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

  const generateImage = useCallback(
    (inviteCode?: string) => {
      if (!account) {
        throw new Error('cannot generate if not connected 👎')
      }

      const params: ImageGenerationParams = { address: account }
      if (inviteCode) {
        try {
          params.inviteCode = decode(inviteCode)
        } catch (error) {
          setErrorGenerating(error)
          return false
        }
      } else if (router.query.inviteCode) {
        try {
          params.inviteCode = decode(router.query.inviteCode as string)
        } catch (error) {
          setErrorGenerating(error)
          return false
        }
      }

      setIsGenerating(true)
      setErrorGenerating(null)
      setCallback({
        callback: () =>
          generateApi({
            method: 'POST',
            data: params,
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
          if (
            error?.response?.data?.message ===
            'You are not registered or invited yet'
          ) {
            setErrorGenerating(new Error('not_invited'))
          } else if (error?.response?.data?.message?.length > 0) {
            setErrorGenerating(new Error(error.response.data.message))
          } else {
            console.error(error)
            setErrorGenerating(error)
          }
          setIsGenerating(false)
        },
      })
      startPolling()
    },
    [account]
  )

  return { generateImage, isGenerating, generationResult, errorGenerating }
}
