'use client';

import { useState } from 'react';
import { DriverInformation, EmergencyContact, CarContactFormProps } from '@/types/car-hire';
import { TextInput } from '@/components/ui/TextInput';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { FormGroup, FormActions } from '@/components/ui/FormField';
import PhoneInput from '@/components/ui/PhoneInput';
import CountrySelect from '@/components/ui/CountrySelect';
import { StyledDatePicker } from '@/components/ui/styled-popovers';

interface ValidationErrors {
  driverInfo?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    licenseNumber?: string;
    licenseCountry?: string;
    licenseExpiryDate?: string;
  };
  emergencyContact?: {
    name?: string;
    relationship?: string;
    phoneNumber?: string;
    email?: string;
  };
}

const COUNTRY_OPTIONS = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'AU', label: 'Australia' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'IT', label: 'Italy' },
  { value: 'ES', label: 'Spain' },
  { value: 'NL', label: 'Netherlands' },
  { value: 'BE', label: 'Belgium' },
  { value: 'CH', label: 'Switzerland' },
  { value: 'AT', label: 'Austria' },
  { value: 'SE', label: 'Sweden' },
  { value: 'NO', label: 'Norway' },
  { value: 'DK', label: 'Denmark' },
  { value: 'FI', label: 'Finland' },
  { value: 'IE', label: 'Ireland' },
  { value: 'PT', label: 'Portugal' },
  { value: 'GR', label: 'Greece' },
  { value: 'PL', label: 'Poland' },
  { value: 'CZ', label: 'Czech Republic' },
  { value: 'HU', label: 'Hungary' },
  { value: 'SK', label: 'Slovakia' },
  { value: 'SI', label: 'Slovenia' },
  { value: 'HR', label: 'Croatia' },
  { value: 'BG', label: 'Bulgaria' },
  { value: 'RO', label: 'Romania' },
  { value: 'LT', label: 'Lithuania' },
  { value: 'LV', label: 'Latvia' },
  { value: 'EE', label: 'Estonia' },
  { value: 'MT', label: 'Malta' },
  { value: 'CY', label: 'Cyprus' },
  { value: 'LU', label: 'Luxembourg' },
  { value: 'IS', label: 'Iceland' },
  { value: 'LI', label: 'Liechtenstein' },
  { value: 'MC', label: 'Monaco' },
  { value: 'SM', label: 'San Marino' },
  { value: 'VA', label: 'Vatican City' },
  { value: 'AD', label: 'Andorra' },
  { value: 'JP', label: 'Japan' },
  { value: 'KR', label: 'South Korea' },
  { value: 'SG', label: 'Singapore' },
  { value: 'NZ', label: 'New Zealand' },
  { value: 'MX', label: 'Mexico' },
  { value: 'BR', label: 'Brazil' },
  { value: 'AR', label: 'Argentina' },
  { value: 'CL', label: 'Chile' },
  { value: 'CO', label: 'Colombia' },
  { value: 'PE', label: 'Peru' },
  { value: 'UY', label: 'Uruguay' },
  { value: 'PY', label: 'Paraguay' },
  { value: 'BO', label: 'Bolivia' },
  { value: 'EC', label: 'Ecuador' },
  { value: 'VE', label: 'Venezuela' },
  { value: 'GY', label: 'Guyana' },
  { value: 'SR', label: 'Suriname' },
  { value: 'GF', label: 'French Guiana' },
  { value: 'FK', label: 'Falkland Islands' },
  { value: 'ZA', label: 'South Africa' },
  { value: 'EG', label: 'Egypt' },
  { value: 'MA', label: 'Morocco' },
  { value: 'TN', label: 'Tunisia' },
  { value: 'DZ', label: 'Algeria' },
  { value: 'LY', label: 'Libya' },
  { value: 'SD', label: 'Sudan' },
  { value: 'ET', label: 'Ethiopia' },
  { value: 'KE', label: 'Kenya' },
  { value: 'TZ', label: 'Tanzania' },
  { value: 'UG', label: 'Uganda' },
  { value: 'RW', label: 'Rwanda' },
  { value: 'BI', label: 'Burundi' },
  { value: 'DJ', label: 'Djibouti' },
  { value: 'SO', label: 'Somalia' },
  { value: 'ER', label: 'Eritrea' },
  { value: 'SS', label: 'South Sudan' },
  { value: 'CF', label: 'Central African Republic' },
  { value: 'TD', label: 'Chad' },
  { value: 'NE', label: 'Niger' },
  { value: 'ML', label: 'Mali' },
  { value: 'BF', label: 'Burkina Faso' },
  { value: 'SN', label: 'Senegal' },
  { value: 'MR', label: 'Mauritania' },
  { value: 'GM', label: 'Gambia' },
  { value: 'GW', label: 'Guinea-Bissau' },
  { value: 'GN', label: 'Guinea' },
  { value: 'SL', label: 'Sierra Leone' },
  { value: 'LR', label: 'Liberia' },
  { value: 'CI', label: 'Ivory Coast' },
  { value: 'GH', label: 'Ghana' },
  { value: 'TG', label: 'Togo' },
  { value: 'BJ', label: 'Benin' },
  { value: 'NG', label: 'Nigeria' },
  { value: 'CM', label: 'Cameroon' },
  { value: 'GQ', label: 'Equatorial Guinea' },
  { value: 'ST', label: 'Sao Tome and Principe' },
  { value: 'GA', label: 'Gabon' },
  { value: 'CG', label: 'Republic of the Congo' },
  { value: 'CD', label: 'Democratic Republic of the Congo' },
  { value: 'AO', label: 'Angola' },
  { value: 'ZM', label: 'Zambia' },
  { value: 'ZW', label: 'Zimbabwe' },
  { value: 'BW', label: 'Botswana' },
  { value: 'NA', label: 'Namibia' },
  { value: 'SZ', label: 'Eswatini' },
  { value: 'LS', label: 'Lesotho' },
  { value: 'MW', label: 'Malawi' },
  { value: 'MZ', label: 'Mozambique' },
  { value: 'MG', label: 'Madagascar' },
  { value: 'MU', label: 'Mauritius' },
  { value: 'SC', label: 'Seychelles' },
  { value: 'KM', label: 'Comoros' },
  { value: 'CV', label: 'Cape Verde' },
  { value: 'IN', label: 'India' },
  { value: 'CN', label: 'China' },
  { value: 'ID', label: 'Indonesia' },
  { value: 'PK', label: 'Pakistan' },
  { value: 'BD', label: 'Bangladesh' },
  { value: 'PH', label: 'Philippines' },
  { value: 'VN', label: 'Vietnam' },
  { value: 'TR', label: 'Turkey' },
  { value: 'IR', label: 'Iran' },
  { value: 'TH', label: 'Thailand' },
  { value: 'MM', label: 'Myanmar' },
  { value: 'AF', label: 'Afghanistan' },
  { value: 'UZ', label: 'Uzbekistan' },
  { value: 'SA', label: 'Saudi Arabia' },
  { value: 'IQ', label: 'Iraq' },
  { value: 'MY', label: 'Malaysia' },
  { value: 'NP', label: 'Nepal' },
  { value: 'YE', label: 'Yemen' },
  { value: 'LK', label: 'Sri Lanka' },
  { value: 'KZ', label: 'Kazakhstan' },
  { value: 'SY', label: 'Syria' },
  { value: 'KH', label: 'Cambodia' },
  { value: 'JO', label: 'Jordan' },
  { value: 'AZ', label: 'Azerbaijan' },
  { value: 'AE', label: 'United Arab Emirates' },
  { value: 'TJ', label: 'Tajikistan' },
  { value: 'IL', label: 'Israel' },
  { value: 'LA', label: 'Laos' },
  { value: 'LB', label: 'Lebanon' },
  { value: 'KG', label: 'Kyrgyzstan' },
  { value: 'TM', label: 'Turkmenistan' },
  { value: 'PS', label: 'Palestine' },
  { value: 'KW', label: 'Kuwait' },
  { value: 'OM', label: 'Oman' },
  { value: 'QA', label: 'Qatar' },
  { value: 'BH', label: 'Bahrain' },
  { value: 'AM', label: 'Armenia' },
  { value: 'GE', label: 'Georgia' },
  { value: 'MN', label: 'Mongolia' },
  { value: 'BT', label: 'Bhutan' },
  { value: 'BN', label: 'Brunei' },
  { value: 'MV', label: 'Maldives' },
  { value: 'TL', label: 'East Timor' },
  { value: 'RU', label: 'Russia' },
  { value: 'UA', label: 'Ukraine' },
  { value: 'BY', label: 'Belarus' },
  { value: 'MD', label: 'Moldova' },
  { value: 'RS', label: 'Serbia' },
  { value: 'ME', label: 'Montenegro' },
  { value: 'BA', label: 'Bosnia and Herzegovina' },
  { value: 'MK', label: 'North Macedonia' },
  { value: 'AL', label: 'Albania' },
  { value: 'XK', label: 'Kosovo' }
];

