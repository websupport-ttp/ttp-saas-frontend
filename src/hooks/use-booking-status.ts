import { useState, useEffect, useCallback } from 'react'
import { flightService } from '@/lib/services/flight-service'
import { hotelService } from '@/lib/services/hotel-service'
import { visaService } from '@/lib/services/visa-service'
import { insuranceService } from '@/lib/services/insurance-service'
import { packageService } from '@/lib/services/package-service'

interface UseBookingStatusOptions {
  bookingReference: string
  serviceType?: 'flight' | 'hotel' | 'visa' | 'insurance' | 'package'
  pollInterval?: number
  maxPollAttempts?: number
  enabled?: boolean
}

interface BookingStatus {
  status: string
  lastUpdated: string
  details?: any
  serviceType?: string
}

// Intelligent polling intervals based on status and service type
const getPollingInterval = (serviceType: string, status?: string): number => {
  // Base intervals by service type (in milliseconds)
  const baseIntervals = {
    flight: 30000,    // 30 seconds - flights change quickly
    hotel: 45000,     // 45 seconds - hotels are moderate
    visa: 300000,     // 5 minutes - visa processing is slow
    insurance: 60000, // 1 minute - insurance is moderate
    package: 60000    // 1 minute - packages are moderate
  }

  // Adjust based on status
  const statusMultipliers = {
    pending: 1,       // Normal polling
    processing: 0.5,  // Faster polling when actively processing
    confirmed: 2,     // Slower polling for confirmed items
    failed: 0.25,     // Very fast polling for failures (might recover)
    cancelled: 3      // Very slow polling for cancelled items
  }

  const baseInterval = baseIntervals[serviceType as keyof typeof baseIntervals] || 60000
  const multiplier = status ? (statusMultipliers[status as keyof typeof statusMultipliers] || 1) : 1
  
  return Math.max(baseInterval * multiplier, 10000) // Minimum 10 seconds
}

// Maximum poll attempts based on service type
const getMaxPollAttempts = (serviceType: string): number => {
  const maxAttempts = {
    flight: 40,    // 20 minutes max
    hotel: 30,     // 22.5 minutes max  
    visa: 20,      // 100 minutes max (visa processing is very slow)
    insurance: 25, // 25 minutes max
    package: 25    // 25 minutes max
  }
  
  return maxAttempts[serviceType as keyof typeof maxAttempts] || 30
}

export function useBookingStatus({
  bookingReference,
  serviceType = 'flight',
  pollInterval,
  maxPollAttempts,
  enabled = true
}: UseBookingStatusOptions) {
  const [bookingStatus, setBookingStatus] = useState<BookingStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [pollCount, setPollCount] = useState(0)

  // Use intelligent defaults if not provided
  const effectiveMaxAttempts = maxPollAttempts || getMaxPollAttempts(serviceType)
  const effectivePollInterval = pollInterval || getPollingInterval(serviceType, bookingStatus?.status)

  const fetchBookingStatus = useCallback(async () => {
    if (!bookingReference || !enabled) return

    try {
      setIsLoading(true)
      setError(undefined)
      
      let status;
      switch (serviceType) {
        case 'hotel':
          status = await hotelService.getBookingStatus(bookingReference)
          break
        case 'visa':
          status = await visaService.getApplicationStatus(bookingReference)
          break
        case 'insurance':
          status = await insuranceService.getPolicyStatus(bookingReference)
          break
        case 'package':
          status = await packageService.getBookingStatus(bookingReference)
          break
        case 'flight':
        default:
          status = await flightService.getBookingStatus(bookingReference)
          break
      }
      
      // Normalize status format across services
      const normalizedStatus = {
        ...status,
        serviceType,
        lastUpdated: status.lastUpdated || new Date().toISOString()
      }
      
      setBookingStatus(normalizedStatus)
      
      // Stop polling if booking is in a final state
      const finalStates = ['confirmed', 'cancelled', 'failed', 'completed', 'expired', 'rejected']
      if (finalStates.includes(status.status?.toLowerCase())) {
        setPollCount(effectiveMaxAttempts) // Stop polling
      }
    } catch (err: any) {
      console.error(`Error fetching ${serviceType} status:`, err)
      setError(err.message || `Failed to fetch ${serviceType} status`)
    } finally {
      setIsLoading(false)
    }
  }, [bookingReference, serviceType, enabled, effectiveMaxAttempts])

  // Initial fetch
  useEffect(() => {
    if (enabled && bookingReference) {
      fetchBookingStatus()
    }
  }, [fetchBookingStatus, enabled, bookingReference])

  // Polling effect with intelligent intervals
  useEffect(() => {
    if (!enabled || !bookingReference || pollCount >= effectiveMaxAttempts) {
      return
    }

    // Use current status to determine polling interval
    const currentInterval = getPollingInterval(serviceType, bookingStatus?.status)
    
    const interval = setInterval(() => {
      setPollCount(prev => {
        const newCount = prev + 1
        if (newCount < effectiveMaxAttempts) {
          fetchBookingStatus()
        }
        return newCount
      })
    }, currentInterval)

    return () => clearInterval(interval)
  }, [enabled, bookingReference, effectiveMaxAttempts, pollCount, fetchBookingStatus, serviceType, bookingStatus?.status])

  const refetch = useCallback(() => {
    setPollCount(0)
    fetchBookingStatus()
  }, [fetchBookingStatus])

  const stopPolling = useCallback(() => {
    setPollCount(effectiveMaxAttempts)
  }, [effectiveMaxAttempts])

  const startPolling = useCallback(() => {
    setPollCount(0)
  }, [])

  return {
    bookingStatus,
    isLoading,
    error,
    refetch,
    stopPolling,
    startPolling,
    isPolling: pollCount < effectiveMaxAttempts && enabled,
    pollCount,
    maxPollAttempts: effectiveMaxAttempts,
    currentPollInterval: getPollingInterval(serviceType, bookingStatus?.status)
  }
}