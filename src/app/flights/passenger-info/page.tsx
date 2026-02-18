'use client'

import { ServiceLayout } from '@/components/layout'
import FlightDetailsBar from '@/components/flights/FlightDetailsBar'
import PassengerInfo from '@/components/flights/PassengerInfo'

export default function PassengerInfoPage() {
  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Flight Booking', href: '/flights' },
    { name: 'Passenger Information', href: '/flights/passenger-info' },
  ]

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Passenger Information - Flight Booking',
    description: 'Enter passenger information for flight booking',
    provider: {
      '@type': 'Organization',
      name: 'The Travel Place',
    },
  }

  const handleBack = () => {
    // Navigate back to flight selection
    window.history.back()
  }

  const handleProceed = (passengerData: any) => {
    console.log('Passenger data:', passengerData)
    // Navigate to payment page
    // router.push('/flights/payment')
  }

  return (
    <ServiceLayout
      title="Passenger Information - Flight Booking"
      description="Enter passenger information for your flight booking. Provide accurate details that match your government-issued ID."
      keywords={['passenger information', 'flight booking', 'travel details', 'airline booking']}
      breadcrumbs={breadcrumbs}
      structuredData={structuredData}
      serviceName="Flight Booking"
    >
      <div className="passenger-info-page">
        {/* Flight Details Bar */}
        <FlightDetailsBar
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
            <PassengerInfo
              onBack={handleBack}
              onProceed={handleProceed}
            />
          </div>
        </div>
      </div>
    </ServiceLayout>
  )
}