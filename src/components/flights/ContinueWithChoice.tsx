'use client'

import Image from 'next/image'
import { getAirlineLogo } from '@/lib/utils/airline-utils'
import PriceBreakdown from '@/components/common/PriceBreakdown'

interface FlightDetails {
  airline: string
  flightNumber: string
  duration: string
  departureTime: string
  arrivalTime: string
  layover?: string
}

interface ContinueWithChoiceProps {
  outboundFlight?: FlightDetails | null
  returnFlight?: FlightDetails | null
  basePrice?: number
  providerCode?: string
  userRole?: string
  onBack?: () => void
  onProceed?: () => void
  isFormValid?: boolean
}

export default function ContinueWithChoice({
  outboundFlight,
  returnFlight,
  basePrice = 0,
  providerCode,
  userRole = 'customer',
  onBack,
  onProceed,
  isFormValid = false,
}: ContinueWithChoiceProps) {
  const renderFlight = (flight: FlightDetails | null | undefined, label: string) => {
    if (!flight) return null
    return (
      <div className="flex gap-2 p-2 w-full">
        <div className="w-10 h-10 flex-shrink-0">
          <Image
            src={getAirlineLogo(flight.airline)}
            alt={flight.airline}
            width={40}
            height={40}
            className="w-full h-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/flights/airlines/default-airline.svg'
            }}
          />
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <div className="text-gray-900 text-sm font-medium">{flight.airline}</div>
          <div className="text-gray-400 text-sm">{flight.flightNumber}</div>
        </div>
        <div className="flex flex-col gap-1 items-end">
          <div className="text-gray-900 text-sm">{flight.duration}</div>
          <div className="text-gray-900 text-sm">{flight.departureTime} - {flight.arrivalTime}</div>
          {flight.layover && <div className="text-gray-400 text-xs">{flight.layover}</div>}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-[400px]">
      {/* Flight Cart */}
      {(outboundFlight || returnFlight) && (
        <div className="flex flex-col gap-2 p-4 bg-white border border-purple-100 rounded-xl">
          {renderFlight(outboundFlight, 'Outbound')}
          {outboundFlight && returnFlight && (
            <div className="w-full h-px bg-gray-200 my-1" />
          )}
          {renderFlight(returnFlight, 'Return')}
        </div>
      )}

      {/* Price Breakdown */}
      {basePrice > 0 && (
        <PriceBreakdown
          basePrice={basePrice}
          serviceType="flights"
          userRole={userRole}
          providerCode={providerCode}
          showDetails={true}
        />
      )}

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 px-5 py-3 rounded text-base font-normal hover:bg-red-50 transition-colors"
          style={{ border: '1px solid #E21E24', color: '#E21E24', backgroundColor: 'white' }}
        >
          Back
        </button>
        <button
          onClick={onProceed}
          disabled={!isFormValid}
          className={`flex-1 px-5 py-3 rounded text-white text-base font-normal transition-colors ${
            isFormValid ? 'bg-[#E21E24] hover:bg-red-700 cursor-pointer' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Proceed to payment
        </button>
      </div>
    </div>
  )
}
