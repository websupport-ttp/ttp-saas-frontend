/**
 * Payment Verification Progress Component
 * Shows progress and status of payment verification process
 */

'use client'

import { useEffect, useState } from 'react'
import { LoadingSpinner } from './LoadingSpinner'
import { ProgressBar } from './ProgressBar'

interface PaymentVerificationProgressProps {
  isVerifying: boolean
  serviceType: string
  reference?: string | null
  onRetry?: () => void
  onCancel?: () => void
  showProgress?: boolean
  maxDuration?: number // in seconds
}

export function PaymentVerificationProgress({
  isVerifying,
  serviceType,
  reference,
  onRetry,
  onCancel,
  showProgress = true,
  maxDuration = 600 // 10 minutes
}: PaymentVerificationProgressProps) {
  const [elapsed, setElapsed] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isVerifying) {
      setElapsed(0)
      setProgress(0)
      return
    }

    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000)
      setElapsed(elapsedSeconds)
      setProgress(Math.min((elapsedSeconds / maxDuration) * 100, 100))
    }, 1000)

    return () => clearInterval(interval)
  }, [isVerifying, maxDuration])

  if (!isVerifying) {
    return null
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const serviceLabel = serviceType.charAt(0).toUpperCase() + serviceType.slice(1)

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-center mb-4">
        <LoadingSpinner size="lg" />
      </div>

      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Verifying Payment
        </h3>
        <p className="text-gray-600">
          We're confirming your {serviceLabel.toLowerCase()} payment...
        </p>
        {reference && (
          <p className="text-sm text-gray-500 mt-1">
            Reference: {reference}
          </p>
        )}
      </div>

      {showProgress && (
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Verification Progress</span>
            <span>{formatTime(elapsed)} / {formatTime(maxDuration)}</span>
          </div>
          <ProgressBar 
            value={progress} 
            className="h-2"
            color={progress > 80 ? 'warning' : 'primary'}
          />
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              This usually takes a few seconds. Please don't close this page or navigate away.
            </p>
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Retry Verification
          </button>
        )}
        {onCancel && (
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
        )}
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Having trouble? Contact our support team for assistance.
        </p>
      </div>
    </div>
  )
}

// Success state component
export function PaymentVerificationSuccess({
  serviceType,
  reference,
  result,
  onContinue
}: {
  serviceType: string
  reference?: string | null
  result?: any
  onContinue?: () => void
}) {
  const serviceLabel = serviceType.charAt(0).toUpperCase() + serviceType.slice(1)

  return (
    <div className="bg-white border border-green-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-center mb-4">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Payment Confirmed!
        </h3>
        <p className="text-gray-600">
          Your {serviceLabel.toLowerCase()} payment has been successfully processed.
        </p>
        {reference && (
          <p className="text-sm text-gray-500 mt-1">
            Reference: {reference}
          </p>
        )}
      </div>

      <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-green-700">
              You will receive a confirmation email shortly with your booking details.
            </p>
          </div>
        </div>
      </div>

      {onContinue && (
        <button
          onClick={onContinue}
          className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors font-medium"
        >
          Continue
        </button>
      )}
    </div>
  )
}

// Failure state component
export function PaymentVerificationFailure({
  serviceType,
  reference,
  error,
  onRetry,
  onSupport
}: {
  serviceType: string
  reference?: string | null
  error?: string | null
  onRetry?: () => void
  onSupport?: () => void
}) {
  const serviceLabel = serviceType.charAt(0).toUpperCase() + serviceType.slice(1)

  return (
    <div className="bg-white border border-red-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-center mb-4">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      </div>

      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Payment Verification Failed
        </h3>
        <p className="text-gray-600">
          We couldn't verify your {serviceLabel.toLowerCase()} payment.
        </p>
        {reference && (
          <p className="text-sm text-gray-500 mt-1">
            Reference: {reference}
          </p>
        )}
        {error && (
          <p className="text-sm text-red-600 mt-2">
            {error}
          </p>
        )}
      </div>

      <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Don't worry - if your payment was successful, we'll process your booking. 
              You can also contact support for assistance.
            </p>
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Try Again
          </button>
        )}
        {onSupport && (
          <button
            onClick={onSupport}
            className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors text-sm font-medium"
          >
            Contact Support
          </button>
        )}
      </div>
    </div>
  )
}