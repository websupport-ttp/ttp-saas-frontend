'use client';

import { useState } from 'react';
import { PackageDetails, ParticipantInfo } from '@/types/api';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

interface PackageBookingCardProps {
  packageDetails: PackageDetails;
  onBookPackage: (selectedDate: string, participants: ParticipantInfo[]) => void;
}

export default function PackageBookingCard({ packageDetails, onBookPackage }: PackageBookingCardProps) {
  const [selectedDate, setSelectedDate] = useState('');
  const [participants, setParticipants] = useState<ParticipantInfo[]>([
    {
      type: 'adult',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      passportNumber: '',
      dietaryRequirements: ''
    }
  ]);
  const [specialRequests, setSpecialRequests] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const calculateTotalPrice = () => {
    const adults = participants.filter(p => p.type === 'adult').length;
    const children = participants.filter(p => p.type === 'child').length;
    return (adults * packageDetails.price.adult) + (children * packageDetails.price.child);
  };

  const addParticipant = (type: 'adult' | 'child') => {
    setParticipants([
      ...participants,
      {
        type,
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        passportNumber: '',
        dietaryRequirements: ''
      }
    ]);
  };

  const removeParticipant = (index: number) => {
    if (participants.length > 1) {
      setParticipants(participants.filter((_, i) => i !== index));
    }
  };

  const updateParticipant = (index: number, field: keyof ParticipantInfo, value: string) => {
    const updated = [...participants];
    updated[index] = { ...updated[index], [field]: value };
    setParticipants(updated);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedDate) {
      newErrors.selectedDate = 'Please select a travel date';
    }

    participants.forEach((participant, index) => {
      if (!participant.firstName.trim()) {
        newErrors[`participant_${index}_firstName`] = 'First name is required';
      }
      if (!participant.lastName.trim()) {
        newErrors[`participant_${index}_lastName`] = 'Last name is required';
      }
      if (!participant.dateOfBirth) {
        newErrors[`participant_${index}_dateOfBirth`] = 'Date of birth is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBooking = () => {
    if (validateForm()) {
      onBookPackage(selectedDate, participants);
    }
  };

  // Generate available dates (next 6 months)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 7; i <= 180; i += 7) { // Weekly departures
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      });
    }
    
    return dates;
  };

  const availableDates = getAvailableDates();

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 sticky top-8">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Book This Package</h3>
        <div className="text-2xl font-bold text-brand-red">
          From {formatPrice(packageDetails.price.adult, packageDetails.price.currency)}
        </div>
        <p className="text-sm text-gray-600">per adult</p>
      </div>

      <div className="space-y-4">
        {/* Date Selection */}
        <div>
          <Select
            label="Select Travel Date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            options={[
              { value: '', label: 'Choose departure date' },
              ...availableDates
            ]}
            error={errors.selectedDate}
            required
          />
        </div>

        {/* Participants */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Participants</h4>
          <div className="space-y-4">
            {participants.map((participant, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-900">
                    {participant.type === 'adult' ? 'Adult' : 'Child'} {index + 1}
                  </h5>
                  {participants.length > 1 && (
                    <button
                      onClick={() => removeParticipant(index)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <Input
                    label="First Name"
                    type="text"
                    value={participant.firstName}
                    onChange={(e) => updateParticipant(index, 'firstName', e.target.value)}
                    error={errors[`participant_${index}_firstName`]}
                    required
                  />
                  <Input
                    label="Last Name"
                    type="text"
                    value={participant.lastName}
                    onChange={(e) => updateParticipant(index, 'lastName', e.target.value)}
                    error={errors[`participant_${index}_lastName`]}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <Input
                    label="Date of Birth"
                    type="date"
                    value={participant.dateOfBirth}
                    onChange={(e) => updateParticipant(index, 'dateOfBirth', e.target.value)}
                    error={errors[`participant_${index}_dateOfBirth`]}
                    required
                  />
                  <Select
                    label="Participant Type"
                    value={participant.type}
                    onChange={(e) => updateParticipant(index, 'type', e.target.value)}
                    options={[
                      { value: 'adult', label: 'Adult (12+ years)' },
                      { value: 'child', label: 'Child (2-11 years)' }
                    ]}
                  />
                </div>

                <Input
                  label="Passport Number (Optional)"
                  type="text"
                  value={participant.passportNumber || ''}
                  onChange={(e) => updateParticipant(index, 'passportNumber', e.target.value)}
                  placeholder="Enter passport number"
                />

                <Input
                  label="Dietary Requirements (Optional)"
                  type="text"
                  value={participant.dietaryRequirements || ''}
                  onChange={(e) => updateParticipant(index, 'dietaryRequirements', e.target.value)}
                  placeholder="Any dietary restrictions or preferences"
                />
              </div>
            ))}
          </div>

          {/* Add Participant Buttons */}
          <div className="flex space-x-2 mt-3">
            <button
              onClick={() => addParticipant('adult')}
              className="text-sm text-brand-red hover:text-red-700 font-medium"
            >
              + Add Adult
            </button>
            <button
              onClick={() => addParticipant('child')}
              className="text-sm text-brand-red hover:text-red-700 font-medium"
            >
              + Add Child
            </button>
          </div>
        </div>

        {/* Special Requests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Special Requests (Optional)
          </label>
          <textarea
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
            placeholder="Any special requests or requirements..."
          />
        </div>

        {/* Price Breakdown */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Price Breakdown</h4>
          <div className="space-y-2 text-sm">
            {participants.filter(p => p.type === 'adult').length > 0 && (
              <div className="flex justify-between">
                <span>Adults ({participants.filter(p => p.type === 'adult').length})</span>
                <span>
                  {formatPrice(
                    participants.filter(p => p.type === 'adult').length * packageDetails.price.adult,
                    packageDetails.price.currency
                  )}
                </span>
              </div>
            )}
            {participants.filter(p => p.type === 'child').length > 0 && (
              <div className="flex justify-between">
                <span>Children ({participants.filter(p => p.type === 'child').length})</span>
                <span>
                  {formatPrice(
                    participants.filter(p => p.type === 'child').length * packageDetails.price.child,
                    packageDetails.price.currency
                  )}
                </span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-2 font-semibold">
              <div className="flex justify-between">
                <span>Total</span>
                <span className="text-brand-red">
                  {formatPrice(calculateTotalPrice(), packageDetails.price.currency)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Book Button */}
        <Button
          onClick={handleBooking}
          className="w-full bg-brand-red hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Book Now - {formatPrice(calculateTotalPrice(), packageDetails.price.currency)}
        </Button>

        {/* Additional Info */}
        <div className="text-xs text-gray-600 space-y-1">
          <p>• Free cancellation up to 60 days before departure</p>
          <p>• Secure payment processing</p>
          <p>• 24/7 customer support</p>
          <p>• ATOL protected</p>
        </div>
      </div>
    </div>
  );
}