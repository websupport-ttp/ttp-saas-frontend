'use client'

import { FlightOffer, LocationInfo, AircraftInfo } from '@/types/api'

interface FlightSelectionProps {
  selectedFlight?: FlightOffer;
  dictionaries?: {
    locations: Record<string, LocationInfo>;
    aircraft: Record<string, AircraftInfo>;
    currencies: Record<string, string>;
    carriers: Record<string, string>;
  };
  onContinue?: () => void;
  onBack?: () => void;
}

export default function FlightSelection({ 
  selectedFlight, 
  dictionaries,
  onContinue,
  onBack 
}: FlightSelectionProps) {
  if (!selectedFlight) {
    return (
      <div className="figma-flight-selection">
        <div className="figma-flight-cart">
          <div className="text-center py-8 text-gray-500">
            <p>Select a flight to see details</p>
          </div>
        </div>
      </div>
    );
  }

  const formatDuration = (duration: string) => {
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

  const getLayoverInfo = (segments: any[]) => {
    if (segments.length <= 1) return '';
    
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

  const getAirlineLogo = (carrierCode: string) => {
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

  const formatPrice = (price: string, currency: string) => {
    const amount = parseFloat(price);
    if (currency === 'NGN') {
      return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const calculateTaxes = (totalPrice: string, basePrice: string) => {
    const total = parseFloat(totalPrice);
    const base = parseFloat(basePrice);
    return total - base;
  };

  const mainCarrier = selectedFlight.validatingAirlineCodes?.[0] || 
                     selectedFlight.itineraries?.[0]?.segments?.[0]?.carrierCode || 'UNKNOWN';
  const taxes = calculateTaxes(selectedFlight.price.total, selectedFlight.price.base);

  return (
    <div className="figma-flight-selection">
      <div className="figma-flight-cart">
        <div className="figma-selected-flights">
          {selectedFlight.itineraries.map((itinerary, index) => {
            const segments = itinerary.segments;
            const firstSegment = segments[0];
            const lastSegment = segments[segments.length - 1];
            
            return (
              <div key={index}>
                <div className="figma-selected-flight">
                  <div className="figma-selected-flight-left">
                    <div className="figma-airline-logo-small">
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
                      <div className="figma-logo-placeholder-small" style={{ display: 'none' }}>
                        {mainCarrier}
                      </div>
                    </div>
                    
                    <div className="figma-airline-details">
                      <div className="figma-airline-name">{getAirlineName(mainCarrier)}</div>
                      <div className="figma-flight-number">
                        {segments.map((segment, segmentIndex) => (
                          <span key={segmentIndex}>
                            {segmentIndex > 0 && <span className="figma-flight-number-separator">, </span>}
                            <span className="figma-flight-number-item">{segment.carrierCode}{segment.number}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="figma-selected-flight-right">
                    <div className="figma-duration-with-days">{formatDuration(itinerary.duration)} (+1d)</div>
                    <div className="figma-time">
                      {formatTime(firstSegment.departure.at)} - {formatTime(lastSegment.arrival.at)}
                    </div>
                    {segments.length > 1 && (
                      <div className="figma-layover">{getLayoverInfo(segments)}</div>
                    )}
                  </div>
                </div>
                
                {index < selectedFlight.itineraries.length - 1 && (
                  <div className="figma-flight-divider"></div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="figma-price-summary">
          <div className="figma-price-labels">
            <div className="figma-price-label">Subtotal</div>
            <div className="figma-price-label">Taxes and Fees</div>
            <div className="figma-price-label">Total</div>
          </div>
          
          <div className="figma-price-values">
            <div className="figma-price-value">
              {formatPrice(selectedFlight.price.base, selectedFlight.price.currency)}
            </div>
            <div className="figma-price-value">
              {formatPrice(taxes.toString(), selectedFlight.price.currency)}
            </div>
            <div className="figma-price-value">
              {formatPrice(selectedFlight.price.total, selectedFlight.price.currency)}
            </div>
          </div>
        </div>
      </div>
      
      <div className="figma-action-buttons">
        <button 
          className="figma-back-button"
          onClick={onBack}
        >
          Back
        </button>
        <button 
          className="figma-continue-button"
          onClick={onContinue}
        >
          Book
        </button>
      </div>
    </div>
  )
}