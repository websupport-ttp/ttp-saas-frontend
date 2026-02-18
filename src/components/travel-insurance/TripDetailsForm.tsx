'use client';

import React, { useState } from 'react';
import { TripDetails, TripDetailsFormProps } from '@/types/travel-insurance';
import { InsuranceQuoteData } from '@/types/api';
import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { Select } from '@/components/ui/Select';
import { FormField } from '@/components/ui/FormField';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { TRIP_TYPES, TRIP_TYPE_LABELS } from '@/lib/constants/travel-insurance';
import { insuranceService } from '@/lib/services/insurance-service';

export function TripDetailsForm({
  tripDetails,
  onTripDetailsChange,
  onSubmit
}: TripDetailsFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!tripDetails.destination.trim()) {
      newErrors.destination = 'Destination is required';
    }

    if (!tripDetails.departureDate) {
      newErrors.departureDate = 'Departure date is required';
    }

    if (!tripDetails.returnDate) {
      newErrors.returnDate = 'Return date is required';
    }

    if (tripDetails.departureDate && tripDetails.returnDate) {
      if (new Date(tripDetails.returnDate) <= new Date(tripDetails.departureDate)) {
        newErrors.returnDate = 'Return date must be after departure date';
      }

      // Check if departure is in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(tripDetails.departureDate) < today) {
        newErrors.departureDate = 'Departure date cannot be in the past';
      }
    }

    if (tripDetails.numberOfTravelers < 1) {
      newErrors.numberOfTravelers = 'At least 1 traveler is required';
    }

    if (tripDetails.numberOfTravelers > 10) {
      newErrors.numberOfTravelers = 'Maximum 10 travelers allowed';
    }

    if (tripDetails.tripCost < 0) {
      newErrors.tripCost = 'Trip cost cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      setQuoteError(null);
      
      try {
        // Transform trip details to quote request format
        const quoteData: InsuranceQuoteData = {
          tripType: tripDetails.tripType === 'leisure' ? 'single' : 'single', // Map to API format
          destination: tripDetails.destination,
          departureDate: tripDetails.departureDate.toISOString().split('T')[0],
          returnDate: tripDetails.returnDate.toISOString().split('T')[0],
          travelers: Array.from({ length: tripDetails.numberOfTravelers }, () => ({
            age: 30, // Default age, should be collected in a more detailed form
            preExistingConditions: false
          })),
          coverageType: 'comprehensive' // Default coverage type
        };

        // Get quote from insurance service
        const quote = await insuranceService.getQuote(quoteData);
        
        // Call the original onSubmit with quote data
        onSubmit(quote);
      } catch (error) {
        console.error('Failed to get insurance quote:', error);
        setQuoteError(error instanceof Error ? error.message : 'Failed to get quote. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleInputChange = (field: keyof TripDetails, value: any) => {
    const updatedDetails = { ...tripDetails, [field]: value };
    onTripDetailsChange(updatedDetails);
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getTripDuration = () => {
    if (tripDetails.departureDate && tripDetails.returnDate) {
      const days = Math.ceil(
        (tripDetails.returnDate.getTime() - tripDetails.departureDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      return days > 0 ? days : 0;
    }
    return 0;
  };

  const tripDuration = getTripDuration();

  const travelerOptions = Array.from({ length: 10 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `${i + 1} ${i === 0 ? 'Traveler' : 'Travelers'}`
  }));

  const tripTypeOptions = Object.entries(TRIP_TYPE_LABELS).map(([value, label]) => ({
    value,
    label
  }));

  return (
    <div className="trip-details-form">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Trip Details</h2>
        <p className="text-gray-600 text-sm">
          Tell us about your trip so we can provide accurate coverage options.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Destination */}
        <FormField error={errors.destination} required>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Destination
          </label>
          <TextInput
            value={tripDetails.destination}
            onChange={(e) => handleInputChange('destination', e.target.value)}
            placeholder="Enter your destination country or city"
            error={errors.destination}
            fullWidth
          />
          {errors.destination && (
            <p className="mt-1 text-sm text-red-600">{errors.destination}</p>
          )}
        </FormField>

        {/* Travel Dates - Mobile optimized layout */}
        <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
          <FormField error={errors.departureDate} required>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Departure Date
            </label>
            <TextInput
              type="date"
              value={tripDetails.departureDate ? formatDateForInput(tripDetails.departureDate) : ''}
              onChange={(e) => handleInputChange('departureDate', new Date(e.target.value))}
              error={errors.departureDate}
              fullWidth
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.departureDate && (
              <p className="mt-1 text-sm text-red-600">{errors.departureDate}</p>
            )}
          </FormField>

          <FormField error={errors.returnDate} required>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Return Date
            </label>
            <TextInput
              type="date"
              value={tripDetails.returnDate ? formatDateForInput(tripDetails.returnDate) : ''}
              onChange={(e) => handleInputChange('returnDate', new Date(e.target.value))}
              error={errors.returnDate}
              fullWidth
              min={tripDetails.departureDate ? formatDateForInput(tripDetails.departureDate) : new Date().toISOString().split('T')[0]}
            />
            {errors.returnDate && (
              <p className="mt-1 text-sm text-red-600">{errors.returnDate}</p>
            )}
          </FormField>
        </div>

        {/* Trip duration display */}
        {tripDuration > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center text-blue-800">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">
                Trip Duration: {tripDuration} day{tripDuration !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}

        {/* Number of Travelers and Trip Type - Mobile optimized */}
        <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
          <FormField error={errors.numberOfTravelers} required>
            <Select
              label="Number of Travelers"
              value={tripDetails.numberOfTravelers.toString()}
              onChange={(e) => handleInputChange('numberOfTravelers', parseInt(e.target.value))}
              error={errors.numberOfTravelers}
              options={travelerOptions}
              />
          </FormField>

          <FormField required>
            <Select
              label="Trip Type"
              value={tripDetails.tripType}
              onChange={(e) => handleInputChange('tripType', e.target.value as keyof typeof TRIP_TYPES)}
              options={tripTypeOptions}
              />
          </FormField>
        </div>

        {/* Trip Cost */}
        <FormField error={errors.tripCost}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estimated Trip Cost (Optional)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <TextInput
              type="number"
              value={tripDetails.tripCost || ''}
              onChange={(e) => handleInputChange('tripCost', parseFloat(e.target.value) || 0)}
              placeholder="0"
              error={errors.tripCost}
              fullWidth
              className="pl-8"
              min="0"
              step="100"
            />
          </div>
          <p className="mt-1 text-sm text-gray-600">
            This helps us recommend appropriate coverage limits
          </p>
          {errors.tripCost && (
            <p className="mt-1 text-sm text-red-600">{errors.tripCost}</p>
          )}
        </FormField>

        {/* Domestic/International indicator */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Coverage Information</h4>
              <p className="text-sm text-gray-600">
                {tripDetails.domesticTrip 
                  ? "Domestic travel insurance typically covers trip cancellation, medical emergencies, and baggage protection within your home country."
                  : "International travel insurance provides comprehensive coverage including medical expenses abroad, emergency evacuation, and trip protection."
                }
              </p>
            </div>
          </div>
        </div>

        {/* Quote Error Display */}
        {quoteError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-red-800 mb-1">Quote Request Failed</h4>
                <p className="text-sm text-red-700">{quoteError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button - Mobile optimized */}
        <div className="pt-4">
          <Button
            type="submit"
            className="touch-target md:w-auto md:px-8"
            size="lg"
            disabled={isLoading}
            fullWidth
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <LoadingSpinner size="sm" color="white" />
                <span>Getting Quote...</span>
              </div>
            ) : (
              'Continue to Coverage Options'
            )}
          </Button>
        </div>
      </form>

      {/* Mobile-specific help section */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg md:hidden">
        <h4 className="font-medium text-yellow-800 mb-2">Need Help?</h4>
        <div className="space-y-2 text-sm text-yellow-700">
          <p>• Choose your main destination if visiting multiple places</p>
          <p>• Trip cost helps determine coverage limits (optional)</p>
          <p>• Adventure trips may require additional coverage</p>
        </div>
      </div>
    </div>
  );
}