'use client';

import React, { useState, useEffect } from 'react';
import { visaService } from '@/lib/services/visa-service';
import { VisaRequirements, VisaFees } from '@/types/api';
import VisaCountrySelector from './VisaCountrySelector';
import VisaRequirementsDisplay from './VisaRequirementsDisplay';

interface BasicInfoData {
  destinationCountry: string;
  visaType: string;
  urgency: string;
}

interface VisaApplicationBasicInfoProps {
  data: BasicInfoData;
  requirements: VisaRequirements | null;
  fees: VisaFees | null;
  loading: boolean;
  onComplete: (data: BasicInfoData) => void;
}

export const VisaApplicationBasicInfo: React.FC<VisaApplicationBasicInfoProps> = ({
  data,
  requirements,
  fees,
  loading,
  onComplete
}) => {
  const [selectedCountry, setSelectedCountry] = useState(data.destinationCountry);
  const [selectedVisaType, setSelectedVisaType] = useState(data.visaType);
  const [selectedUrgency, setSelectedUrgency] = useState(data.urgency);
  const [showRequirements, setShowRequirements] = useState(false);

  // Show requirements if we have complete selection
  useEffect(() => {
    if (selectedCountry && selectedVisaType && (requirements || loading)) {
      setShowRequirements(true);
    } else {
      setShowRequirements(false);
    }
  }, [selectedCountry, selectedVisaType, requirements, loading]);

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setShowRequirements(false);
  };

  const handleVisaTypeChange = (visaType: string) => {
    setSelectedVisaType(visaType);
    setShowRequirements(false);
  };

  const handleUrgencyChange = (urgency: string) => {
    setSelectedUrgency(urgency);
  };

  const handleSelectionComplete = () => {
    if (selectedCountry && selectedVisaType) {
      setShowRequirements(true);
    }
  };

  const handleProceedToNext = () => {
    onComplete({
      destinationCountry: selectedCountry,
      visaType: selectedVisaType,
      urgency: selectedUrgency
    });
  };

  const canProceed = selectedCountry && selectedVisaType && requirements && fees;

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Basic Information
        </h2>
        <p className="text-gray-600">
          Select your destination country and visa type to get started
        </p>
      </div>

      {/* Country and Visa Type Selection */}
      <VisaCountrySelector
        selectedCountry={selectedCountry}
        selectedVisaType={selectedVisaType}
        onCountryChange={handleCountryChange}
        onVisaTypeChange={handleVisaTypeChange}
        onSelectionComplete={handleSelectionComplete}
        disabled={loading}
        showUrgencySelection={true}
        selectedUrgency={selectedUrgency}
        onUrgencyChange={handleUrgencyChange}
      />

      {/* Requirements and Fees Display */}
      {showRequirements && (
        <div className="border-t border-gray-200 pt-6">
          <VisaRequirementsDisplay
            requirements={requirements}
            fees={fees}
            loading={loading}
            error={null}
            urgency={selectedUrgency}
            onProceedToApplication={canProceed ? handleProceedToNext : undefined}
          />
        </div>
      )}

      {/* Manual Continue Button (if requirements are shown but no auto-proceed) */}
      {showRequirements && canProceed && (
        <div className="border-t border-gray-200 pt-6">
          <div className="flex justify-end">
            <button
              onClick={handleProceedToNext}
              className="bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Continue to Personal Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisaApplicationBasicInfo;