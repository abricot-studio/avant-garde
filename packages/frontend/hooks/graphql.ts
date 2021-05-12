import { useCallback, useEffect, useRef } from 'react'
import { OperationContext } from 'urql'

type Timeout = ReturnType<typeof setInterval>

export const usePolling = (
  reexecuteQuery: (opts?: Partial<OperationContext>) => void
) => {
  const poll = useRef<Timeout | null>(null)

  const refresh = () => {
    reexecuteQuery({ requestPolicy: 'network-only' })
  }

  const startPolling = () => {
    refresh()
    poll.current = setInterval(refresh, 3000)
  }

  const stopPolling = () => {
    if (poll.current) {
      clearInterval(poll.current)
      poll.current = null
    }
  }

  useEffect(() => {
    return () => stopPolling()
  }, [])

  return {
    refresh,
    startPolling,
    stopPolling,
  }
}
