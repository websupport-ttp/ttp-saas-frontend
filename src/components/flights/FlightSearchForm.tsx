'use client'

import { useState, useEffect } from 'react';
import { FlightSearchCriteria } from '@/types/api';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { 
  StyledAutocompleteInput, 
  StyledDatePicker, 
  StyledPassengerSelector 
} from '@/components/ui/styled-popovers';
import { referenceDataService } from '@/lib/services/reference-data-service';

interface FlightSearchFormProps {
  onSearch: (criteria: FlightSearchCriteria) => void;
  isLoading?: boolean;
  initialData?: any;
}

export default function FlightSearchForm({ onSearch, isLoading = false, initialData }: FlightSearchFormProps) {
  const [formData, setFormData] = useState<FlightSearchCriteria>({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    passengers: {
      adults: 1,
      children: 0,
      infants: 0
    },
    cabinClass: 'economy',
    tripType: 'round_trip'
  });

  // Update form data when initialData is provided
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        origin: initialData.from || prev.origin,
        destination: initialData.to || prev.destination,
        departureDate: initialData.departure || prev.departureDate,
        returnDate: initialData.return || prev.returnDate,
        passengers: {
          adults: parseInt(initialData.passengers) || prev.passengers.adults,
          children: prev.passengers.children,
          infants: prev.passengers.infants
        },
        tripType: initialData.flightType === 'one-way' ? 'one_way' : 'round_trip'
      }));
    }
  }, [initialData]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [originDisplay, setOriginDisplay] = useState('');
  const [destinationDisplay, setDestinationDisplay] = useState('');
  const [hasInteracted, setHasInteracted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.origin || !formData.origin.trim()) {
      newErrors.origin = 'Please select an origin airport';
    }

    if (!formData.destination || !formData.destination.trim()) {
      newErrors.destination = 'Please select a destination airport';
    }

    if (!formData.departureDate) {
      newErrors.departureDate = 'Departure date is required';
    }

    if (formData.tripType === 'round_trip' && !formData.returnDate) {
      newErrors.returnDate = 'Return date is required for round trip';
    }

    if (formData.passengers.adults < 1) {
      newErrors.passengers = 'At least one adult passenger is required';
    }

    // Validate departure date is not in the past
    if (formData.departureDate) {
      const departureDate = new Date(formData.departureDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (departureDate < today) {
        newErrors.departureDate = 'Departure date cannot be in the past';
      }
    }

    // Validate return date is after departure date
    if (formData.tripType === 'round_trip' && formData.departureDate && formData.returnDate) {
      const departureDate = new Date(formData.departureDate);
      const returnDate = new Date(formData.returnDate);
      
      if (returnDate <= departureDate) {
        newErrors.returnDate = 'Return date must be after departure date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasInteracted(true);
    
    if (validateForm()) {
      onSearch(formData);
    }
  };

  const handleInputChange = (field: keyof FlightSearchCriteria, value: any) => {
    setHasInteracted(true);
    
    setFormData(prev => {
      const updated = {
        ...prev,
        [field]: value
      };
      
      // Clear return date when switching to one-way
      if (field === 'tripType' && value === 'one_way') {
        updated.returnDate = '';
      }
      
      return updated;
    });

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Fallback airport data for when backend is unavailable
  const fallbackAirports = [
    { iataCode: 'LOS', name: 'Murtala Muhammed International Airport', cityName: 'Lagos', countryName: 'Nigeria' },
    { iataCode: 'ABV', name: 'Nnamdi Azikiwe International Airport', cityName: 'Abuja', countryName: 'Nigeria' },
    { iataCode: 'PHC', name: 'Port Harcourt International Airport', cityName: 'Port Harcourt', countryName: 'Nigeria' },
    { iataCode: 'KAN', name: 'Mallam Aminu Kano International Airport', cityName: 'Kano', countryName: 'Nigeria' },
    { iataCode: 'LHR', name: 'London Heathrow Airport', cityName: 'London', countryName: 'United Kingdom' },
    { iataCode: 'JFK', name: 'John F. Kennedy International Airport', cityName: 'New York', countryName: 'United States' },
    { iataCode: 'DXB', name: 'Dubai International Airport', cityName: 'Dubai', countryName: 'United Arab Emirates' },
    { iataCode: 'CDG', name: 'Charles de Gaulle Airport', cityName: 'Paris', countryName: 'France' },
    { iataCode: 'AMS', name: 'Amsterdam Airport Schiphol', cityName: 'Amsterdam', countryName: 'Netherlands' },
    { iataCode: 'FRA', name: 'Frankfurt Airport', cityName: 'Frankfurt', countryName: 'Germany' }
  ];

  // Airport search function with fallback
  const searchAirports = async (query: string) => {
    try {
      // Don't search if query is too short
      if (!query || query.length < 3) {
        return [];
      }
      
      const airports = await referenceDataService.searchAirports(query, 5);
      return airports.map(airport => referenceDataService.formatAirportOption(airport));
    } catch (error) {
      console.error('Airport search error, using fallback:', error);
      
      // Use fallback data when backend is unavailable
      const searchTerm = query.toLowerCase();
      const matches = fallbackAirports.filter(airport => 
        airport.name.toLowerCase().includes(searchTerm) ||
        airport.iataCode.toLowerCase().includes(searchTerm) ||
        airport.cityName.toLowerCase().includes(searchTerm) ||
        airport.countryName.toLowerCase().includes(searchTerm)
      ).slice(0, 5);
      
      return matches.map(airport => ({
        value: airport.iataCode,
        label: `${airport.name} (${airport.iataCode})`,
        subtitle: `${airport.cityName}, ${airport.countryName}`,
        data: airport
      }));
    }
  };

  // Handle origin airport selection
  const handleOriginChange = (value: string, option?: any) => {
    setHasInteracted(true);
    setOriginDisplay(value);
    if (option) {
      // Use IATA code for the form data
      handleInputChange('origin', option.value);
    } else {
      // User is typing, clear the form data until they select an option
      handleInputChange('origin', '');
    }
  };

  // Handle destination airport selection
  const handleDestinationChange = (value: string, option?: any) => {
    setHasInteracted(true);
    setDestinationDisplay(value);
    if (option) {
      // Use IATA code for the form data
      handleInputChange('destination', option.value);
    } else {
      // User is typing, clear the form data until they select an option
      handleInputChange('destination', '');
    }
  };

  const handlePassengerChange = (type: 'adults' | 'children' | 'infants', value: number) => {
    setFormData(prev => ({
      ...prev,
      passengers: {
        ...prev.passengers,
        [type]: Math.max(0, value)
      }
    }));

    // Clear passenger error
    if (errors.passengers) {
      setErrors(prev => ({
        ...prev,
        passengers: ''
      }));
    }
  };

  const tripTypeOptions = [
    { value: 'round_trip', label: 'Round Trip' },
    { value: 'one_way', label: 'One Way' },
    { value: 'multi_city', label: 'Multi City' }
  ];

  const cabinClassOptions = [
    { value: 'economy', label: 'Economy' },
    { value: 'premium_economy', label: 'Premium Economy' },
    { value: 'business', label: 'Business' },
    { value: 'first', label: 'First Class' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* URL Parameters Notice */}
      {initialData && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-800">
                <strong>Search Pre-filled:</strong> Form has been populated with your search criteria. You can modify the details below or search directly.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Trip Type Selection */}
        <div className="flex gap-4">
          <div className="flex-1">
            <Select
              label="Trip Type"
              value={formData.tripType}
              onChange={(e) => handleInputChange('tripType', e.target.value)}
              options={tripTypeOptions}
              error={errors.tripType}
            />
          </div>
        </div>

        {/* Origin and Destination */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From *
            </label>
            <StyledAutocompleteInput
              value={originDisplay}
              onChange={handleOriginChange}
              placeholder="Type 'London' and wait..."
              fetchSuggestions={searchAirports}
              minQueryLength={3}
              error={!!(errors.origin && hasInteracted)}
            />
            {errors.origin && hasInteracted && (
              <p className="text-red-600 text-sm mt-1">{errors.origin}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To *
            </label>
            <StyledAutocompleteInput
              value={destinationDisplay}
              onChange={handleDestinationChange}
              placeholder="Type 'Paris' and wait..."
              fetchSuggestions={searchAirports}
              minQueryLength={3}
              error={!!(errors.destination && hasInteracted)}
            />
            {errors.destination && hasInteracted && (
              <p className="text-red-600 text-sm mt-1">{errors.destination}</p>
            )}
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Departure Date *
            </label>
            <StyledDatePicker
              value={formData.departureDate}
              onChange={(date) => handleInputChange('departureDate', date)}
              placeholder="Select departure date"
              minDate={new Date().toISOString().split('T')[0]} // Today or later
              error={!!errors.departureDate}
              required
              aria-label="Departure date"
            />
            {errors.departureDate && hasInteracted && (
              <p className="text-red-600 text-sm mt-1">{errors.departureDate}</p>
            )}
          </div>
          {formData.tripType === 'round_trip' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Return Date *
              </label>
              <StyledDatePicker
                value={formData.returnDate || ''}
                onChange={(date) => handleInputChange('returnDate', date)}
                placeholder="Select return date"
                minDate={formData.departureDate || new Date().toISOString().split('T')[0]} // After departure date
                error={!!errors.returnDate}
                required
                aria-label="Return date"
              />
              {errors.returnDate && hasInteracted && (
                <p className="text-red-600 text-sm mt-1">{errors.returnDate}</p>
              )}
            </div>
          )}
        </div>

        {/* Passengers */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Passengers</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adults (12+ years)
              </label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handlePassengerChange('adults', formData.passengers.adults - 1)}
                  disabled={formData.passengers.adults <= 1}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  -
                </button>
                <span className="w-8 text-center font-medium">{formData.passengers.adults}</span>
                <button
                  type="button"
                  onClick={() => handlePassengerChange('adults', formData.passengers.adults + 1)}
                  disabled={formData.passengers.adults >= 9}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Children (2-11 years)
              </label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handlePassengerChange('children', formData.passengers.children - 1)}
                  disabled={formData.passengers.children <= 0}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  -
                </button>
                <span className="w-8 text-center font-medium">{formData.passengers.children}</span>
                <button
                  type="button"
                  onClick={() => handlePassengerChange('children', formData.passengers.children + 1)}
                  disabled={formData.passengers.children >= 8}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Infants (Under 2)
              </label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handlePassengerChange('infants', formData.passengers.infants - 1)}
                  disabled={formData.passengers.infants <= 0}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  -
                </button>
                <span className="w-8 text-center font-medium">{formData.passengers.infants}</span>
                <button
                  type="button"
                  onClick={() => handlePassengerChange('infants', formData.passengers.infants + 1)}
                  disabled={formData.passengers.infants >= formData.passengers.adults}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          {errors.passengers && (
            <p className="text-red-600 text-sm">{errors.passengers}</p>
          )}
        </div>

        {/* Cabin Class */}
        <div>
          <Select
            label="Cabin Class"
            value={formData.cabinClass}
            onChange={(e) => handleInputChange('cabinClass', e.target.value)}
            options={cabinClassOptions}
            error={errors.cabinClass}
          />
        </div>

        {/* Search Button */}
        <div className="pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full md:w-auto px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <LoadingSpinner size="sm" color="white" />
                <span>Searching Flights...</span>
              </div>
            ) : (
              'Search Flights'
            )}
          </Button>
        </div>


      </form>
    </div>
  );
}