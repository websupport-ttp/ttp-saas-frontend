'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ServiceLayout } from '@/components/layout'
import HotelPaymentMethod from '@/components/hotels/HotelPaymentMethod'

export default function HotelPaymentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [bookingData, setBookingData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get booking data from URL params or localStorage
    const hotelData = searchParams.get('hotel')
    const guestData = searchParams.get('guests')
    
    if (hotelData) {
      try {
        const parsedHotel = JSON.parse(decodeURIComponent(hotelData))
        const parsedGuests = guestData ? JSON.parse(decodeURIComponent(guestData)) : []
        
        // Get additional booking info from URL params
        const destination = searchParams.get('destination') || parsedHotel.location?.city || 'City'
        const checkin = searchParams.get('checkin') || new Date().toISOString().split('T')[0]
        const checkout = searchParams.get('checkout') || new Date(Date.now() + (24 * 60 * 60 * 1000)).toISOString().split('T')[0]
        const nights = searchParams.get('nights') || '1'
        const rooms = searchParams.get('rooms') || '1'
        const adults = searchParams.get('adults') || '1'
        const children = searchParams.get('children') || '0'
        
        // Calculate nights if not provided
        const calculatedNights = checkin && checkout ? 
          Math.max(1, Math.ceil((new Date(checkout).getTime() - new Date(checkin).getTime()) / (1000 * 60 * 60 * 24))) : 
          parseInt(nights)
        
        // Ensure pricePerNight is properly set
        const pricePerNight = parsedHotel.pricePerNight || parsedHotel.rooms?.[0]?.price?.total || parsedHotel.price || 25000;
        
        const booking = {
          hotel: {
            ...parsedHotel,
            pricePerNight: pricePerNight,
            bookingInfo: {
              nights: calculatedNights,
              adults: parseInt(adults),
              children: parseInt(children),
              rooms: parseInt(rooms)
            }
          },
          guests: parsedGuests,
          bookingReference: `HTL${Date.now()}`,
          totalAmount: calculatedNights * pricePerNight,
          bookingInfo: {
            destination: destination,
            checkin: checkin,
            checkout: checkout,
            nights: calculatedNights,
            rooms: parseInt(rooms),
            adults: parseInt(adults),
            children: parseInt(children)
          }
        }
        
        setBookingData(booking)
        
        // Store booking data for success page
        localStorage.setItem('currentHotelBooking', JSON.stringify(booking))
      } catch (error) {
        console.error('Error parsing booking data:', error)
        router.push('/hotels')
      }
    } else {
      router.push('/hotels')
    }
    
    setLoading(false)
  }, [searchParams, router])

  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Hotel Booking', href: '/hotels' },
    { name: 'Payment', href: '/hotels/payment' },
  ]

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Payment - Hotel Booking',
    description: 'Complete your hotel booking payment securely',
    provider: {
      '@type': 'Organization',
      name: 'The Travel Place',
    },
  }

  const handleBack = () => {
    window.history.back()
  }

  const handleConfirmPay = (paymentData: any) => {
    // Simulate payment processing
    const paymentReference = `HTL_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
    
    // Store payment reference for success page
    localStorage.setItem('hotelPaymentReference', paymentReference)
    
    // Navigate to success page with reference
    router.push(`/hotels/success?reference=${paymentReference}`)
  }

  if (loading) {
    return (
      <ServiceLayout
        title="Loading Payment"
        description="Loading payment details"
        breadcrumbs={breadcrumbs}
        serviceName="Hotel Booking"
      >
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mb-4"></div>
            <p className="text-gray-600">Loading payment details...</p>
          </div>
        </div>
      </ServiceLayout>
    )
  }

  if (!bookingData) {
    return (
      <ServiceLayout
        title="Booking Not Found"
        description="Booking data not found"
        breadcrumbs={breadcrumbs}
        serviceName="Hotel Booking"
      >
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Booking data not found</p>
          </div>
        </div>
      </ServiceLayout>
    )
  }

  return (
    <ServiceLayout
      title="Payment - Hotel Booking"
      description="Complete your hotel booking payment securely with multiple payment options including credit card, Google Pay, Apple Pay, and more."
      keywords={['payment', 'hotel booking', 'secure payment', 'credit card', 'google pay', 'apple pay']}
      breadcrumbs={breadcrumbs}
      structuredData={structuredData}
      serviceName="Hotel Booking"
    >
      <div className="payment-page">
        {/* Main Content */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <HotelPaymentMethod
              hotel={bookingData.hotel}
              totalAmount={bookingData.totalAmount}
              guests={bookingData.guests}
              onBack={handleBack}
              onConfirmPay={handleConfirmPay}
            />
          </div>
        </div>
      </div>
    </ServiceLayout>
  )
}