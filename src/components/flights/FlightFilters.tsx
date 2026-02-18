'use client'

import { useState, useEffect } from 'react'
import { FlightSearchResponse } from '@/types/api'

const ChevronDown = ({ className }: { className?: string }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M5 8L9 12L13 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

interface FlightFiltersProps {
  onFilterChange: (filters: any) => void;
  totalResults: number;
  searchResults?: FlightSearchResponse;
}

export default function FlightFilters({ 
  onFilterChange, 
  totalResults, 
  searchResults 
}: FlightFiltersProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState([0, 2000000])
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([])
  const [selectedStops, setSelectedStops] = useState('all')
  const [selectedTimes, setSelectedTimes] = useState('all')

  // Extract available airlines from search results
  const availableAirlines = searchResults?.data 
    ? Array.from(new Set(
        searchResults.data.flatMap(flight => {
          // Handle both Amadeus API format and mock data format
          const airlineCodes = flight.validatingAirlineCodes || 
                              (flight.itineraries?.[0]?.segments?.[0]?.carrierCode ? [flight.itineraries[0].segments[0].carrierCode] : []);
          
          return airlineCodes.map(code => ({
            code,
            name: searchResults.dictionaries?.carriers?.[code] || code
          }));
        })
      )).map(airline => airline)
    : []

  // Calculate price range from search results
  useEffect(() => {
    if (searchResults?.data) {
      const prices = searchResults.data.map(flight => parseFloat(flight.price.total))
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)
      setPriceRange([Math.floor(minPrice), Math.ceil(maxPrice)])
    }
  }, [searchResults])

  // Update filters when values change
  useEffect(() => {
    onFilterChange({
      priceRange,
      airlines: selectedAirlines,
      stops: selectedStops,
      departureTime: selectedTimes
    })
  }, [priceRange, selectedAirlines, selectedStops, selectedTimes])

  const toggleFilter = (filterId: string) => {
    setActiveFilter(activeFilter === filterId ? null : filterId)
  }

  const handleAirlineToggle = (airlineCode: string) => {
    setSelectedAirlines(prev => 
      prev.includes(airlineCode)
        ? prev.filter(code => code !== airlineCode)
        : [...prev, airlineCode]
    )
  }

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`
  }

  const filters = [
    { id: 'price', label: 'Max price' },
    { id: 'times', label: 'Times' },
    { id: 'airlines', label: 'Airlines' },
    { id: 'stops', label: 'Stops' },
    { id: 'more', label: 'More' }
  ]

  return (
    <div className="figma-flight-filters">
      <div className="figma-filter-row">
        {filters.map((filter) => (
          <div key={filter.id} className="relative">
            <button
              className={`figma-filter-pill ${activeFilter === filter.id ? 'active' : ''}`}
              onClick={() => toggleFilter(filter.id)}
            >
              <span className="figma-filter-label">{filter.label}</span>
              <ChevronDown className="figma-filter-chevron" />
            </button>

            {/* Filter Dropdown */}
            {activeFilter === filter.id && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-64">
                {filter.id === 'price' && (
                  <div className="p-4">
                    <h4 className="font-semibold mb-3">Price Range</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{formatPrice(priceRange[0])}</span>
                        <span>{formatPrice(priceRange[1])}</span>
                      </div>
                      <input
                        type="range"
                        min={priceRange[0]}
                        max={priceRange[1]}
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full"
                      />
                    </div>
                  </div>
                )}

                {filter.id === 'airlines' && (
                  <div className="p-4 max-h-64 overflow-y-auto">
                    <h4 className="font-semibold mb-3">Airlines</h4>
                    <div className="space-y-2">
                      {availableAirlines.map((airline) => (
                        <label key={airline.code} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedAirlines.includes(airline.code)}
                            onChange={() => handleAirlineToggle(airline.code)}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm">{airline.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {filter.id === 'stops' && (
                  <div className="p-4">
                    <h4 className="font-semibold mb-3">Number of Stops</h4>
                    <div className="space-y-2">
                      {[
                        { value: 'all', label: 'Any number of stops' },
                        { value: 'nonstop', label: 'Nonstop only' },
                        { value: '1stop', label: '1 stop or fewer' },
                        { value: '2+stops', label: '2+ stops' }
                      ].map((option) => (
                        <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="stops"
                            value={option.value}
                            checked={selectedStops === option.value}
                            onChange={(e) => setSelectedStops(e.target.value)}
                            className="border-gray-300"
                          />
                          <span className="text-sm">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {filter.id === 'times' && (
                  <div className="p-4">
                    <h4 className="font-semibold mb-3">Departure Time</h4>
                    <div className="space-y-2">
                      {[
                        { value: 'all', label: 'Any time' },
                        { value: 'morning', label: 'Morning (6AM - 12PM)' },
                        { value: 'afternoon', label: 'Afternoon (12PM - 6PM)' },
                        { value: 'evening', label: 'Evening (6PM - 12AM)' },
                        { value: 'night', label: 'Night (12AM - 6AM)' }
                      ].map((option) => (
                        <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="times"
                            value={option.value}
                            checked={selectedTimes === option.value}
                            onChange={(e) => setSelectedTimes(e.target.value)}
                            className="border-gray-300"
                          />
                          <span className="text-sm">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <h2 className="figma-section-title">
          Choose a <span className="figma-section-title-red">flight</span>
        </h2>
        <span className="text-sm text-gray-600">
          {totalResults} flights found
        </span>
      </div>
    </div>
  )
}