'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ServiceLayout } from '@/components/layout'
import UniversalSuccessPage from '@/components/common/UniversalSuccessPage'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { getAirlineLogo } from '@/lib/utils/airline-utils'

export default function UniversalSuccessPageRoute() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [bookingDetails, setBookingDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [paymentReference, setPaymentReference] = useState<string | null>(null)
  const [serviceType, setServiceType] = useState<string>('hotel')
  const verificationAttempted = useRef(false)

  console.log('🎯 Universal Success Page - Component loaded')

  useEffect(() => {
    // Get payment reference and service type from URL parameters
    // Paystack can send reference as 'reference', 'trxref', or other parameter names
    const reference = searchParams.get('reference') || 
                     searchParams.get('trxref') || 
                     searchParams.get('transaction_id') ||
                     searchParams.get('trans_id')
    const service = searchParams.get('service') || 'hotel' // Default to hotel if not specified
    
    console.log('🔍 All URL search params:', Object.fromEntries(searchParams.entries()))
    console.log('📧 Found payment reference:', reference)
    console.log('🏷️ Service type:', service)
    
    if (reference) {
      setPaymentReference(reference)
      setServiceType(service)
      
      // Verify payment and trigger confirmation emails (only once)
      if (!verificationAttempted.current) {
        verificationAttempted.current = true
        verifyPaymentAndSendEmails(reference, service)
      }
      
      // Try to get booking data from localStorage based on service type
      const storageKey = `current${service.charAt(0).toUpperCase() + service.slice(1)}Booking`
      const storedBookingData = localStorage.getItem(storageKey)
      
      console.log(`📦 Looking for booking data in: ${storageKey}`)
      console.log('🔍 Stored booking data:', storedBookingData)
      
      if (storedBookingData) {
        try {
          const parsedBookingData = JSON.parse(storedBookingData)
          console.log('✅ Parsed booking data:', parsedBookingData)
          setBookingDetails(parsedBookingData)
        } catch (error) {
          console.error('❌ Error parsing stored booking data:', error)
        }
      }
      
      setLoading(false)
    } else {
      console.warn('⚠️ No payment reference found in URL parameters')
      console.log('🔍 Available URL parameters:', Object.fromEntries(searchParams.entries()))
      console.log('🌐 Full URL:', window.location.href)
      console.log('❓ This might be a direct navigation to success page without payment')
      
      // Still try to show booking data if available
      const storageKey = `current${service.charAt(0).toUpperCase() + service.slice(1)}Booking`
      const storedBookingData = localStorage.getItem(storageKey)
      
      if (storedBookingData) {
        try {
          const parsedBookingData = JSON.parse(storedBookingData)
          console.log('📦 Found booking data without payment reference:', parsedBookingData)
          setBookingDetails(parsedBookingData)
        } catch (error) {
          console.error('❌ Error parsing stored booking data:', error)
        }
      }
      
      setLoading(false)
      // Don't redirect to home, just show the success page without payment verification
    }
  }, [searchParams, router])

  // Function to verify payment and trigger confirmation emails
  const verifyPaymentAndSendEmails = async (reference: string, service: string) => {
    try {
      console.log(`🔍 Starting payment verification for ${service}`)
      console.log(`📧 Payment reference: ${reference}`)
      console.log(`🌐 Current URL: ${window.location.href}`)
      
      let verificationEndpoint = ''
      switch (service) {
        case 'hotel':
          verificationEndpoint = '/api/v1/products/hotels/verify-payment'
          break
        case 'flight':
          verificationEndpoint = '/api/v1/products/flights/verify-payment'
          break
        case 'insurance':
          verificationEndpoint = '/api/v1/products/travel-insurance/verify-payment'
          break
        case 'visa':
          verificationEndpoint = '/api/v1/products/visa/verify-payment'
          break
        default:
          verificationEndpoint = '/api/v1/products/hotels/verify-payment'
      }

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1'
      const fullUrl = verificationEndpoint.startsWith('http') 
        ? verificationEndpoint 
        : `${apiBaseUrl.replace('/api/v1', '')}${verificationEndpoint}`
      
      console.log(`🎯 Calling endpoint: ${fullUrl}`)
      console.log(`📤 Request payload:`, { reference })

      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reference })
      })

      console.log(`📊 Response status: ${response.status}`)
      console.log(`📊 Response ok: ${response.ok}`)

      const result = await response.json()
      console.log(`📋 Full response body:`, result)

      if (result.status === 'success' || result.success) {
        console.log(`✅ Payment verification successful for ${service}`)
        console.log(`📧 Confirmation emails should be sent for ${service} booking`)
        console.log(`🎉 Booking confirmed with reference: ${result.data?.bookingReference || 'N/A'}`)
      } else {
        console.warn(`⚠️ Payment verification failed for ${service}`)
        console.warn(`❌ Error message: ${result.message}`)
        console.warn(`🔍 Error details:`, result.debug || result.error || 'No additional details')
        
        // Check if it's a "Transaction not found" error
        if (result.message?.includes('Transaction not found')) {
          console.log(`💡 This might be because the payment reference doesn't exist in the database`)
          console.log(`💡 Make sure you're using a real payment reference from a completed booking`)
        }
      }
    } catch (error) {
      console.error(`❌ Network error verifying payment for ${service}:`, error)
      if (error instanceof Error) {
        console.error(`🔍 Error details:`, {
          name: error.name,
          message: error.message,
          stack: error.stack
        })
      }
    }
  }

  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: getServiceDisplayName(serviceType), href: `/${serviceType === 'package' ? 'packages' : serviceType === 'car-hire' ? 'car-hire' : serviceType + 's'}` },
    { name: 'Booking Confirmed', href: '/success' },
  ]

  function getServiceDisplayName(service: string) {
    switch (service) {
      case 'hotel': return 'Hotel Booking'
      case 'flight': return 'Flight Booking'
      case 'insurance': return 'Travel Insurance'
      case 'visa': return 'Visa Application'
      case 'package': return 'Travel Package'
      case 'car-hire': return 'Car Rental'
      default: return 'Service'
    }
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${getServiceDisplayName(serviceType)} Confirmed - Success`,
    description: `Your ${serviceType} booking has been confirmed successfully`,
    provider: {
      '@type': 'Organization',
      name: 'The Travel Place',
    },
  }

  const handleViewBooking = () => {
    console.log(`View ${serviceType} booking details`)
    // router.push('/dashboard/bookings')
  }

  const handleBookAnother = () => {
    let route = `/${serviceType}s`
    if (serviceType === 'package') route = '/packages'
    if (serviceType === 'car-hire') route = '/car-hire'
    router.push(route)
  }

  if (loading) {
    return (
      <ServiceLayout
        title="Loading Booking Details"
        description="Loading your booking confirmation"
        breadcrumbs={breadcrumbs}
        serviceName={getServiceDisplayName(serviceType)}
      >
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading your booking details...</p>
          </div>
        </div>
      </ServiceLayout>
    )
  }

  // Prepare service details based on service type and booking data
  const prepareServiceDetails = () => {
    if (!bookingDetails) {
      return getDefaultServiceDetails(serviceType)
    }

    switch (serviceType) {
      case 'hotel':
        return {
          id: bookingDetails.hotel?.id || bookingDetails.hotelDetails?.id || '1',
          name: bookingDetails.hotel?.name || bookingDetails.hotelDetails?.name || 'Hotel Booking',
          type: 'hotel' as const,
          location: bookingDetails.hotel?.location || bookingDetails.hotelDetails?.location || { city: 'City', country: 'Country' },
          pricePerNight: bookingDetails.hotel?.pricePerNight || bookingDetails.hotelDetails?.price || bookingDetails.hotel?.rooms?.[0]?.price?.total || 199,
          images: bookingDetails.hotel?.images || ['/images/hotels/hotel-1.png']
        }
      case 'flight':
        return {
          id: bookingDetails.flight?.id || '1',
          name: bookingDetails.flight?.airline || bookingDetails.flight?.validatingAirlineCodes?.[0] || 'Flight Booking',
          type: 'flight' as const,
          airline: bookingDetails.flight?.airline || bookingDetails.flight?.validatingAirlineCodes?.[0] || 'Airline',
          flightNumber: bookingDetails.flight?.flightNumber || 
                       bookingDetails.flight?.itineraries?.[0]?.segments?.map((s: any) => s.carrierCode + s.number).join(', ') || 
                       'FL123',
          route: bookingDetails.flight?.route || 
                 (bookingDetails.flight?.itineraries?.[0]?.segments ? 
                   `${bookingDetails.flight.itineraries[0].segments[0]?.departure?.iataCode || 'DEP'} → ${bookingDetails.flight.itineraries[0].segments.slice(-1)[0]?.arrival?.iataCode || 'ARR'}` : 
                   'Route'),
          images: [getAirlineLogo(bookingDetails.flight?.validatingAirlineCodes?.[0] || 'default')]
        }
      case 'insurance':
        return {
          id: bookingDetails.insurance?.id || '1',
          name: bookingDetails.insurance?.planName || 'Travel Insurance',
          type: 'insurance' as const,
          provider: bookingDetails.insurance?.provider || 'Insurance Provider',
          planType: bookingDetails.insurance?.planType || 'Standard Plan'
        }
      case 'visa':
        return {
          id: bookingDetails.visa?.id || '1',
          name: bookingDetails.visa?.countryName || 'Visa Application',
          type: 'visa' as const,
          country: bookingDetails.visa?.country || 'Country',
          visaType: bookingDetails.visa?.visaType || 'Tourist Visa'
        }
      case 'package':
        return {
          id: bookingDetails.package?.id || '1',
          name: bookingDetails.package?.name || 'Travel Package',
          type: 'package' as const,
          location: bookingDetails.package?.location || { city: 'City', country: 'Country' },
          packageType: bookingDetails.package?.packageType || 'Standard Package',
          duration: bookingDetails.package?.duration || '7 days'
        }
      case 'car-hire':
        return {
          id: bookingDetails.carHire?.id || bookingDetails.car?.id || '1',
          name: bookingDetails.carHire?.name || bookingDetails.car?.name || 'Car Rental',
          type: 'car-hire' as const,
          location: bookingDetails.carHire?.location || bookingDetails.location ? { city: bookingDetails.location, country: 'Country' } : { city: 'City', country: 'Country' },
          carModel: bookingDetails.carHire?.model || bookingDetails.car?.name || 'Car Model',
          rentalDays: bookingDetails.carHire?.rentalDays || bookingDetails.rentalDays || 1
        }
      default:
        return getDefaultServiceDetails(serviceType)
    }
  }

  const getDefaultServiceDetails = (service: string) => {
    switch (service) {
      case 'hotel':
        return {
          id: '1',
          name: 'Hotel Booking',
          type: 'hotel' as const,
          location: { city: 'City', country: 'Country' },
          pricePerNight: 199,
          images: ['/images/hotels/hotel-1.png']
        }
      case 'flight':
        return {
          id: '1',
          name: 'Flight Booking',
          type: 'flight' as const,
          airline: 'Airline',
          flightNumber: 'FL123',
          route: 'Route'
        }
      case 'insurance':
        return {
          id: '1',
          name: 'Travel Insurance',
          type: 'insurance' as const,
          provider: 'Insurance Provider',
          planType: 'Standard Plan'
        }
      case 'visa':
        return {
          id: '1',
          name: 'Visa Application',
          type: 'visa' as const,
          country: 'Country',
          visaType: 'Tourist Visa'
        }
      case 'package':
        return {
          id: '1',
          name: 'Travel Package',
          type: 'package' as const,
          location: { city: 'City', country: 'Country' },
          packageType: 'Standard Package',
          duration: '7 days'
        }
      case 'car-hire':
        return {
          id: '1',
          name: 'Car Rental',
          type: 'car-hire' as const,
          location: { city: 'City', country: 'Country' },
          carModel: 'Car Model',
          rentalDays: 1
        }
      default:
        return {
          id: '1',
          name: 'Service Booking',
          type: 'hotel' as const,
          location: { city: 'City', country: 'Country' },
          pricePerNight: 199
        }
    }
  }

  // Prepare booking details
  const prepareBookingDetails = () => {
    const baseDetails = {
      confirmationNumber: bookingDetails?.bookingReference || 
                         bookingDetails?.paymentReference || 
                         bookingDetails?.reference || 
                         paymentReference,
      bookingDate: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      guestName: bookingDetails?.guestDetails?.firstName && bookingDetails?.guestDetails?.lastName ? 
        `${bookingDetails.guestDetails.firstName} ${bookingDetails.guestDetails.lastName}` : 
        bookingDetails?.passengerName ||
        'Valued Customer',
      email: bookingDetails?.guestDetails?.email || bookingDetails?.email || '',
      totalAmount: bookingDetails?.totalAmount || 199,
      subtotal: Math.round((bookingDetails?.totalAmount || 199) / 1.12),
      taxes: Math.round((bookingDetails?.totalAmount || 199) * 0.12 / 1.12)
    }

    // Add service-specific details
    switch (serviceType) {
      case 'hotel':
        return {
          ...baseDetails,
          nights: bookingDetails?.bookingInfo?.nights || bookingDetails?.hotel?.bookingInfo?.nights || 1,
          adults: bookingDetails?.bookingInfo?.adults || bookingDetails?.hotel?.bookingInfo?.adults || 1,
          children: bookingDetails?.bookingInfo?.children || bookingDetails?.hotel?.bookingInfo?.children || 0,
          rooms: bookingDetails?.bookingInfo?.rooms || bookingDetails?.hotel?.bookingInfo?.rooms || 1
        }
      case 'flight':
        return {
          ...baseDetails,
          passengers: bookingDetails?.passengers?.length || 
                     bookingDetails?.passenger ? 1 : 
                     bookingDetails?.flight?.travelerPricings?.length || 1,
          departure: bookingDetails?.departure || 
                    bookingDetails?.flight?.itineraries?.[0]?.segments?.[0]?.departure?.iataCode || 
                    'Departure',
          arrival: bookingDetails?.arrival || 
                  bookingDetails?.flight?.itineraries?.[0]?.segments?.slice(-1)[0]?.arrival?.iataCode || 
                  'Arrival',
          flightClass: bookingDetails?.flightClass || 
                      bookingDetails?.flight?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin || 
                      'Economy'
        }
      case 'insurance':
        return {
          ...baseDetails,
          policyNumber: bookingDetails?.policyNumber || 'POL123456',
          coveragePeriod: bookingDetails?.coveragePeriod || '30 days'
        }
      case 'visa':
        return {
          ...baseDetails,
          applicationId: bookingDetails?.applicationId || 'APP123456',
          processingTime: bookingDetails?.processingTime || '10-15 business days'
        }
      case 'package':
        return {
          ...baseDetails,
          packageDuration: bookingDetails?.packageDuration || bookingDetails?.package?.duration || '7 days',
          packageType: bookingDetails?.packageType || bookingDetails?.package?.packageType || 'Standard Package'
        }
      case 'car-hire':
        return {
          ...baseDetails,
          rentalDays: bookingDetails?.rentalDays || bookingDetails?.carHire?.rentalDays || 1,
          carModel: bookingDetails?.carModel || bookingDetails?.car?.name || 'Car Model'
        }
      default:
        return baseDetails
    }
  }

  const serviceDetails = prepareServiceDetails()
  const finalBookingDetails = prepareBookingDetails()

  console.log('🎯 Final service details:', serviceDetails)
  console.log('🎯 Final booking details:', finalBookingDetails)

  return (
    <ServiceLayout
      title={`${getServiceDisplayName(serviceType)} Confirmed - Success`}
      description={`Your ${serviceType} booking has been confirmed successfully. Check your email for booking details and confirmation.`}
      keywords={[`${serviceType} booking confirmed`, 'successful payment', 'booking confirmation', `${serviceType} reservation`]}
      breadcrumbs={breadcrumbs}
      structuredData={structuredData}
      serviceName={getServiceDisplayName(serviceType)}
    >
      <div className="success-page bg-white min-h-screen">
        {/* Main Content */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <UniversalSuccessPage
              serviceDetails={serviceDetails}
              bookingDetails={finalBookingDetails}
              paymentMethod={{
                cardNumber: "Paystack Payment",
                cardholderName: finalBookingDetails.guestName,
                expiryDate: "Completed",
                cardType: "paystack"
              }}
              currency="NGN"
              onViewBooking={handleViewBooking}
              onBookAnother={handleBookAnother}
              bookingReference={finalBookingDetails.confirmationNumber}
            />
          </div>
        </div>
      </div>
    </ServiceLayout>
  )
}