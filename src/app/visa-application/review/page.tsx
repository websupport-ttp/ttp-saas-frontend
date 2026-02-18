'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ServiceLayout } from '@/components/hotels';
import { VisaReviewSummary } from '@/components/visa-application';
import { VisaApplication, VisaType } from '@/types/visa-application';
import { POPULAR_DESTINATIONS } from '@/lib/constants/visa-application';
import { generateVisaConfirmation } from '@/lib/visa-utils';

// Mock visa application data - in real app this would come from state management
const mockVisaApplication: VisaApplication = {
  id: 'visa-app-001',
  destinationCountry: 'US',
  nationality: 'GB',
  visaType: {
    id: 'b1-b2',
    name: 'B-1/B-2 Tourist/Business Visa',
    description: 'For tourism, business meetings, and short-term visits',
    validityDays: 3650,
    maxStayDays: 180,
    entries: 'multiple',
    governmentFee: 160,
    processingFee: 50,
    processingTime: '5-10 business days',
    requirements: ['Valid passport', 'DS-160 form', 'Interview appointment', 'Supporting documents']
  },
  arrivalDate: new Date('2024-12-15'),
  travelers: [
    {
      id: 'traveler-001',
      personalInfo: {
        firstName: 'John',
        middleName: 'Michael',
        lastName: 'Smith',
        dateOfBirth: new Date('1990-05-15'),
        placeOfBirth: 'London, UK',
        nationality: 'British',
        gender: 'male',
        maritalStatus: 'single',
        email: 'john.smith@example.com',
        phoneNumber: '+44 20 1234 5678',
        address: {
          street: '123 Baker Street',
          city: 'London',
          state: 'England',
          postalCode: 'NW1 6XE',
          country: 'United Kingdom'
        }
      },
      passportInfo: {
        passportNumber: 'GB123456789',
        nationality: 'British',
        issueDate: new Date('2020-01-15'),
        expirationDate: new Date('2030-01-15'),
        issuingCountry: 'United Kingdom',
        placeOfIssue: 'London'
      },
      additionalInfo: {
        hasAssets: true,
        assetDetails: 'Property ownership and savings account',
        hasTravelHistory: true,
        travelHistoryDetails: 'Previous visits to EU countries',
        employmentStatus: 'employed',
        employerDetails: {
          name: 'Tech Solutions Ltd',
          address: '456 Business Park, London, UK',
          position: 'Software Engineer'
        },
        monthlyIncome: '£5,000-£7,500',
        previousApplications: 'none',
        purposeOfTravel: 'Tourism and business meetings',
        emergencyContact: {
          name: 'Jane Smith',
          relationship: 'Sister',
          phoneNumber: '+44 20 9876 5432',
          address: '789 Family Road, London, UK'
        }
      }
    }
  ],
  appointmentLocation: 'US Embassy London - 33 Nine Elms Lane, London SW11 7US',
  status: 'draft',
  totalCost: 210,
  confirmationNumber: '',
  createdAt: new Date(),
};

export default function VisaReviewPage() {
  const router = useRouter();
  const [application, setApplication] = useState<VisaApplication>(mockVisaApplication);
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = (section: string) => {
    // Navigate to the appropriate edit page
    switch (section) {
      case 'personal':
        router.push('/visa-application/personal');
        break;
      case 'passport':
        router.push('/visa-application/passport');
        break;
      case 'appointment':
        router.push('/visa-application/appointment');
        break;
      default:
        router.push('/visa-application');
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call to submit application
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate confirmation number
      const confirmationNumber = generateVisaConfirmation();
      
      // Update application with confirmation
      setApplication(prev => ({
        ...prev,
        confirmationNumber,
        status: 'submitted',
        submittedAt: new Date()
      }));
      
      // Navigate to payment page
      router.push('/visa-application/payment');
    } catch (error) {
      console.error('Error submitting application:', error);
      setIsLoading(false);
    }
  };

  const breadcrumbs = [
    { name: 'Visa Application', href: '/visa-application' },
    { name: 'Personal Details', href: '/visa-application/personal' },
    { name: 'Passport Information', href: '/visa-application/passport' },
    { name: 'Appointment', href: '/visa-application/appointment' },
    { name: 'Review Application', href: '/visa-application/review' }
  ];

  return (
    <ServiceLayout title="Review Your Visa Application" breadcrumbs={breadcrumbs}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Preparing your application...</p>
            </div>
          </div>
        ) : (
          <VisaReviewSummary
            application={application}
            visaType={application.visaType}
            onEdit={handleEdit}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </ServiceLayout>
  );
}