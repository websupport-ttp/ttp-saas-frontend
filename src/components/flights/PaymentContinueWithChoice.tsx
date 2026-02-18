'use client'

import Image from 'next/image'
import { getAirlineLogo } from '@/lib/utils/airline-utils'

interface FlightDetails {
  airline: string
  flightNumber: string
  duration: string
  departureTime: string
  arrivalTime: string
  layover?: string
}

interface PriceSummary {
  subtotal: number
  taxesAndFees: number
  total: number
}

interface PaymentContinueWithChoiceProps {
  outboundFlight?: FlightDetails
  returnFlight?: FlightDetails
  priceSummary?: PriceSummary
  onBack?: () => void
  onConfirmPay?: () => void
}

export default function PaymentContinueWithChoice({
  outboundFlight = {
    airline: "Hawaiian Airlines",
    flightNumber: "FIG4312",
    duration: "16h 45m (+1d)",
    departureTime: "7:00 AM",
    arrivalTime: "4:15 PM",
    layover: "2h 45m in HNL"
  },
  returnFlight = {
    airline: "Hawaiian Airlines",
    flightNumber: "FIG4312",
    duration: "16h 45m (+1d)",
    departureTime: "7:00 AM",
    arrivalTime: "4:15 PM",
    layover: "2h 45m in HNL"
  },
  priceSummary = {
    subtotal: 1403,
    taxesAndFees: 121,
    total: 1725
  },
  onBack,
  onConfirmPay
}: PaymentContinueWithChoiceProps) {
  return (
    <div className="flex flex-col items-end gap-10 w-[400px] h-[608px]">
      {/* Flight Cart */}
      <div className="flex flex-col items-end w-full">
        {/* Flights in Cart */}
        <div className="flex flex-col gap-2 p-4 bg-white border border-purple-100 rounded-xl">
          {/* Outbound Flight */}
          <div className="flex gap-2 p-2 w-[368px]">
            <div className="w-10 h-10 flex-shrink-0">
              <Image
                src={getAirlineLogo(outboundFlight.airline)}
                alt={outboundFlight.airline}
                width={40}
                height={40}
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback to default airline logo if specific logo fails to load
                  const target = e.target as HTMLImageElement
                  target.src = '/images/flights/airlines/default-airline.svg'
                }}
              />
            </div>

            <div className="flex flex-col gap-1 flex-1">
              <div className="text-gray-900 text-base font-normal text-right">
                {outboundFlight.airline}
              </div>
              <div className="text-gray-400 text-base font-normal text-right">
                {outboundFlight.flightNumber}
              </div>
            </div>

            <div className="flex flex-col gap-1 flex-1">
              <div className="text-gray-900 text-base font-normal text-right">
                {outboundFlight.duration}
              </div>
              <div className="text-gray-900 text-base font-normal text-right">
                {outboundFlight.departureTime} - {outboundFlight.arrivalTime}
              </div>
              {outboundFlight.layover && (
                <div className="text-gray-400 text-base font-normal text-right">
                  {outboundFlight.layover}
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="flex justify-center py-1 w-[368px]">
            <div className="w-full h-px bg-gray-200"></div>
          </div>

          {/* Return Flight */}
          <div className="flex gap-2 p-2 w-[368px]">
            <div className="w-10 h-10 flex-shrink-0">
              <Image
                src={getAirlineLogo(returnFlight.airline)}
                alt={returnFlight.airline}
                width={40}
                height={40}
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback to default airline logo if specific logo fails to load
                  const target = e.target as HTMLImageElement
                  target.src = '/images/flights/airlines/default-airline.svg'
                }}
              />
            </div>

            <div className="flex flex-col gap-1 flex-1">
              <div className="text-gray-900 text-base font-normal text-right">
                {returnFlight.airline}
              </div>
              <div className="text-gray-400 text-base font-normal text-right">
                {returnFlight.flightNumber}
              </div>
            </div>

            <div className="flex flex-col gap-1 flex-1">
              <div className="text-gray-900 text-base font-normal text-right">
                {returnFlight.duration}
              </div>
              <div className="text-gray-900 text-base font-normal text-right">
                {returnFlight.departureTime} - {returnFlight.arrivalTime}
              </div>
              {returnFlight.layover && (
                <div className="text-gray-400 text-base font-normal text-right">
                  {returnFlight.layover}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Price Summary */}
        <div className="flex justify-end gap-10 p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex flex-col gap-2">
            <div className="text-gray-900 text-base font-semibold text-right w-[120px]">
              Subtotal
            </div>
            <div className="text-gray-900 text-base font-semibold text-right w-[120px]">
              Taxes and Fees
            </div>
            <div className="text-gray-900 text-base font-semibold text-right w-[120px]">
              Total
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="text-gray-900 text-base font-semibold">
              ${priceSummary.subtotal.toLocaleString()}
            </div>
            <div className="text-gray-900 text-base font-semibold">
              ${priceSummary.taxesAndFees}
            </div>
            <div className="text-gray-900 text-base font-semibold">
              ${priceSummary.total.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Button Row */}
      <div className="flex gap-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-3 h-12 rounded text-lg font-normal hover:bg-red-50 transition-colors"
          style={{
            border: '1px solid #E21E24',
            color: '#E21E24',
            backgroundColor: 'white',
            borderRadius: '4px'
          }}
        >
          Back
        </button>

        <button
          onClick={onConfirmPay}
          className="flex items-center gap-2 px-5 py-3 h-12 bg-[#E21E24] rounded text-white text-lg font-normal hover:bg-red-700 transition-colors"
        >
          Confirm and pay
        </button>
      </div>
    </div>
  )
}