'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ServiceLayout from '@/components/hotels/ServiceLayout';
import { TripDetailsForm } from '@/components/travel-insurance/TripDetailsForm';
import { TripDetails } from '@/types/travel-insurance';
import { useUniversalNavigation } from '@/hooks/useUniversalNavigation';
import { validateTripDates } from '@/lib/insurance-utils';

export default function InsuranceDetailsPage() {
  const router = useRouter();
  const { getStoredData, storeData } = useUniversalNavigation();
  
  const [tripDetails, setTripDetails] = useState<TripDetails>({
    destination: '',
    departureDate: new Date(),
    returnDate: new Date(),
    tripType: 'leisure',
    tripCost: 0,
    numberOfTravelers: 1,
    domesticTrip: false,
  });

  useEffect(() => {
    // Check if user has selected a plan
    const selectedPlan = getStoredData('travel-insurance', 'selectedPlan');
    if (!selectedPlan) {
      router.push('/travel-insurance');
      return;
    }

    // Load stored trip details
    const storedTripDetails = getStoredData('travel-insurance', 'tripDetails');
    if (storedTripDetails) {
      setTripDetails({
        ...storedTripDetails,
        departureDate: new Date(storedTripDetails.departureDate),
        returnDate: new Date(storedTripDetails.returnDate),
      });
    } else {
      // Set default dates (tomorrow and day after)
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dayAfter = new Date();
      dayAfter.setDate(dayAfter.getDate() + 8); // 7-day trip by default

      setTripDetails(prev => ({
        ...prev,
        departureDate: tomorrow,
        returnDate: dayAfter,
      }));
    }
  }, [getStoredData, router]);

  const handleTripDetailsChange = (details: TripDetails) => {
    // Determine if trip is domestic (simplified logic)
    const isDomestic = details.destination.toLowerCase().includes('united states') || 
                      details.destination.toLowerCase().includes('usa') ||
                      details.destination.toLowerCase().includes('us');
    
    const updatedDetails = {
      ...details,
      domesticTrip: isDomestic,
    };
    
    setTripDetails(updatedDetails);
    storeData('travel-insurance', 'tripDetails', updatedDetails);
  };

  const handleSubmit = () => {
    const validation = validateTripDates(tripDetails.departureDate, tripDetails.returnDate);
    if (validation.valid) {
      router.push('/travel-insurance/travelers');
    }
  };

  const handleBack = () => {
    router.push('/travel-insurance');
  };

  const progressSteps = [
    { label: 'Choose Plan', active: false, completed: true },
    { label: 'Trip Details', active: true, completed: false },
    { label: 'Travelers', active: false, completed: false },
    { label: 'Review', active: false, completed: false },
    { label: 'Payment', active: false, completed: false },
  ];

  return (
    <ServiceLayout title="Travel Insurance">
      <div className="max-w-2xl mx-auto">
        <TripDetailsForm
          tripDetails={tripDetails}
          onTripDetailsChange={handleTripDetailsChange}
          onSubmit={handleSubmit}
        />
      </div>
    </ServiceLayout>
  );
}