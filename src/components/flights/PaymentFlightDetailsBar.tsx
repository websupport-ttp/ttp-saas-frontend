'use client'

import Image from 'next/image'

interface PaymentFlightDetailsBarProps {
  departureCode?: string
  departureLocation?: string
  arrivalCode?: string
  arrivalLocation?: string
  departureDate?: string
  departureTime?: string
  arrivalDate?: string
  arrivalTime?: string
  isActive?: boolean
}

export default function PaymentFlightDetailsBar({
  departureCode = "LOS",
  departureLocation = "Lagos, Nigeria",
  arrivalCode = "LGW",
  arrivalLocation = "London, Gatwick",
  departureDate = "Feb 25",
  departureTime = "7:00AM",
  arrivalDate = "Mar 21",
  arrivalTime = "12:15PM",
  isActive = true
}: PaymentFlightDetailsBarProps) {
  return (
    <div className="h-[88px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 h-full flex items-center">
        {/* Flight Route Section */}
        <div className="bg-gray-800 flex items-center h-full">
          {/* Departure */}
          <div className="flex flex-col items-start justify-center px-6 py-5 h-[88px] min-w-[129px]">
            <div className="text-gray-100 text-2xl font-extrabold uppercase leading-tight mb-1 text-left">
              {departureCode}
            </div>
            <div className="text-purple-200 text-xs leading-tight text-left">
              {departureLocation}
            </div>
          </div>

          {/* Arrow */}
          <div className="w-8 h-8 flex items-center justify-center mx-4">
            <svg width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 1L19 7.5L12.5 14M18 7.5H1" stroke="#EEEEEE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Arrival */}
          <div className="flex flex-col items-start justify-center px-6 py-5 h-[88px] min-w-[129px]">
            <div className="text-gray-100 text-2xl font-extrabold uppercase leading-tight mb-1 text-left">
              {arrivalCode}
            </div>
            <div className="text-purple-200 text-xs leading-tight text-left">
              {arrivalLocation}
            </div>
          </div>
        </div>

        {/* Progress Steps Section */}
        <div className="flex items-center h-full">
          {/* Left Divider */}
          <div className="w-px h-[88px] bg-gray-600"></div>

          {/* Departing Step */}
          <div className={`relative flex flex-col items-start justify-center px-6 py-5 h-[88px] min-w-[210px] ${isActive ? 'bg-red-600' : ''
            }`}>
            <div className="text-white text-base font-normal leading-tight mb-1 text-left">
              {departureDate} | {departureTime}
            </div>
            <div className="text-purple-200 text-xs leading-tight text-left">
              Departing
            </div>
            {isActive && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                <Image
                  src="/images/flights/chevron-up.svg"
                  alt="Active step indicator"
                  width={20}
                  height={8}
                  className="w-5 h-2"
                />
              </div>
            )}
          </div>

          {/* Middle Divider */}
          <div className="w-px h-[88px] bg-gray-600"></div>

          {/* Arriving Step */}
          <div className="flex flex-col items-start justify-center px-6 py-5 h-[88px] bg-gray-800 min-w-[210px]">
            <div className="text-white text-base font-normal leading-tight mb-1 text-left">
              {arrivalDate} | {arrivalTime}
            </div>
            <div className="text-purple-200 text-xs leading-tight text-left">
              Arriving
            </div>
          </div>

          {/* Right Divider */}
          <div className="w-px h-[88px] bg-gray-600"></div>
        </div>
      </div>
    </div>
  )
}