'use client'

import { useState } from 'react'
import { FlightOffer, LocationInfo, AircraftInfo } from '@/types/api'

interface FlightTableProps {
  flights: FlightOffer[];
  onFlightSelect?: (flight: FlightOffer) => void;
  selectedFlight?: FlightOffer;
  dictionaries?: {
    locations: Record<string, LocationInfo>;
    aircraft: Record<string, AircraftInfo>;
    currencies: Record<string, string>;
    carriers: Record<string, string>;
  };
}

export default function FlightTable({ 
  flights, 
  onFlightSelect, 
  selectedFlight,
  dictionaries 
}: FlightTableProps) {
  const formatDuration = (duration: string) => {
    // Convert PT15H30M to 15h 30m
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (!match) return duration;
    
    const hours = match[1] ? `${match[1]}h` : '';
    const minutes = match[2] ? ` ${match[2]}m` : '';
    return `${hours}${minutes}`.trim();
  };

  const formatTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getStopsText = (segments: any[]) => {
    const stopCount = segments.length - 1;
    if (stopCount === 0) return 'Nonstop';
    if (stopCount === 1) return '1 stop';
    return `${stopCount} stops`;
  };

  const getLayoverInfo = (segments: any[]) => {
    if (segments.length <= 1) return '';
    
    // Calculate layover time between first and second segment
    const firstArrival = new Date(segments[0].arrival.at);
    const secondDeparture = new Date(segments[1].departure.at);
    const layoverMs = secondDeparture.getTime() - firstArrival.getTime();
    const layoverHours = Math.floor(layoverMs / (1000 * 60 * 60));
    const layoverMinutes = Math.floor((layoverMs % (1000 * 60 * 60)) / (1000 * 60));
    
    const layoverText = layoverHours > 0 
      ? `${layoverHours}h ${layoverMinutes}m`
      : `${layoverMinutes}m`;
    
    return `${layoverText} in ${segments[1].departure.iataCode}`;
  };

  const getAirlineName = (carrierCode: string) => {
    return dictionaries?.carriers?.[carrierCode] || carrierCode;
  };

  const formatPrice = (price: string, currency: string) => {
    const amount = parseFloat(price);
    if (currency === 'NGN') {
      return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getAirlineLogo = (carrierCode: string) => {
    // Map common airline codes to logo paths (using existing images)
    const logoMap: Record<string, string> = {
      'AA': '/images/united-airlines.svg', // Fallback to existing
      'DL': '/images/flights/airlines/delta-airlines.svg',
      'UA': '/images/flights/airlines/united-airlines.svg',
      'BA': '/images/flights/airlines/emirates.svg', // Fallback to existing
      'LH': '/images/flights/airlines/emirates.svg', // Fallback to existing
      'AF': '/images/flights/airlines/air-france.svg',
      'EK': '/images/flights/airlines/emirates.svg',
      'QR': '/images/flights/airlines/emirates.svg', // Fallback to existing
      'TK': '/images/flights/airlines/emirates.svg', // Fallback to existing
      'SQ': '/images/flights/airlines/emirates.svg', // Fallback to existing
      'JL': '/images/flights/airlines/japan-airlines.svg',
      'KE': '/images/flights/airlines/korean-air.svg',
      'HA': '/images/flights/airlines/hawaiian-airlines.svg',
      'BR': '/images/flights/airlines/eva-air.svg',
      'QF': '/images/flights/airlines/qantas-airlines.svg'
    };
    
    // Use existing airline logo or fallback to a generic plane icon
    return logoMap[carrierCode] || '/images/flight-icon.svg';
  };

  if (!flights || flights.length === 0) {
    return (
      <div className="figma-flight-table">
        <div className="text-center py-8 text-gray-500">
          No flights available
        </div>
      </div>
    );
  }

  return (
    <div className="figma-flight-table">
      <div className="figma-table-container">
        {flights.map((flight, index) => {
          const firstItinerary = flight.itineraries[0];
          const segments = firstItinerary?.segments || [];
          const firstSegment = segments[0];
          const lastSegment = segments[segments.length - 1];
          const mainCarrier = flight.validatingAirlineCodes?.[0] || 
                              flight.itineraries?.[0]?.segments?.[0]?.carrierCode || 'UNKNOWN';
          
          if (!firstSegment || !lastSegment) return null;

          const isSelected = selectedFlight?.id === flight.id;

          return (
            <div key={flight.id}>
              <div
                className={`figma-flight-row ${isSelected ? 'selected' : ''}`}
                onClick={() => onFlightSelect?.(flight)}
              >
                {/* Column 1: Airline logo with duration and airline name below */}
                <div className="figma-column-1">
                  <div className="figma-airline-logo">
                    <img
                      src={getAirlineLogo(mainCarrier)}
                      alt={getAirlineName(mainCarrier)}
                      width={40}
                      height={40}
                      className="figma-airline-logo-img"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const placeholder = target.nextElementSibling as HTMLElement;
                        if (placeholder) placeholder.style.display = 'block';
                      }}
                    />
                    <div className="figma-logo-placeholder" style={{ display: 'none' }}>
                      {mainCarrier}
                    </div>
                  </div>
                  <div className="figma-airline-info">
                    <div className="figma-duration">
                      {formatDuration(firstItinerary.duration)}
                    </div>
                    <div className="figma-airline-name">
                      {getAirlineName(mainCarrier)}
                    </div>
                  </div>
                </div>

                {/* Column 2: Take off time to landing time with flight class */}
                <div className="figma-column-2">
                  <div className="figma-time">
                    {formatTime(firstSegment.departure.at)} - {formatTime(lastSegment.arrival.at)}
                  </div>
                  <div className="figma-flight-class">
                    Economy
                  </div>
                </div>

                {/* Column 3: Number of stops with layover info below */}
                <div className="figma-column-3">
                  <div className="figma-stops">
                    {getStopsText(segments)}
                  </div>
                  <div className="figma-layover">
                    {getLayoverInfo(segments)}
                  </div>
                </div>

                {/* Column 4: Price with trip type below */}
                <div className="figma-column-4">
                  <div className="figma-price">
                    {formatPrice(flight.price.total, flight.price.currency)}
                  </div>
                  <div className="figma-trip-type">
                    {flight.itineraries.length > 1 ? 'round trip' : 'one way'}
                  </div>
                </div>
              </div>

              {index < flights.length - 1 && (
                <div className="figma-row-divider"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  )
}