const RELATIONSHIP_OPTIONS = [
  { value: 'spouse', label: 'Spouse' },
  { value: 'partner', label: 'Partner' },
  { value: 'parent', label: 'Parent' },
  { value: 'child', label: 'Child' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'friend', label: 'Friend' },
  { value: 'colleague', label: 'Colleague' },
  { value: 'other', label: 'Other' }
];

export default function CarContactForm({
  driverInfo,
  emergencyContact,
  onDriverInfoChange,
  onEmergencyContactChange,
  onSubmit
}: CarContactFormProps) {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasDriverLicense, setHasDriverLicense] = useState(true);

  const validateForm = (): ValidationErrors => {
    const validationErrors: ValidationErrors = {
      driverInfo: {},
      emergencyContact: {}
    };

    // Driver information validation
    if (!driverInfo.firstName.trim()) {
      validationErrors.driverInfo!.firstName = 'First name is required';
    }

    if (!driverInfo.lastName.trim()) {
      validationErrors.driverInfo!.lastName = 'Last name is required';
    }

    if (!driverInfo.email.trim()) {
      validationErrors.driverInfo!.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(driverInfo.email)) {
      validationErrors.driverInfo!.email = 'Please enter a valid email address';
    }

    if (!driverInfo.phoneNumber.trim()) {
      validationErrors.driverInfo!.phoneNumber = 'Phone number is required';
    } else if (!/^[\+]?[0-9][\d]{6,15}$/.test(driverInfo.phoneNumber.replace(/[\s\-\(\)]/g, ''))) {
      validationErrors.driverInfo!.phoneNumber = 'Please enter a valid phone number';
    }

    if (!driverInfo.dateOfBirth) {
      validationErrors.driverInfo!.dateOfBirth = 'Date of birth is required';
    } else {
      const today = new Date();
      const birthDate = new Date(driverInfo.dateOfBirth);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        // Subtract 1 from age if birthday hasn't occurred this year
      }
      
      if (age < 18) {
        validationErrors.driverInfo!.dateOfBirth = 'Driver must be at least 18 years old';
      } else if (age > 100) {
        validationErrors.driverInfo!.dateOfBirth = 'Please enter a valid date of birth';
      }
    }

    if (!driverInfo.licenseNumber.trim() && hasDriverLicense) {
      validationErrors.driverInfo!.licenseNumber = 'License number is required';
    }

    if (!driverInfo.licenseCountry.trim() && hasDriverLicense) {
      validationErrors.driverInfo!.licenseCountry = 'License country is required';
    }

    if (!driverInfo.licenseExpiryDate && hasDriverLicense) {
      validationErrors.driverInfo!.licenseExpiryDate = 'License expiry date is required';
    } else if (driverInfo.licenseExpiryDate && hasDriverLicense) {
      const today = new Date();
      const expiryDate = new Date(driverInfo.licenseExpiryDate);
      
      if (expiryDate <= today) {
        validationErrors.driverInfo!.licenseExpiryDate = 'License must be valid for at least the rental period';
      }
    }

    // Emergency contact validation
    if (!emergencyContact.name.trim()) {
      validationErrors.emergencyContact!.name = 'Emergency contact name is required';
    }

    if (!emergencyContact.relationship.trim()) {
      validationErrors.emergencyContact!.relationship = 'Relationship is required';
    }

    if (!emergencyContact.phoneNumber.trim()) {
      validationErrors.emergencyContact!.phoneNumber = 'Emergency contact phone number is required';
    } else if (!/^[\+]?[0-9][\d]{6,15}$/.test(emergencyContact.phoneNumber.replace(/[\s\-\(\)]/g, ''))) {
      validationErrors.emergencyContact!.phoneNumber = 'Please enter a valid phone number';
    }

    if (emergencyContact.email && emergencyContact.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emergencyContact.email)) {
      validationErrors.emergencyContact!.email = 'Please enter a valid email address';
    }

    // Remove empty error objects
    if (Object.keys(validationErrors.driverInfo!).length === 0) {
      delete validationErrors.driverInfo;
    }
    if (Object.keys(validationErrors.emergencyContact!).length === 0) {
      delete validationErrors.emergencyContact;
    }

    return validationErrors;
  };

  const handleDriverInfoChange = (field: keyof DriverInformation, value: string | Date) => {
    const updatedDriverInfo = {
      ...driverInfo,
      [field]: value
    };

    // Clear validation error for this field
    if (errors.driverInfo?.[field]) {
      setErrors(prev => ({
        ...prev,
        driverInfo: {
          ...prev.driverInfo,
          [field]: undefined
        }
      }));
    }

    onDriverInfoChange(updatedDriverInfo);
  };

  const handleEmergencyContactChange = (field: keyof EmergencyContact, value: string) => {
    const updatedEmergencyContact = {
      ...emergencyContact,
      [field]: value
    };

    // Clear validation error for this field
    if (errors.emergencyContact?.[field]) {
      setErrors(prev => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [field]: undefined
        }
      }));
    }

    onEmergencyContactChange(updatedEmergencyContact);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDateForInput = (date: Date | undefined): string => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Driver Information Section */}
      <FormGroup 
        title="Driver Information"
        description="Please provide the primary driver's details as they appear on their driving license."
      >
        {/* Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextInput
            label="First Name"
            value={driverInfo.firstName}
            onChange={(e) => handleDriverInfoChange('firstName', e.target.value)}
            error={errors.driverInfo?.firstName}
            placeholder="Enter first name"
            required
            />
          
          <TextInput
            label="Last Name"
            value={driverInfo.lastName}
            onChange={(e) => handleDriverInfoChange('lastName', e.target.value)}
            error={errors.driverInfo?.lastName}
            placeholder="Enter last name"
            required
            />
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextInput
            label="Email Address"
            type="email"
            value={driverInfo.email}
            onChange={(e) => handleDriverInfoChange('email', e.target.value)}
            error={errors.driverInfo?.email}
            placeholder="Enter email address"
            required
            />
          
          <PhoneInput
            label="Phone Number"
            value={driverInfo.phoneNumber}
            onChange={(value) => handleDriverInfoChange('phoneNumber', value)}
            error={errors.driverInfo?.phoneNumber}
            placeholder="Enter phone number"
            required
            />
        </div>

        {/* Date of Birth */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="border border-gray-300 rounded-md">
              <StyledDatePicker
                value={formatDateForInput(driverInfo.dateOfBirth)}
                onChange={(date) => handleDriverInfoChange('dateOfBirth', new Date(date))}
                placeholder="Select date of birth"
                maxDate={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                error={!!(errors.driverInfo?.dateOfBirth)}
                required
              />
            </div>
            {errors.driverInfo?.dateOfBirth && (
              <p className="mt-1 text-sm text-red-600">{errors.driverInfo.dateOfBirth}</p>
            )}
          </div>
        </div>

        {/* Driver License Checkbox */}
        <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-md">
          <input
            type="checkbox"
            id="hasDriverLicense"
            checked={hasDriverLicense}
            onChange={(e) => {
              setHasDriverLicense(e.target.checked)
              // Clear license fields if unchecked
              if (!e.target.checked) {
                handleDriverInfoChange('licenseNumber', '')
                handleDriverInfoChange('licenseCountry', '')
                handleDriverInfoChange('licenseExpiryDate', undefined as any)
              }
            }}
            className="w-4 h-4 text-brand-red border-gray-300 rounded focus:ring-brand-red"
          />
          <label htmlFor="hasDriverLicense" className="text-sm text-gray-700 cursor-pointer">
            I will be driving this vehicle (provide driver's license information)
          </label>
        </div>

        {/* License Information - Only show if checkbox is checked */}
        {hasDriverLicense && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextInput
                label="License Number"
                value={driverInfo.licenseNumber}
                onChange={(e) => handleDriverInfoChange('licenseNumber', e.target.value)}
                error={errors.driverInfo?.licenseNumber}
                placeholder="Enter license number"
                required
                />
              
              <CountrySelect
                label="License Country"
                value={driverInfo.licenseCountry}
                onChange={(value) => handleDriverInfoChange('licenseCountry', value)}
                error={errors.driverInfo?.licenseCountry}
                options={COUNTRY_OPTIONS}
                placeholder="Select license country"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  License Expiry Date
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="border border-gray-300 rounded-md">
                  <StyledDatePicker
                    value={formatDateForInput(driverInfo.licenseExpiryDate)}
                    onChange={(date) => handleDriverInfoChange('licenseExpiryDate', new Date(date))}
                    placeholder="Select expiry date"
                    minDate={new Date().toISOString().split('T')[0]}
                    error={!!(errors.driverInfo?.licenseExpiryDate)}
                    required
                  />
                </div>
                {errors.driverInfo?.licenseExpiryDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.driverInfo.licenseExpiryDate}</p>
                )}
              </div>
            </div>
          </>
        )}
      </FormGroup>

      {/* Emergency Contact Section */}
      <FormGroup 
        title="Emergency Contact"
        description="Please provide details for someone we can contact in case of emergency."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextInput
            label="Full Name"
            value={emergencyContact.name}
            onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
            error={errors.emergencyContact?.name}
            placeholder="Enter full name"
            required
            />
          
          <Select
            label="Relationship"
            value={emergencyContact.relationship}
            onChange={(e) => handleEmergencyContactChange('relationship', e.target.value)}
            error={errors.emergencyContact?.relationship}
            options={RELATIONSHIP_OPTIONS}
            placeholder="Select relationship"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <PhoneInput
            label="Phone Number"
            value={emergencyContact.phoneNumber}
            onChange={(value) => handleEmergencyContactChange('phoneNumber', value)}
            error={errors.emergencyContact?.phoneNumber}
            placeholder="Enter phone number"
            required
            />
          
          <TextInput
            label="Email Address (Optional)"
            type="email"
            value={emergencyContact.email || ''}
            onChange={(e) => handleEmergencyContactChange('email', e.target.value)}
            error={errors.emergencyContact?.email}
            placeholder="Enter email address"
            />
        </div>
      </FormGroup>

      {/* Form Actions */}
      <FormActions align="between">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
        >
          Back
        </Button>
        
        <Button
          type="submit"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          Continue to Payment
        </Button>
      </FormActions>
    </form>
  );
}