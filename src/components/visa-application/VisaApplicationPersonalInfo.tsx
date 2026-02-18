'use client';

import React, { useState } from 'react';
import { PersonalInfo } from '@/types/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface VisaApplicationPersonalInfoProps {
  data?: Partial<PersonalInfo>;
  onComplete: (data: { personalInfo: PersonalInfo }) => void;
  onBack: () => void;
}

export const VisaApplicationPersonalInfo: React.FC<VisaApplicationPersonalInfoProps> = ({
  data = {},
  onComplete,
  onBack
}) => {
  const [formData, setFormData] = useState<PersonalInfo>({
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    dateOfBirth: data.dateOfBirth || '',
    placeOfBirth: data.placeOfBirth || '',
    nationality: data.nationality || '',
    passportNumber: data.passportNumber || '',
    passportExpiryDate: data.passportExpiryDate || '',
    email: data.email || '',
    phoneNumber: data.phoneNumber || '',
    address: {
      street: data.address?.street || '',
      city: data.address?.city || '',
      state: data.address?.state || '',
      postalCode: data.address?.postalCode || '',
      country: data.address?.country || ''
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({ personalInfo: formData });
  };

  const handleInputChange = (field: keyof PersonalInfo) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleAddressChange = (field: keyof PersonalInfo['address']) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: e.target.value
      }
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            value={formData.firstName}
            onChange={handleInputChange('firstName')}
            required
          />
          <Input
            label="Last Name"
            value={formData.lastName}
            onChange={handleInputChange('lastName')}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Date of Birth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleInputChange('dateOfBirth')}
            required
          />
          <Input
            label="Place of Birth"
            value={formData.placeOfBirth}
            onChange={handleInputChange('placeOfBirth')}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nationality"
            value={formData.nationality}
            onChange={handleInputChange('nationality')}
            required
          />
          <Input
            label="Passport Number"
            value={formData.passportNumber}
            onChange={handleInputChange('passportNumber')}
            required
          />
        </div>

        <Input
          label="Passport Expiry Date"
          type="date"
          value={formData.passportExpiryDate}
          onChange={handleInputChange('passportExpiryDate')}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleInputChange('email')}
            required
          />
          <Input
            label="Phone Number"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleInputChange('phoneNumber')}
            required
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Address</h3>
          
          <Input
            label="Street Address"
            value={formData.address.street}
            onChange={handleAddressChange('street')}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="City"
              value={formData.address.city}
              onChange={handleAddressChange('city')}
              required
            />
            <Input
              label="State/Province"
              value={formData.address.state}
              onChange={handleAddressChange('state')}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Postal Code"
              value={formData.address.postalCode}
              onChange={handleAddressChange('postalCode')}
              required
            />
            <Input
              label="Country"
              value={formData.address.country}
              onChange={handleAddressChange('country')}
              required
            />
          </div>
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