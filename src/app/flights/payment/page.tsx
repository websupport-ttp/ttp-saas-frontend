'use client'

import { ServiceLayout } from '@/components/layout'
import PaymentFlightDetailsBar from '@/components/flights/PaymentFlightDetailsBar'
import PaymentMethod from '@/components/flights/PaymentMethod'

export default function PaymentPage() {
  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Flight Booking', href: '/flights' },
    { name: 'Payment', href: '/flights/payment' },
  ]

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Payment - Flight Booking',
    description: 'Complete your flight booking payment securely',
    provider: {
      '@type': 'Organization',
      name: 'The Travel Place',
    },
  }

  const handleBack = () => {
    // Navigate back to passenger info
    window.history.back()
  }

  const handleConfirmPay = (paymentData: any) => {
    console.log('Payment data:', paymentData)
    // Process payment and navigate to confirmation
    // router.push('/flights/confirmation')
  }

  return (
    <ServiceLayout
      title="Payment - Flight Booking"
      description="Complete your flight booking payment securely with multiple payment options including credit card, Google Pay, Apple Pay, and more."
      keywords={['payment', 'flight booking', 'secure payment', 'credit card', 'google pay', 'apple pay']}
      breadcrumbs={breadcrumbs}
      structuredData={structuredData}
      serviceName="Flight Booking"
    >
      <div className="payment-page">
        {/* Flight Details Bar - No heart/share icons */}
        <PaymentFlightDetailsBar
          departureCode="LOS"
          departureLocation="Lagos, Nigeria"
          arrivalCode="LGW"
          arrivalLocation="London, Gatwick"
          departureDate="Feb 25"
          departureTime="7:00AM"
          arrivalDate="Mar 21"
          arrivalTime="12:15PM"
          isActive={true}
        />

        {/* Main Content */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <PaymentMethod
              onBack={handleBack}
              onConfirmPay={handleConfirmPay}
            />
          </div>
        </div>
      </div>
    </ServiceLayout>
  )
}