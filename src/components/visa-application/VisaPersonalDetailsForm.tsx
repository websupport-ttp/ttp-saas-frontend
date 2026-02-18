'use client';

import { useState } from 'react';
import { VisaTraveler, PersonalInformation, VisaPersonalDetailsFormProps } from '@/types/visa-application';
import { TextInput } from '@/components/ui/TextInput';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { FormField, FormGroup, FormActions } from '@/components/ui/FormField';
import { 
  GENDER_OPTIONS, 
  MARITAL_STATUS_OPTIONS, 
  COMMON_NATIONALITIES,
  RELATIONSHIP_TYPES 
} from '@/lib/constants/visa-application';
import { validateEmail, cn } from '@/lib/utils';

interface FormErrors {
  [key: string]: {
    [field: string]: string;
  };
}

export function VisaPersonalDetailsForm({
  travelers,
  onTravelerUpdate,
  onAddTraveler,
  onRemoveTraveler,
  onSubmit
}: VisaPersonalDetailsFormProps) {
  const [errors, setErrors] = useState<FormErrors>({});

  // Create a new empty traveler
  const createNewTraveler = (): VisaTraveler => ({
    id: `traveler-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    personalInfo: {
      firstName: '',
      middleName: '',
      lastName: '',
      dateOfBirth: new Date(),
      placeOfBirth: '',
      nationality: '',
      gender: 'male',
      maritalStatus: 'single',
      email: '',
      phoneNumber: '',
      address: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: ''
      }
    },
    passportInfo: {
      passportNumber: '',
      nationality: '',
      issueDate: new Date(),
      expirationDate: new Date(),
      issuingCountry: '',
      placeOfIssue: ''
    },
    additionalInfo: {
      hasAssets: false,
      hasTravelHistory: false,
      employmentStatus: 'employed',
      monthlyIncome: '',
      previousApplications: 'none',
      purposeOfTravel: '',
      emergencyContact: {
        name: '',
        relationship: '',
        phoneNumber: '',
        address: ''
      }
    }
  });

  // Validate a single traveler's personal information
  const validateTraveler = (traveler: VisaTraveler, index: number): { [field: string]: string } => {
    const errors: { [field: string]: string } = {};
    const { personalInfo } = traveler;

    // Required field validation
    if (!personalInfo.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!personalInfo.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!personalInfo.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(personalInfo.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!personalInfo.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    }

    if (!personalInfo.placeOfBirth.trim()) {
      errors.placeOfBirth = 'Place of birth is required';
    }

    if (!personalInfo.nationality) {
      errors.nationality = 'Nationality is required';
    }

    // Address validation
    if (!personalInfo.address.street.trim()) {
      errors['address.street'] = 'Street address is required';
    }

    if (!personalInfo.address.city.trim()) {
      errors['address.city'] = 'City is required';
    }

    if (!personalInfo.address.state.trim()) {
      errors['address.state'] = 'State/Province is required';
    }

    if (!personalInfo.address.postalCode.trim()) {
      errors['address.postalCode'] = 'Postal code is required';
    }

    if (!personalInfo.address.country.trim()) {
      errors['address.country'] = 'Country is required';
    }

    // Date of birth validation (must be at least 18 years old)
    const today = new Date();
    const birthDate = new Date(personalInfo.dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      const adjustedAge = age - 1;
      if (adjustedAge < 18) {
        errors.dateOfBirth = 'Applicant must be at least 18 years old';
      }
    } else if (age < 18) {
      errors.dateOfBirth = 'Applicant must be at least 18 years old';
    }

    return errors;
  };

  // Validate all travelers
  const validateAllTravelers = (): boolean => {
    const newErrors: FormErrors = {};
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

  // Handle input changes for a specific traveler
  const handleInputChange = (
    index: number,
    field: keyof PersonalInformation | string,
    value: string | Date
  ) => {
    const updatedTraveler = { ...travelers[index] };
    
    if (field.includes('.')) {
      // Handle nested fields like address.street
      const [parent, child] = field.split('.');
      if (parent === 'address') {
        updatedTraveler.personalInfo.address = {
          ...updatedTraveler.personalInfo.address,
          [child]: value
        };
      }
    } else {
      // Handle direct fields
      updatedTraveler.personalInfo = {
        ...updatedTraveler.personalInfo,
        [field]: value
      };
    }

    onTravelerUpdate(index, updatedTraveler);

    // Clear errors for this field
    if (errors[index] && errors[index][field]) {
      const newErrors = { ...errors };
      delete newErrors[index][field];
      if (Object.keys(newErrors[index]).length === 0) {
        delete newErrors[index];
      }
      setErrors(newErrors);
    }
  };

  // Handle adding a new traveler
  const handleAddTraveler = () => {
    onAddTraveler();
  };

  // Handle removing a traveler
  const handleRemoveTraveler = (index: number) => {
    onRemoveTraveler(index);
    
    // Remove errors for this traveler
    const newErrors = { ...errors };
    delete newErrors[index];
    
    // Reindex remaining errors
    const reindexedErrors: FormErrors = {};
    Object.keys(newErrors).forEach(key => {
      const keyIndex = parseInt(key);
      if (keyIndex > index) {
        reindexedErrors[keyIndex - 1] = newErrors[keyIndex];
      } else {
        reindexedErrors[keyIndex] = newErrors[keyIndex];
      }
    });
    
    setErrors(reindexedErrors);
  };

  // Handle form submission
  const handleSubmit = () => {
    if (travelers.length === 0) {
      // Add first traveler if none exist
      handleAddTraveler();
      return;
    }

    if (validateAllTravelers()) {
      onSubmit();
    }
  };

  // Gender options for select
  const genderOptions = [
    { value: GENDER_OPTIONS.MALE, label: 'Male' },
    { value: GENDER_OPTIONS.FEMALE, label: 'Female' },
    { value: GENDER_OPTIONS.OTHER, label: 'Other' }
  ];

  // Marital status options for select
  const maritalStatusOptions = [
    { value: MARITAL_STATUS_OPTIONS.SINGLE, label: 'Single' },
    { value: MARITAL_STATUS_OPTIONS.MARRIED, label: 'Married' },
    { value: MARITAL_STATUS_OPTIONS.DIVORCED, label: 'Divorced' },
    { value: MARITAL_STATUS_OPTIONS.WIDOWED, label: 'Widowed' }
  ];

  // Nationality options for select
  const nationalityOptions = COMMON_NATIONALITIES.map(nationality => ({
    value: nationality.code,
    label: nationality.name
  }));

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Personal Details</h2>
        <p className="mt-2 text-gray-600">
          Please provide personal information for all travelers. Information must match passport details exactly.
        </p>
      </div>

      {travelers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No travelers added yet</p>
          <Button onClick={handleAddTraveler}>
            Add First Traveler
          </Button>
        </div>
      )}

      {travelers.map((traveler, index) => (
        <FormGroup
          key={traveler.id}
          title={`Traveler ${index + 1}`}
          description="All information must match your passport exactly"
          className="border border-gray-200 rounded-lg p-6"
        >
          {/* Remove traveler button (only show if more than 1 traveler) */}
          {travelers.length > 1 && (
            <div className="flex justify-end mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRemoveTraveler(index)}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                Remove Traveler
              </Button>
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField error={errors[index]?.firstName}>
              <TextInput
                label="First Name"
                value={traveler.personalInfo.firstName}
                onChange={(e) => handleInputChange(index, 'firstName', e.target.value)}
                error={errors[index]?.firstName}
                required
                />
            </FormField>

            <FormField error={errors[index]?.middleName}>
              <TextInput
                label="Middle Name (Optional)"
                value={traveler.personalInfo.middleName || ''}
                onChange={(e) => handleInputChange(index, 'middleName', e.target.value)}
                />
            </FormField>

            <FormField error={errors[index]?.lastName}>
              <TextInput
                label="Last Name"
                value={traveler.personalInfo.lastName}
                onChange={(e) => handleInputChange(index, 'lastName', e.target.value)}
                error={errors[index]?.lastName}
                required
                />
            </FormField>
          </div>

          {/* Date of Birth and Personal Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField error={errors[index]?.dateOfBirth}>
              <div className="relative">
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={traveler.personalInfo.dateOfBirth.toISOString().split('T')[0]}
                  onChange={(e) => handleInputChange(index, 'dateOfBirth', new Date(e.target.value))}
                  className={cn(
                    'block w-full px-3 py-3 text-gray-900 placeholder-gray-500 border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0',
                    'bg-white border-gray-300 rounded-lg focus:border-brand-red focus:ring-brand-red',
                    'text-base sm:text-sm', // Larger text on mobile for better touch interaction
                    errors[index]?.dateOfBirth && 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  )}
                  style={{
                    // Improve mobile date picker appearance
                    WebkitAppearance: 'none',
                    MozAppearance: 'textfield'
                  }}
                />
                {errors[index]?.dateOfBirth && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors[index]?.dateOfBirth}
                  </p>
                )}
              </div>
            </FormField>

            <FormField error={errors[index]?.placeOfBirth}>
              <TextInput
                label="Place of Birth"
                value={traveler.personalInfo.placeOfBirth}
                onChange={(e) => handleInputChange(index, 'placeOfBirth', e.target.value)}
                error={errors[index]?.placeOfBirth}
                required
                />
            </FormField>

            <FormField error={errors[index]?.nationality}>
              <Select
                label="Nationality"
                value={traveler.personalInfo.nationality}
                onChange={(e) => handleInputChange(index, 'nationality', e.target.value)}
                options={nationalityOptions}
                placeholder="Select nationality"
                error={errors[index]?.nationality}
                required
                />
            </FormField>
          </div>

          {/* Gender and Marital Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField>
              <Select
                label="Gender"
                value={traveler.personalInfo.gender}
                onChange={(e) => handleInputChange(index, 'gender', e.target.value)}
                options={genderOptions}
                required
                />
            </FormField>

            <FormField>
              <Select
                label="Marital Status"
                value={traveler.personalInfo.maritalStatus}
                onChange={(e) => handleInputChange(index, 'maritalStatus', e.target.value)}
                options={maritalStatusOptions}
                required
                />
            </FormField>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField error={errors[index]?.email}>
              <TextInput
                label="Email Address"
                type="email"
                value={traveler.personalInfo.email}
                onChange={(e) => handleInputChange(index, 'email', e.target.value)}
                error={errors[index]?.email}
                required
                />
            </FormField>

            <FormField error={errors[index]?.phoneNumber}>
              <TextInput
                label="Phone Number"
                type="tel"
                value={traveler.personalInfo.phoneNumber}
                onChange={(e) => handleInputChange(index, 'phoneNumber', e.target.value)}
                error={errors[index]?.phoneNumber}
                required
                />
            </FormField>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900">Address Information</h4>
            
            <FormField error={errors[index]?.['address.street']}>
              <TextInput
                label="Street Address"
                value={traveler.personalInfo.address.street}
                onChange={(e) => handleInputChange(index, 'address.street', e.target.value)}
                error={errors[index]?.['address.street']}
                required
                />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <FormField error={errors[index]?.['address.city']}>
                <TextInput
                  label="City"
                  value={traveler.personalInfo.address.city}
                  onChange={(e) => handleInputChange(index, 'address.city', e.target.value)}
                  error={errors[index]?.['address.city']}
                  required
                  />
              </FormField>

              <FormField error={errors[index]?.['address.state']}>
                <TextInput
                  label="State/Province"
                  value={traveler.personalInfo.address.state}
                  onChange={(e) => handleInputChange(index, 'address.state', e.target.value)}
                  error={errors[index]?.['address.state']}
                  required
                  />
              </FormField>

              <FormField error={errors[index]?.['address.postalCode']}>
                <TextInput
                  label="Postal Code"
                  value={traveler.personalInfo.address.postalCode}
                  onChange={(e) => handleInputChange(index, 'address.postalCode', e.target.value)}
                  error={errors[index]?.['address.postalCode']}
                  required
                  />
              </FormField>

              <FormField error={errors[index]?.['address.country']}>
                <TextInput
                  label="Country"
                  value={traveler.personalInfo.address.country}
                  onChange={(e) => handleInputChange(index, 'address.country', e.target.value)}
                  error={errors[index]?.['address.country']}
                  required
                  />
              </FormField>
            </div>
          </div>
        </FormGroup>
      ))}

      {/* Add Another Traveler Button */}
      {travelers.length > 0 && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={handleAddTraveler}
            className="border-brand-red text-brand-red hover:bg-brand-red hover:text-white"
          >
            Add Another Traveler
          </Button>
        </div>
      )}

      {/* Form Actions */}
      <FormActions align="between">
        <Button variant="outline">
          Back
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={travelers.length === 0}
        >
          Continue to Passport Information
        </Button>
      </FormActions>
    </div>
  );
}