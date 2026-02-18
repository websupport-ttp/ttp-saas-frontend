'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { visaService } from '@/lib/services/visa-service';
import { VisaRequirements, VisaFees } from '@/types/api';
import VisaCountrySelector from '@/components/visa-application/VisaCountrySelector';
import VisaRequirementsDisplay from '@/components/visa-application/VisaRequirementsDisplay';
import { useNotificationHelpers } from '@/contexts/notification-context';

export default function VisaRequirementsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showError } = useNotificationHelpers();

  // State management
  const [selectedCountry, setSelectedCountry] = useState(searchParams.get('country') || '');
  const [selectedVisaType, setSelectedVisaType] = useState(searchParams.get('visaType') || '');
  const [selectedUrgency, setSelectedUrgency] = useState(searchParams.get('urgency') || 'standard');
  const [requirements, setRequirements] = useState<VisaRequirements | null>(null);
  const [fees, setFees] = useState<VisaFees | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRequirements, setShowRequirements] = useState(false);

  // Load requirements and fees when selection is complete
  useEffect(() => {
    if (selectedCountry && selectedVisaType) {
      loadRequirementsAndFees();
    }
  }, [selectedCountry, selectedVisaType, selectedUrgency]);

  const loadRequirementsAndFees = async () => {
    if (!selectedCountry || !selectedVisaType) return;

    try {
      setLoading(true);
      setError(null);

      // Load requirements and fees in parallel
      const [requirementsData, feesData] = await Promise.all([
        visaService.getRequirements(selectedCountry, selectedVisaType),
        visaService.calculateFees({
          destinationCountry: selectedCountry,
          visaType: selectedVisaType,
          urgency: selectedUrgency
        })
      ]);

      setRequirements(requirementsData);
      setFees(feesData);
      setShowRequirements(true);

      // Update URL with current selection
      const params = new URLSearchParams();
      params.set('country', selectedCountry);
      params.set('visaType', selectedVisaType);
      params.set('urgency', selectedUrgency);
      router.replace(`/visa/requirements?${params.toString()}`, { scroll: false });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load visa information';
      setError(errorMessage);
      showError('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setShowRequirements(false);
    setRequirements(null);
    setFees(null);
    setError(null);
  };

  const handleVisaTypeChange = (visaType: string) => {
    setSelectedVisaType(visaType);
    setShowRequirements(false);
    setRequirements(null);
    setFees(null);
    setError(null);
  };

  const handleUrgencyChange = (urgency: string) => {
    setSelectedUrgency(urgency);
    // Recalculate fees when urgency changes
    if (selectedCountry && selectedVisaType) {
      loadRequirementsAndFees();
    }
  };

  const handleSelectionComplete = () => {
    if (selectedCountry && selectedVisaType) {
      loadRequirementsAndFees();
    }
  };

  const handleProceedToApplication = () => {
    // Navigate to visa application form with current selection
    const params = new URLSearchParams();
    params.set('country', selectedCountry);
    params.set('visaType', selectedVisaType);
    params.set('urgency', selectedUrgency);
    router.push(`/visa/apply?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Visa Requirements & Fees
          </h1>
          <p className="text-lg text-gray-600">
            Check visa requirements and calculate fees for your destination
          </p>
        </div>

        {/* Country and Visa Type Selection */}
        <div className="mb-8">
          <VisaCountrySelector
            selectedCountry={selectedCountry}
            selectedVisaType={selectedVisaType}
            onCountryChange={handleCountryChange}
            onVisaTypeChange={handleVisaTypeChange}
            onSelectionComplete={handleSelectionComplete}
            disabled={loading}
          />
        </div>

        {/* Urgency Selection (if country and visa type are selected) */}
        {selectedCountry && selectedVisaType && (
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Processing Urgency</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { value: 'standard', label: 'Standard', time: '10-15 days', description: 'Regular processing' },
                  { value: 'express', label: 'Express', time: '5-7 days', description: 'Faster processing' },
                  { value: 'urgent', label: 'Urgent', time: '2-3 days', description: 'Priority processing' }
                ].map((option) => (
                  <div key={option.value} className="relative">
                    <input
                      type="radio"
                      id={option.value}
                      name="urgency"
                      value={option.value}
                      checked={selectedUrgency === option.value}
                      onChange={(e) => handleUrgencyChange(e.target.value)}
                      disabled={loading}
                      className="sr-only peer"
                    />
                    <label
                      htmlFor={option.value}
                      className="flex flex-col items-center justify-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
                    >
                      <div className="text-center">
                        <div className="font-medium text-gray-900">{option.label}</div>
                        <div className="text-sm text-gray-500 mt-1">{option.time}</div>
                        <div className="text-xs text-gray-400 mt-1">{option.description}</div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Requirements and Fees Display */}
        {(showRequirements || loading || error) && (
          <div className="mb-8">
            <VisaRequirementsDisplay
              requirements={requirements}
              fees={fees}
              loading={loading}
              error={error}
              urgency={selectedUrgency}
              onProceedToApplication={handleProceedToApplication}
            />
          </div>
        )}

        {/* Help Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
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
                  If you have questions about visa requirements or need assistance with your application, 
                  please contact our visa specialists at{' '}
                  <a href="mailto:visa@thetravelplace.com" className="underline hover:text-blue-600">
                    visa@thetravelplace.com
                  </a>{' '}
                  or call us at{' '}
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