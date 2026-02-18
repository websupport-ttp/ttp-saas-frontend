/**
 * Status Notifications Hook
 * Integrates status polling with notification system for real-time updates
 */

import { useCallback, useRef } from 'react'
import { useNotificationHelpers } from '@/contexts/notification-context'
import { usePolling } from './use-polling'
import { ServiceType } from '@/lib/services/polling-service'

interface UseStatusNotificationsOptions {
  bookingReference: string
  serviceType: ServiceType
  enabled?: boolean
  showNotifications?: boolean
  onStatusChange?: (oldStatus: string | null, newStatus: string) => void
  onBookingConfirmed?: (status: any) => void
  onBookingFailed?: (status: any) => void
}

export function useStatusNotifications({
  bookingReference,
  serviceType,
  enabled = true,
  showNotifications = true,
  onStatusChange,
  onBookingConfirmed,
  onBookingFailed
}: UseStatusNotificationsOptions) {
  const previousStatusRef = useRef<string | null>(null)
  const {
    showStatusUpdate,
    showBookingConfirmation,
    showError,
    showWarning
  } = useNotificationHelpers()

  const handleStatusUpdate = useCallback((status: any) => {
    const currentStatus = status.status?.toLowerCase()
    const previousStatus = previousStatusRef.current

    // Only show notification if status actually changed
    if (previousStatus && previousStatus !== currentStatus && showNotifications) {
      showStatusUpdate(
        serviceType,
        bookingReference,
        previousStatus,
        currentStatus,
        {
          metadata: {
            details: status.details,
            lastUpdated: status.lastUpdated
          }
        }
      )
    }

    // Handle specific status changes
    if (currentStatus && showNotifications) {
      switch (currentStatus) {
        case 'confirmed':
        case 'completed':
          if (previousStatus && previousStatus !== currentStatus) {
            showBookingConfirmation(serviceType, bookingReference, {
              metadata: status
            })
            if (onBookingConfirmed) {
              onBookingConfirmed(status)
            }
          }
          break

        case 'failed':
        case 'cancelled':
        case 'rejected':
          if (previousStatus && previousStatus !== currentStatus) {
            const serviceLabel = serviceType.charAt(0).toUpperCase() + serviceType.slice(1)
            showError(
              `${serviceLabel} ${currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}`,
              `Your ${serviceLabel.toLowerCase()} has been ${currentStatus}. ${status.details?.reason || ''}`,
              {
                category: 'booking',
                serviceType,
                bookingReference,
                priority: 'high',
                persistent: true,
                metadata: status
              }
            )
            if (onBookingFailed) {
              onBookingFailed(status)
            }
          }
          break

        case 'expired':
          if (previousStatus && previousStatus !== currentStatus) {
            const serviceLabel = serviceType.charAt(0).toUpperCase() + serviceType.slice(1)
            showWarning(
              `${serviceLabel} Expired`,
              `Your ${serviceLabel.toLowerCase()} booking has expired. Please contact support if you need assistance.`,
              {
                category: 'booking',
                serviceType,
                bookingReference,
                priority: 'high',
                persistent: true,
                metadata: status
              }
            )
          }
          break

        case 'processing':
        case 'pending':
          // Only show processing notification on first time or if coming from failed state
          if (!previousStatus || previousStatus === 'failed') {
            const serviceLabel = serviceType.charAt(0).toUpperCase() + serviceType.slice(1)
            showStatusUpdate(
              serviceType,
              bookingReference,
              previousStatus || 'submitted',
              currentStatus,
              {
                duration: 0, // Keep visible until status changes
                persistent: true,
                metadata: status
              }
            )
          }
          break
      }
    }

    // Call external callback
    if (onStatusChange && previousStatus !== currentStatus) {
      onStatusChange(previousStatus, currentStatus)
    }

    // Update previous status
    previousStatusRef.current = currentStatus
  }, [
    serviceType,
    bookingReference,
    showNotifications,
    showStatusUpdate,
    showBookingConfirmation,
    showError,
    showWarning,
    onStatusChange,
    onBookingConfirmed,
    onBookingFailed
  ])

  const handlePollingError = useCallback((error: Error) => {
    if (showNotifications) {
      const serviceLabel = serviceType.charAt(0).toUpperCase() + serviceType.slice(1)
      showError(
        'Status Check Failed',
        `Unable to check your ${serviceLabel.toLowerCase()} status: ${error.message}`,
        {
          category: 'system',
          serviceType,
          bookingReference,
          priority: 'medium',
          actions: [
            {
              label: 'Retry',
              action: () => window.location.reload(),
              variant: 'primary'
            }
          ]
        }
      )
    }
  }, [serviceType, bookingReference, showNotifications, showError])

  const handlePollingComplete = useCallback((finalStatus: any) => {
    const currentStatus = finalStatus.status?.toLowerCase()
    
    // Final notification based on end state
    if (showNotifications && currentStatus) {
      const serviceLabel = serviceType.charAt(0).toUpperCase() + serviceType.slice(1)
      
      if (['confirmed', 'completed'].includes(currentStatus)) {
        showBookingConfirmation(serviceType, bookingReference, {
          message: `Your ${serviceLabel.toLowerCase()} is now ${currentStatus}!`,
          metadata: finalStatus
        })
      }
    }
  }, [serviceType, bookingReference, showNotifications, showBookingConfirmation])

  // Use the polling hook with our notification handlers
  const pollingResult = usePolling({
    bookingReference,
    serviceType,
    enabled,
    showNotifications: false, // We handle notifications ourselves
    onStatusChange: handleStatusUpdate,
    onError: handlePollingError,
    onComplete: handlePollingComplete
  })

  return {
    ...pollingResult,
    previousStatus: previousStatusRef.current
  }
}

// Hook for monitoring multiple bookings with notifications
export function useMultipleStatusNotifications() {
  const activePolling = useRef<Map<string, any>>(new Map())

  const startStatusNotifications = useCallback((options: UseStatusNotificationsOptions & { id?: string }) => {
    const id = options.id || `${options.serviceType}-${options.bookingReference}`
    
    // Stop existing polling for this ID
    if (activePolling.current.has(id)) {
      const existing = activePolling.current.get(id)
      if (existing.stopPolling) {
        existing.stopPolling()
      }
    }

    // Start new polling (this would need to be implemented differently in a real component)
    // For now, we'll just track the options
    activePolling.current.set(id, options)
    
    return id
  }, [])

  const stopStatusNotifications = useCallback((id: string) => {
    const polling = activePolling.current.get(id)
    if (polling && polling.stopPolling) {
      polling.stopPolling()
    }
    activePolling.current.delete(id)
  }, [])

  const stopAllStatusNotifications = useCallback(() => {
    activePolling.current.forEach((polling, id) => {
      if (polling.stopPolling) {
        polling.stopPolling()
      }
    })
    activePolling.current.clear()
  }, [])

  return {
    startStatusNotifications,
    stopStatusNotifications,
    stopAllStatusNotifications,
    activeCount: activePolling.current.size
  }
}