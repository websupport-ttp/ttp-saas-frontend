'use client';

import { useState, useEffect } from 'react';
import { PackageDetails, PackagePurchaseData, ParticipantInfo } from '@/types/api';
import { useSimpleAuth } from '@/contexts/simple-auth-context';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface PackagePurchaseFormProps {
  packageDetails: PackageDetails;
  bookingData: any;
  onPurchase: (purchaseData: PackagePurchaseData) => void;
  isProcessing: boolean;
  error: string | null;
}

export default function PackagePurchaseForm({
  packageDetails,
  bookingData,
  onPurchase,
  isProcessing,
  error
}: PackagePurchaseFormProps) {
  const { user } = useSimpleAuth();
  const [participants, setParticipants] = useState<ParticipantInfo[]>([]);
  const [specialRequests, setSpecialRequests] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Initialize participants based on booking data
  useEffect(() => {
    if (bookingData?.participants) {
      setParticipants(bookingData.participants);
    } else {
      // Initialize with default participants
      const defaultParticipants: ParticipantInfo[] = [];
      const adultCount = bookingData?.adultCount || 1;
      const childCount = bookingData?.childCount || 0;

      // Add adults
      for (let i = 0; i < adultCount; i++) {
        defaultParticipants.push({
          type: 'adult',
          firstName: i === 0 && user ? user.firstName : '',
          lastName: i === 0 && user ? user.lastName : '',
          dateOfBirth: '',
          passportNumber: '',
          dietaryRequirements: ''
        });
      }

      // Add children
      for (let i = 0; i < childCount; i++) {
        defaultParticipants.push({
          type: 'child',
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          passportNumber: '',
          dietaryRequirements: ''
        });
      }

      setParticipants(defaultParticipants);
    }
  }, [bookingData, user]);

  // Validate form
  useEffect(() => {
    const errors: Record<string, string> = {};
    let valid = true;

    participants.forEach((participant, index) => {
      if (!participant.firstName.trim()) {
        errors[`participant_${index}_firstName`] = 'First name is required';
        valid = false;
      }
      if (!participant.lastName.trim()) {
        errors[`participant_${index}_lastName`] = 'Last name is required';
        valid = false;
      }
      if (!participant.dateOfBirth) {
        errors[`participant_${index}_dateOfBirth`] = 'Date of birth is required';
        valid = false;
      }
    });

    setFormErrors(errors);
    setIsFormValid(valid);
  }, [participants]);

  const updateParticipant = (index: number, field: keyof ParticipantInfo, value: string) => {
    const updatedParticipants = [...participants];
    updatedParticipants[index] = {
      ...updatedParticipants[index],
      [field]: value
    };
    setParticipants(updatedParticipants);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
      return;
    }

    const purchaseData: PackagePurchaseData = {
      packageId: packageDetails.id,
      selectedDate: bookingData.selectedDate,
      participants,
      specialRequests: specialRequests.trim() || undefined
    };

    onPurchase(purchaseData);
  };

  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const getMaxDate = (type: 'adult' | 'child'): string => {
    const today = new Date();
    if (type === 'adult') {
      // Adults must be at least 18 years old
      const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
      return maxDate.toISOString().split('T')[0];
    } else {
      // Children must be under 18
      const maxDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
      return maxDate.toISOString().split('T')[0];
    }
  };

  const getMinDate = (type: 'adult' | 'child'): string => {
    const today = new Date();
    if (type === 'child') {
      // Children must be at least 2 years old for most packages
      const minDate = new Date(today.getFullYear() - 17, today.getMonth(), today.getDate());
      return minDate.toISOString().split('T')[0];
    } else {
      // Adults can be up to 100 years old
      const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
      return minDate.toISOString().split('T')[0];
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="font-poppins font-semibold text-2xl text-gray-900 mb-6">
        Participant Details
      </h2>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg
              className="h-5 w-5 text-red-500 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Participants Section */}
        <div className="space-y-6">
          {participants.map((participant, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-6 bg-gray-50"
            >
              <h3 className="font-semibold text-lg text-gray-900 mb-4">
                {participant.type === 'adult' ? 'Adult' : 'Child'} {index + 1}
                {participant.type === 'adult' && index === 0 && ' (Lead Traveler)'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={participant.firstName}
                    onChange={(e) => updateParticipant(index, 'firstName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent ${
                      formErrors[`participant_${index}_firstName`]
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300'
                    }`}
                    placeholder="Enter first name"
                    disabled={isProcessing}
                  />
                  {formErrors[`participant_${index}_firstName`] && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors[`participant_${index}_firstName`]}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={participant.lastName}
                    onChange={(e) => updateParticipant(index, 'lastName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent ${
                      formErrors[`participant_${index}_lastName`]
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300'
                    }`}
                    placeholder="Enter last name"
                    disabled={isProcessing}
                  />
                  {formErrors[`participant_${index}_lastName`] && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors[`participant_${index}_lastName`]}
                    </p>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    value={participant.dateOfBirth}
                    onChange={(e) => updateParticipant(index, 'dateOfBirth', e.target.value)}
                    min={getMinDate(participant.type)}
                    max={getMaxDate(participant.type)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent ${
                      formErrors[`participant_${index}_dateOfBirth`]
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300'
                    }`}
                    disabled={isProcessing}
                  />
                  {formErrors[`participant_${index}_dateOfBirth`] && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors[`participant_${index}_dateOfBirth`]}
                    </p>
                  )}
                  {participant.dateOfBirth && (
                    <p className="mt-1 text-sm text-gray-500">
                      Age: {calculateAge(participant.dateOfBirth)} years
                    </p>
                  )}
                </div>

                {/* Passport Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Passport Number
                  </label>
                  <input
                    type="text"
                    value={participant.passportNumber || ''}
                    onChange={(e) => updateParticipant(index, 'passportNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                    placeholder="Enter passport number"
                    disabled={isProcessing}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Required for international travel
                  </p>
                </div>

                {/* Dietary Requirements */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dietary Requirements
                  </label>
                  <input
                    type="text"
                    value={participant.dietaryRequirements || ''}
                    onChange={(e) => updateParticipant(index, 'dietaryRequirements', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                    placeholder="e.g., Vegetarian, Halal, Gluten-free, Allergies"
                    disabled={isProcessing}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Special Requests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Special Requests or Notes
          </label>
          <textarea
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
            placeholder="Any special requests, accessibility needs, or additional information..."
            disabled={isProcessing}
          />
          <p className="mt-1 text-sm text-gray-500">
            Optional: Let us know about any special requirements or preferences
          </p>
        </div>

        {/* Terms and Conditions */}
        <div className="border-t border-gray-200 pt-6">
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Important Notes:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• All participant names must match passport/ID documents exactly</li>
              <li>• Passport must be valid for at least 6 months from travel date</li>
              <li>• Dietary requirements will be accommodated where possible</li>
              <li>• Special requests are subject to availability and may incur additional costs</li>
            </ul>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!isFormValid || isProcessing}
            className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
              !isFormValid || isProcessing
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-brand-red hover:bg-red-700 text-white'
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center">
                <LoadingSpinner size="sm" color="white" />
                <span className="ml-2">Processing...</span>
              </div>
            ) : (
              'Proceed to Payment'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}