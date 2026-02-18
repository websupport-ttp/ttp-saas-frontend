'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ServiceLayout } from '@/components/layout'
import { flightService } from '@/lib/services/flight-service'
import { PaymentVerificationResponse } from '@/types/api'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import { Button } from '@/components/ui/Button'
import ErrorBoundary from '@/components/ui/ErrorBoundary'

export default function PaymentVerificationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'failed' | 'error'>('loading')
  const [paymentData, setPaymentData] = useState<PaymentVerificationResponse | null>(null)
  const [error, setError] = useState<string | undefined>()
  const [bookingReference, setBookingReference] = useState<string | null>(null)

  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Flight Booking', href: '/flights' },
    { name: 'Payment Verification', href: '/flights/payment/verify' },
  ]

  useEffect(() => {
    const reference = searchParams.get('reference')
    const trxref = searchParams.get('trxref')
    const paymentRef = reference || trxref

    if (paymentRef) {
      verifyPayment(paymentRef)
    } else {
      // Try to get payment reference from localStorage
      const storedPaymentRef = localStorage.getItem('paymentReference')
      if (storedPaymentRef) {
        verifyPayment(storedPaymentRef)
      } else {
        setVerificationStatus('error')
        setError('No payment reference found. Please try booking again.')
      }
    }

    // Get booking reference from localStorage
    const storedBookingRef = localStorage.getItem('bookingReference')
    if (storedBookingRef) {
      setBookingReference(storedBookingRef)
    }
  }, [searchParams])

  const verifyPayment = async (reference: string) => {
    try {
      setVerificationStatus('loading')
      const response = await flightService.verifyPayment(reference)
      setPaymentData(response)
      
      if (response.status === 'success') {
        setVerificationStatus('success')
        // Clear stored references
        localStorage.removeItem('paymentReference')
        localStorage.removeItem('selectedFlight')
        // Keep booking reference for confirmation display
      } else if (response.status === 'failed') {
        setVerificationStatus('failed')
        setError('Payment was not successful. Please try again.')
      } else {
        setVerificationStatus('loading')
        // Payment is still pending, poll again after 5 seconds (max 10 attempts)
        const pollCount = (window as any).paymentPollCount || 0
        if (pollCount < 10) {
          (window as any).paymentPollCount = pollCount + 1
          setTimeout(() => verifyPayment(reference), 5000)
        } else {
          setVerificationStatus('error')
          setError('Payment verification is taking longer than expected. Please contact support if payment was deducted.')
        }
      }
    } catch (err: any) {
      console.error('Payment verification error:', err)
      setVerificationStatus('error')
      setError(err.message || 'Failed to verify payment. Please contact support.')
    }
  }

  const handleRetryPayment = () => {
    router.push('/flights')
  }

  const handleGoHome = () => {
    router.push('/')
  }

  const handleViewBookings = () => {
    // Navigate to bookings page (to be implemented)
    router.push('/bookings')
  }

  const formatPrice = (amount: number, currency: string = 'NGN') => {
    if (currency === 'NGN') {
      return `₦${amount.toLocaleString()}`
    }
    return `${amount.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <ErrorBoundary>
      <ServiceLayout
        title="Payment Verification"
        description="Verifying your flight booking payment"
        breadcrumbs={breadcrumbs}
        serviceName="Flight Booking"
      >
        <div className="max-w-4xl mx-auto py-8">
          {verificationStatus === 'loading' && (
            <div className="flex flex-col items-center py-12">
              <LoadingSpinner size="lg" />
              <h2 className="text-2xl font-bold text-gray-900 mt-4">Verifying Payment</h2>
              <p className="text-gray-600 mt-2">Please wait while we verify your payment...</p>
            </div>
          )}

          {verificationStatus === 'success' && paymentData && (
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
                <p className="text-gray-600">Your flight has been booked successfully.</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bookingReference && (
                    <div>
                      <p className="text-sm text-gray-600">Booking Reference</p>
                      <p className="font-semibold text-gray-900">{bookingReference}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600">Payment Reference</p>
                    <p className="font-semibold text-gray-900">{paymentData.reference}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Amount Paid</p>
                    <p className="font-semibold text-gray-900">{formatPrice(paymentData.amount, paymentData.currency)}</p>
                  </div>
                  {paymentData.paidAt && (
                    <div>
                      <p className="text-sm text-gray-600">Payment Date</p>
                      <p className="font-semibold text-gray-900">{formatDate(paymentData.paidAt)}</p>
                    </div>
                  )}
                  {paymentData.channel && (
                    <div>
                      <p className="text-sm text-gray-600">Payment Method</p>
                      <p className="font-semibold text-gray-900 capitalize">{paymentData.channel}</p>
                    </div>
                  )}
                  {paymentData.authorization && (
                    <div>
                      <p className="text-sm text-gray-600">Card Details</p>
                      <p className="font-semibold text-gray-900">
                        **** **** **** {paymentData.authorization.last4} ({paymentData.authorization.brand})
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="text-sm font-semibold text-blue-900 mb-1">Important Information</h4>
                    <p className="text-sm text-blue-800">
                      A confirmation email has been sent to your registered email address. 
                      Please check your email for your e-ticket and booking details.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="primary"
                  onClick={handleViewBookings}
                >
                  View My Bookings
                </Button>
                <Button
                  variant="outline"
                  onClick={handleGoHome}
                >
                  Go to Home
                </Button>
              </div>
            </div>
          )}

          {verificationStatus === 'failed' && (
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Payment Failed</h2>
                <p className="text-gray-600 mb-6">Your payment was not successful. Please try again.</p>
                
                {error && (
                  <div className="mb-6">
                    <ErrorMessage message={error} variant="inline" />
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    variant="primary"
                    onClick={handleRetryPayment}
                  >
                    Try Again
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleGoHome}
                  >
                    Go to Home
                  </Button>
                </div>
              </div>
            </div>
          )}

          {verificationStatus === 'error' && (
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <ErrorMessage 
                title="Verification Error"
                message={error || 'Unable to verify payment. Please contact support.'}
                onRetry={() => window.location.reload()}
                variant="card"
              />
              
              <div className="flex justify-center mt-6">
                <Button
                  variant="outline"
                  onClick={handleGoHome}
                >
                  Go to Home
                </Button>
              </div>
            </div>
          )}
        </div>
      </ServiceLayout>
    </ErrorBoundary>
  )
}