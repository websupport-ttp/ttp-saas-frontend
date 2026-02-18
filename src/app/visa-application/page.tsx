'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ServiceLayout from '@/components/hotels/ServiceLayout';
import { VisaApplicationForm } from '@/components/visa-application';
import { VisaType } from '@/types/visa-application';

export default function VisaApplicationPage() {
  const router = useRouter();
  const [destinationCountry, setDestinationCountry] = useState('');
  const [nationality, setNationality] = useState('');
  const [visaType, setVisaType] = useState<VisaType | null>(null);
  const [arrivalDate, setArrivalDate] = useState<Date | null>(null);

  const handleStartApplication = () => {
    // Store application data in session storage for persistence across pages
    const applicationData = {
      destinationCountry,
      nationality,
      visaType,
      arrivalDate: arrivalDate?.toISOString(),
      createdAt: new Date().toISOString()
    };
    
    sessionStorage.setItem('visa-application-data', JSON.stringify(applicationData));
    
    // Navigate to personal details page
    router.push('/visa-application/personal');
  };

  const breadcrumbs = [
    { name: 'Visa Assistance', href: '/visa-application' }
  ];

  return (
    <ServiceLayout 
      title="Visa Assistance Service"
      breadcrumbs={breadcrumbs}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <VisaApplicationForm
          destinationCountry={destinationCountry}
          nationality={nationality}
          visaType={visaType}
          arrivalDate={arrivalDate}
          onCountryChange={setDestinationCountry}
          onNationalityChange={setNationality}
          onVisaTypeChange={setVisaType}
          onArrivalDateChange={setArrivalDate}
          onStartApplication={handleStartApplication}
        />
      </div>
    </ServiceLayout>
  );
}