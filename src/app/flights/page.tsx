'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import FigmaFlightSearchForm from '@/components/flights/FigmaFlightSearchForm'
import FlightResults from '@/components/flights/FlightResults'
import HotelSlider from '@/components/flights/HotelSlider'
import { Header } from '@/components/layout/Header'
import { flightService } from '@/lib/services/flight-service'
import { FlightSearchCriteria, FlightSearchResponse, FlightOffer } from '@/types/api'
import { useNotificationHelpers } from '@/contexts/notification-context'
import { appConfig } from '@/lib/config'

export default function FlightsPage() {
  const [searchResults, setSearchResults] = useState<FlightSearchResponse | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [selectedFlight, setSelectedFlight] = useState<FlightOffer | undefined>()
  const [hasSearched, setHasSearched] = useState(false)
  const [initialSearchData, setInitialSearchData] = useState<any>(null)
  const [hasAutoSearched, setHasAutoSearched] = useState(false)

  const router = useRouter()
  const { showSuccess, showError, showInfo } = useNotificationHelpers()

  // Helper function to extract airport code from autocomplete selection
  const extractAirportCode = (airportString: string): string => {
    if (!airportString) return '';

    // Extract code from format like "London Heathrow Airport (LHR)"
    const match = airportString.match(/\(([A-Z]{3})\)/);
    if (match) {
      return match[1];
    }

    // If no parentheses found, check if it's already a 3-letter code
    if (airportString.length === 3 && /^[A-Z]{3}$/.test(airportString)) {
      return airportString;
    }

    // Fallback: take first 3 characters and uppercase
    return airportString.substring(0, 3).toUpperCase();
  };

  // Helper function to extract city name from airport string
  const extractDestinationCity = (airportString: string): string => {
    if (!airportString) return '';

    // Remove airport code in parentheses first: "London Heathrow Airport (LHR)" -> "London Heathrow Airport"
    let cleanString = airportString.replace(/\s*\([A-Z]{3}\)\s*$/, '').trim();
    
    // Handle comma-separated format first (city, country)
    if (cleanString.includes(',')) {
      const parts = cleanString.split(',');
      return parts[0].trim();
    }
    
    // Define city mappings for common airports
    const cityMappings: Record<string, string> = {
      'London Heathrow': 'London',
      'London Gatwick': 'London',
      'London Stansted': 'London',
      'London Luton': 'London',
      'Paris Charles de Gaulle': 'Paris',
      'Paris Orly': 'Paris',
      'New York JFK': 'New York',
      'New York LaGuardia': 'New York',
      'New York Newark': 'New York',
      'Tokyo Narita': 'Tokyo',
      'Tokyo Haneda': 'Tokyo',
      'Sydney Kingsford Smith': 'Sydney',
      'Mumbai Chhatrapati Shivaji': 'Mumbai',
      'Bangkok Suvarnabhumi': 'Bangkok',
      'Dubai International': 'Dubai',
      'Cairo International': 'Cairo'
    };
    
    // Check for direct mappings first
    for (const [airportName, cityName] of Object.entries(cityMappings)) {
      if (cleanString.includes(airportName)) {
        return cityName;
      }
    }
    
    // Handle airport names - extract the first word before common airport keywords
    const airportKeywords = ['Airport', 'International', 'Heathrow', 'Gatwick', 'Charles de Gaulle', 'Narita', 'Haneda', 'Kingsford Smith', 'Chhatrapati Shivaji', 'Suvarnabhumi'];
    
    for (const keyword of airportKeywords) {
      if (cleanString.includes(keyword)) {
        const beforeKeyword = cleanString.split(keyword)[0].trim();
        const words = beforeKeyword.split(' ');
        return words[0]; // Take just the first word (city name)
      }
    }
    
    // If no airport keywords found, take the first word
    const words = cleanString.split(' ');
    return words[0];
  };

  // Helper function to calculate check-out date (1 day after check-in if no return date)
  const getCheckOutDate = (checkInDate: string, returnDate?: string): string => {
    if (returnDate) return returnDate;
    
    // Add 1 day to check-in date for hotel stay
    const checkIn = new Date(checkInDate);
    checkIn.setDate(checkIn.getDate() + 1);
    return checkIn.toISOString().split('T')[0];
  };

  // Parse URL parameters on component mount (client-side only)
  useEffect(() => {
    // Prevent multiple auto-searches
    if (hasAutoSearched || initialSearchData) return;

    // Only run on client-side
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search)

    // Check if we have search parameters
    const hasParams = urlParams.has('from') || urlParams.has('to') || urlParams.has('departure')

    if (hasParams) {
      // Parse passengers parameter - it could be a JSON string or simple count
      let parsedPassengers = { adults: 1, children: 0, infants: 0 };
      const passengersParam = urlParams.get('passengers');
      
      if (passengersParam) {
        try {
          // Try to parse as JSON object first
          const parsed = JSON.parse(passengersParam);
          if (parsed && typeof parsed === 'object') {
            parsedPassengers = {
              adults: parsed.adults || 1,
              children: parsed.children || 0,
              infants: parsed.infants || 0
            };
          }
        } catch {
          // If JSON parsing fails, treat as simple count
          const count = parseInt(passengersParam) || 1;
          parsedPassengers = { adults: count, children: 0, infants: 0 };
        }
      }

      const searchData = {
        from: urlParams.get('from') || '',
        to: urlParams.get('to') || '',
        departure: urlParams.get('departure') || '',
        passengers: parsedPassengers,
        flightType: urlParams.get('flightType') || 'oneWay', // Use actual flightType from URL
        return: urlParams.get('return') || ''
      }
      
      // Store initial search data for the form
      setInitialSearchData(searchData)

      // Automatically trigger search if we have minimum required data
      if (searchData.from && searchData.to && searchData.departure) {
        setHasAutoSearched(true)
        // Trigger search immediately without delay
        handleFlightSearch(searchData)
      }
    }
  }, [hasAutoSearched, initialSearchData]) // Add dependencies back

  const handleFlightSearch = async (searchData: any) => {
    // Prevent multiple simultaneous searches
    if (isLoading) {
      return
    }

    // Extract airport codes
    const originCode = extractAirportCode(searchData.from || searchData.origin || '');
    const destinationCode = extractAirportCode(searchData.to || searchData.destination || '');

    // Transform SearchForm data to FlightSearchCriteria format
    const criteria: FlightSearchCriteria = {
      origin: originCode,
      destination: destinationCode,
      departureDate: searchData.departure || searchData.departureDate || '',
      returnDate: searchData.return || searchData.returnDate || (searchData.flightType === 'roundTrip' ? searchData.return : ''),
      passengers: typeof searchData.passengers === 'object' && searchData.passengers !== null
        ? {
            adults: searchData.passengers.adults || 1,
            children: searchData.passengers.children || 0,
            infants: searchData.passengers.infants || 0
          }
        : {
            adults: parseInt(searchData.passengers?.toString() || '1') || 1,
            children: 0,
            infants: 0
          },
      cabinClass: searchData.cabinClass || 'economy',
      tripType: searchData.flightType || 'oneWay'
    }

    setIsLoading(true)
    setError(undefined)
    setSearchResults(undefined)
    setSelectedFlight(undefined)

    // Debug logging
    console.log('Flight search criteria:', criteria);
    console.log('API Base URL:', appConfig.apiBaseUrl);

    try {
      const results = await flightService.searchFlights(criteria)
      setSearchResults(results)
      setHasSearched(true)

      // Don't show success notification - results are visible to user
      if (results.data && results.data.length === 0) {
        showInfo(
          'No Flights Found',
          'No flights found for your search criteria. Try adjusting your dates or destinations.'
        )
      }
    } catch (err: any) {
      console.error('Flight search error details:', err);
      
      let errorMessage = 'Failed to search flights';
      
      // Extract more detailed error information
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      // Log additional debug information
      console.error('Error type:', typeof err);
      console.error('Error response:', err?.response);
      console.error('API Base URL:', appConfig?.apiBaseUrl);
      
      setError(errorMessage)
      showError('Search Failed', errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFlightSelect = (flight: FlightOffer) => {
    setSelectedFlight(flight)
  }

  const handleBookFlight = (flight: FlightOffer) => {
    // Navigate to booking page with flight data and search criteria
    const flightData = encodeURIComponent(JSON.stringify(flight))
    const searchCriteria = {
      passengers: initialSearchData?.passengers || { adults: 1, children: 0, infants: 0 },
      tripType: initialSearchData?.flightType || 'oneWay',
      origin: initialSearchData?.from || '',
      destination: initialSearchData?.to || '',
      departureDate: initialSearchData?.departure || '',
      returnDate: initialSearchData?.return || ''
    }
    
    const searchCriteriaEncoded = encodeURIComponent(JSON.stringify(searchCriteria))
    router.push(`/flights/book?flight=${flightData}&search=${searchCriteriaEncoded}`)
  }

  // Track if component is mounted (client-side)
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  // Show loading only if we have URL params and haven't processed them yet
  if (isMounted && typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search)
    const hasUrlParams = urlParams.has('from') || urlParams.has('to') || urlParams.has('departure')
    
    if (hasUrlParams && !initialSearchData && !hasAutoSearched && !isLoading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mb-4"></div>
            <p className="text-gray-600">Loading flight search...</p>
          </div>
        </div>
      )
    }
  }

  // Show a basic layout during SSR to prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <div className="bg-white/10 rounded-lg p-8 text-center">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Flight Search Form */}
        <div className="mb-8">
          <FigmaFlightSearchForm
            onSearch={handleFlightSearch}
            isLoading={isLoading}
            initialData={initialSearchData}
          />
        </div>



        {/* Flight Results */}
        {(hasSearched || isLoading || error) && (
          <div className="mb-8">
            <FlightResults
              searchResults={searchResults}
              isLoading={isLoading}
              error={error}
              onFlightSelect={handleFlightSelect}
              selectedFlight={selectedFlight}
              onBookFlight={handleBookFlight}
            />
          </div>
        )}

        {/* Hotel Recommendations - Show when we have search results */}
        {(() => {
          const shouldShowHotels = hasSearched && searchResults && searchResults.data && searchResults.data.length > 0 && initialSearchData && initialSearchData.to && initialSearchData.departure;
          const extractedDestination = initialSearchData?.to ? extractDestinationCity(initialSearchData.to) : '';
          
          return shouldShowHotels ? (
            <div className="mb-8">
              <HotelSlider
                key={`hotel-${initialSearchData.to}-${initialSearchData.departure}`}
                destination={extractedDestination}
                checkInDate={initialSearchData.departure}
                checkOutDate={getCheckOutDate(initialSearchData.departure, initialSearchData.return)}
                rooms={[{ adults: Math.max(1, parseInt(initialSearchData.passengers || '1') || 1), children: 0 }]}
              />
            </div>
          ) : null;
        })()}





      </div>
      </main>
    </div>
  )
}