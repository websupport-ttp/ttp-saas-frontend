'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { visaService } from '@/lib/services/visa-service';
import { VisaApplicationData, VisaRequirements, VisaFees } from '@/types/api';
import { useNotificationHelpers } from '@/contexts/notification-context';
import { useSimpleAuth } from '@/contexts/simple-auth-context';

// Import step components
import VisaApplicationStepIndicator from '@/components/visa-application/VisaApplicationStepIndicator';
import VisaApplicationBasicInfo from '@/components/visa-application/VisaApplicationBasicInfo';
import { VisaApplicationPersonalInfo } from '@/components/visa-application/VisaApplicationPersonalInfo';
import VisaApplicationTravelInfo from '@/components/visa-application/VisaApplicationTravelInfo';
import VisaApplicationReview from '@/components/visa-application/VisaApplicationReview';

export default function VisaApplicationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showError, showSuccess } = useNotificationHelpers();
  const { user, isAuthenticated } = useSimpleAuth();

  // Get initial values from URL params
  const initialCountry = searchParams.get('country') || '';
  const initialVisaType = searchParams.get('visaType') || '';
  const initialUrgency = searchParams.get('urgency') || 'standard';

  // Application state
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [requirements, setRequirements] = useState<VisaRequirements | null>(null);
  const [fees, setFees] = useState<VisaFees | null>(null);

  // Form data state
  const [applicationData, setApplicationData] = useState<Partial<VisaApplicationData>>({
    destinationCountry: initialCountry,
    visaType: initialVisaType,
    urgency: initialUrgency,
    personalInfo: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      placeOfBirth: '',
      nationality: '',
      passportNumber: '',
      passportExpiryDate: '',
      email: user?.email || '',
      phoneNumber: '',
      address: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: ''
      }
    },
    travelInfo: {
      purposeOfVisit: '',
      intendedDateOfEntry: '',
      intendedDateOfExit: '',
      accommodationDetails: '',
      previousVisits: false,
      previousVisitDetails: ''
    },
    documents: []
  });

  const steps = [
    { id: 1, name: 'Basic Information', description: 'Country and visa type' },
    { id: 2, name: 'Personal Details', description: 'Your personal information' },
    { id: 3, name: 'Travel Information', description: 'Travel plans and purpose' },
    { id: 4, name: 'Review & Submit', description: 'Review and submit application' }
  ];

  // Load requirements and fees when basic info is complete
  useEffect(() => {
    if (applicationData.destinationCountry && applicationData.visaType) {
      loadRequirementsAndFees();
    }
  }, [applicationData.destinationCountry, applicationData.visaType, applicationData.urgency]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/visa/apply');
    }
  }, [isAuthenticated, router]);

  const loadRequirementsAndFees = async () => {
    if (!applicationData.destinationCountry || !applicationData.visaType) return;

    try {
      setLoading(true);
      const [requirementsData, feesData] = await Promise.all([
        visaService.getRequirements(applicationData.destinationCountry, applicationData.visaType),
        visaService.calculateFees({
          destinationCountry: applicationData.destinationCountry,
          visaType: applicationData.visaType,
          urgency: applicationData.urgency || 'standard'
        })
      ]);

      setRequirements(requirementsData);
      setFees(feesData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load visa information';
      showError('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationData = (updates: Partial<VisaApplicationData>) => {
    setApplicationData(prev => ({
      ...prev,
      ...updates
    }));
  };

  const handleStepComplete = (stepData: any) => {
    switch (currentStep) {
      case 1:
        updateApplicationData({
          destinationCountry: stepData.destinationCountry,
          visaType: stepData.visaType,
          urgency: stepData.urgency
        });
        break;
      case 2:
        updateApplicationData({
          personalInfo: stepData.personalInfo
        });
        break;
      case 3:
        updateApplicationData({
          travelInfo: stepData.travelInfo
        });
        break;
    }

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStepBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitApplication = async () => {
    try {
      setLoading(true);

      // Validate required data
      if (!applicationData.destinationCountry || !applicationData.visaType || !applicationData.personalInfo || !applicationData.travelInfo) {
        throw new Error('Please complete all required information');
      }

      // Submit application
      const result = await visaService.submitApplication(applicationData as VisaApplicationData);
      
      showSuccess('Success', 'Your visa application has been submitted successfully!');
      
      // Redirect to application status page
      router.push(`/visa/status/${result.applicationId}?tracking=${result.trackingNumber}`);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit application';
      showError('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <VisaApplicationBasicInfo
            data={{
              destinationCountry: applicationData.destinationCountry || '',
              visaType: applicationData.visaType || '',
              urgency: applicationData.urgency || 'standard'
            }}
            requirements={requirements}
            fees={fees}
            loading={loading}
            onComplete={handleStepComplete}
          />
        );
      case 2:
        return (
          <VisaApplicationPersonalInfo
            data={applicationData.personalInfo}
            onComplete={handleStepComplete}
            onBack={handleStepBack}
          />
        );
      case 3:
        return (
          <VisaApplicationTravelInfo
            data={applicationData.travelInfo}
            onComplete={handleStepComplete}
            onBack={handleStepBack}
          />
        );
      case 4:
        return (
          <VisaApplicationReview
            applicationData={applicationData}
            requirements={requirements}
            fees={fees}
            onSubmit={handleSubmitApplication}
            onBack={handleStepBack}
            loading={loading}
          />
        );
      default:
        return null;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Visa Application
          </h1>
          <p className="text-lg text-gray-600">
            Complete your visa application in a few simple steps
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <VisaApplicationStepIndicator
            steps={steps}
            currentStep={currentStep}
          />
        </div>

        {/* Current Step Content */}
        <div className="bg-white rounded-lg shadow-md">
          {renderCurrentStep()}
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Need Help?</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  If you need assistance with your visa application, please contact our support team at{' '}
                  <a href="mailto:visa@thetravelplace.com" className="underline hover:text-blue-600">
                    visa@thetravelplace.com
                  </a>{' '}
                  or call{' '}
                  <a href="tel:+234-800-TRAVEL" className="underline hover:text-blue-600">
                    +234-800-TRAVEL
                  </a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}