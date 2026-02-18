/**
 * Polling Hook
 * React hook for managing status polling using the centralized polling service
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { pollingService, ServiceType } from '@/lib/services/polling-service'
import { useNotificationHelpers } from '@/contexts/notification-context'

interface UsePollingOptions {
  bookingReference: string
  serviceType: ServiceType
  enabled?: boolean
  customPollInterval?: number
  customMaxAttempts?: number
  showNotifications?: boolean
  onStatusChange?: (status: any) => void
  onComplete?: (finalStatus: any) => void
  onError?: (error: Error) => void
}

interface PollingState {
  status: any | null
  isPolling: boolean
  error: string | null
  pollCount: number
  maxPollAttempts: number
}

export function usePolling({
  bookingReference,
  serviceType,
  enabled = true,
  customPollInterval,
  customMaxAttempts,
  showNotifications = true,
  onStatusChange,
  onComplete,
  onError
}: UsePollingOptions) {
  const [state, setState] = useState<PollingState>({
    status: null,
    isPolling: false,
    error: null,
    pollCount: 0,
    maxPollAttempts: 0
  })

  const pollingIdRef = useRef<string | null>(null)
  const { showSuccess, showError, showInfo } = useNotificationHelpers()

  const handleStatusUpdate = useCallback((status: any) => {
    setState(prev => ({
      ...prev,
      status,
      error: null
    }))

    // Show notification for status changes
    setState(prevState => {
      if (showNotifications && prevState.status && prevState.status.status !== status.status) {
        const serviceLabel = serviceType.charAt(0).toUpperCase() + serviceType.slice(1)
        showInfo(
          'Status Update',
          `Your ${serviceLabel.toLowerCase()} status has changed to: ${status.status}`
        )
      }
      return prevState
    })

    // Call external callback
    if (onStatusChange) {
      onStatusChange(status)
    }
  }, [serviceType, showNotifications, showInfo, onStatusChange])

  const handleError = useCallback((error: Error) => {
    setState(prev => ({
      ...prev,
      error: error.message
    }))

    if (showNotifications) {
      showError('Polling Error', `Failed to check ${serviceType} status: ${error.message}`)
    }

    if (onError) {
      onError(error)
    }
  }, [serviceType, showNotifications, showError, onError])

  const handleComplete = useCallback((finalStatus: any) => {
    setState(prev => ({
      ...prev,
      status: finalStatus,
      isPolling: false
    }))

    if (showNotifications) {
      const serviceLabel = serviceType.charAt(0).toUpperCase() + serviceType.slice(1)
      const isSuccess = ['confirmed', 'completed'].includes(finalStatus.status?.toLowerCase())
      
      if (isSuccess) {
        showSuccess(
          `${serviceLabel} Confirmed`,
          `Your ${serviceLabel.toLowerCase()} has been confirmed!`
        )
      } else {
        showInfo(
          `${serviceLabel} Update`,
          `Your ${serviceLabel.toLowerCase()} status is now: ${finalStatus.status}`
        )
      }
    }

    if (onComplete) {
      onComplete(finalStatus)
    }
  }, [serviceType, showNotifications, showSuccess, showInfo, onComplete])

  const startPolling = useCallback(() => {
    if (!bookingReference || !enabled || pollingIdRef.current) {
      return
    }

    try {
      const pollingId = pollingService.startPolling({
        bookingReference,
        serviceType,
        customPollInterval,
        customMaxAttempts,
        onStatusUpdate: handleStatusUpdate,
        onError: handleError,
        onComplete: handleComplete
      })

      pollingIdRef.current = pollingId
      setState(prev => ({
        ...prev,
        isPolling: true,
        error: null,
        pollCount: 0,
        maxPollAttempts: customMaxAttempts || 30
      }))

    } catch (error) {
      console.error('Failed to start polling:', error)
      setState(prev => ({
        ...prev,
        error: (error as Error).message
      }))
    }
  }, [
    bookingReference,
    serviceType,
    enabled,
    customPollInterval,
    customMaxAttempts,
    handleStatusUpdate,
    handleError,
    handleComplete
  ])

  const stopPolling = useCallback(() => {
    if (pollingIdRef.current) {
      pollingService.stopPolling(pollingIdRef.current)
      pollingIdRef.current = null
      setState(prev => ({
        ...prev,
        isPolling: false
      }))
    }
  }, [])

  const restartPolling = useCallback(() => {
    stopPolling()
    setTimeout(startPolling, 100) // Small delay to ensure cleanup
  }, [stopPolling, startPolling])

  // Update poll count from polling service
  useEffect(() => {
    if (!pollingIdRef.current) return

    const interval = setInterval(() => {
      const pollingItem = pollingService.getPollingItem(pollingIdRef.current!)
      if (pollingItem) {
        setState(prev => ({
          ...prev,
          pollCount: pollingItem.pollCount,
          maxPollAttempts: pollingItem.maxPollAttempts
        }))
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [pollingIdRef.current])

  // Start/stop polling based on enabled state
  useEffect(() => {
    if (enabled && bookingReference) {
      startPolling()
    } else {
      stopPolling()
    }

    return () => {
      stopPolling()
    }
  }, [enabled, bookingReference, startPolling, stopPolling])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollingIdRef.current) {
        pollingService.stopPolling(pollingIdRef.current)
      }
    }
  }, [])

  return {
    ...state,
    startPolling,
    stopPolling,
    restartPolling,
    pollingId: pollingIdRef.current
  }
}

// Hook for polling multiple items
export function useMultiplePolling() {
  const [pollingItems, setPollingItems] = useState<Map<string, any>>(new Map())

  const startPolling = useCallback((options: UsePollingOptions & { id: string }) => {
    const { id, ...pollingOptions } = options
    
    // Use the single polling hook logic but manage multiple instances
    // This is a simplified version - in practice, you might want to use a reducer
    setPollingItems(prev => {
      const newMap = new Map(prev)
      newMap.set(id, { ...pollingOptions, isPolling: true })
      return newMap
    })
  }, [])

  const stopPolling = useCallback((id: string) => {
    setPollingItems(prev => {
      const newMap = new Map(prev)
      const item = newMap.get(id)
      if (item) {
        newMap.set(id, { ...item, isPolling: false })
      }
      return newMap
    })
  }, [])

  const stopAllPolling = useCallback(() => {
    pollingService.stopAllPolling()
    setPollingItems(new Map())
  }, [])

  return {
    pollingItems: Array.from(pollingItems.entries()),
    startPolling,
    stopPolling,
    stopAllPolling,
    pollingStatus: pollingService.getPollingStatus()
  }
}