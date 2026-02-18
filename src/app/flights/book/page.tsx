'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ServiceLayout } from '@/components/layout'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { useSimpleAuth } from '@/contexts/simple-auth-context'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import PassengerInfo from '@/components/flights/PassengerInfo'
import PaymentMethodForm from '@/components/flights/PaymentMethodForm'
import { flightService } from '@/lib/services/flight-service'
import { PassengerData } from '@/types'

interface PaymentData {
  paymentMethod: 'paystack' | 'google' | 'apple' | 'paypal'
  nameOnCard: string
  cardNumber: string
  expirationDate: string
  ccv: string
  saveCard: boolean
  email: string
  password: string
}

export default function FlightBookingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAuthenticated, login, isLoading: authLoading } = useSimpleAuth()
  const [selectedFlight, setSelectedFlight] = useState<any>(null)
  const [passengerData, setPassengerData] = useState<PassengerData | null>(null)
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [currentStep, setCurrentStep] = useState<'passenger-details' | 'payment-method' | 'booking'>('passenger-details')
  const [isHydrated, setIsHydrated] = useState(false)

  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Flight Booking', href: '/flights' },
    { name: 'Book Flight', href: '/flights/book' },
  ]

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true)
    
    // Get selected flight from URL params first, then localStorage
    const urlParams = new URLSearchParams(window.location.search)
    const flightParam = urlParams.get('flight')
    
    console.log('🛫 Flight Booking Page - URL params:', {
      flightParam: flightParam ? 'Found' : 'Not found',
      currentStep,
      isHydrated
    })
    
    if (flightParam) {
      try {
        const flightData = JSON.parse(decodeURIComponent(flightParam))
        console.log('🛫 Flight data parsed from URL:', flightData)
        setSelectedFlight(flightData)
        // Also store in localStorage for consistency
        localStorage.setItem('selectedFlight', JSON.stringify(flightData))
      } catch (e) {
        console.error('Error parsing flight data from URL:', e)
      }
    } else {
      // Fallback to localStorage
      const flightData = localStorage.getItem('selectedFlight')
      if (flightData) {
        try {
          const parsedData = JSON.parse(flightData)
          console.log('🛫 Flight data parsed from localStorage:', parsedData)
          setSelectedFlight(parsedData)
        } catch (e) {
          console.error('Error parsing flight data from localStorage:', e)
        }
      }
    }
  }, [])

  const handleBack = () => {
    if (currentStep === 'passenger-details') {
      router.push('/flights')
    } else if (currentStep === 'payment-method') {
      setCurrentStep('passenger-details')
    } else {
      setCurrentStep('payment-method')
    }
  }

  const handlePassengerDataSubmit = (data: PassengerData) => {
    setPassengerData(data)
    setCurrentStep('payment-method')
  }

  const handlePaymentDataChange = (data: PaymentData) => {
    setPaymentData(data)
  }

  const handleBookingSubmit = async () => {
    if (!passengerData || !paymentData || !selectedFlight) {
      setError('Missing required booking information')
      return
    }

    setIsLoading(true)
    setError(undefined)

    try {
      // Create booking data
      const bookingData = {
        flight: selectedFlight,
        passenger: passengerData,
        payment: paymentData,
        totalAmount: selectedFlight.price?.total || '0',
        currency: selectedFlight.price?.currency || 'NGN'
      }

      // Process booking through flight service
      const result = await flightService.createBooking(bookingData)
      
      if (result.success && result.paymentUrl) {
        // Redirect to Paystack payment page
        window.location.href = result.paymentUrl
      } else {
        throw new Error(result.error || 'Booking failed')
      }
    } catch (err) {
      console.error('Booking error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred during booking')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isHydrated) {
    return (
      <ErrorBoundary>
        <ServiceLayout
          title="Flight Booking"
          description="Complete your flight booking"
          breadcrumbs={breadcrumbs}
          serviceName="Flight Booking"
        >
          <div className="max-w-6xl mx-auto py-8">
            <div className="flex flex-col items-center">
              <LoadingSpinner size="lg" />
              <p className="text-gray-600 mt-4">Loading...</p>
            </div>
          </div>
        </ServiceLayout>
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
      <ServiceLayout
        title="Flight Booking"
        description="Complete your flight booking"
        breadcrumbs={breadcrumbs}
        serviceName="Flight Booking"
      >
        <div className="max-w-6xl mx-auto py-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Flight Booking</h1>
            <p className="text-gray-600">Complete your flight booking process</p>
          </div>

          {error && (
            <div className="mb-6">
              <ErrorMessage message={error} />
            </div>
          )}

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-8">
              <div className={`flex items-center ${currentStep === 'passenger-details' ? 'text-red-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'passenger-details' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}>
                  1
                </div>
                <span className="ml-2 font-medium">Passenger Details</span>
              </div>
              
              <div className={`w-16 h-0.5 ${passengerData ? 'bg-red-600' : 'bg-gray-200'}`}></div>
              
              <div className={`flex items-center ${currentStep === 'payment-method' ? 'text-red-600' : passengerData ? 'text-gray-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'payment-method' ? 'bg-red-600 text-white' : passengerData ? 'bg-gray-600 text-white' : 'bg-gray-200'}`}>
                  2
                </div>
                <span className="ml-2 font-medium">Payment Method</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {!selectedFlight ? (
              <div className="text-center py-8">
                <div className="mb-4">
                  <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  No Flight Selected
                </h2>
                <p className="text-gray-600 mb-6">
                  Please select a flight from the search results to continue with booking.
                </p>
                <Button
                  variant="outline"
                  onClick={handleBack}
                >
                  Back to Flight Search
                </Button>
              </div>
            ) : currentStep === 'passenger-details' ? (
              <PassengerInfo
                onBack={handleBack}
                onProceed={handlePassengerDataSubmit}
              />
            ) : currentStep === 'payment-method' ? (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Payment Method
                  </h2>
                  <p className="text-gray-600">
                    Choose your preferred payment method
                  </p>
                </div>

                <div className="flex justify-center">
                  <PaymentMethodForm onDataChange={handlePaymentDataChange} />
                </div>

                <div className="flex justify-center space-x-4">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleBookingSubmit}
                    disabled={isLoading || !paymentData}
                    className="bg-red-600 hover:bg-red-700 text-white px-8"
                  >
                    {isLoading ? (
                      <>
                        <LoadingSpinner size="sm" color="white" />
                        <span className="ml-2">Processing...</span>
                      </>
                    ) : (
                      'Complete Booking'
                    )}
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </ServiceLayout>
    </ErrorBoundary>
  )
}