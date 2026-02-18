'use client';

import React, { useState } from 'react';
import { InsuredTraveler, TravelerInformationFormProps } from '@/types/travel-insurance';
import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { FormField } from '@/components/ui/FormField';
import { COMMON_CONDITIONS } from '@/lib/constants/travel-insurance';

export function TravelerInformationForm({
  travelers,
  onTravelerUpdate,
  onAddTraveler,
  onRemoveTraveler,
  onSubmit
}: TravelerInformationFormProps) {
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({});
  const [expandedTravelers, setExpandedTravelers] = useState<Record<string, boolean>>({});

  const validateTraveler = (traveler: InsuredTraveler, index: number) => {
    const travelerErrors: Record<string, string> = {};

    // Personal info validation
    if (!traveler.personalInfo.firstName.trim()) {
      travelerErrors.firstName = 'First name is required';
    }
    if (!traveler.personalInfo.lastName.trim()) {
      travelerErrors.lastName = 'Last name is required';
    }
    if (!traveler.personalInfo.email.trim()) {
      travelerErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(traveler.personalInfo.email)) {
      travelerErrors.email = 'Please enter a valid email';
    }
    if (!traveler.personalInfo.phoneNumber.trim()) {
      travelerErrors.phoneNumber = 'Phone number is required';
    }
    if (!traveler.personalInfo.dateOfBirth) {
      travelerErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const age = new Date().getFullYear() - new Date(traveler.personalInfo.dateOfBirth).getFullYear();
      if (age < 0 || age > 120) {
        travelerErrors.dateOfBirth = 'Please enter a valid date of birth';
      }
    }

    // Address validation
    if (!traveler.personalInfo.address.street.trim()) {
      travelerErrors.street = 'Street address is required';
    }
    if (!traveler.personalInfo.address.city.trim()) {
      travelerErrors.city = 'City is required';
    }
    if (!traveler.personalInfo.address.postalCode.trim()) {
      travelerErrors.postalCode = 'Postal code is required';
    }
    if (!traveler.personalInfo.address.country.trim()) {
      travelerErrors.country = 'Country is required';
    }

    // Beneficiary validation
    if (!traveler.beneficiary.name.trim()) {
      travelerErrors.beneficiaryName = 'Beneficiary name is required';
    }
    if (!traveler.beneficiary.relationship.trim()) {
      travelerErrors.beneficiaryRelationship = 'Relationship is required';
    }
    if (!traveler.beneficiary.phoneNumber.trim()) {
      travelerErrors.beneficiaryPhone = 'Beneficiary phone is required';
    }

    return travelerErrors;
  };

  const validateForm = () => {
    const newErrors: Record<string, Record<string, string>> = {};
    let hasErrors = false;

    travelers.forEach((traveler, index) => {
      const travelerErrors = validateTraveler(traveler, index);
      if (Object.keys(travelerErrors).length > 0) {
        newErrors[index] = travelerErrors;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    return !hasErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit();
    }
  };

  const updateTravelerField = (index: number, field: string, value: any) => {
    const updatedTraveler = { ...travelers[index] };
    
    // Handle nested field updates
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      if (parent === 'personalInfo') {
        if (child.includes('address.')) {
          const addressField = child.split('.')[1];
          updatedTraveler.personalInfo.address = {
            ...updatedTraveler.personalInfo.address,
            [addressField]: value
          };
        } else {
          updatedTraveler.personalInfo = {
            ...updatedTraveler.personalInfo,
            [child]: value
          };
        }
      } else if (parent === 'beneficiary') {
        if (child.includes('address.')) {
          const addressField = child.split('.')[1];
          updatedTraveler.beneficiary.address = {
            ...updatedTraveler.beneficiary.address,
            [addressField]: value
          };
        } else {
          updatedTraveler.beneficiary = {
            ...updatedTraveler.beneficiary,
            [child]: value
          };
        }
      } else if (parent === 'medicalInfo') {
        updatedTraveler.medicalInfo = {
          hasPreExistingConditions: false,
          ...updatedTraveler.medicalInfo,
          [child]: value
        };
      }
    }

    onTravelerUpdate(index, updatedTraveler);

    // Clear errors for this field
    if (errors[index] && errors[index][field]) {
      setErrors(prev => ({
        ...prev,
        [index]: {
          ...prev[index],
          [field]: ''
        }
      }));
    }
  };

  const toggleTravelerExpansion = (index: number) => {
    setExpandedTravelers(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getAge = (dateOfBirth: Date) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ];

  const countryOptions = [
    { value: '', label: 'Select country' },
    { value: 'US', label: 'United States' },
    { value: 'CA', label: 'Canada' },
    { value: 'GB', label: 'United Kingdom' },
    { value: 'AU', label: 'Australia' },
    { value: 'DE', label: 'Germany' },
    { value: 'FR', label: 'France' },
    { value: 'IT', label: 'Italy' },
    { value: 'ES', label: 'Spain' },
    { value: 'JP', label: 'Japan' },
    { value: 'other', label: 'Other' }
  ];

  const relationshipOptions = [
    { value: '', label: 'Select relationship' },
    { value: 'spouse', label: 'Spouse' },
    { value: 'parent', label: 'Parent' },
    { value: 'child', label: 'Child' },
    { value: 'sibling', label: 'Sibling' },
    { value: 'partner', label: 'Partner' },
    { value: 'friend', label: 'Friend' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="traveler-information-form">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Traveler Information</h2>
        <p className="text-gray-600 text-sm">
          Provide details for all travelers who will be covered by this policy.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {travelers.map((traveler, index) => {
          const travelerErrors = errors[index] || {};
          const isExpanded = expandedTravelers[index] ?? (index === 0);
          const age = traveler.personalInfo.dateOfBirth ? getAge(traveler.personalInfo.dateOfBirth) : null;

          return (
            <div key={traveler.id} className="border border-gray-200 rounded-lg bg-white">
              {/* Traveler Header - Mobile optimized */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => toggleTravelerExpansion(index)}
                      className="md:hidden flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200"
                    >
                      {isExpanded ? '−' : '+'}
                    </button>
                    <div>
                      <h3 className="font-medium">
                        Traveler {index + 1}
                        {traveler.personalInfo.firstName && traveler.personalInfo.lastName && (
                          <span className="text-gray-600 ml-2">
                            ({traveler.personalInfo.firstName} {traveler.personalInfo.lastName})
                          </span>
                        )}
                      </h3>
                      {age && (
                        <p className="text-sm text-gray-500">Age: {age}</p>
                      )}
                    </div>
                  </div>
                  
                  {travelers.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onRemoveTraveler(index)}
                      className="text-red-600 hover:text-red-700 hover:border-red-300"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>

              {/* Traveler Details - Collapsible on mobile */}
              <div className={`p-4 space-y-6 ${isExpanded ? 'block' : 'hidden md:block'}`}>
                {/* Personal Information */}
                <div>
                  <h4 className="font-medium mb-4 text-gray-800">Personal Information</h4>
                  
                  <div className="space-y-4">
                    {/* Name fields - Mobile optimized */}
                    <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
                      <FormField error={travelerErrors.firstName} required>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <TextInput
                          value={traveler.personalInfo.firstName}
                          onChange={(e) => updateTravelerField(index, 'personalInfo.firstName', e.target.value)}
                          placeholder="Enter first name"
                          error={travelerErrors.firstName}
                          className="w-full"
                        />
                        {travelerErrors.firstName && (
                          <p className="mt-1 text-sm text-red-600">{travelerErrors.firstName}</p>
                        )}
                      </FormField>

                      <FormField error={travelerErrors.lastName} required>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <TextInput
                          value={traveler.personalInfo.lastName}
                          onChange={(e) => updateTravelerField(index, 'personalInfo.lastName', e.target.value)}
                          placeholder="Enter last name"
                          error={travelerErrors.lastName}
                          className="w-full"
                        />
                        {travelerErrors.lastName && (
                          <p className="mt-1 text-sm text-red-600">{travelerErrors.lastName}</p>
                        )}
                      </FormField>
                    </div>

                    {/* Date of birth and gender */}
                    <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
                      <FormField error={travelerErrors.dateOfBirth} required>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date of Birth
                        </label>
                        <TextInput
                          type="date"
                          value={traveler.personalInfo.dateOfBirth ? formatDateForInput(traveler.personalInfo.dateOfBirth) : ''}
                          onChange={(e) => updateTravelerField(index, 'personalInfo.dateOfBirth', new Date(e.target.value))}
                          error={travelerErrors.dateOfBirth}
                          className="w-full"
                          max={new Date().toISOString().split('T')[0]}
                        />
                        {travelerErrors.dateOfBirth && (
                          <p className="mt-1 text-sm text-red-600">{travelerErrors.dateOfBirth}</p>
                        )}
                      </FormField>

                      <FormField required>
                        <Select
                          label="Gender"
                          value={traveler.personalInfo.gender}
                          onChange={(e) => updateTravelerField(index, 'personalInfo.gender', e.target.value)}
                          options={genderOptions}
                        />
                      </FormField>
                    </div>

                    {/* Contact information */}
                    <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
                      <FormField error={travelerErrors.email} required>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <TextInput
                          type="email"
                          value={traveler.personalInfo.email}
                          onChange={(e) => updateTravelerField(index, 'personalInfo.email', e.target.value)}
                          placeholder="Enter email address"
                          error={travelerErrors.email}
                          className="w-full"
                        />
                        {travelerErrors.email && (
                          <p className="mt-1 text-sm text-red-600">{travelerErrors.email}</p>
                        )}
                      </FormField>

                      <FormField error={travelerErrors.phoneNumber} required>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <TextInput
                          type="tel"
                          value={traveler.personalInfo.phoneNumber}
                          onChange={(e) => updateTravelerField(index, 'personalInfo.phoneNumber', e.target.value)}
                          placeholder="Enter phone number"
                          error={travelerErrors.phoneNumber}
                          className="w-full"
                        />
                        {travelerErrors.phoneNumber && (
                          <p className="mt-1 text-sm text-red-600">{travelerErrors.phoneNumber}</p>
                        )}
                      </FormField>
                    </div>

                    {/* Address */}
                    <FormField error={travelerErrors.street} required>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address
                      </label>
                      <TextInput
                        value={traveler.personalInfo.address.street}
                        onChange={(e) => updateTravelerField(index, 'personalInfo.address.street', e.target.value)}
                        placeholder="Enter street address"
                        error={travelerErrors.street}
                        className="w-full"
                      />
                      {travelerErrors.street && (
                        <p className="mt-1 text-sm text-red-600">{travelerErrors.street}</p>
                      )}
                    </FormField>

                    <div className="space-y-4 md:grid md:grid-cols-3 md:gap-4 md:space-y-0">
                      <FormField error={travelerErrors.city} required>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <TextInput
                          value={traveler.personalInfo.address.city}
                          onChange={(e) => updateTravelerField(index, 'personalInfo.address.city', e.target.value)}
                          placeholder="Enter city"
                          error={travelerErrors.city}
                          className="w-full"
                        />
                        {travelerErrors.city && (
                          <p className="mt-1 text-sm text-red-600">{travelerErrors.city}</p>
                        )}
                      </FormField>

                      <FormField>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State/Province
                        </label>
                        <TextInput
                          value={traveler.personalInfo.address.state}
                          onChange={(e) => updateTravelerField(index, 'personalInfo.address.state', e.target.value)}
                          placeholder="Enter state/province"
                          className="w-full"
                        />
                      </FormField>

                      <FormField error={travelerErrors.postalCode} required>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Postal Code
                        </label>
                        <TextInput
                          value={traveler.personalInfo.address.postalCode}
                          onChange={(e) => updateTravelerField(index, 'personalInfo.address.postalCode', e.target.value)}
                          placeholder="Enter postal code"
                          error={travelerErrors.postalCode}
                          className="w-full"
                        />
                        {travelerErrors.postalCode && (
                          <p className="mt-1 text-sm text-red-600">{travelerErrors.postalCode}</p>
                        )}
                      </FormField>
                    </div>

                    <FormField error={travelerErrors.country} required>
                      <Select
                        label="Country"
                        value={traveler.personalInfo.address.country}
                        onChange={(e) => updateTravelerField(index, 'personalInfo.address.country', e.target.value)}
                        error={travelerErrors.country}
                        options={countryOptions}
                      />
                    </FormField>
                  </div>
                </div>

                {/* Medical Information */}
                <div>
                  <h4 className="font-medium mb-4 text-gray-800">Medical Information (Optional)</h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        checked={traveler.medicalInfo?.hasPreExistingConditions || false}
                        onChange={(e) => updateTravelerField(index, 'medicalInfo.hasPreExistingConditions', e.target.checked)}
                        className="mt-1"
                      />
                      <div>
                        <label className="text-sm font-medium">
                          I have pre-existing medical conditions
                        </label>
                        <p className="text-xs text-gray-600 mt-1">
                          Declaring conditions may affect coverage and premium
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Beneficiary Information */}
                <div>
                  <h4 className="font-medium mb-4 text-gray-800">Emergency Beneficiary</h4>
                  
                  <div className="space-y-4">
                    <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
                      <FormField error={travelerErrors.beneficiaryName} required>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Beneficiary Name
                        </label>
                        <TextInput
                          value={traveler.beneficiary.name}
                          onChange={(e) => updateTravelerField(index, 'beneficiary.name', e.target.value)}
                          placeholder="Enter beneficiary name"
                          error={travelerErrors.beneficiaryName}
                          className="w-full"
                        />
                        {travelerErrors.beneficiaryName && (
                          <p className="mt-1 text-sm text-red-600">{travelerErrors.beneficiaryName}</p>
                        )}
                      </FormField>

                      <FormField error={travelerErrors.beneficiaryRelationship} required>
                        <Select
                          label="Relationship"
                          value={traveler.beneficiary.relationship}
                          onChange={(e) => updateTravelerField(index, 'beneficiary.relationship', e.target.value)}
                          error={travelerErrors.beneficiaryRelationship}
                          options={relationshipOptions}
                          />
                      </FormField>
                    </div>

                    <FormField error={travelerErrors.beneficiaryPhone} required>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Beneficiary Phone
                      </label>
                      <TextInput
                        type="tel"
                        value={traveler.beneficiary.phoneNumber}
                        onChange={(e) => updateTravelerField(index, 'beneficiary.phoneNumber', e.target.value)}
                        placeholder="Enter beneficiary phone number"
                        error={travelerErrors.beneficiaryPhone}
                        className="w-full"
                      />
                      {travelerErrors.beneficiaryPhone && (
                        <p className="mt-1 text-sm text-red-600">{travelerErrors.beneficiaryPhone}</p>
                      )}
                    </FormField>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Add Traveler Button */}
        <div className="text-center">
          <Button
            type="button"
            variant="outline"
            onClick={onAddTraveler}
            className="w-full md:w-auto"
          >
            + Add Another Traveler
          </Button>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            className="w-full touch-target md:w-auto md:px-8"
            size="lg"
          >
            Continue to Review
          </Button>
        </div>
      </form>

      {/* Mobile help section */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg md:hidden">
        <h4 className="font-medium text-blue-800 mb-2">Information Tips</h4>
        <div className="space-y-2 text-sm text-blue-700">
          <p>• Use legal names as they appear on passports</p>
          <p>• Beneficiary should be someone who can be contacted in emergencies</p>
          <p>• Medical conditions affect coverage - declare for proper protection</p>
        </div>
      </div>
    </div>
  );
}