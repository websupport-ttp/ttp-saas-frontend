'use client';

import React, { useState, useEffect } from 'react';
import { visaService } from '@/lib/services/visa-service';

interface VisaCountrySelectorProps {
  selectedCountry: string;
  selectedVisaType: string;
  onCountryChange: (country: string) => void;
  onVisaTypeChange: (visaType: string) => void;
  onSelectionComplete: () => void;
  disabled?: boolean;
  showUrgencySelection?: boolean;
  selectedUrgency?: string;
  onUrgencyChange?: (urgency: string) => void;
}

interface SupportedCountry {
  code: string;
  name: string;
  visaTypes: string[];
}

export const VisaCountrySelector: React.FC<VisaCountrySelectorProps> = ({
  selectedCountry,
  selectedVisaType,
  onCountryChange,
  onVisaTypeChange,
  onSelectionComplete,
  disabled = false,
  showUrgencySelection = false,
  selectedUrgency = 'standard',
  onUrgencyChange
}) => {
  const [countries, setCountries] = useState<SupportedCountry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSupportedCountries();
  }, []);

  const loadSupportedCountries = async () => {
    try {
      setLoading(true);
      setError(null);
      const supportedCountries = await visaService.getSupportedCountries();
      setCountries(supportedCountries);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load supported countries');
    } finally {
      setLoading(false);
    }
  };

  const handleCountryChange = (countryCode: string) => {
    onCountryChange(countryCode);
    // Reset visa type when country changes
    onVisaTypeChange('');
  };

  const handleVisaTypeChange = (visaType: string) => {
    onVisaTypeChange(visaType);
  };

  const selectedCountryData = countries.find(c => c.code === selectedCountry);
  const canProceed = selectedCountry && selectedVisaType;

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error Loading Countries</h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
            <button
              onClick={loadSupportedCountries}
              className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Select Destination & Visa Type</h3>
      
      <div className="space-y-6">
        {/* Country Selection */}
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
            Destination Country *
          </label>
          <select
            id="country"
            value={selectedCountry}
            onChange={(e) => handleCountryChange(e.target.value)}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Select a country</option>
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        {/* Visa Type Selection */}
        <div>
          <label htmlFor="visaType" className="block text-sm font-medium text-gray-700 mb-2">
            Visa Type *
          </label>
          <select
            id="visaType"
            value={selectedVisaType}
            onChange={(e) => handleVisaTypeChange(e.target.value)}
            disabled={disabled || !selectedCountry}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Select visa type</option>
            {selectedCountryData?.visaTypes.map((visaType) => (
              <option key={visaType} value={visaType}>
                {visaType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
          {!selectedCountry && (
            <p className="mt-1 text-sm text-gray-500">Please select a country first</p>
          )}
        </div>

        {/* Urgency Selection - Only show if enabled */}
        {showUrgencySelection && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Processing Urgency
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { value: 'standard', label: 'Standard', time: '10-15 days' },
                { value: 'express', label: 'Express', time: '5-7 days' },
                { value: 'urgent', label: 'Urgent', time: '2-3 days' }
              ].map((option) => (
                <div key={option.value} className="relative">
                  <input
                    type="radio"
                    id={option.value}
                    name="urgency"
                    value={option.value}
                    checked={selectedUrgency === option.value}
                    onChange={(e) => onUrgencyChange?.(e.target.value)}
                    disabled={disabled}
                    className="sr-only peer"
                  />
                  <label
                    htmlFor={option.value}
                    className="flex items-center justify-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
                  >
                    <div className="text-center">
                      <div className="font-medium text-gray-900">{option.label}</div>
                      <div className="text-sm text-gray-500">{option.time}</div>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-4">
          <button
            onClick={onSelectionComplete}
            disabled={!canProceed || disabled}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {canProceed ? 'View Requirements & Fees' : 'Please select country and visa type'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisaCountrySelector;