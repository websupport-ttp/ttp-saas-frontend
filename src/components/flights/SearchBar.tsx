'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function SearchBar() {
  const [fromCity] = useState('Lagos (LOS)')
  const [toCity] = useState('London (LGW)')
  const [departureDate] = useState('Mon, 14 Jun 2021')
  const [returnDate] = useState('Wed, 16 Jun 2021')
  const [passengers] = useState('1 passengers')

  return (
    <div className="figma-search-bar">
      <div className="figma-search-container">
        {/* Main Route Section */}
        <div className="figma-route-section">
          <div className="figma-route-inputs">
            <div className="figma-input-field">
              <Image 
                src="/images/flights/plane-departure.svg" 
                alt="Departure" 
                width={32} 
                height={32} 
                className="figma-input-icon" 
              />
              <span className="figma-location-text">{fromCity}</span>
              <span className="figma-separator">-</span>
              <Image 
                src="/images/flights/plane-arrival.svg" 
                alt="Arrival" 
                width={32} 
                height={32} 
                className="figma-input-icon" 
              />
              <span className="figma-location-text">{toCity}</span>
            </div>
          </div>
          <div className="figma-passengers-info">{passengers}</div>
        </div>

        <div className="figma-divider"></div>

        {/* Departure Date Section */}
        <div className="figma-date-section">
          <div className="figma-date-input">
            <Image 
              src="/images/flights/calendar-day.svg" 
              alt="Calendar" 
              width={32} 
              height={32} 
              className="figma-input-icon" 
            />
            <span className="figma-date-label">Departure</span>
          </div>
          <div className="figma-date-value">{departureDate}</div>
        </div>

        <div className="figma-divider"></div>

        {/* Return Date Section */}
        <div className="figma-date-section">
          <div className="figma-date-input">
            <Image 
              src="/images/flights/calendar-day.svg" 
              alt="Calendar" 
              width={32} 
              height={32} 
              className="figma-input-icon" 
            />
            <span className="figma-date-label">Return</span>
          </div>
          <div className="figma-date-value">{returnDate}</div>
        </div>

        {/* Search Button */}
        <button className="figma-search-button">
          Search Another Ticket
        </button>
      </div>
    </div>
  )
}