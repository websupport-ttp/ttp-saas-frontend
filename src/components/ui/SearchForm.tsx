'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { ServiceType, SearchFormData } from '@/types';
import { Button } from './Button';
import {
  StyledDatePicker,
  StyledAutocompleteInput,
  StyledPassengerSelector,
  StyledRoomSelector,
  StyledTripTypeSelector
} from './styled-popovers';
import { TravelerSelector, TravelerCounts } from './TravelerSelector';
import TimeSelector from './TimeSelector';
import SimplePassengerSelector from './SimplePassengerSelector';

import { referenceDataService } from '@/lib/services/reference-data-service';

interface FieldConfig {
  key: string;
  placeholder: string;
  icon?: string;
  type: 'text' | 'date' | 'autocomplete' | 'passenger-selector' | 'traveler-selector' | 'room-selector' | 'select' | 'trip-type-selector' | 'time-selector' | 'simple-passenger-selector';
  autocompleteType?: 'airport' | 'location' | 'country';
  required: boolean;
  width: string;
  validation?: (value: string) => string | null;
  options?: { value: string; label: string }[];
  defaultValue?: string;
}

interface ServiceConfig {
  icon: string;
  fields: FieldConfig[];
  buttonText: string;
}

interface SearchFormProps {
  serviceType: ServiceType;
  onSearch: (data: SearchFormData) => void;
  className?: string;
  loading?: boolean;
  style?: React.CSSProperties;
}

