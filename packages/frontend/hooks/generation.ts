import { useEthers } from '@usedapp/core'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ToastImageGenerated, useToast } from '../components/ui'
import config from '../config'
import * as ga from '../lib/ga'

const generateApi = axios.create({
  baseURL: `${config.baseUrl}/api/generate`,
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
  const router = useRouter()
  const toast = useToast()
  const { account } = useEthers()

  const [generationResult, setGenerationResult] =
    useState<ImageGeneration | null>(null)
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [errorGenerating, setErrorGenerating] = useState<Error | null>(null)
  const { startPolling, stopPolling, setCallback } = useInterval(5000)
  useEffect(() => {
    if (account && generationCache[account]) {
      setGenerationResult(generationCache[account])
    } else {
      setGenerationResult(null)
    }
    setIsGenerating(false)
    stopPolling()
  }, [account])

  const generateImage = useCallback(
    (inviteCode) => {
      if (!account) {
        throw new Error('cannot generate if not connected 👎')
      }

      const params: ImageGenerationParams = { address: account }
      if (inviteCode && inviteCode.length > 0) {
        try {
          params.inviteCode = inviteCode
        } catch (error) {
          setErrorGenerating(error)
          return false
        }
      }
      ga.event({
        action: 'generating_pending',
        params: {
          event_category: 'generating',
          event_label: 'generating_pending',
          value: '1',
        },
      })
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
            ga.event({
              action: 'generating_success',
              params: {
                event_category: 'generating',
                event_label: 'generating_success',
                value: '1',
              },
            })
            return false
          }),
        onError: (error) => {
          setGenerationResult(null)
          if (
            error?.response?.data?.message ===
            'You are not registered or invited yet'
          ) {
            ga.event({
              action: 'generating_not_invited',
              params: {
                event_category: 'generating',
                event_label: 'generating_not_invited',
                value: '1',
              },
            })
            setErrorGenerating(new Error('not_invited'))
          } else if (error?.response?.data?.message?.length > 0) {
            setErrorGenerating(new Error(error.response.data.message))
            if(!config.inviteMode){
              toast({
                title: '⚠️ Generation error',
                description: error.message,
                status: 'error',
                duration: 20000,
                isClosable: true,
              })
            }
          } else {
            ga.event({
              action: 'generating_error',
              params: {
                event_category: 'generating',
                event_label: 'generating_error',
                value: '1',
              },
            })
            console.error(error)
            if(!config.inviteMode){
              toast({
                title: '⚠️ Generation error',
                description: error.message,
                status: 'error',
                duration: 20000,
                isClosable: true,
              })
            }
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
