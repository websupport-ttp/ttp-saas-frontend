'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ServiceLayout from '@/components/hotels/ServiceLayout';
import { VisaAppointmentSelector } from '@/components/visa-application';
import { AppointmentLocation } from '@/types/visa-application';
import { APPOINTMENT_LOCATIONS } from '@/lib/constants/visa-application';
import { useBookingState } from '@/lib/bookingState';
import '@/styles/mobile-visa-optimizations.css';

export default function VisaAppointmentPage() {
  const router = useRouter();
  const { getVisaApplication, updateVisaApplication } = useBookingState();
  
  const [userAddress, setUserAddress] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [availableLocations, setAvailableLocations] = useState<AppointmentLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load visa application data and available locations
  useEffect(() => {
    const loadData = async () => {
      try {
        const application = getVisaApplication();
        
        if (!application) {
          // Redirect to start if no application found
          router.push('/visa-application');
          return;
        }

        // Get available locations for the destination country
        const locations = APPOINTMENT_LOCATIONS[application.destinationCountry as keyof typeof APPOINTMENT_LOCATIONS] || [];
        setAvailableLocations([...locations]); // Convert readonly array to mutable array

        // Set existing data if available
        if (application.appointmentLocation) {
          setSelectedLocation(application.appointmentLocation);
        }

        // Load user address from personal info if available
        if (application.travelers.length > 0 && application.travelers[0].personalInfo.address) {
          const address = application.travelers[0].personalInfo.address;
          setUserAddress(`${address.street}, ${address.city}, ${address.postalCode}`);
        }
      } catch (error) {
        console.error('Error loading appointment data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [getVisaApplication, router]);

  const handleAddressChange = (address: string) => {
    setUserAddress(address);
  };

  const handleLocationSelect = (locationId: string) => {
    setSelectedLocation(locationId);
  };

  const handleSubmit = () => {
    if (!selectedLocation) return;

    try {
      // Update the visa application with selected appointment location
      const application = getVisaApplication();
      if (application) {
        updateVisaApplication({
          ...application,
          appointmentLocation: selectedLocation
        });
      }

      // Navigate to review page
      router.push('/visa-application/review');
    } catch (error) {
      console.error('Error saving appointment selection:', error);
    }
  };

  if (isLoading) {
    return (
      <ServiceLayout title="Visa Application - Appointment Selection">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-4 text-gray-600">Loading appointment locations...</span>
          </div>
        </div>
      </ServiceLayout>
    );
  }

  const breadcrumbs = [
    { name: 'Visa Application', href: '/visa-application' },
    { name: 'Personal Details', href: '/visa-application/personal' },
    { name: 'Passport Information', href: '/visa-application/passport' },
    { name: 'Appointment Selection', href: '/visa-application/appointment' }
  ];

  return (
    <ServiceLayout
      title="Visa Application - Appointment Selection"
      breadcrumbs={breadcrumbs}
    >
      <div className="visa-form-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="visa-form">
          <VisaAppointmentSelector
            userAddress={userAddress}
            availableLocations={availableLocations}
            selectedLocation={selectedLocation}
            onAddressChange={handleAddressChange}
            onLocationSelect={handleLocationSelect}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </ServiceLayout>
  );
}