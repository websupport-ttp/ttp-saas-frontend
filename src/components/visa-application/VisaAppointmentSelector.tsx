'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { FormField, FormGroup, FormActions } from '@/components/ui/FormField';
import { VisaAppointmentSelectorProps, AppointmentLocation } from '@/types/visa-application';
import { APPOINTMENT_LOCATIONS } from '@/lib/constants/visa-application';
import { calculateDistance } from '@/lib/visa-utils';

// Mock function to get user coordinates from address
// In a real app, this would use a geocoding service
const mockGeocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock coordinates for common UK cities
  const mockCoordinates: Record<string, { lat: number; lng: number }> = {
    'london': { lat: 51.5074, lng: -0.1278 },
    'manchester': { lat: 53.4808, lng: -2.2426 },
    'birmingham': { lat: 52.4862, lng: -1.8904 },
    'edinburgh': { lat: 55.9533, lng: -3.1883 },
    'glasgow': { lat: 55.8642, lng: -4.2518 },
    'liverpool': { lat: 53.4084, lng: -2.9916 },
    'leeds': { lat: 53.8008, lng: -1.5491 },
    'bristol': { lat: 51.4545, lng: -2.5879 },
    'belfast': { lat: 54.5973, lng: -5.9301 },
  };

  const normalizedAddress = address.toLowerCase();
  for (const [city, coords] of Object.entries(mockCoordinates)) {
    if (normalizedAddress.includes(city)) {
      return coords;
    }
  }

  // Default to London if no match found
  return mockCoordinates.london;
};

export function VisaAppointmentSelector({
  userAddress,
  availableLocations,
  selectedLocation,
  onAddressChange,
  onLocationSelect,
  onSubmit
}: VisaAppointmentSelectorProps) {
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [sortedLocations, setSortedLocations] = useState<(AppointmentLocation & { distance?: number })[]>([]);
  const [addressError, setAddressError] = useState<string>('');

  // Sort locations by distance when address changes
  useEffect(() => {
    const findNearestLocations = async () => {
      if (!userAddress.trim() || availableLocations.length === 0) {
        setSortedLocations(availableLocations);
        return;
      }

      setIsLoadingLocations(true);
      setAddressError('');

      try {
        const userCoords = await mockGeocodeAddress(userAddress);
        
        if (!userCoords) {
          setAddressError('Could not find location. Please try a different address.');
          setSortedLocations(availableLocations);
          return;
        }

        const locationsWithDistance = availableLocations.map(location => ({
          ...location,
          distance: calculateDistance(
            userCoords.lat,
            userCoords.lng,
            location.coordinates.lat,
            location.coordinates.lng
          )
        }));

        // Sort by distance
        locationsWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0));
        setSortedLocations(locationsWithDistance);
      } catch (error) {
        console.error('Error finding nearest locations:', error);
        setAddressError('Error finding nearest locations. Please try again.');
        setSortedLocations(availableLocations);
      } finally {
        setIsLoadingLocations(false);
      }
    };

    const debounceTimer = setTimeout(findNearestLocations, 500);
    return () => clearTimeout(debounceTimer);
  }, [userAddress, availableLocations]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onAddressChange(e.target.value);
    setAddressError('');
  };

  const handleLocationSelect = (locationId: string) => {
    onLocationSelect(locationId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedLocation) {
      onSubmit();
    }
  };

  const formatDistance = (distance?: number): string => {
    if (!distance) return '';
    return distance < 1 ? `${(distance * 1000).toFixed(0)}m` : `${distance.toFixed(1)}km`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Select Appointment Location
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Choose the most convenient visa application center for your appointment
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <FormGroup title="Find Nearest Centers">
            <FormField>
              <TextInput
                label="Your Address"
                placeholder="Enter your address, city, or postcode"
                value={userAddress}
                onChange={handleAddressChange}
                error={addressError}
                helperText="We'll find the nearest visa application centers to your location"
              />
            </FormField>
          </FormGroup>

          <FormGroup title="Available Locations">
            {isLoadingLocations ? (
              <div className="flex items-center justify-center py-6 sm:py-8">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-sm sm:text-base text-gray-600">Finding nearest locations...</span>
              </div>
            ) : sortedLocations.length === 0 ? (
              <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
                No appointment locations available for the selected destination.
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {sortedLocations.map((location) => (
                  <div
                    key={location.id}
                    className={`border rounded-lg p-3 sm:p-4 cursor-pointer transition-all duration-200 touch-manipulation ${
                      selectedLocation === location.id
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 active:bg-gray-100'
                    }`}
                    onClick={() => handleLocationSelect(location.id)}
                    style={{ minHeight: '44px' }} // Minimum touch target size
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start sm:items-center gap-3 mb-2">
                          <div className={`w-5 h-5 sm:w-4 sm:h-4 rounded-full border-2 flex-shrink-0 mt-0.5 sm:mt-0 ${
                            selectedLocation === location.id
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300'
                          }`}>
                            {selectedLocation === location.id && (
                              <div className="w-full h-full rounded-full bg-white scale-50"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-tight">
                              {location.name}
                            </h3>
                            {location.distance && (
                              <span className="text-xs sm:text-sm text-blue-600 font-medium">
                                {formatDistance(location.distance)} away
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="ml-8 sm:ml-7 space-y-2">
                          <div className="text-gray-600 text-sm sm:text-base">
                            <div className="font-medium">{location.address.street}</div>
                            <div>
                              {location.address.city}, {location.address.state} {location.address.postalCode}
                            </div>
                            <div>{location.address.country}</div>
                          </div>

                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 mt-3">
                            <div>
                              <span className="text-xs sm:text-sm font-medium text-gray-700">Hours:</span>
                              <div className="text-xs sm:text-sm text-gray-600">
                                <div>Mon-Fri: {location.hoursOfOperation.weekdays}</div>
                                <div>Weekends: {location.hoursOfOperation.weekends}</div>
                              </div>
                            </div>
                            <div>
                              <span className="text-xs sm:text-sm font-medium text-gray-700">Contact:</span>
                              <div className="text-xs sm:text-sm text-gray-600">
                                <div>{location.contactInfo.phone}</div>
                                <div className="truncate">{location.contactInfo.email}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </FormGroup>

          {selectedLocation && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-start sm:items-center">
                <div className="flex-shrink-0">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mt-0.5 sm:mt-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    Location selected successfully
                  </p>
                  <p className="text-xs sm:text-sm text-green-700">
                    You can proceed to review your application details
                  </p>
                </div>
              </div>
            </div>
          )}

          <FormActions>
            <Button
              type="submit"
              size="lg"
              disabled={!selectedLocation}
              className="min-h-[44px] text-base sm:text-lg" // Ensure minimum touch target size
            >
              Continue to Review
            </Button>
          </FormActions>
        </form>
      </div>
    </div>
  );
}