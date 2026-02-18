'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ServiceLayout from '@/components/hotels/ServiceLayout';
import { PolicyReviewSummary } from '@/components/travel-insurance/PolicyReviewSummary';
import { InsurancePolicy, InsuranceQuote, InsurancePlan, TripDetails, InsuredTraveler } from '@/types/travel-insurance';
import { useUniversalNavigation } from '@/hooks/useUniversalNavigation';
import { SAMPLE_INSURANCE_PLANS } from '@/lib/constants/travel-insurance';
import { generateInsuranceQuote, generatePolicyNumber } from '@/lib/insurance-utils';

export default function InsuranceReviewPage() {
  const router = useRouter();
  const { getStoredData, storeData } = useUniversalNavigation();
  
  const [policy, setPolicy] = useState<InsurancePolicy | null>(null);
  const [quote, setQuote] = useState<InsuranceQuote | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    // Check if user has completed previous steps
    const selectedPlanId = getStoredData('travel-insurance', 'selectedPlan');
    const tripDetails = getStoredData('travel-insurance', 'tripDetails');
    const travelers = getStoredData('travel-insurance', 'travelers');
    
    if (!selectedPlanId || !tripDetails || !travelers) {
      router.push('/travel-insurance');
      return;
    }

    // Find the selected plan
    const selectedPlan = (SAMPLE_INSURANCE_PLANS as any).find((plan: any) => plan.id === selectedPlanId);
    if (!selectedPlan) {
      router.push('/travel-insurance');
      return;
    }

    // Create policy object
    const policyData: InsurancePolicy = {
      id: `policy-${Date.now()}`,
      policyNumber: generatePolicyNumber(),
      planType: selectedPlan.type,
      coverage: selectedPlan.coverage,
      tripDetails: {
        ...tripDetails,
        departureDate: new Date(tripDetails.departureDate),
        returnDate: new Date(tripDetails.returnDate),
      },
      travelers: travelers.map((traveler: any) => ({
        ...traveler,
        personalInfo: {
          ...traveler.personalInfo,
          dateOfBirth: new Date(traveler.personalInfo.dateOfBirth),
        }
      })),
      premium: 0, // Will be set from quote
      effectiveDate: new Date(tripDetails.departureDate),
      expirationDate: new Date(tripDetails.returnDate),
      status: 'active',
      createdAt: new Date(),
      confirmationNumber: '',
    };

    // Generate quote
    const quoteRequest = {
      tripDetails: policyData.tripDetails,
      travelers: policyData.travelers.map(traveler => ({
        age: new Date().getFullYear() - new Date(traveler.personalInfo.dateOfBirth).getFullYear(),
        hasPreExistingConditions: traveler.medicalInfo?.hasPreExistingConditions || false,
      })),
      planType: selectedPlan.type,
    };

    const generatedQuote = generateInsuranceQuote(selectedPlan, quoteRequest);
    
    // Update policy with premium from quote
    policyData.premium = generatedQuote.totalPremium;

    setPolicy(policyData);
    setQuote(generatedQuote);

    // Store the policy and quote for payment page
    storeData('travel-insurance', 'policy', policyData);
    storeData('travel-insurance', 'quote', generatedQuote);
  }, [getStoredData, storeData, router]);

  const handleEdit = (section: string) => {
    switch (section) {
      case 'trip':
        router.push('/travel-insurance/details');
        break;
      case 'coverage':
        router.push('/travel-insurance');
        break;
      case 'travelers':
        router.push('/travel-insurance/travelers');
        break;
      default:
        break;
    }
  };

  const handleAcceptTerms = (accepted: boolean) => {
    setTermsAccepted(accepted);
  };

  const handleSubmit = () => {
    if (termsAccepted && policy && quote) {
      router.push('/travel-insurance/payment');
    }
  };

  const handleBack = () => {
    router.push('/travel-insurance/travelers');
  };

  const progressSteps = [
    { label: 'Choose Plan', active: false, completed: true },
    { label: 'Trip Details', active: false, completed: true },
    { label: 'Travelers', active: false, completed: true },
    { label: 'Review', active: true, completed: false },
    { label: 'Payment', active: false, completed: false },
  ];

  if (!policy || !quote) {
    return (
      <ServiceLayout title="Travel Insurance">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      </ServiceLayout>
    );
  }

  return (
    <ServiceLayout title="Travel Insurance">
      <div className="max-w-4xl mx-auto">
        <PolicyReviewSummary
          policy={policy}
          quote={quote}
          onEdit={handleEdit}
          onAcceptTerms={handleAcceptTerms}
          onSubmit={handleSubmit}
          termsAccepted={termsAccepted}
        />
      </div>
    </ServiceLayout>
  );
}