const serviceConfig: Record<ServiceType, ServiceConfig> = {
  flights: {
    icon: '/images/departure-icon.svg',
    fields: [
      {
        key: 'from',
        placeholder: 'From',
        icon: '/images/departure-icon.svg',
        type: 'autocomplete' as const,
        autocompleteType: 'airport' as const,
        required: true,
        width: 'flex-1',
        validation: (value: string) => value.length < 2 ? 'Please enter a valid departure city' : null
      },
      {
        key: 'to',
        placeholder: 'To',
        icon: '/images/arrival-icon.svg',
        type: 'autocomplete' as const,
        autocompleteType: 'airport' as const,
        required: true,
        width: 'flex-1',
        validation: (value: string) => value.length < 2 ? 'Please enter a valid destination city' : null
      },
      {
        key: 'dates',
        placeholder: 'Select dates',
        type: 'date' as const,
        required: true,
        width: 'flex-1',
        validation: (value: string) => {
          if (!value) return 'Please select travel dates';
          return null;
        }
      },
      {
        key: 'passengers',
        placeholder: '1 passenger',
        icon: '/images/person-icon.svg',
        type: 'passenger-selector' as const,
        required: true,
        width: 'flex-1'
      },
    ],
    buttonText: 'Search',
  },
  hotels: {
    icon: '/images/hotel-icon.svg',
    fields: [
      {
        key: 'destination',
        placeholder: 'City or Hotel Name',
        icon: '/images/service-icons/hotel-icon.svg',
        type: 'autocomplete' as const,
        autocompleteType: 'location' as const,
        required: true,
        width: 'flex-1',
        validation: (value: string) => value.length < 2 ? 'Please enter a valid city or hotel name' : null
      },
      {
        key: 'checkin',
        placeholder: 'Check-in',
        type: 'date' as const,
        required: true,
        width: 'flex-1',
        validation: (value: string) => {
          const date = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return date < today ? 'Check-in date cannot be in the past' : null;
        }
      },
      {
        key: 'checkout',
        placeholder: 'Check-out',
        type: 'date' as const,
        required: true,
        width: 'flex-1',
        validation: (value: string) => {
          const date = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (date < today) return 'Check-out date cannot be in the past';
          return null;
        }
      },
      {
        key: 'guests',
        placeholder: '1 room, 1 guest',
        icon: '/images/person-icon.svg',
        type: 'room-selector' as const,
        required: true,
        width: 'flex-1'
      },
    ],
    buttonText: 'Search',
  },
  car: {
    icon: '/images/car-icon.svg',
    fields: [
      {
        key: 'location',
        placeholder: 'Pickup location',
        icon: '/images/arrival-icon.svg',
        type: 'autocomplete' as const,
        autocompleteType: 'location' as const,
        required: true,
        width: 'flex-1',
        validation: (value: string) => value.length < 2 ? 'Please enter a valid pickup location' : null
      },
      {
        key: 'pickup',
        placeholder: 'Pickup',
        type: 'date' as const,
        required: true,
        width: 'flex-1',
        validation: (value: string) => {
          const date = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return date < today ? 'Pickup date cannot be in the past' : null;
        }
      },
      {
        key: 'drivers',
        placeholder: '1 driver',
        icon: '/images/person-icon.svg',
        type: 'text' as const,
        required: true,
        width: 'flex-1'
      },
    ],
    buttonText: 'Search',
  },
  insurance: {
    icon: '/images/insurance-icon.svg',
    fields: [
      {
        key: 'destination',
        placeholder: 'Destination',
        icon: '/images/arrival-icon.svg',
        type: 'autocomplete' as const,
        autocompleteType: 'country' as const,
        required: true,
        width: 'flex-1',
        validation: (value: string) => value.length < 2 ? 'Please enter a valid destination' : null
      },
      {
        key: 'departure',
        placeholder: 'Departure',
        type: 'date' as const,
        required: true,
        width: 'flex-1',
        validation: (value: string) => {
          const date = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return date < today ? 'Departure date cannot be in the past' : null;
        }
      },
      {
        key: 'travelers',
        placeholder: '1 traveler',
        icon: '/images/person-icon.svg',
        type: 'text' as const,
        required: true,
        width: 'flex-1'
      },
    ],
    buttonText: 'Get Quote',
  },
  visa: {
    icon: '/images/visa-icon.svg',
    fields: [
      {
        key: 'destinationCountry',
        placeholder: 'Destination',
        icon: '/images/arrival-icon.svg',
        type: 'autocomplete' as const,
        autocompleteType: 'country' as const,
        required: true,
        width: 'flex-1',
        validation: (value: string) => value.length < 2 ? 'Please enter a valid country' : null
      },
      {
        key: 'nationality',
        placeholder: 'Nationality',
        icon: '/images/arrival-icon.svg',
        type: 'autocomplete' as const,
        autocompleteType: 'country' as const,
        required: true,
        width: 'flex-1',
        validation: (value: string) => value.length < 2 ? 'Please enter your nationality' : null
      },
      {
        key: 'applicants',
        placeholder: '1 applicant',
        icon: '/images/person-icon.svg',
        type: 'text' as const,
        required: true,
        width: 'flex-1'
      },
    ],
    buttonText: 'Apply',
  },
  'visa-application': {
    icon: '/images/visa-icon.svg',
    fields: [
      {
        key: 'destinationCountry',
        placeholder: 'Destination',
        icon: '/images/arrival-icon.svg',
        type: 'autocomplete' as const,
        autocompleteType: 'country' as const,
        required: true,
        width: 'flex-1',
        validation: (value: string) => value.length < 2 ? 'Please enter a valid country' : null
      },
      {
        key: 'nationality',
        placeholder: 'Nationality',
        icon: '/images/arrival-icon.svg',
        type: 'autocomplete' as const,
        autocompleteType: 'country' as const,
        required: true,
        width: 'flex-1',
        validation: (value: string) => value.length < 2 ? 'Please enter your nationality' : null
      },
      {
        key: 'applicants',
        placeholder: '1 applicant',
        icon: '/images/person-icon.svg',
        type: 'text' as const,
        required: true,
        width: 'flex-1'
      },
    ],
    buttonText: 'Apply',
  },
  'car-hire': {
    icon: '/images/car-icon.svg',
    fields: [
      {
        key: 'pickupAddress',
        placeholder: 'Pick up address',
        icon: '/images/location-icon.svg',
        type: 'autocomplete' as const,
        autocompleteType: 'location' as const,
        required: true,
        width: 'flex-1',
        validation: (value: string) => value.length < 2 ? 'Please enter a valid pickup address' : null
      },
      {
        key: 'pickupDate',
        placeholder: 'Pick up date',
        icon: '/images/calendar-icon.svg',
        type: 'date' as const,
        required: true,
        width: 'flex-1',
        validation: (value: string) => {
          const date = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return date < today ? 'Pick up date cannot be in the past' : null;
        }
      },
      {
        key: 'pickupTime',
        placeholder: 'Pick up time',
        icon: '/images/clock-icon.svg',
        type: 'time-selector' as const,
        required: true,
        width: 'flex-1',
        defaultValue: '10:00'
      },
      {
        key: 'dropoffAddress',
        placeholder: 'Drop off address',
        icon: '/images/location-icon.svg',
        type: 'autocomplete' as const,
        autocompleteType: 'location' as const,
        required: true,
        width: 'flex-1',
        validation: (value: string) => value.length < 2 ? 'Please enter a valid drop off address' : null
      },
      {
        key: 'passengers',
        placeholder: '1 passenger',
        icon: '/images/person-icon.svg',
        type: 'simple-passenger-selector' as const,
        required: true,
        width: 'flex-1'
      },
    ],
    buttonText: 'Search Cars',
  },
  car: {
    icon: '/images/car-icon.svg',
    fields: [
      {
        key: 'pickupAddress',
        placeholder: 'Pick up address',
        icon: '/images/location-icon.svg',
        type: 'autocomplete' as const,
        autocompleteType: 'location' as const,
        required: true,
        width: 'flex-1',
        validation: (value: string) => value.length < 2 ? 'Please enter a valid pickup address' : null
      },
      {
        key: 'pickupDate',
        placeholder: 'Pick up date',
        icon: '/images/calendar-icon.svg',
        type: 'date' as const,
        required: true,
        width: 'flex-1',
        validation: (value: string) => {
          const date = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return date < today ? 'Pick up date cannot be in the past' : null;
        }
      },
      {
        key: 'pickupTime',
        placeholder: 'Pick up time',
        icon: '/images/clock-icon.svg',
        type: 'time-selector' as const,
        required: true,
        width: 'flex-1',
        defaultValue: '10:00'
      },
      {
        key: 'dropoffAddress',
        placeholder: 'Drop off address',
        icon: '/images/location-icon.svg',
        type: 'autocomplete' as const,
        autocompleteType: 'location' as const,
        required: true,
        width: 'flex-1',
        validation: (value: string) => value.length < 2 ? 'Please enter a valid drop off address' : null
      },
      {
        key: 'passengers',
        placeholder: '1 passenger',
        icon: '/images/person-icon.svg',
        type: 'simple-passenger-selector' as const,
        required: true,
        width: 'flex-1'
      },
    ],
    buttonText: 'Search Cars',
  },
  'travel-insurance': {
    icon: '/images/insurance-icon.svg',
    fields: [
      {
        key: 'destination',
        placeholder: 'Destination Country',
        icon: '/images/arrival-icon.svg',
        type: 'autocomplete' as const,
        autocompleteType: 'country' as const,
        required: true,
        width: 'flex-1',
        validation: (value: string) => value.length < 2 ? 'Please select a destination country' : null
      },
      {
        key: 'coverBegins',
        placeholder: 'Cover Begins',
        type: 'date' as const,
        required: true,
        width: 'flex-1',
        validation: (value: string) => {
          const date = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return date < today ? 'Cover start date cannot be in the past' : null;
        }
      },
      {
        key: 'coverEnds',
        placeholder: 'Cover Ends',
        type: 'date' as const,
        required: true,
        width: 'flex-1',
        validation: (value: string) => {
          const date = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (date < today) return 'Cover end date cannot be in the past';
          return null;
        }
      },
      {
        key: 'travelers',
        placeholder: '1 traveler',
        icon: '/images/person-icon.svg',
        type: 'traveler-selector' as const,
        required: true,
        width: 'flex-1'
      },
    ],
    buttonText: 'Get Quote',
  },
};

