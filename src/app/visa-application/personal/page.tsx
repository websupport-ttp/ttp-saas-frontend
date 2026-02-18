'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { VisaTraveler } from '@/types/visa-application';
import { VisaPersonalDetailsForm } from '@/components/visa-application';
import ServiceLayout from '@/components/hotels/ServiceLayout';
import '@/styles/mobile-visa-optimizations.css';

export default function VisaPersonalPage() {
  const router = useRouter();
  const [travelers, setTravelers] = useState<VisaTraveler[]>([]);

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
      }
    }
  }, []);

  // Save data whenever travelers change
  useEffect(() => {
    if (travelers.length > 0) {
      localStorage.setItem('visa_application_travelers', JSON.stringify(travelers));
    }
  }, [travelers]);

  // Create a new empty traveler
  const createNewTraveler = (): VisaTraveler => ({
    id: `traveler-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    personalInfo: {
      firstName: '',
      middleName: '',
      lastName: '',
      dateOfBirth: new Date(),
      placeOfBirth: '',
      nationality: '',
      gender: 'male',
      maritalStatus: 'single',
      email: '',
      phoneNumber: '',
      address: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: ''
      }
    },
    passportInfo: {
      passportNumber: '',
      nationality: '',
      issueDate: new Date(),
      expirationDate: new Date(),
      issuingCountry: '',
      placeOfIssue: ''
    },
    additionalInfo: {
      hasAssets: false,
      hasTravelHistory: false,
      employmentStatus: 'employed',
      monthlyIncome: '',
      previousApplications: 'none',
      purposeOfTravel: '',
      emergencyContact: {
        name: '',
        relationship: '',
        phoneNumber: '',
        address: ''
      }
    }
  });

  // Handle traveler updates
  const handleTravelerUpdate = (index: number, updatedTraveler: VisaTraveler) => {
    const newTravelers = [...travelers];
    newTravelers[index] = updatedTraveler;
    setTravelers(newTravelers);
  };

  // Handle adding a new traveler
  const handleAddTraveler = () => {
    const newTraveler = createNewTraveler();
    setTravelers([...travelers, newTraveler]);
  };

  // Handle removing a traveler
  const handleRemoveTraveler = (index: number) => {
    const newTravelers = travelers.filter((_, i) => i !== index);
    setTravelers(newTravelers);
  };

  // Handle form submission
  const handleSubmit = () => {
    // Navigate to passport information page
    router.push('/visa-application/passport');
  };

  const breadcrumbs = [
    { name: 'Visa Application', href: '/visa-application' },
    { name: 'Personal Details', href: '/visa-application/personal' }
  ];

  return (
    <ServiceLayout 
      title="Visa Application - Personal Details"
      breadcrumbs={breadcrumbs}
    >
      <div className="visa-form-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="visa-form">
          <VisaPersonalDetailsForm
            travelers={travelers}
            onTravelerUpdate={handleTravelerUpdate}
            onAddTraveler={handleAddTraveler}
            onRemoveTraveler={handleRemoveTraveler}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </ServiceLayout>
  );
}