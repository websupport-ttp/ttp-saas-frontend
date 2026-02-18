/**
 * Payment Verification Hook
 * React hook for handling automatic payment verification after Paystack redirects
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  paymentVerificationService, 
  PaymentServiceType,
  extractPaymentReference,
  isPaymentRedirectUrl
} from '@/lib/services/payment-verification-service'
import { useNotificationHelpers } from '@/contexts/notification-context'

interface UsePaymentVerificationOptions {
  serviceType: PaymentServiceType
  bookingId?: string
  onSuccess?: (result: any) => void
  onFailure?: (error: Error) => void
  onTimeout?: () => void
  autoStart?: boolean
  showNotifications?: boolean
  redirectOnSuccess?: string
  redirectOnFailure?: string
}

interface PaymentVerificationState {
  isVerifying: boolean
  isSuccess: boolean
  isFailed: boolean
  isTimeout: boolean
  result: any | null
  error: string | null
  reference: string | null
}

export function usePaymentVerification({
  serviceType,
  bookingId,
  onSuccess,
  onFailure,
  onTimeout,
  autoStart = true,
  showNotifications = true,
  redirectOnSuccess,
  redirectOnFailure
}: UsePaymentVerificationOptions) {
  const [state, setState] = useState<PaymentVerificationState>({
    isVerifying: false,
    isSuccess: false,
    isFailed: false,
    isTimeout: false,
    result: null,
    error: null,
    reference: null
  })

  const verificationIdRef = useRef<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { showSuccess, showError, showWarning } = useNotificationHelpers()

  const handleSuccess = useCallback((result: any) => {
    setState(prev => ({
      ...prev,
      isVerifying: false,
      isSuccess: true,
      result,
      error: null
    }))

    if (showNotifications) {
      const serviceLabel = serviceType.charAt(0).toUpperCase() + serviceType.slice(1)
      showSuccess(
        'Payment Confirmed',
        `Your ${serviceLabel.toLowerCase()} payment has been successfully processed!`
      )
    }

    if (onSuccess) {
      onSuccess(result)
    }

    if (redirectOnSuccess) {
      setTimeout(() => router.push(redirectOnSuccess), 2000)
    }
  }, [serviceType, showNotifications, showSuccess, onSuccess, redirectOnSuccess, router])

  const handleFailure = useCallback((error: Error) => {
    setState(prev => ({
      ...prev,
      isVerifying: false,
      isFailed: true,
      error: error.message
    }))

    if (showNotifications) {
      showError(
        'Payment Failed',
        `Payment verification failed: ${error.message}`,
        {
          persistent: true,
          actions: [
            {
              label: 'Retry',
              action: () => startVerification(),
              variant: 'primary'
            }
          ]
        }
      )
    }

    if (onFailure) {
      onFailure(error)
    }

    if (redirectOnFailure) {
      setTimeout(() => router.push(redirectOnFailure), 5000)
    }
  }, [showNotifications, showError, onFailure, redirectOnFailure, router])

  const handleTimeout = useCallback(() => {
    setState(prev => ({
      ...prev,
      isVerifying: false,
      isTimeout: true,
      error: 'Payment verification timed out'
    }))

    if (showNotifications) {
      showWarning(
        'Verification Timeout',
        'Payment verification is taking longer than expected. Please check your booking status or contact support.',
        {
          persistent: true,
          actions: [
            {
              label: 'Retry',
              action: () => startVerification(),
              variant: 'primary'
            }
          ]
        }
      )
    }

    if (onTimeout) {
      onTimeout()
    }
  }, [showNotifications, showWarning, onTimeout])

  const startVerification = useCallback((customReference?: string) => {
    // Get reference from URL params or use custom reference
    const reference = customReference || 
                     searchParams.get('reference') || 
                     searchParams.get('trxref')

    if (!reference) {
      console.error('No payment reference found')
      return null
    }

    // Stop any existing verification
    if (verificationIdRef.current) {
      paymentVerificationService.stopVerification(verificationIdRef.current)
    }

    setState(prev => ({
      ...prev,
      isVerifying: true,
      isSuccess: false,
      isFailed: false,
      isTimeout: false,
      result: null,
      error: null,
      reference
    }))

    const verificationId = paymentVerificationService.startVerification({
      reference,
      serviceType,
      bookingId,
      onSuccess: handleSuccess,
      onFailure: handleFailure,
      onTimeout: handleTimeout
    })

    verificationIdRef.current = verificationId
    return verificationId
  }, [searchParams, serviceType, bookingId, handleSuccess, handleFailure, handleTimeout])

  const stopVerification = useCallback(() => {
    if (verificationIdRef.current) {
      paymentVerificationService.stopVerification(verificationIdRef.current)
      verificationIdRef.current = null
      setState(prev => ({
        ...prev,
        isVerifying: false
      }))
    }
  }, [])

  const retryVerification = useCallback(() => {
    startVerification()
  }, [startVerification])

  const verifyOnce = useCallback(async (customReference?: string) => {
    const reference = customReference || 
                     searchParams.get('reference') || 
                     searchParams.get('trxref')

    if (!reference) {
      throw new Error('No payment reference found')
    }

    setState(prev => ({ ...prev, isVerifying: true, error: null }))

    try {
      const result = await paymentVerificationService.verifyPaymentOnce(
        serviceType,
        reference,
        bookingId
      )

      if (result.success || result.status === 'success' || result.verified) {
        handleSuccess(result)
      } else {
        handleFailure(new Error(result.message || 'Payment verification failed'))
      }

      return result
    } catch (error) {
      handleFailure(error as Error)
      throw error
    }
  }, [searchParams, serviceType, bookingId, handleSuccess, handleFailure])

  // Auto-start verification if enabled and payment reference is present
  useEffect(() => {
    if (autoStart && (searchParams.get('reference') || searchParams.get('trxref'))) {
      startVerification()
    }

    return () => {
      if (verificationIdRef.current) {
        paymentVerificationService.stopVerification(verificationIdRef.current)
      }
    }
  }, [autoStart, searchParams, startVerification])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (verificationIdRef.current) {
        paymentVerificationService.stopVerification(verificationIdRef.current)
      }
    }
  }, [])

  return {
    ...state,
    startVerification,
    stopVerification,
    retryVerification,
    verifyOnce,
    verificationId: verificationIdRef.current
  }
}

// Hook for handling payment redirects automatically
export function usePaymentRedirectHandler() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const handleRedirect = useCallback((
    serviceType: PaymentServiceType,
    bookingId?: string,
    successPath?: string,
    failurePath?: string
  ) => {
    const currentUrl = window.location.href
    
    if (!isPaymentRedirectUrl(currentUrl)) {
      return null
    }

    const reference = extractPaymentReference(currentUrl)
    if (!reference) {
      console.error('Payment reference not found in URL')
      return null
    }

    // Start verification and handle results
    return paymentVerificationService.startVerification({
      reference,
      serviceType,
      bookingId,
      onSuccess: (result) => {
        console.log('Payment verified successfully:', result)
        if (successPath) {
          router.push(successPath)
        }
      },
      onFailure: (error) => {
        console.error('Payment verification failed:', error)
        if (failurePath) {
          router.push(failurePath)
        }
      },
      onTimeout: () => {
        console.warn('Payment verification timed out')
        if (failurePath) {
          router.push(failurePath)
        }
      }
    })
  }, [searchParams, router])

  const isPaymentRedirect = isPaymentRedirectUrl(window?.location?.href || '')
  const paymentReference = extractPaymentReference(window?.location?.href || '')

  return {
    handleRedirect,
    isPaymentRedirect,
    paymentReference
  }
}

// Hook for monitoring payment verification progress
export function usePaymentVerificationProgress(verificationId: string | null) {
  const [progress, setProgress] = useState({
    isActive: false,
    attempts: 0,
    maxAttempts: 30,
    timeRemaining: 0
  })

  useEffect(() => {
    if (!verificationId) {
      setProgress(prev => ({ ...prev, isActive: false }))
      return
    }

    const interval = setInterval(() => {
      const isActive = paymentVerificationService.isVerifying(verificationId)
      setProgress(prev => ({
        ...prev,
        isActive
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [verificationId])

  return progress
}