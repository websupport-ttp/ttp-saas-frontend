'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { TextInput } from '@/components/ui/TextInput';
import { FormField, FormGroup, FormActions } from '@/components/ui/FormField';
import { VisaType, VisaApplicationFormProps } from '@/types/visa-application';
import { POPULAR_DESTINATIONS, COMMON_NATIONALITIES } from '@/lib/constants/visa-application';
import { formatVisaValidity, calculateVisaCost } from '@/lib/visa-utils';

// Mock visa types data - in real app this would come from API
const VISA_TYPES_BY_COUNTRY: Record<string, VisaType[]> = {
  'US': [
    {
      id: 'b1-b2',
      name: 'B-1/B-2 Tourist/Business Visa',
      description: 'For tourism, business meetings, and short-term visits',
      validityDays: 3650, // 10 years
      maxStayDays: 180,
      entries: 'multiple',
      governmentFee: 160,
      processingFee: 50,
      processingTime: '5-10 business days',
      requirements: ['Valid passport', 'DS-160 form', 'Interview appointment', 'Supporting documents']
    },
    {
      id: 'esta',
      name: 'ESTA (Visa Waiver)',
      description: 'For eligible countries under Visa Waiver Program',
      validityDays: 730, // 2 years
      maxStayDays: 90,
      entries: 'multiple',
      governmentFee: 14,
      processingFee: 10,
      processingTime: '1-3 business days',
      requirements: ['Valid passport', 'ESTA application', 'Return ticket']
    }
  ],
  'GB': [
    {
      id: 'standard-visitor',
      name: 'Standard Visitor Visa',
      description: 'For tourism, business, or visiting family and friends',
      validityDays: 180, // 6 months
      maxStayDays: 180,
      entries: 'multiple',
      governmentFee: 100,
      processingFee: 40,
      processingTime: '3-8 weeks',
      requirements: ['Valid passport', 'Online application', 'Biometric appointment', 'Supporting documents']
    }
  ],
  'CA': [
    {
      id: 'visitor-visa',
      name: 'Visitor Visa (TRV)',
      description: 'For tourism, business, or visiting family',
      validityDays: 3650, // Up to 10 years
      maxStayDays: 180,
      entries: 'multiple',
      governmentFee: 100,
      processingFee: 35,
      processingTime: '2-4 weeks',
      requirements: ['Valid passport', 'Online application', 'Biometrics', 'Supporting documents']
    }
  ]
};

export default function VisaApplicationForm({
  destinationCountry,
  nationality,
  visaType,
  arrivalDate,
  onCountryChange,
  onNationalityChange,
  onVisaTypeChange,
  onArrivalDateChange,
  onStartApplication
}: VisaApplicationFormProps) {
  const [availableVisaTypes, setAvailableVisaTypes] = useState<VisaType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Update available visa types when destination country changes
  useEffect(() => {
    if (destinationCountry) {
      const visaTypes = VISA_TYPES_BY_COUNTRY[destinationCountry] || [];
      setAvailableVisaTypes(visaTypes);
      
      // Reset visa type selection if current selection is not available for new country
      if (visaType && !visaTypes.find(vt => vt.id === visaType.id)) {
        onVisaTypeChange(visaTypes[0] || null);
      }
    } else {
      setAvailableVisaTypes([]);
    }
  }, [destinationCountry, visaType, onVisaTypeChange]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!destinationCountry || !nationality || !visaType || !arrivalDate) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      onStartApplication();
    } catch (error) {
      console.error('Error starting visa application:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = destinationCountry && nationality && visaType && arrivalDate;

  // Format date for input (YYYY-MM-DD)
  const formatDateForInput = (date: Date | null): string => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  // Parse date from input
  const parseDateFromInput = (dateString: string): Date | null => {
    if (!dateString) return null;
    return new Date(dateString);
  };

  // Handle date change with null check
  const handleDateChange = (dateString: string) => {
    const date = parseDateFromInput(dateString);
    onArrivalDateChange(date);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Apply for Your Visa
          </h2>
          <p className="text-gray-600">
            Start your visa application by providing basic travel information
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormGroup title="Travel Information">
            {/* Destination Country */}
            <FormField>
              <Select
                label="Destination Country"
                placeholder="Select destination country"
                value={destinationCountry}
                onChange={(e) => onCountryChange(e.target.value)}
                options={POPULAR_DESTINATIONS.map(country => ({
                  value: country.code,
                  label: `${country.flag} ${country.name}`
                }))}
                required
              />
            </FormField>

            {/* Nationality */}
            <FormField>
              <Select
                label="Your Nationality"
                placeholder="Select your nationality"
                value={nationality}
                onChange={(e) => onNationalityChange(e.target.value)}
                options={COMMON_NATIONALITIES.map(nat => ({
                  value: nat.code,
                  label: nat.name
                }))}
                required
              />
            </FormField>

            {/* Visa Type */}
            {availableVisaTypes.length > 0 && (
              <FormField>
                <Select
                  label="Visa Type"
                  placeholder="Select visa type"
                  value={visaType?.id || ''}
                  onChange={(e) => {
                    const selectedType = availableVisaTypes.find(vt => vt.id === e.target.value);
                    if (selectedType) {
                      onVisaTypeChange(selectedType);
                    }
                  }}
                  options={availableVisaTypes.map(vt => ({
                    value: vt.id,
                    label: vt.name
                  }))}
                  required
                />
              </FormField>
            )}

            {/* Arrival Date */}
            <FormField>
              <TextInput
                type="date"
                label="Planned Arrival Date"
                value={formatDateForInput(arrivalDate)}
                onChange={(e) => handleDateChange(e.target.value)}
                min={new Date().toISOString().split('T')[0]} // Minimum date is today
                required
              />
            </FormField>
          </FormGroup>

          {/* Visa Details Display */}
          {visaType && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                {visaType.name}
              </h3>
              <p className="text-blue-800 mb-4">
                {visaType.description}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-sm font-medium text-blue-700">Validity & Stay:</span>
                  <p className="text-sm text-blue-600">
                    {formatVisaValidity(visaType)}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-blue-700">Processing Time:</span>
                  <p className="text-sm text-blue-600">
                    {visaType.processingTime}
                  </p>
                </div>
              </div>

              <div className="border-t border-blue-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-blue-700">Total Cost (per person):</span>
                  <span className="text-lg font-bold text-blue-900">
                    ${calculateVisaCost(visaType, 1)}
                  </span>
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  Government fee: ${visaType.governmentFee} + Processing fee: ${visaType.processingFee}
                </div>
              </div>
            </div>
          )}

          <FormActions>
            <Button
              type="submit"
              size="lg"
              loading={isLoading}
              disabled={!isFormValid}
              >
              Start Application
            </Button>
          </FormActions>
        </form>
      </div>
    </div>
  );
}