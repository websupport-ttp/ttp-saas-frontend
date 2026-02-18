'use client'

import { useState, useEffect } from 'react';
import { FlightOffer, FlightSearchResponse } from '@/types/api';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import FlightFilters from './FlightFilters'
import FlightTable from './FlightTable'
import FlightSelection from './FlightSelection'

interface FlightResultsProps {
  searchResults?: FlightSearchResponse;
  isLoading?: boolean;
  error?: string;
  onFlightSelect?: (flight: FlightOffer) => void;
  selectedFlight?: FlightOffer;
  onBookFlight?: (flight: FlightOffer) => void;
}

export default function FlightResults({
  searchResults,
  isLoading = false,
  error,
  onFlightSelect,
  selectedFlight,
  onBookFlight
}: FlightResultsProps) {
  const [filteredFlights, setFilteredFlights] = useState<FlightOffer[]>([]);
  const [filters, setFilters] = useState({
    priceRange: [0, 2000000],
    airlines: [] as string[],
    stops: 'all',
    departureTime: 'all',
    duration: [0, 24]
  });

  useEffect(() => {
    if (searchResults?.data) {
      // Apply filters to flight results
      let filtered = searchResults.data;

      // Price filter
      filtered = filtered.filter(flight => {
        const price = parseFloat(flight.price.total);
        return price >= filters.priceRange[0] && price <= filters.priceRange[1];
      });

      // Airlines filter
      if (filters.airlines.length > 0) {
        filtered = filtered.filter(flight => {
          const airlineCodes = flight.validatingAirlineCodes || 
                              (flight.itineraries?.[0]?.segments?.[0]?.carrierCode ? [flight.itineraries[0].segments[0].carrierCode] : []);
          return airlineCodes.some(code => filters.airlines.includes(code));
        });
      }

      // Stops filter
      if (filters.stops !== 'all') {
        filtered = filtered.filter(flight => {
          const segments = flight.itineraries[0]?.segments || [];
          const stopCount = segments.length - 1;

          switch (filters.stops) {
            case 'nonstop':
              return stopCount === 0;
            case '1stop':
              return stopCount === 1;
            case '2+stops':
              return stopCount >= 2;
            default:
              return true;
          }
        });
      }

      setFilteredFlights(filtered);
    }
  }, [searchResults, filters]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Searching for flights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <ErrorMessage
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  if (!searchResults || !searchResults.data || searchResults.data.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No flights found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search criteria or dates.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="figma-flight-results">
      {/* Container to match results width */}
      <div className="figma-results-container">
        <div className="lg:col-span-3">
          <FlightFilters
            onFilterChange={handleFilterChange}
            totalResults={filteredFlights.length}
            searchResults={searchResults}
          />
        </div>
      </div>
      
      <div className="figma-results-container">
        <div className="figma-left-section">
          <FlightTable
            flights={filteredFlights}
            onFlightSelect={onFlightSelect}
            selectedFlight={selectedFlight}
            dictionaries={searchResults.dictionaries}
          />
        </div>

        <div className="figma-right-section">
          <FlightSelection
            selectedFlight={selectedFlight}
            dictionaries={searchResults.dictionaries}
            onContinue={() => selectedFlight && onBookFlight?.(selectedFlight)}
            onBack={() => window.history.back()}
          />
        </div>
      </div>
    </div>
  )
}