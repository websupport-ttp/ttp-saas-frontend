'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ServiceLayout from '@/components/hotels/ServiceLayout';
import { TravelerInformationForm } from '@/components/travel-insurance/TravelerInformationForm';
import { InsuredTraveler, TripDetails } from '@/types/travel-insurance';
import { useUniversalNavigation } from '@/hooks/useUniversalNavigation';

export default function InsuranceTravelersPage() {
  const router = useRouter();
  const { getStoredData, storeData } = useUniversalNavigation();
  
  const [travelers, setTravelers] = useState<InsuredTraveler[]>([]);
  const [tripDetails, setTripDetails] = useState<TripDetails | null>(null);

  useEffect(() => {
    // Check if user has completed previous steps
    const selectedPlan = getStoredData('travel-insurance', 'selectedPlan');
    const storedTripDetails = getStoredData('travel-insurance', 'tripDetails');
    
    if (!selectedPlan || !storedTripDetails) {
      router.push('/travel-insurance');
      return;
    }

    setTripDetails(storedTripDetails);

    // Load stored travelers or create initial travelers based on trip details
    const storedTravelers = getStoredData('travel-insurance', 'travelers');
    
    if (storedTravelers && storedTravelers.length > 0) {
      setTravelers(storedTravelers.map((traveler: any) => ({
        ...traveler,
        personalInfo: {
          ...traveler.personalInfo,
          dateOfBirth: new Date(traveler.personalInfo.dateOfBirth),
        }
      })));
    } else {
      // Create initial travelers based on number from trip details
      const initialTravelers: InsuredTraveler[] = Array.from(
        { length: storedTripDetails.numberOfTravelers },
        (_, index) => createEmptyTraveler(index)
      );
      setTravelers(initialTravelers);
    }
  }, [getStoredData, router]);

  const createEmptyTraveler = (index: number): InsuredTraveler => ({
    id: `traveler-${index + 1}`,
    personalInfo: {
      firstName: '',
      lastName: '',
      dateOfBirth: new Date(),
      gender: 'male',
      email: '',
      phoneNumber: '',
      address: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
      },
    },
    medicalInfo: {
      hasPreExistingConditions: false,
      conditions: [],
      medications: [],
      allergies: [],
    },
    beneficiary: {
      name: '',
      relationship: '',
      phoneNumber: '',
      email: '',
      address: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
      },
    },
  });

  const handleTravelerUpdate = (index: number, updatedTraveler: InsuredTraveler) => {
    const updatedTravelers = [...travelers];
    updatedTravelers[index] = updatedTraveler;
    setTravelers(updatedTravelers);
    storeData('travel-insurance', 'travelers', updatedTravelers);
  };

  const handleAddTraveler = () => {
    const newTraveler = createEmptyTraveler(travelers.length);
    const updatedTravelers = [...travelers, newTraveler];
    setTravelers(updatedTravelers);
    storeData('travel-insurance', 'travelers', updatedTravelers);
    
    // Update trip details with new traveler count
    if (tripDetails) {
      const updatedTripDetails = {
        ...tripDetails,
        numberOfTravelers: updatedTravelers.length,
      };
      setTripDetails(updatedTripDetails);
      storeData('travel-insurance', 'tripDetails', updatedTripDetails);
    }
  };

  const handleRemoveTraveler = (index: number) => {
    if (travelers.length > 1) {
      const updatedTravelers = travelers.filter((_, i) => i !== index);
      setTravelers(updatedTravelers);
      storeData('travel-insurance', 'travelers', updatedTravelers);
      
      // Update trip details with new traveler count
      if (tripDetails) {
        const updatedTripDetails = {
          ...tripDetails,
          numberOfTravelers: updatedTravelers.length,
        };
        setTripDetails(updatedTripDetails);
        storeData('travel-insurance', 'tripDetails', updatedTripDetails);
      }
    }
  };

  const handleSubmit = () => {
    router.push('/travel-insurance/review');
  };

  const handleBack = () => {
    router.push('/travel-insurance/details');
  };

  const progressSteps = [
    { label: 'Choose Plan', active: false, completed: true },
    { label: 'Trip Details', active: false, completed: true },
    { label: 'Travelers', active: true, completed: false },
    { label: 'Review', active: false, completed: false },
    { label: 'Payment', active: false, completed: false },
  ];

  return (
    <ServiceLayout title="Travel Insurance">
      <div className="max-w-4xl mx-auto">
        <TravelerInformationForm
          travelers={travelers}
          onTravelerUpdate={handleTravelerUpdate}
          onAddTraveler={handleAddTraveler}
          onRemoveTraveler={handleRemoveTraveler}
          onSubmit={handleSubmit}
        />
      </div>
    </ServiceLayout>
  );
}