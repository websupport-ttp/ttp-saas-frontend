'use client'

import { useState } from 'react';
import { AutocompleteInput } from '@/components/ui/AutocompleteInput';

// Mock airport data for testing
const mockAirports = [
  {
    id: 'LOS',
    type: 'airport',
    subType: 'AIRPORT',
    name: 'Murtala Muhammed International Airport',
    iataCode: 'LOS',
    address: {
      cityName: 'Lagos',
      cityCode: 'LOS',
      countryName: 'Nigeria',
      countryCode: 'NG'
    }
  },
  {
    id: 'ABV',
    type: 'airport',
    subType: 'AIRPORT',
    name: 'Nnamdi Azikiwe International Airport',
    iataCode: 'ABV',
    address: {
      cityName: 'Abuja',
      cityCode: 'ABV',
      countryName: 'Nigeria',
      countryCode: 'NG'
    }
  },
  {
    id: 'PHC',
    type: 'airport',
    subType: 'AIRPORT',
    name: 'Port Harcourt International Airport',
    iataCode: 'PHC',
    address: {
      cityName: 'Port Harcourt',
      cityCode: 'PHC',
      countryName: 'Nigeria',
      countryCode: 'NG'
    }
  },
  {
    id: 'LHR',
    type: 'airport',
    subType: 'AIRPORT',
    name: 'London Heathrow Airport',
    iataCode: 'LHR',
    address: {
      cityName: 'London',
      cityCode: 'LON',
      countryName: 'United Kingdom',
      countryCode: 'GB'
    }
  },
  {
    id: 'JFK',
    type: 'airport',
    subType: 'AIRPORT',
    name: 'John F. Kennedy International Airport',
    iataCode: 'JFK',
    address: {
      cityName: 'New York',
      cityCode: 'NYC',
      countryName: 'United States',
      countryCode: 'US'
    }
  }
];

export default function AirportTestPage() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [originCode, setOriginCode] = useState('');
  const [destinationCode, setDestinationCode] = useState('');

  // Mock airport search function
  const searchAirports = async (query: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!query || query.length < 2) {
      return [];
    }
    
    const searchTerm = query.toLowerCase();
    const results = mockAirports.filter(airport => 
      airport.name.toLowerCase().includes(searchTerm) ||
      airport.iataCode.toLowerCase().includes(searchTerm) ||
      airport.address.cityName.toLowerCase().includes(searchTerm) ||
      airport.address.countryName.toLowerCase().includes(searchTerm)
    );
    
    return results.map(airport => ({
      value: airport.iataCode,
      label: `${airport.name} (${airport.iataCode})`,
      subtitle: `${airport.address.cityName}, ${airport.address.countryName}`,
      data: airport
    }));
  };

  const handleOriginChange = (value: string, option?: any) => {
    setOrigin(value);
    if (option) {
      setOriginCode(option.value);
      console.log('Origin selected:', option);
    } else {
      setOriginCode('');
    }
  };

  const handleDestinationChange = (value: string, option?: any) => {
    setDestination(value);
    if (option) {
      setDestinationCode(option.value);
      console.log('Destination selected:', option);
    } else {
      setDestinationCode('');
    }
  };

  const handleSearch = () => {
    if (!originCode || !destinationCode) {
      alert('Please select both origin and destination airports');
      return;
    }
    
    const searchData = {
      originLocationCode: originCode,
      destinationLocationCode: destinationCode,
      departureDate: '2024-12-01',
      adults: 1,
      children: 0,
      infants: 0,
      currencyCode: 'NGN',
      max: 50,
      travelClass: 'ECONOMY',
      nonStop: false
    };
    
    console.log('Flight search data:', searchData);
    alert(`Search data prepared:\nOrigin: ${originCode}\nDestination: ${destinationCode}\n\nCheck console for full data`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Airport Autocomplete Test
          </h1>
          
          <div className="space-y-6">
            {/* Origin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From *
              </label>
              <div className="relative">
                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-red-500 focus-within:border-red-500">
                  <AutocompleteInput
                    value={origin}
                    onChange={handleOriginChange}
                    placeholder="Enter origin city or airport"
                    fetchSuggestions={searchAirports}
                    minQueryLength={2}
                    maxSuggestions={10}
                    aria-label="Origin airport"
                  />
                </div>
                {originCode && (
                  <p className="text-sm text-green-600 mt-1">
                    Selected: {originCode}
                  </p>
                )}
              </div>
            </div>

            {/* Destination */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To *
              </label>
              <div className="relative">
                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-red-500 focus-within:border-red-500">
                  <AutocompleteInput
                    value={destination}
                    onChange={handleDestinationChange}
                    placeholder="Enter destination city or airport"
                    fetchSuggestions={searchAirports}
                    minQueryLength={2}
                    maxSuggestions={10}
                    aria-label="Destination airport"
                  />
                </div>
                {destinationCode && (
                  <p className="text-sm text-green-600 mt-1">
                    Selected: {destinationCode}
                  </p>
                )}
              </div>
            </div>

            {/* Search Button */}
            <div className="pt-4">
              <button
                onClick={handleSearch}
                className="w-full md:w-auto px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
              >
                Test Search
              </button>
            </div>

            {/* Debug Info */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Debug Info:</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p><strong>Origin Display:</strong> {origin || 'None'}</p>
                <p><strong>Origin Code:</strong> {originCode || 'None'}</p>
                <p><strong>Destination Display:</strong> {destination || 'None'}</p>
                <p><strong>Destination Code:</strong> {destinationCode || 'None'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}