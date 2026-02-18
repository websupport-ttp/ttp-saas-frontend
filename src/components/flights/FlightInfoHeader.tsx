'use client'

import Image from 'next/image'
import { useState } from 'react'

interface FlightInfoHeaderProps {
  originCode: string
  originCity: string
  originCountry: string
  destinationCode: string
  destinationCity: string
  destinationCountry: string
  departureDate: string
  departureTime: string
  returnDate?: string
  returnTime?: string
  isRoundTrip?: boolean
}

export default function FlightInfoHeader({
  originCode,
  originCity,
  originCountry,
  destinationCode,
  destinationCity,
  destinationCountry,
  departureDate,
  departureTime,
  returnDate,
  returnTime,
  isRoundTrip = false
}: FlightInfoHeaderProps) {
  const [isFavorited, setIsFavorited] = useState(false)

  const handleShare = () => {
    // Share functionality
    if (navigator.share) {
      navigator.share({
        title: `Flight: ${originCode} → ${destinationCode}`,
        text: `Flight from ${originCity} to ${destinationCity}`,
        url: window.location.href
      }).catch((error) => console.log('Error sharing:', error))
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  const handleFavorite = () => {
    setIsFavorited(!isFavorited)
    // Add your favorite logic here (e.g., save to localStorage or API)
  }

  return (
    <div className="w-full bg-white overflow-visible">
      <div className="max-w-7xl mx-auto flex items-center py-0 overflow-visible">
        {/* Left side - Flight route information and departing box - takes up 3/5 with dark blue background */}
        <div className="flex items-center w-3/5 bg-[#27273F] h-[88px] overflow-visible">
          {/* Origin */}
          <div className="flex flex-col justify-center gap-0 px-6 py-5 min-w-[160px] h-[88px]">
            <div className="text-[#FAFAFA] font-extrabold text-2xl leading-[1.364em] uppercase">
              {originCode}
            </div>
            <div className="text-[#E9E8FC] text-xs leading-[1.364em]">
              {originCity}, {originCountry}
            </div>
          </div>

          {/* Arrow */}
          <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
            {isRoundTrip ? (
              // Round trip arrows (forward and backward)
              <div className="flex flex-col items-center justify-center">
                <svg width="16" height="6" viewBox="0 0 16 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 3L10 0.5V2.5H1V3.5H10V5.5L15 3Z" fill="white"/>
                </svg>
                <svg width="16" height="6" viewBox="0 0 16 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-0.5">
                  <path d="M1 3L6 5.5V3.5H15V2.5H6V0.5L1 3Z" fill="white"/>
                </svg>
              </div>
            ) : (
              // One way arrow
              <Image
                src="/images/flight-info/arrow-right-icon.svg"
                alt="Arrow"
                width={32}
                height={32}
              />
            )}
          </div>

          {/* Destination */}
          <div className="flex flex-col justify-center gap-0 px-6 py-5 min-w-[160px] h-[88px]">
            <div className="text-[#FAFAFA] font-extrabold text-2xl leading-[1.364em] uppercase">
              {destinationCode}
            </div>
            <div className="text-[#E9E8FC] text-xs leading-[1.364em]">
              {destinationCity}, {destinationCountry}
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-[88px] bg-[#6E7491] ml-4"></div>

          {/* Departing step - Active with chevron */}
          <div className="relative flex flex-col justify-center gap-1 px-6 py-5 w-[210px] h-[88px] bg-[#E21E24] overflow-visible">
            <div className="text-white text-base leading-[1.364em]">
              {departureDate} | {departureTime}
            </div>
            <div className="text-[#E9E8FC] text-xs leading-[1.364em]">
              Departing
            </div>
            {/* White chevron pointing up */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
              <svg width="20" height="8" viewBox="0 0 20 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 0L20 8H0L10 0Z" fill="white"/>
              </svg>
            </div>
          </div>

          {/* Arriving step - Inactive (only show for round trips) */}
          {isRoundTrip && returnDate && returnTime && (
            <>
              {/* Divider */}
              <div className="w-px h-[88px] bg-[#6E7491]"></div>
              
              <div className="flex flex-col justify-center gap-1 px-6 py-5 w-[210px] h-[88px] bg-[#27273F]">
                <div className="text-white text-base leading-[1.364em]">
                  {returnDate} | {returnTime}
                </div>
                <div className="text-[#E9E8FC] text-xs leading-[1.364em]">
                  Arriving
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right side - Action icons - takes up 2/5 with white background */}
        <div className="flex items-center justify-end w-2/5 h-[88px] bg-white px-8 gap-6">
          {/* Share button */}
          <button
            onClick={handleShare}
            className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Share flight"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 5.12548 15.0077 5.24917 15.0227 5.37061L8.08259 9.16716C7.54305 8.4449 6.72181 8 5.8 8C4.14315 8 2.8 9.34315 2.8 11C2.8 12.6569 4.14315 14 5.8 14C6.72181 14 7.54305 13.5551 8.08259 12.8328L15.0227 16.6294C15.0077 16.7508 15 16.8745 15 17C15 18.6569 16.3431 20 18 20C19.6569 20 21 18.6569 21 17C21 15.3431 19.6569 14 18 14C17.0782 14 16.257 14.4449 15.7174 15.1672L8.77732 11.3706C8.79229 11.2492 8.8 11.1255 8.8 11C8.8 10.8745 8.79229 10.7508 8.77732 10.6294L15.7174 6.83284C16.257 7.5551 17.0782 8 18 8Z"
                fill="#27273F"
              />
            </svg>
          </button>

          {/* Favorite button */}
          <button
            onClick={handleFavorite}
            className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-full transition-colors"
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill={isFavorited ? '#E21E24' : 'none'}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.03L12 21.35Z"
                stroke="#27273F"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
