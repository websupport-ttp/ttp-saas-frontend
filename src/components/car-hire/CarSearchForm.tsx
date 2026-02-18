'use client';

import { useState, useEffect } from 'react';
import { CarSearchCriteria } from '@/types/car-hire';
import { getUIIcon } from '@/lib/constants/icons';

interface CarSearchFormProps {
  onSearch: (criteria: CarSearchCriteria) => void;
  initialValues?: Partial<CarSearchCriteria>;
}

export default function CarSearchForm({ onSearch, initialValues }: CarSearchFormProps) {
  const [pickupAddress, setPickupAddress] = useState(initialValues?.pickupAddress || initialValues?.location || '');
  const [dropoffAddress, setDropoffAddress] = useState(initialValues?.dropoffAddress || '');
  const [pickupDate, setPickupDate] = useState(
    initialValues?.pickupDate ? initialValues.pickupDate.toISOString().split('T')[0] : ''
  );
  const [pickupTime, setPickupTime] = useState('10:00');
  const [passengerCount, setPassengerCount] = useState(initialValues?.passengerCount || 1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form when initialValues change
  useEffect(() => {
    if (initialValues) {
      if (initialValues.pickupAddress || initialValues.location) {
        setPickupAddress(initialValues.pickupAddress || initialValues.location || '');
      }
      if (initialValues.dropoffAddress) {
        setDropoffAddress(initialValues.dropoffAddress);
      }
      if (initialValues.pickupDate) {
        setPickupDate(initialValues.pickupDate.toISOString().split('T')[0]);
      }
      if (initialValues.passengerCount) {
        setPassengerCount(initialValues.passengerCount);
      }
    }
  }, [initialValues]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!pickupAddress.trim()) {
      newErrors.pickupAddress = 'Pick up address is required';
    }

    if (!dropoffAddress.trim()) {
      newErrors.dropoffAddress = 'Drop off address is required';
    }

    if (!pickupDate) {
      newErrors.pickupDate = 'Pick up date is required';
    }

    if (!pickupTime) {
      newErrors.pickupTime = 'Pick up time is required';
    }

    if (pickupDate) {
      const pickupDateTime = new Date(`${pickupDate}T${pickupTime}`);
      const now = new Date();

      if (pickupDateTime < now) {
        newErrors.pickupDate = 'Pick up date and time cannot be in the past';
      }
    }

    if (passengerCount < 1 || passengerCount > 8) {
      newErrors.passengerCount = 'Number of passengers must be between 1 and 8';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const pickupDateTime = new Date(`${pickupDate}T${pickupTime}`);
      
      const searchCriteria: CarSearchCriteria = {
        location: pickupAddress.trim(),
        pickupDate: pickupDateTime,
        returnDate: new Date(pickupDateTime.getTime() + 24 * 60 * 60 * 1000), // Default 1 day rental
        passengerCount,
        pickupAddress: pickupAddress.trim(),
        dropoffAddress: dropoffAddress.trim(),
      };
      
      onSearch(searchCriteria);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Pick up Address */}
          <div className="sm:col-span-2 lg:col-span-1">
            <label htmlFor="pickupAddress" className="block text-sm font-medium text-gray-700 mb-1">
              Pick up address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <input
                type="text"
                id="pickupAddress"
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                placeholder="Enter pick up location"
                className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-brand-red ${
                  errors.pickupAddress ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.pickupAddress && (
              <p className="mt-1 text-sm text-red-600">{errors.pickupAddress}</p>
            )}
          </div>

          {/* Pick up Date and Time */}
          <div>
            <label htmlFor="pickupDate" className="block text-sm font-medium text-gray-700 mb-1">
              Pick up date & time
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="date"
                  id="pickupDate"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-brand-red ${
                    errors.pickupDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              <input
                type="time"
                id="pickupTime"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className={`block w-24 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-brand-red ${
                  errors.pickupTime ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {(errors.pickupDate || errors.pickupTime) && (
              <p className="mt-1 text-sm text-red-600">{errors.pickupDate || errors.pickupTime}</p>
            )}
          </div>

          {/* Drop off Address */}
          <div>
            <label htmlFor="dropoffAddress" className="block text-sm font-medium text-gray-700 mb-1">
              Drop off address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <input
                type="text"
                id="dropoffAddress"
                value={dropoffAddress}
                onChange={(e) => setDropoffAddress(e.target.value)}
                placeholder="Enter drop off location"
                className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-brand-red ${
                  errors.dropoffAddress ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.dropoffAddress && (
              <p className="mt-1 text-sm text-red-600">{errors.dropoffAddress}</p>
            )}
          </div>

          {/* Passenger Count */}
          <div>
            <label htmlFor="passengerCount" className="block text-sm font-medium text-gray-700 mb-1">
              Passengers
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <select
                id="passengerCount"
                value={passengerCount}
                onChange={(e) => setPassengerCount(parseInt(e.target.value))}
                className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-brand-red ${
                  errors.passengerCount ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {Array.from({ length: 8 }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'passenger' : 'passengers'}
                  </option>
                ))}
              </select>
            </div>
            {errors.passengerCount && (
              <p className="mt-1 text-sm text-red-600">{errors.passengerCount}</p>
            )}
          </div>
        </div>

        {/* Search Button */}
        <div className="flex justify-center pt-4">
          <button
            type="submit"
            className="w-full sm:w-auto bg-brand-red hover:bg-red-700 text-white font-semibold py-3 px-6 sm:px-8 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Search Cars</span>
          </button>
        </div>
      </form>
    </div>
  );
}