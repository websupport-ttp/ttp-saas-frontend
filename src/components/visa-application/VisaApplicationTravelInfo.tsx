'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';

interface TravelInfo {
  purposeOfVisit: string;
  intendedDateOfEntry: string;
  intendedDateOfExit: string;
  accommodationDetails: string;
  previousVisits: boolean;
  previousVisitDetails: string;
}

interface VisaApplicationTravelInfoProps {
  data?: Partial<TravelInfo>;
  onComplete: (data: { travelInfo: TravelInfo }) => void;
  onBack: () => void;
}

export const VisaApplicationTravelInfo: React.FC<VisaApplicationTravelInfoProps> = ({
  data = {},
  onComplete,
  onBack
}) => {
  const [formData, setFormData] = useState<TravelInfo>({
    purposeOfVisit: data.purposeOfVisit || '',
    intendedDateOfEntry: data.intendedDateOfEntry || '',
    intendedDateOfExit: data.intendedDateOfExit || '',
    accommodationDetails: data.accommodationDetails || '',
    previousVisits: data.previousVisits || false,
    previousVisitDetails: data.previousVisitDetails || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({ travelInfo: formData });
  };

  const handleInputChange = (field: keyof TravelInfo) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleCheckboxChange = (field: keyof TravelInfo) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.checked
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Travel Information</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Purpose of Visit"
          value={formData.purposeOfVisit}
          onChange={handleInputChange('purposeOfVisit')}
          placeholder="e.g., Tourism, Business, Education"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Intended Date of Entry"
            type="date"
            value={formData.intendedDateOfEntry}
            onChange={handleInputChange('intendedDateOfEntry')}
            required
          />
          <Input
            label="Intended Date of Exit"
            type="date"
            value={formData.intendedDateOfExit}
            onChange={handleInputChange('intendedDateOfExit')}
            required
          />
        </div>

        <Textarea
          label="Accommodation Details"
          value={formData.accommodationDetails}
          onChange={handleInputChange('accommodationDetails')}
          placeholder="Hotel name and address, or host information"
          rows={4}
          required
        />

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="previousVisits"
              checked={formData.previousVisits}
              onChange={handleCheckboxChange('previousVisits')}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="previousVisits" className="text-sm font-medium text-gray-700">
              I have visited this country before
            </label>
          </div>

          {formData.previousVisits && (
            <Textarea
              label="Previous Visit Details"
              value={formData.previousVisitDetails}
              onChange={handleInputChange('previousVisitDetails')}
              placeholder="Please provide details about your previous visits (dates, purpose, duration)"
              rows={3}
            />
          )}
        </div>

        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
          >
            Back
          </Button>
          <Button type="submit">
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
};

export default VisaApplicationTravelInfo;