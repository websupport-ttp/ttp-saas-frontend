'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { VisaTraveler } from '@/types/visa-application';
import { VisaPassportForm } from '@/components/visa-application';
import ServiceLayout from '@/components/hotels/ServiceLayout';
import '@/styles/mobile-visa-optimizations.css';

export default function VisaPassportPage() {
  const router = useRouter();
  const [travelers, setTravelers] = useState<VisaTraveler[]>([]);
  const [currentTravelerIndex, setCurrentTravelerIndex] = useState(0);

  // Load saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('visa_application_travelers');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Convert date strings back to Date objects
        const travelersWithDates = parsedData.map((traveler: any) => ({
          ...traveler,
          personalInfo: {
            ...traveler.personalInfo,
            dateOfBirth: new Date(traveler.personalInfo.dateOfBirth)
          },
          passportInfo: {
            ...traveler.passportInfo,
            issueDate: new Date(traveler.passportInfo.issueDate),
            expirationDate: new Date(traveler.passportInfo.expirationDate)
          }
        }));
        setTravelers(travelersWithDates);
      } catch (error) {
        console.error('Error loading saved traveler data:', error);
        // Redirect back to personal details if no data found
        router.push('/visa-application/personal');
      }
    } else {
      // Redirect back to personal details if no data found
      router.push('/visa-application/personal');
    }
  }, [router]);

  // Save data whenever travelers change
  useEffect(() => {
    if (travelers.length > 0) {
      localStorage.setItem('visa_application_travelers', JSON.stringify(travelers));
    }
  }, [travelers]);

  // Handle traveler updates
  const handleTravelerUpdate = (updatedTraveler: VisaTraveler) => {
    const newTravelers = [...travelers];
    newTravelers[currentTravelerIndex] = updatedTraveler;
    setTravelers(newTravelers);
  };

  // Handle form submission
  const handleSubmit = () => {
    // Check if there are more travelers to process
    if (currentTravelerIndex < travelers.length - 1) {
      // Move to next traveler
      setCurrentTravelerIndex(currentTravelerIndex + 1);
    } else {
      // All travelers completed, navigate to appointment selection
      router.push('/visa-application/appointment');
    }
  };

  // Handle back navigation
  const handleBack = () => {
    if (currentTravelerIndex > 0) {
      // Go to previous traveler
      setCurrentTravelerIndex(currentTravelerIndex - 1);
    } else {
      // Go back to personal details
      router.push('/visa-application/personal');
    }
  };

  // Don't render if no travelers loaded yet
  if (travelers.length === 0) {
    return (
      <ServiceLayout title="Visa Application - Passport Information">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p>Loading...</p>
          </div>
        </div>
      </ServiceLayout>
    );
  }

  const currentTraveler = travelers[currentTravelerIndex];
  const breadcrumbs = [
    { name: 'Visa Application', href: '/visa-application' },
    { name: 'Personal Details', href: '/visa-application/personal' },
    { name: 'Passport Information', href: '/visa-application/passport' }
  ];

  return (
    <ServiceLayout 
      title="Visa Application - Passport Information"
      breadcrumbs={breadcrumbs}
    >
      <div className="visa-form-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Progress indicator for multiple travelers */}
        {travelers.length > 1 && (
          <div className="mb-6 sm:mb-8 text-center">
            <div className="inline-flex items-center space-x-2 bg-gray-100 rounded-full px-3 sm:px-4 py-2">
              <span className="text-xs sm:text-sm font-medium text-gray-700">
                Traveler {currentTravelerIndex + 1} of {travelers.length}
              </span>
              <span className="text-xs sm:text-sm text-gray-500">
                ({currentTraveler.personalInfo.firstName} {currentTraveler.personalInfo.lastName})
              </span>
            </div>
          </div>
        )}

        <div className="visa-form">
          <VisaPassportForm
            traveler={currentTraveler}
            onTravelerUpdate={handleTravelerUpdate}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </ServiceLayout>
  );
}