'use client'

import Image from 'next/image'
import HotelNearYou from '@/components/sections/HotelNearYou'
import { formatCurrency } from '@/lib/utils/currency'

interface FlightDetails {
  airline: string
  flightNumber: string
  duration: string
  departureTime: string
  arrivalTime: string
  layover?: string
  price: number
  destination?: string
}

interface BookingDetails {
  confirmationNumber: string
  bookingDate: string
  passengerName: string
  email: string
  totalAmount: number
  subtotal: number
  taxes: number
  baggageFees: number
}

interface PaymentMethod {
  cardNumber: string
  cardholderName: string
  expiryDate: string
  cardType: string
}

interface SuccessfulPaymentProps {
  outboundFlight?: FlightDetails
  returnFlight?: FlightDetails
  bookingDetails?: BookingDetails
  paymentMethod?: PaymentMethod
  bookingReference?: string
  verificationStatus?: 'verifying' | 'success' | 'failed'
  currency?: string
  onViewBooking?: () => void
  onBookAnother?: () => void
}

export default function SuccessfulPayment({
  outboundFlight,
  returnFlight,
  bookingDetails,
  paymentMethod,
  bookingReference,
  verificationStatus = 'success',
  currency: propCurrency,
  onViewBooking,
  onBookAnother
}: SuccessfulPaymentProps) {
  // Helper function to extract city name from location string
  const extractDestinationCity = (locationString: string): string => {
    if (!locationString) return 'Lagos'; // Default fallback

    // Remove common suffixes and clean up
    let cleanString = locationString
      .replace(/,.*$/, '') // Remove everything after comma
      .replace(/\s*(Airport|International).*$/i, '') // Remove airport suffixes
      .trim();

    // Handle specific airport mappings
    const cityMappings: Record<string, string> = {
      'London Heathrow': 'London',
      'London Gatwick': 'London',
      'London Stansted': 'London',
      'London Luton': 'London',
      'New York JFK': 'New York',
      'New York LaGuardia': 'New York',
      'New York Newark': 'New York',
      'Paris Charles de Gaulle': 'Paris',
      'Paris Orly': 'Paris',
      'Tokyo Narita': 'Tokyo',
      'Tokyo Haneda': 'Tokyo',
      'Sydney Kingsford Smith': 'Sydney',
      'Mumbai Chhatrapati Shivaji': 'Mumbai',
      'Bangkok Suvarnabhumi': 'Bangkok',
      'Dubai International': 'Dubai',
      'Cairo International': 'Cairo'
    };

    // Check for direct mappings
    for (const [airportName, cityName] of Object.entries(cityMappings)) {
      if (cleanString.includes(airportName)) {
        return cityName;
      }
    }

    // Take the first word as city name
    const words = cleanString.split(' ');
    return words[0] || 'Lagos';
  };

  // Use bookingReference if provided, otherwise use default
  const confirmationNumber = bookingReference || bookingDetails?.confirmationNumber || "#381029404387";
  
  // Use actual booking details or defaults
  const actualBookingDetails = bookingDetails || {
    confirmationNumber: confirmationNumber,
    bookingDate: "February 25th, 2021",
    passengerName: "Wonuola",
    email: "wonuola@example.com",
    totalAmount: 768,
    subtotal: 702,
    taxes: 66,
    baggageFees: 0
  };

  // Use actual flight details or defaults
  const actualOutboundFlight = outboundFlight || {
    airline: "Hawaiian Airlines",
    flightNumber: "FIG4312",
    duration: "16h 45m",
    departureTime: "7:00AM",
    arrivalTime: "4:15PM",
    layover: "2h 45m in HNL",
    price: 624
  };

  const actualReturnFlight = returnFlight || actualOutboundFlight;

  const actualPaymentMethod = paymentMethod || {
    cardNumber: "••••••••••••3456",
    cardholderName: actualBookingDetails.passengerName || "Wonuola Ogundana",
    expiryDate: "10/23",
    cardType: "mastercard"
  };

  // Extract destination from flight details for dynamic text and hotel search
  const destination = actualOutboundFlight.destination ? 
    extractDestinationCity(actualOutboundFlight.destination) : 
    'Lagos'; // Default fallback

  // Currency formatting - use prop currency or default to NGN for Nigerian flights
  const currency = propCurrency || 'NGN';
  
  // Debug logging for price breakdown
  console.log('💰 SuccessfulPayment price breakdown:', {
    totalAmount: actualBookingDetails.totalAmount,
    subtotal: actualBookingDetails.subtotal,
    taxes: actualBookingDetails.taxes,
    baggageFees: actualBookingDetails.baggageFees
  });
  
  // Helper function to get airline logo with fallback
  const getAirlineLogo = (airlineName: string) => {
    // Map of common airlines to their logo files
    const airlineLogos: Record<string, string> = {
      'hawaiian airlines': '/images/flights/airlines/hawaiian-airlines.svg',
      'delta airlines': '/images/flights/airlines/delta-airlines.svg',
      'delta': '/images/flights/airlines/delta-airlines.svg',
      'emirates': '/images/flights/airlines/emirates.svg',
      'air france': '/images/flights/airlines/air-france.svg',
      'eva air': '/images/flights/airlines/eva-air.svg',
      'japan airlines': '/images/flights/airlines/japan-airlines.svg',
      'jal': '/images/flights/airlines/japan-airlines.svg',
      'korean air': '/images/flights/airlines/korean-air.svg',
      'qantas': '/images/flights/airlines/qantas-airlines.svg',
      'qantas airlines': '/images/flights/airlines/qantas-airlines.svg',
      'united airlines': '/images/flights/airlines/united-airlines.svg',
      'united': '/images/flights/airlines/united-airlines.svg',
      'the travel place': '/images/flights/airlines/hawaiian-airlines.svg' // Default for our brand
    };

    const normalizedName = airlineName.toLowerCase();
    return airlineLogos[normalizedName] || '/images/flights/airlines/hawaiian-airlines.svg';
  };
  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-14">
        {/* Main Content - Left Side */}
        <div className="lg:col-span-2 space-y-14">
          {/* Success Notification */}
          <div className="bg-green-50 border border-green-600 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center">
              {verificationStatus === 'verifying' && (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-3"></div>
                  <p className="text-green-600 text-base">
                    Your flight has been booked successfully! Your confirmation number is {confirmationNumber}. Finalizing booking details...
                  </p>
                </>
              )}
              {verificationStatus === 'success' && (
                <>
                  <svg className="h-4 w-4 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-green-600 text-base">
                    Your flight has been booked successfully! Your confirmation number is {confirmationNumber}. Check your email for complete details.
                  </p>
                </>
              )}
              {verificationStatus === 'failed' && (
                <p className="text-green-600 text-base">
                  Your flight has been booked successfully! Your confirmation number is {confirmationNumber}. You will receive confirmation via email shortly.
                </p>
              )}
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M24 8L8 24M8 8L24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Header Section */}
          <div className="space-y-4">
            <div className="space-y-4">
              <h1 className="text-red-600 text-2xl font-bold">
                Bon voyage, {actualBookingDetails.passengerName}!
              </h1>
              <p className="text-gray-600 text-lg font-semibold">
                Confirmation number: {confirmationNumber}
              </p>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed">
              Thank you for booking your travel with The TravelPlace. Below is a summary of your trip to {destination}.
              We've sent a copy of your booking confirmation to your email address. You can also find this page again in My trips.
            </p>
          </div>

          {/* Flight Summary */}
          <div className="space-y-6">
            <h2 className="text-gray-600 text-2xl font-bold">Flight summary</h2>

            <div className="space-y-10">
              {/* Departing Flight */}
              <div className="space-y-3">
                <h3 className="text-gray-600 text-lg font-semibold">
                  Departing {actualBookingDetails.bookingDate}
                </h3>
                <div className="border border-gray-200 rounded p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex-shrink-0">
                      <Image
                        src={getAirlineLogo(actualOutboundFlight.airline)}
                        alt={actualOutboundFlight.airline}
                        width={40}
                        height={40}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="grid grid-cols-4 gap-8 items-center">
                        <div>
                          <p className="text-gray-900 font-medium">{actualOutboundFlight.duration}</p>
                          <p className="text-gray-400 text-sm">{actualOutboundFlight.airline}</p>
                        </div>
                        <div>
                          <p className="text-gray-900 font-medium">{actualOutboundFlight.departureTime} - {actualOutboundFlight.arrivalTime}</p>
                          <p className="text-gray-400 text-sm">{actualOutboundFlight.flightNumber}</p>
                        </div>
                        <div>
                          <p className="text-gray-900 font-medium">{(actualOutboundFlight.layover && actualOutboundFlight.layover.includes('stop')) ? actualOutboundFlight.layover : '1 stop'}</p>
                          <p className="text-gray-400 text-sm">{actualOutboundFlight.layover || 'Direct flight'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-900 font-medium">{formatCurrency(actualOutboundFlight.price, { currency })}</p>
                          <p className="text-gray-400 text-sm">one way</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Return Flight */}
              <div className="space-y-3">
                <h3 className="text-gray-600 text-lg font-semibold">
                  Arriving March 21st, 2021
                </h3>
                <div className="border border-gray-200 rounded p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex-shrink-0">
                      <Image
                        src={getAirlineLogo(actualReturnFlight.airline)}
                        alt={actualReturnFlight.airline}
                        width={40}
                        height={40}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="grid grid-cols-4 gap-8 items-center">
                        <div>
                          <p className="text-gray-900 font-medium">{actualReturnFlight.duration}</p>
                          <p className="text-gray-400 text-sm">{actualReturnFlight.airline}</p>
                        </div>
                        <div>
                          <p className="text-gray-900 font-medium">{actualReturnFlight.departureTime} - {actualReturnFlight.arrivalTime}</p>
                          <p className="text-gray-400 text-sm">{actualReturnFlight.flightNumber}</p>
                        </div>
                        <div>
                          <p className="text-gray-900 font-medium">{(actualReturnFlight.layover && actualReturnFlight.layover.includes('stop')) ? actualReturnFlight.layover : '1 stop'}</p>
                          <p className="text-gray-400 text-sm">{actualReturnFlight.layover || 'Direct flight'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-900 font-medium">{formatCurrency(actualReturnFlight.price, { currency })}</p>
                          <p className="text-gray-400 text-sm">one way</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-14">
          {/* Price Breakdown */}
          <div className="space-y-6">
            <h2 className="text-gray-600 text-2xl font-bold">Price breakdown</h2>

            <div className="space-y-4">
              <div className="space-y-3">
                {/* Only show departing flight price if we have flight data */}
                {actualOutboundFlight.price > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-lg">Departing Flight</span>
                    <span className="text-gray-600 text-lg">{formatCurrency(actualOutboundFlight.price, { currency })}</span>
                  </div>
                )}
                
                {/* Only show return flight price if we have return flight data */}
                {actualReturnFlight.price > 0 && actualReturnFlight !== actualOutboundFlight && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-lg">Arriving Flight</span>
                    <span className="text-gray-600 text-lg">{formatCurrency(actualReturnFlight.price, { currency })}</span>
                  </div>
                )}
                
                {/* Only show baggage fees if they exist */}
                {actualBookingDetails.baggageFees > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-lg">Baggage fees</span>
                    <span className="text-gray-600 text-lg">{formatCurrency(actualBookingDetails.baggageFees, { currency })}</span>
                  </div>
                )}
                
                {/* Only show taxes if they exist */}
                {actualBookingDetails.taxes > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-lg">Taxes and Fees</span>
                    <span className="text-gray-600 text-lg">{formatCurrency(actualBookingDetails.taxes, { currency })}</span>
                  </div>
                )}
                
                {/* Only show subtotal if it's different from total (i.e., we have breakdown) */}
                {actualBookingDetails.subtotal > 0 && actualBookingDetails.subtotal !== actualBookingDetails.totalAmount && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-lg">Subtotal</span>
                    <span className="text-gray-600 text-lg">{formatCurrency(actualBookingDetails.subtotal, { currency })}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-800 text-lg font-semibold">Amount paid</span>
                  <span className="text-gray-800 text-lg font-semibold">{formatCurrency(actualBookingDetails.totalAmount, { currency })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-6">
            <h2 className="text-gray-600 text-2xl font-bold">Payment method</h2>

            {actualPaymentMethod.cardType === 'paystack' ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">Paystack Payment</p>
                    <p className="text-gray-600">Payment completed successfully</p>
                    <p className="text-sm text-gray-500 mt-1">Paid by: {actualPaymentMethod.cardholderName}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden" style={{
                height: '188px',
                background: 'linear-gradient(180deg, rgba(235, 86, 140, 1) 0%, rgba(237, 94, 118, 1) 100%)',
                boxShadow: 'inset 4px 4px 16px 0px rgba(255, 255, 255, 0.2), inset -4px -4px 16px 0px rgba(0, 0, 0, 0.1)'
              }}>
                {/* Mastercard Logo - Top Left */}
                <div className="absolute left-6" style={{ top: '28px' }}>
                  <Image
                    src="/images/payment/mastercard-logo.svg"
                    alt="Mastercard"
                    width={76}
                    height={24}
                    className="w-19 h-6"
                  />
                </div>

                {/* Card Number */}
                <div className="absolute left-6" style={{ top: '142px' }}>
                  <p className="text-white text-base font-semibold tracking-[0.2em]" style={{ color: '#F6F6FE' }}>
                    {actualPaymentMethod.cardNumber}
                  </p>
                </div>

                {/* Cardholder Name */}
                <div className="absolute left-6" style={{ bottom: '54px' }}>
                  <p className="text-lg font-semibold" style={{ color: '#F6F6FE' }}>
                    {actualPaymentMethod.cardholderName}
                  </p>
                </div>

                {/* Expiry Date */}
                <div className="absolute right-6" style={{ bottom: '54px' }}>
                  <p className="text-base font-semibold tracking-[0.1em]" style={{ color: '#F6F6FE' }}>
                    {actualPaymentMethod.expiryDate}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hotel Recommendations */}
      <div className="mt-16">
        <HotelNearYou 
          destination={destination}
          checkInDate={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
          checkOutDate={new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
          rooms={[{ adults: 2, children: 0 }]}
        />
      </div>
    </div>
  )
}