'use client';

import { useState } from 'react';
import { VisaTraveler, VisaPassportFormProps, PassportInformation, AdditionalInformation } from '@/types/visa-application';
import { TextInput } from '@/components/ui/TextInput';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { FormField, FormGroup, FormActions } from '@/components/ui/FormField';
import { 
  EMPLOYMENT_STATUS_OPTIONS, 
  PREVIOUS_APPLICATION_STATUS,
  COMMON_NATIONALITIES,
  RELATIONSHIP_TYPES 
} from '@/lib/constants/visa-application';
import { cn } from '@/lib/utils';

interface FormErrors {
  passport?: { [field: string]: string };
  additional?: { [field: string]: string };
}

export function VisaPassportForm({
  traveler,
  onTravelerUpdate,
  onSubmit
}: VisaPassportFormProps) {
  const [errors, setErrors] = useState<FormErrors>({});

  // Validate passport information
  const validatePassportInfo = (passportInfo: PassportInformation): { [field: string]: string } => {
    const errors: { [field: string]: string } = {};

    // Required field validation
    if (!passportInfo.passportNumber.trim()) {
      errors.passportNumber = 'Passport number is required';
    }

    if (!passportInfo.nationality) {
      errors.nationality = 'Nationality is required';
    }

    if (!passportInfo.issuingCountry) {
      errors.issuingCountry = 'Issuing country is required';
    }

    if (!passportInfo.placeOfIssue.trim()) {
      errors.placeOfIssue = 'Place of issue is required';
    }

    // Date validation
    const today = new Date();
    const issueDate = new Date(passportInfo.issueDate);
    const expirationDate = new Date(passportInfo.expirationDate);

    if (issueDate > today) {
      errors.issueDate = 'Issue date cannot be in the future';
    }

    if (expirationDate <= today) {
      errors.expirationDate = 'Passport must be valid for at least 6 months';
    }

    if (issueDate >= expirationDate) {
      errors.expirationDate = 'Expiration date must be after issue date';
    }

    // Passport validity check (must be valid for at least 6 months from today)
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
    
    if (expirationDate < sixMonthsFromNow) {
      errors.expirationDate = 'Passport must be valid for at least 6 months from today';
    }

    return errors;
  };

  // Validate additional information
  const validateAdditionalInfo = (additionalInfo: AdditionalInformation): { [field: string]: string } => {
    const errors: { [field: string]: string } = {};

    // Required field validation
    if (!additionalInfo.monthlyIncome.trim()) {
      errors.monthlyIncome = 'Monthly income is required';
    }

    if (!additionalInfo.purposeOfTravel.trim()) {
      errors.purposeOfTravel = 'Purpose of travel is required';
    }

    // Emergency contact validation
    if (!additionalInfo.emergencyContact.name.trim()) {
      errors['emergencyContact.name'] = 'Emergency contact name is required';
    }

    if (!additionalInfo.emergencyContact.relationship.trim()) {
      errors['emergencyContact.relationship'] = 'Relationship is required';
    }

    if (!additionalInfo.emergencyContact.phoneNumber.trim()) {
      errors['emergencyContact.phoneNumber'] = 'Emergency contact phone is required';
    }

    if (!additionalInfo.emergencyContact.address.trim()) {
      errors['emergencyContact.address'] = 'Emergency contact address is required';
    }

    // Conditional validation
    if (additionalInfo.hasAssets && !additionalInfo.assetDetails?.trim()) {
      errors.assetDetails = 'Please provide details about your assets';
    }

    if (additionalInfo.hasTravelHistory && !additionalInfo.travelHistoryDetails?.trim()) {
      errors.travelHistoryDetails = 'Please provide details about your travel history';
    }

    if (additionalInfo.employmentStatus === 'employed' && !additionalInfo.employerDetails?.name.trim()) {
      errors['employerDetails.name'] = 'Employer name is required';
    }

    if (additionalInfo.employmentStatus === 'employed' && !additionalInfo.employerDetails?.address.trim()) {
      errors['employerDetails.address'] = 'Employer address is required';
    }

    if (additionalInfo.employmentStatus === 'employed' && !additionalInfo.employerDetails?.position.trim()) {
      errors['employerDetails.position'] = 'Job position is required';
    }

    if ((additionalInfo.previousApplications === 'denied_recent' || additionalInfo.previousApplications === 'denied_old') 
        && !additionalInfo.previousApplicationDetails?.trim()) {
      errors.previousApplicationDetails = 'Please provide details about your previous application';
    }

    return errors;
  };

  // Validate all form data
  const validateForm = (): boolean => {
    const passportErrors = validatePassportInfo(traveler.passportInfo);
    const additionalErrors = validateAdditionalInfo(traveler.additionalInfo);

    const newErrors: FormErrors = {};
    
    if (Object.keys(passportErrors).length > 0) {
      newErrors.passport = passportErrors;
    }
    
    if (Object.keys(additionalErrors).length > 0) {
      newErrors.additional = additionalErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle passport information changes
  const handlePassportChange = (field: keyof PassportInformation, value: string | Date) => {
    const updatedTraveler = {
      ...traveler,
      passportInfo: {
        ...traveler.passportInfo,
        [field]: value
      }
    };

    onTravelerUpdate(updatedTraveler);

    // Clear errors for this field
    if (errors.passport && errors.passport[field]) {
      const newErrors = { ...errors };
      delete newErrors.passport![field];
      if (Object.keys(newErrors.passport!).length === 0) {
        delete newErrors.passport;
      }
      setErrors(newErrors);
    }
  };

  // Handle additional information changes
  const handleAdditionalChange = (field: string, value: string | boolean) => {
    const updatedTraveler = { ...traveler };
    
    if (field.includes('.')) {
      // Handle nested fields
      const [parent, child] = field.split('.');
      if (parent === 'emergencyContact') {
        updatedTraveler.additionalInfo.emergencyContact = {
          ...updatedTraveler.additionalInfo.emergencyContact,
          [child]: value
        };
      } else if (parent === 'employerDetails') {
        updatedTraveler.additionalInfo.employerDetails = {
          ...updatedTraveler.additionalInfo.employerDetails!,
          [child]: value
        };
      }
    } else {
      // Handle direct fields
      updatedTraveler.additionalInfo = {
        ...updatedTraveler.additionalInfo,
        [field]: value
      };
    }

    // Initialize employer details if employment status is employed
    if (field === 'employmentStatus' && value === 'employed' && !updatedTraveler.additionalInfo.employerDetails) {
      updatedTraveler.additionalInfo.employerDetails = {
        name: '',
        address: '',
        position: ''
      };
    }

    onTravelerUpdate(updatedTraveler);

    // Clear errors for this field
    if (errors.additional && errors.additional[field]) {
      const newErrors = { ...errors };
      delete newErrors.additional![field];
      if (Object.keys(newErrors.additional!).length === 0) {
        delete newErrors.additional;
      }
      setErrors(newErrors);
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit();
    }
  };

  // Options for selects
  const nationalityOptions = COMMON_NATIONALITIES.map(nationality => ({
    value: nationality.code,
    label: nationality.name
  }));

  const employmentStatusOptions = [
    { value: EMPLOYMENT_STATUS_OPTIONS.EMPLOYED, label: 'Employed' },
    { value: EMPLOYMENT_STATUS_OPTIONS.UNEMPLOYED, label: 'Unemployed' },
    { value: EMPLOYMENT_STATUS_OPTIONS.STUDENT, label: 'Student' },
    { value: EMPLOYMENT_STATUS_OPTIONS.RETIRED, label: 'Retired' },
    { value: EMPLOYMENT_STATUS_OPTIONS.SELF_EMPLOYED, label: 'Self-Employed' }
  ];

  const previousApplicationOptions = [
    { value: PREVIOUS_APPLICATION_STATUS.NONE, label: 'No previous applications' },
    { value: PREVIOUS_APPLICATION_STATUS.APPROVED, label: 'Previously approved' },
    { value: PREVIOUS_APPLICATION_STATUS.DENIED_RECENT, label: 'Denied within last 2 years' },
    { value: PREVIOUS_APPLICATION_STATUS.DENIED_OLD, label: 'Denied more than 2 years ago' }
  ];

  const relationshipOptions = RELATIONSHIP_TYPES.map(type => ({
    value: type,
    label: type
  }));

  const monthlyIncomeOptions = [
    { value: 'under-1000', label: 'Under $1,000' },
    { value: '1000-2500', label: '$1,000 - $2,500' },
    { value: '2500-5000', label: '$2,500 - $5,000' },
    { value: '5000-10000', label: '$5,000 - $10,000' },
    { value: '10000-25000', label: '$10,000 - $25,000' },
    { value: 'over-25000', label: 'Over $25,000' }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Passport Information</h2>
        <p className="mt-2 text-gray-600">
          Please provide your passport details and additional information required for visa processing.
        </p>
      </div>

      {/* Passport Information Section */}
      <FormGroup
        title="Passport Details"
        description="Enter your passport information exactly as it appears on your passport"
        className="border border-gray-200 rounded-lg p-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField error={errors.passport?.passportNumber}>
            <TextInput
              label="Passport Number"
              value={traveler.passportInfo.passportNumber}
              onChange={(e) => handlePassportChange('passportNumber', e.target.value)}
              error={errors.passport?.passportNumber}
              required
              placeholder="Enter passport number"
            />
          </FormField>

          <FormField error={errors.passport?.nationality}>
            <Select
              label="Passport Nationality"
              value={traveler.passportInfo.nationality}
              onChange={(e) => handlePassportChange('nationality', e.target.value)}
              options={nationalityOptions}
              placeholder="Select nationality"
              error={errors.passport?.nationality}
              required
              />
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField error={errors.passport?.issueDate}>
            <div className="relative">
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Issue Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={traveler.passportInfo.issueDate.toISOString().split('T')[0]}
                onChange={(e) => handlePassportChange('issueDate', new Date(e.target.value))}
                className={cn(
                  'block w-full px-3 py-3 text-gray-900 placeholder-gray-500 border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0',
                  'bg-white border-gray-300 rounded-lg focus:border-brand-red focus:ring-brand-red',
                  'text-base sm:text-sm', // Larger text on mobile for better touch interaction
                  'min-h-[44px]', // Minimum touch target size for mobile
                  errors.passport?.issueDate && 'border-red-500 focus:border-red-500 focus:ring-red-500'
                )}
                style={{
                  // Improve mobile date picker appearance
                  WebkitAppearance: 'none',
                  MozAppearance: 'textfield'
                }}
              />
              {errors.passport?.issueDate && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.passport?.issueDate}
                </p>
              )}
            </div>
          </FormField>

          <FormField error={errors.passport?.expirationDate}>
            <div className="relative">
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Expiration Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={traveler.passportInfo.expirationDate.toISOString().split('T')[0]}
                onChange={(e) => handlePassportChange('expirationDate', new Date(e.target.value))}
                className={cn(
                  'block w-full px-3 py-3 text-gray-900 placeholder-gray-500 border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0',
                  'bg-white border-gray-300 rounded-lg focus:border-brand-red focus:ring-brand-red',
                  'text-base sm:text-sm', // Larger text on mobile for better touch interaction
                  'min-h-[44px]', // Minimum touch target size for mobile
                  errors.passport?.expirationDate && 'border-red-500 focus:border-red-500 focus:ring-red-500'
                )}
                style={{
                  // Improve mobile date picker appearance
                  WebkitAppearance: 'none',
                  MozAppearance: 'textfield'
                }}
              />
              {errors.passport?.expirationDate && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.passport?.expirationDate}
                </p>
              )}
            </div>
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField error={errors.passport?.issuingCountry}>
            <Select
              label="Issuing Country"
              value={traveler.passportInfo.issuingCountry}
              onChange={(e) => handlePassportChange('issuingCountry', e.target.value)}
              options={nationalityOptions}
              placeholder="Select issuing country"
              error={errors.passport?.issuingCountry}
              required
              />
          </FormField>

          <FormField error={errors.passport?.placeOfIssue}>
            <TextInput
              label="Place of Issue"
              value={traveler.passportInfo.placeOfIssue}
              onChange={(e) => handlePassportChange('placeOfIssue', e.target.value)}
              error={errors.passport?.placeOfIssue}
              required
              placeholder="City where passport was issued"
            />
          </FormField>
        </div>
      </FormGroup>

      {/* Additional Information Section */}
      <FormGroup
        title="Additional Information"
        description="Please answer the following questions to complete your visa application"
        className="border border-gray-200 rounded-lg p-6"
      >
        {/* Asset Information */}
        <div className="space-y-4">
          <Checkbox
            label="Do you own any assets (property, vehicles, investments)?"
            checked={traveler.additionalInfo.hasAssets}
            onChange={(e) => handleAdditionalChange('hasAssets', e.target.checked)}
          />

          {traveler.additionalInfo.hasAssets && (
            <FormField error={errors.additional?.assetDetails}>
              <div className="relative">
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Asset Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={traveler.additionalInfo.assetDetails || ''}
                  onChange={(e) => handleAdditionalChange('assetDetails', e.target.value)}
                  rows={3}
                  className={cn(
                    'block w-full px-3 py-2.5 text-gray-900 placeholder-gray-500 border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0',
                    'bg-white border-gray-300 rounded-lg focus:border-brand-red focus:ring-brand-red',
                    errors.additional?.assetDetails && 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  )}
                  placeholder="Please describe your assets (property, vehicles, investments, etc.)"
                />
                {errors.additional?.assetDetails && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.additional?.assetDetails}
                  </p>
                )}
              </div>
            </FormField>
          )}
        </div>

        {/* Travel History */}
        <div className="space-y-4">
          <Checkbox
            label="Have you traveled internationally in the past 5 years?"
            checked={traveler.additionalInfo.hasTravelHistory}
            onChange={(e) => handleAdditionalChange('hasTravelHistory', e.target.checked)}
          />

          {traveler.additionalInfo.hasTravelHistory && (
            <FormField error={errors.additional?.travelHistoryDetails}>
              <div className="relative">
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Travel History Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={traveler.additionalInfo.travelHistoryDetails || ''}
                  onChange={(e) => handleAdditionalChange('travelHistoryDetails', e.target.value)}
                  rows={3}
                  className={cn(
                    'block w-full px-3 py-2.5 text-gray-900 placeholder-gray-500 border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0',
                    'bg-white border-gray-300 rounded-lg focus:border-brand-red focus:ring-brand-red',
                    errors.additional?.travelHistoryDetails && 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  )}
                  placeholder="Please list countries visited and approximate dates"
                />
                {errors.additional?.travelHistoryDetails && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.additional?.travelHistoryDetails}
                  </p>
                )}
              </div>
            </FormField>
          )}
        </div>

        {/* Employment Information */}
        <div className="space-y-4">
          <FormField error={errors.additional?.employmentStatus}>
            <Select
              label="Employment Status"
              value={traveler.additionalInfo.employmentStatus}
              onChange={(e) => handleAdditionalChange('employmentStatus', e.target.value)}
              options={employmentStatusOptions}
              error={errors.additional?.employmentStatus}
              required
              />
          </FormField>

          {traveler.additionalInfo.employmentStatus === 'employed' && (
            <div className="space-y-4 pl-4 border-l-2 border-gray-200">
              <h4 className="text-sm font-medium text-gray-900">Employer Details</h4>
              
              <FormField error={errors.additional?.['employerDetails.name']}>
                <TextInput
                  label="Employer Name"
                  value={traveler.additionalInfo.employerDetails?.name || ''}
                  onChange={(e) => handleAdditionalChange('employerDetails.name', e.target.value)}
                  error={errors.additional?.['employerDetails.name']}
                  required
                  />
              </FormField>

              <FormField error={errors.additional?.['employerDetails.position']}>
                <TextInput
                  label="Job Position"
                  value={traveler.additionalInfo.employerDetails?.position || ''}
                  onChange={(e) => handleAdditionalChange('employerDetails.position', e.target.value)}
                  error={errors.additional?.['employerDetails.position']}
                  required
                  />
              </FormField>

              <FormField error={errors.additional?.['employerDetails.address']}>
                <div className="relative">
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Employer Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={traveler.additionalInfo.employerDetails?.address || ''}
                    onChange={(e) => handleAdditionalChange('employerDetails.address', e.target.value)}
                    rows={2}
                    className={cn(
                      'block w-full px-3 py-2.5 text-gray-900 placeholder-gray-500 border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0',
                      'bg-white border-gray-300 rounded-lg focus:border-brand-red focus:ring-brand-red',
                      errors.additional?.['employerDetails.address'] && 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    )}
                  />
                  {errors.additional?.['employerDetails.address'] && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.additional?.['employerDetails.address']}
                    </p>
                  )}
                </div>
              </FormField>
            </div>
          )}
        </div>

        {/* Monthly Income */}
        <FormField error={errors.additional?.monthlyIncome}>
          <Select
            label="Monthly Income"
            value={traveler.additionalInfo.monthlyIncome}
            onChange={(e) => handleAdditionalChange('monthlyIncome', e.target.value)}
            options={monthlyIncomeOptions}
            placeholder="Select income range"
            error={errors.additional?.monthlyIncome}
            required
            />
        </FormField>

        {/* Previous Applications */}
        <div className="space-y-4">
          <FormField error={errors.additional?.previousApplications}>
            <Select
              label="Previous Visa Applications"
              value={traveler.additionalInfo.previousApplications}
              onChange={(e) => handleAdditionalChange('previousApplications', e.target.value)}
              options={previousApplicationOptions}
              error={errors.additional?.previousApplications}
              required
              />
          </FormField>

          {(traveler.additionalInfo.previousApplications === 'denied_recent' || 
            traveler.additionalInfo.previousApplications === 'denied_old') && (
            <FormField error={errors.additional?.previousApplicationDetails}>
              <div className="relative">
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Previous Application Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={traveler.additionalInfo.previousApplicationDetails || ''}
                  onChange={(e) => handleAdditionalChange('previousApplicationDetails', e.target.value)}
                  rows={3}
                  className={cn(
                    'block w-full px-3 py-2.5 text-gray-900 placeholder-gray-500 border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0',
                    'bg-white border-gray-300 rounded-lg focus:border-brand-red focus:ring-brand-red',
                    errors.additional?.previousApplicationDetails && 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  )}
                  placeholder="Please provide details about your previous application and reason for denial"
                />
                {errors.additional?.previousApplicationDetails && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.additional?.previousApplicationDetails}
                  </p>
                )}
              </div>
            </FormField>
          )}
        </div>

        {/* Purpose of Travel */}
        <FormField error={errors.additional?.purposeOfTravel}>
          <div className="relative">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Purpose of Travel <span className="text-red-500">*</span>
            </label>
            <textarea
              value={traveler.additionalInfo.purposeOfTravel}
              onChange={(e) => handleAdditionalChange('purposeOfTravel', e.target.value)}
              rows={2}
              className={cn(
                'block w-full px-3 py-2.5 text-gray-900 placeholder-gray-500 border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0',
                'bg-white border-gray-300 rounded-lg focus:border-brand-red focus:ring-brand-red',
                errors.additional?.purposeOfTravel && 'border-red-500 focus:border-red-500 focus:ring-red-500'
              )}
              placeholder="Describe the purpose of your visit"
            />
            {errors.additional?.purposeOfTravel && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.additional?.purposeOfTravel}
              </p>
            )}
          </div>
        </FormField>

        {/* Accommodation Details */}
        <FormField>
          <div className="relative">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Accommodation Details (Optional)
            </label>
            <textarea
              value={traveler.additionalInfo.accommodationDetails || ''}
              onChange={(e) => handleAdditionalChange('accommodationDetails', e.target.value)}
              rows={2}
              className="block w-full px-3 py-2.5 text-gray-900 placeholder-gray-500 border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 bg-white border-gray-300 rounded-lg focus:border-brand-red focus:ring-brand-red"
              placeholder="Hotel name and address, or host information"
            />
          </div>
        </FormField>
      </FormGroup>

      {/* Emergency Contact Section */}
      <FormGroup
        title="Emergency Contact"
        description="Provide details of someone who can be contacted in case of emergency"
        className="border border-gray-200 rounded-lg p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField error={errors.additional?.['emergencyContact.name']}>
            <TextInput
              label="Full Name"
              value={traveler.additionalInfo.emergencyContact.name}
              onChange={(e) => handleAdditionalChange('emergencyContact.name', e.target.value)}
              error={errors.additional?.['emergencyContact.name']}
              required
              />
          </FormField>

          <FormField error={errors.additional?.['emergencyContact.relationship']}>
            <Select
              label="Relationship"
              value={traveler.additionalInfo.emergencyContact.relationship}
              onChange={(e) => handleAdditionalChange('emergencyContact.relationship', e.target.value)}
              options={relationshipOptions}
              placeholder="Select relationship"
              error={errors.additional?.['emergencyContact.relationship']}
              required
              />
          </FormField>
        </div>

        <FormField error={errors.additional?.['emergencyContact.phoneNumber']}>
          <TextInput
            label="Phone Number"
            type="tel"
            value={traveler.additionalInfo.emergencyContact.phoneNumber}
            onChange={(e) => handleAdditionalChange('emergencyContact.phoneNumber', e.target.value)}
            error={errors.additional?.['emergencyContact.phoneNumber']}
            required
            />
        </FormField>

        <FormField error={errors.additional?.['emergencyContact.address']}>
          <div className="relative">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Address <span className="text-red-500">*</span>
            </label>
            <textarea
              value={traveler.additionalInfo.emergencyContact.address}
              onChange={(e) => handleAdditionalChange('emergencyContact.address', e.target.value)}
              rows={2}
              className={cn(
                'block w-full px-3 py-2.5 text-gray-900 placeholder-gray-500 border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0',
                'bg-white border-gray-300 rounded-lg focus:border-brand-red focus:ring-brand-red',
                errors.additional?.['emergencyContact.address'] && 'border-red-500 focus:border-red-500 focus:ring-red-500'
              )}
            />
            {errors.additional?.['emergencyContact.address'] && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.additional?.['emergencyContact.address']}
              </p>
            )}
          </div>
        </FormField>
      </FormGroup>

      {/* Form Actions */}
      <FormActions align="between">
        <Button 
          variant="outline"
          type="button"
        >
          Back to Personal Details
        </Button>
        <Button onClick={handleSubmit}>
          Continue to Appointment Selection
        </Button>
      </FormActions>
    </div>
  );
}