export default function SearchForm({
  serviceType,
  onSearch,
  className = '',
  loading = false,
  style = {}
}: SearchFormProps) {
  const [formData, setFormData] = useState<SearchFormData>({
    passengers: '1', // Default to 1 adult
    dates: '' // Combined dates field
  });
  const [passengerData, setPassengerData] = useState({
    adults: 1,
    children: 0,
    infants: 0
  });
  const [travelerData, setTravelerData] = useState<TravelerCounts>({
    adults: 1,
    children: 0
  });
  const [roomData, setRoomData] = useState({
    rooms: 1,
    adults: 1,
    children: 0
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});


  const config = serviceConfig[serviceType];

  // Safety check - if config is not found, return early with error message
  if (!config) {
    console.error(`Service configuration not found for service type: ${serviceType}`);
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">
          Service configuration not found for "{serviceType}". Please check the service type.
        </p>
      </div>
    );
  }

  // Autocomplete fetch functions
  const fetchAirportSuggestions = useCallback(async (query: string) => {
    // Use mock data directly for immediate response during development
    const mockAirports = [
      { id: 'LHR', type: 'location', subType: 'AIRPORT', name: 'London Heathrow Airport', iataCode: 'LHR', address: { cityName: 'London', countryName: 'United Kingdom' } },
      { id: 'JFK', type: 'location', subType: 'AIRPORT', name: 'John F. Kennedy International Airport', iataCode: 'JFK', address: { cityName: 'New York', countryName: 'United States' } },
      { id: 'CDG', type: 'location', subType: 'AIRPORT', name: 'Charles de Gaulle Airport', iataCode: 'CDG', address: { cityName: 'Paris', countryName: 'France' } },
      { id: 'DXB', type: 'location', subType: 'AIRPORT', name: 'Dubai International Airport', iataCode: 'DXB', address: { cityName: 'Dubai', countryName: 'United Arab Emirates' } },
      { id: 'LAX', type: 'location', subType: 'AIRPORT', name: 'Los Angeles International Airport', iataCode: 'LAX', address: { cityName: 'Los Angeles', countryName: 'United States' } },
      { id: 'LOS', type: 'location', subType: 'AIRPORT', name: 'Murtala Muhammed International Airport', iataCode: 'LOS', address: { cityName: 'Lagos', countryName: 'Nigeria' } },
      { id: 'ABV', type: 'location', subType: 'AIRPORT', name: 'Nnamdi Azikiwe International Airport', iataCode: 'ABV', address: { cityName: 'Abuja', countryName: 'Nigeria' } },
      { id: 'SIN', type: 'location', subType: 'AIRPORT', name: 'Singapore Changi Airport', iataCode: 'SIN', address: { cityName: 'Singapore', countryName: 'Singapore' } },
      { id: 'NRT', type: 'location', subType: 'AIRPORT', name: 'Narita International Airport', iataCode: 'NRT', address: { cityName: 'Tokyo', countryName: 'Japan' } },
      { id: 'SYD', type: 'location', subType: 'AIRPORT', name: 'Sydney Kingsford Smith Airport', iataCode: 'SYD', address: { cityName: 'Sydney', countryName: 'Australia' } }
    ];

    const filtered = query.length === 0
      ? mockAirports.slice(0, 5) // Show top 5 popular airports when no query
      : mockAirports.filter(airport =>
        airport.name.toLowerCase().includes(query.toLowerCase()) ||
        airport.iataCode.toLowerCase().includes(query.toLowerCase()) ||
        airport.address.cityName.toLowerCase().includes(query.toLowerCase()) ||
        airport.address.countryName.toLowerCase().includes(query.toLowerCase())
      );

    const formattedOptions = filtered.map(airport => {
      try {
        return referenceDataService.formatAirportOption(airport);
      } catch (error) {
        console.error('Error formatting airport option:', error);
        // Fallback format
        return {
          value: airport.iataCode,
          label: `${airport.name} (${airport.iataCode})`,
          subtitle: `${airport.address.cityName}, ${airport.address.countryName}`,
          data: airport
        };
      }
    });
    return formattedOptions;
  }, []);

  const fetchLocationSuggestions = useCallback(async (query: string) => {
    // Use mock data directly for immediate response during development
    const mockLocations = [
      { id: 'london', type: 'location', subType: 'CITY', name: 'London', iataCode: 'LON', address: { cityName: 'London', countryName: 'United Kingdom' } },
      { id: 'paris', type: 'location', subType: 'CITY', name: 'Paris', iataCode: 'PAR', address: { cityName: 'Paris', countryName: 'France' } },
      { id: 'dubai', type: 'location', subType: 'CITY', name: 'Dubai', iataCode: 'DXB', address: { cityName: 'Dubai', countryName: 'United Arab Emirates' } },
      { id: 'newyork', type: 'location', subType: 'CITY', name: 'New York', iataCode: 'NYC', address: { cityName: 'New York', countryName: 'United States' } },
      { id: 'lagos', type: 'location', subType: 'CITY', name: 'Lagos', iataCode: 'LOS', address: { cityName: 'Lagos', countryName: 'Nigeria' } },
      { id: 'abuja', type: 'location', subType: 'CITY', name: 'Abuja', iataCode: 'ABV', address: { cityName: 'Abuja', countryName: 'Nigeria' } },
      { id: 'singapore', type: 'location', subType: 'CITY', name: 'Singapore', iataCode: 'SIN', address: { cityName: 'Singapore', countryName: 'Singapore' } },
      { id: 'tokyo', type: 'location', subType: 'CITY', name: 'Tokyo', iataCode: 'NRT', address: { cityName: 'Tokyo', countryName: 'Japan' } }
    ];

    const filtered = query.length === 0
      ? mockLocations.slice(0, 5) // Show top 5 popular locations when no query
      : mockLocations.filter(location =>
        location.name.toLowerCase().includes(query.toLowerCase()) ||
        location.address.cityName.toLowerCase().includes(query.toLowerCase()) ||
        location.address.countryName.toLowerCase().includes(query.toLowerCase())
      );

    return filtered.map(location => referenceDataService.formatAirportOption(location));
  }, []);

  const fetchCountrySuggestions = useCallback(async (query: string) => {
    // Use mock data directly for immediate response during development
    const mockCountries = [
      { code: 'US', name: 'United States', continent: 'North America' },
      { code: 'GB', name: 'United Kingdom', continent: 'Europe' },
      { code: 'FR', name: 'France', continent: 'Europe' },
      { code: 'DE', name: 'Germany', continent: 'Europe' },
      { code: 'AE', name: 'United Arab Emirates', continent: 'Asia' },
      { code: 'NG', name: 'Nigeria', continent: 'Africa' },
      { code: 'SG', name: 'Singapore', continent: 'Asia' },
      { code: 'JP', name: 'Japan', continent: 'Asia' },
      { code: 'AU', name: 'Australia', continent: 'Oceania' },
      { code: 'CA', name: 'Canada', continent: 'North America' },
      { code: 'IN', name: 'India', continent: 'Asia' },
      { code: 'CN', name: 'China', continent: 'Asia' }
    ];

    const filtered = query.length === 0
      ? mockCountries.slice(0, 5) // Show top 5 popular countries when no query
      : mockCountries.filter(country =>
        country.name.toLowerCase().includes(query.toLowerCase()) ||
        country.code.toLowerCase().includes(query.toLowerCase())
      );

    return filtered.map(country => referenceDataService.formatCountryOption(country));
  }, []);

  // Get autocomplete function based on type
  const getAutocompleteFetcher = (type: string) => {
    switch (type) {
      case 'airport':
        return fetchAirportSuggestions;
      case 'location':
        return fetchLocationSuggestions;
      case 'country':
        return fetchCountrySuggestions;
      default:
        return fetchLocationSuggestions;
    }
  };

  const handleInputChange = useCallback((key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));

    // Clear error when user starts typing
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  }, [errors]);

  // Separate handler for autocomplete selections
  const handleAutocompleteChange = useCallback((key: string, value: string, option?: any) => {
    // If an option was selected, use its label for display
    const displayValue = option ? option.label : value;

    setFormData(prev => ({
      ...prev,
      [key]: displayValue,
      // Store additional data if needed
      [`${key}_data`]: option?.data || option
    }));

    // Clear error when user selects an option
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  }, [errors]);

  const handleInputBlur = useCallback((key: string, value: string) => {
    setTouched(prev => ({ ...prev, [key]: true }));

    // Validate field on blur
    if (config && config.fields) {
      const field = config.fields.find(f => f.key === key);
      if (field) {
        let error = '';

        if (field.required && !value.trim()) {
          error = 'This field is required';
        } else if (field.validation && value.trim()) {
          const validationError = field.validation(value);
          if (validationError) {
            error = validationError;
          }
        }

        // Always update the error state (either set error or clear it)
        setErrors(prev => ({ ...prev, [key]: error }));
      }
    }
  }, [config?.fields]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!config || !config.fields) {
      return false;
    }

    config.fields.forEach(field => {
      const value = formData[field.key as keyof SearchFormData] || '';

      // Skip validation for passenger-selector, traveler-selector, trip-type-selector, time-selector and simple-passenger-selector as they're handled separately
      if (field.type === 'passenger-selector' || field.type === 'traveler-selector' || field.type === 'trip-type-selector' || field.type === 'time-selector' || field.type === 'simple-passenger-selector') {
        return;
      }

      // Return date is always optional for flights (user can choose one-way or round-trip)
      if (serviceType === 'flights' && (field.key === 'return' || field.key === 'dates')) {
        return; // Skip validation - return date and combined dates are handled by date picker
      }

      // Only validate string values
      if (typeof value === 'string') {
        if (field.required && !value.trim()) {
          newErrors[field.key] = 'This field is required';
        } else if (field.validation && value.trim()) {
          const validationError = field.validation(value);
          if (validationError) {
            newErrors[field.key] = validationError;
          }
        }
      }
    });

    setErrors(newErrors);
    setTouched(config.fields.reduce((acc, field) => ({ ...acc, [field.key]: true }), {}));

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // For flights, infer trip type from dates and include passenger breakdown
      const submitData = serviceType === 'flights'
        ? { 
            ...formData, 
            // Infer trip type from whether dates contains a return date
            flightType: formData.dates?.includes(' - ') ? 'roundTrip' : 'oneWay',
            passengers: passengerData, // Pass the actual passenger breakdown
            // Extract departure and return dates from the combined dates field
            departure: formData.dates?.split(' - ')[0] || formData.dates || '',
            return: formData.dates?.includes(' - ') 
              ? formData.dates.split(' - ')[1] 
              : ''
          }
        : formData;
      
      try {
        onSearch(submitData);
      } catch (error) {
        console.error('❌ Error calling onSearch:', error);
      }
    } else {
      console.log('❌ Form validation failed');
    }
  };

  // Use all fields from config - return date is always shown for flights
  const visibleFields = config.fields;

  return (
    <div className={`w-full max-w-full search-form-container ${className}`} style={{ ...style, overflow: 'visible' }}>
      <form
        onSubmit={handleSubmit}
        className={`w-full flex flex-col md:flex-row items-stretch bg-white/10 rounded-lg min-w-0 relative transition-all duration-200`}
        style={{ overflow: 'visible' }}
        role="search"
        aria-label={`${serviceType} search form`}
        noValidate
      >


        {/* Form Fields Container - Wraps on mobile, single row on desktop */}
        <div className="flex flex-col md:flex-row items-stretch flex-1 min-w-0" style={{ overflow: 'visible' }}>
          {visibleFields.map((field, index) => {
            const rawValue = formData[field.key as keyof SearchFormData];
            const fieldValue = typeof rawValue === 'string' ? rawValue : '';
            const fieldError = errors[field.key];
            const isFieldTouched = touched[field.key];
            const isLastField = index === visibleFields.length - 1;

            return (
              <div
                key={field.key}
                className={`relative flex-1 min-w-0 border-white ${
                  isLastField 
                    ? 'border-b-0 md:border-r-0' 
                    : 'border-b md:border-b-0 md:border-r'
                } form-field`}
                style={{ overflow: 'visible' }}
              >
                <div className="flex items-center px-3 py-3 sm:py-4 min-w-0 w-full">
                  {/* Show icon for non-date fields only */}
                  {field.icon && !['date'].includes(field.type || '') && (
                    <Image
                      src={field.icon as string}
                      alt={`${field.placeholder} icon`}
                      width={14}
                      height={14}
                      className="w-3.5 h-3.5 mr-2 flex-shrink-0 opacity-70"
                      style={{
                        filter: 'brightness(0) invert(0)'
                      }}
                    />
                  )}

                  {field.type === 'date' ? (
                    <div className="flex-1">
                      <StyledDatePicker
                        value={fieldValue}
                        onChange={(date) => handleInputChange(field.key, date)}
                        placeholder={field.placeholder}
                        minDate={
                          field.key === 'checkout' && formData.checkin
                            ? formData.checkin as string
                            : new Date().toISOString().split('T')[0]
                        }
                        error={!!(fieldError && isFieldTouched)}
                        required={field.required}
                        className="w-full"
                      />
                    </div>
                  ) : field.type === 'autocomplete' ? (
                    <div className="flex-1">
                      <StyledAutocompleteInput
                        value={fieldValue}
                        onChange={(value, option) => handleAutocompleteChange(field.key, value, option)}
                        placeholder={field.placeholder}
                        fetchSuggestions={getAutocompleteFetcher(field.autocompleteType || 'location')}
                        error={!!(fieldError && isFieldTouched)}
                        className="w-full"
                        showLocationOptions={(serviceType === 'car-hire' || serviceType === 'car') && (field.key === 'pickupAddress' || field.key === 'dropoffAddress')}
                      />
                    </div>
                  ) : field.type === 'passenger-selector' ? (
                    <div className="flex-1">
                      <StyledPassengerSelector
                        value={passengerData}
                        onChange={(passengers) => {
                          setPassengerData(passengers)
                          const total = passengers.adults + passengers.children + passengers.infants
                          const label = total === 1 ? '1 passenger' : `${total} passengers`
                          handleInputChange(field.key, label)
                        }}
                        error={!!(fieldError && isFieldTouched)}
                        className="w-full"
                      />
                    </div>
                  ) : field.type === 'traveler-selector' ? (
                    <div className="flex-1">
                      <TravelerSelector
                        value={travelerData}
                        onChange={(travelers) => {
                          setTravelerData(travelers)
                          // Create a detailed label with adults and children breakdown
                          const parts = [];
                          if (travelers.adults > 0) {
                            parts.push(`${travelers.adults} ${travelers.adults === 1 ? 'Adult' : 'Adults'}`);
                          }
                          if (travelers.children > 0) {
                            parts.push(`${travelers.children} ${travelers.children === 1 ? 'Child' : 'Children'}`);
                          }
                          const label = parts.join(', ') || '0 travelers';
                          handleInputChange(field.key, label)
                        }}
                        className="w-full"
                      />
                    </div>
                  ) : field.type === 'room-selector' ? (
                    <div className="flex-1">
                      <StyledRoomSelector
                        value={roomData}
                        onChange={(rooms) => {
                          setRoomData(rooms)
                          const roomText = rooms.rooms === 1 ? '1 room' : `${rooms.rooms} rooms`
                          const guestText = (rooms.adults + rooms.children) === 1 ? '1 guest' : `${rooms.adults + rooms.children} guests`
                          handleInputChange(field.key, `${roomText}, ${guestText}`)
                        }}
                        error={!!(fieldError && isFieldTouched)}
                        className="w-full"
                      />
                    </div>
                  ) : field.type === 'trip-type-selector' ? (
                    <div className="flex-1">
                      <StyledTripTypeSelector
                        value={fieldValue as 'oneWay' | 'roundTrip' || field.defaultValue as 'oneWay' | 'roundTrip' || 'oneWay'}
                        onChange={(tripType) => {
                          handleInputChange(field.key, tripType)
                          // Clear return date if switching to one-way
                          if (tripType === 'oneWay') {
                            handleInputChange('return', '')
                          }
                        }}
                        error={!!(fieldError && isFieldTouched)}
                        className="w-full"
                      />
                    </div>
                  ) : field.type === 'time-selector' ? (
                    <div className="flex-1">
                      <TimeSelector
                        value={fieldValue || field.defaultValue || ''}
                        onChange={(value) => {
                          handleInputChange(field.key, value);
                          handleInputBlur(field.key, value);
                        }}
                        placeholder={field.placeholder}
                        className="w-full"
                      />
                    </div>
                  ) : field.type === 'simple-passenger-selector' ? (
                    <div className="flex-1">
                      <SimplePassengerSelector
                        value={parseInt(fieldValue) || 1}
                        onChange={(count) => {
                          const label = count === 1 ? '1 passenger' : `${count} passengers`
                          handleInputChange(field.key, label)
                        }}
                        placeholder={field.placeholder}
                        className="w-full"
                      />
                    </div>
                  ) : field.type === 'select' ? (
                    <select
                      value={fieldValue || field.defaultValue || ''}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                      onBlur={(e) => handleInputBlur(field.key, e.target.value)}
                      className={`flex-1 bg-transparent text-brand-blue outline-none text-sm sm:text-base font-medium cursor-pointer ${fieldError && isFieldTouched ? 'border-b-2 border-red-400' : ''}`}
                      aria-label={field.placeholder}
                      aria-invalid={!!(fieldError && isFieldTouched)}
                      aria-describedby={fieldError && isFieldTouched ? `${field.key}-error` : undefined}
                      required={field.required}
                    >
                      {field.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type || 'text'}
                      placeholder={field.placeholder}
                      value={fieldValue}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                      onBlur={(e) => handleInputBlur(field.key, e.target.value)}
                      className={`flex-1 bg-transparent text-brand-blue placeholder-brand-blue/60 outline-none text-sm sm:text-base font-medium ${fieldError && isFieldTouched ? 'border-b-2 border-red-400' : ''}`}
                      aria-label={field.placeholder}
                      aria-invalid={!!(fieldError && isFieldTouched)}
                      aria-describedby={fieldError && isFieldTouched ? `${field.key}-error` : undefined}
                      required={field.required}
                    />
                  )}
                </div>

                {fieldError && isFieldTouched && (
                  <div
                    id={`${field.key}-error`}
                    className="absolute top-full left-3 lg:left-4 text-red-300 text-xs lg:text-sm mt-1 z-10"
                    role="alert"
                  >
                    {fieldError}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Search Button - Full width on mobile, auto width on desktop */}
        <div className="flex-shrink-0 w-full md:w-auto md:min-w-[7rem]">
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={loading}
            disabled={loading}
            className="bg-brand-red hover:bg-brand-red-dark disabled:bg-brand-red/70 text-white px-4 py-3 sm:py-4 rounded-b-lg md:rounded-b-none md:rounded-r-lg h-full w-full font-semibold shadow-lg flex items-center justify-center transition-all duration-200"
            aria-label={loading ? "Searching..." : "Search"}
          >
            {loading ? (
              <span className="text-sm whitespace-nowrap">Searching...</span>
            ) : (
              <>
                <svg
                  className="w-5 h-5 md:w-4 md:h-4 md:mr-2 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span className="md:inline text-sm whitespace-nowrap">{config.buttonText}</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}