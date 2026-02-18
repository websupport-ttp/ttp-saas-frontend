'use client';

import { useState } from 'react';
import { Guest, GuestInformationFormProps } from '@/types/hotels';

interface GuestFormData {
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  redressNumber: string;
  knownTravellerNumber: string;
}

interface ValidationErrors {
  [key: string]: string;
}

export default function GuestInformationForm({ guests, onGuestUpdate, onSubmit }: GuestInformationFormProps) {
  const [errors, setErrors] = useState<{ [guestIndex: number]: ValidationErrors }>({});

  const validateGuestForm = (guest: Guest, guestIndex: number): ValidationErrors => {
    const validationErrors: ValidationErrors = {};

    // Required fields for all guests
    if (!guest.firstName.trim()) {
      validationErrors.firstName = 'First name is required';
    }
    if (!guest.lastName.trim()) {
      validationErrors.lastName = 'Last name is required';
    }
    if (!guest.dateOfBirth) {
      validationErrors.dateOfBirth = 'Date of birth is required';
    }

    // Additional required fields for adults
    if (guest.type === 'Adult') {
      if (!guest.email?.trim()) {
        validationErrors.email = 'Email is required for adults';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest.email)) {
        validationErrors.email = 'Please enter a valid email address';
      }
      if (!guest.phoneNumber?.trim()) {
        validationErrors.phoneNumber = 'Phone number is required for adults';
      }
    }

    return validationErrors;
  };

  const handleInputChange = (guestIndex: number, field: keyof GuestFormData, value: string) => {
    const currentGuest = guests[guestIndex];
    const updatedGuest: Guest = {
      ...currentGuest,
      [field]: field === 'dateOfBirth' ? new Date(value) : value,
    };

    // Clear validation error for this field
    setErrors(prev => ({
      ...prev,
      [guestIndex]: {
        ...prev[guestIndex],
        [field]: ''
      }
    }));

    onGuestUpdate(guestIndex, updatedGuest);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all guests
    const allErrors: { [guestIndex: number]: ValidationErrors } = {};
    let hasErrors = false;

    guests.forEach((guest, index) => {
      const guestErrors = validateGuestForm(guest, index);
      if (Object.keys(guestErrors).length > 0) {
        allErrors[index] = guestErrors;
        hasErrors = true;
      }
    });

    setErrors(allErrors);

    if (!hasErrors) {
      onSubmit(guests);
    }
  };

  const formatDateForInput = (date: Date | undefined): string => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {guests.map((guest, guestIndex) => (
        <div key={guestIndex} className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          {/* Guest Type Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              guest.type === 'Adult' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {guest.type}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Guest {guestIndex + 1}
            </h3>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label htmlFor={`firstName-${guestIndex}`} className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                id={`firstName-${guestIndex}`}
                value={guest.firstName}
                onChange={(e) => handleInputChange(guestIndex, 'firstName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors[guestIndex]?.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter first name"
              />
              {errors[guestIndex]?.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors[guestIndex].firstName}</p>
              )}
            </div>

            <div>
              <label htmlFor={`middleName-${guestIndex}`} className="block text-sm font-medium text-gray-700 mb-1">
                Middle Name
              </label>
              <input
                type="text"
                id={`middleName-${guestIndex}`}
                value={guest.middleName || ''}
                onChange={(e) => handleInputChange(guestIndex, 'middleName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter middle name"
              />
            </div>

            <div>
              <label htmlFor={`lastName-${guestIndex}`} className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                id={`lastName-${guestIndex}`}
                value={guest.lastName}
                onChange={(e) => handleInputChange(guestIndex, 'lastName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors[guestIndex]?.lastName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter last name"
              />
              {errors[guestIndex]?.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors[guestIndex].lastName}</p>
              )}
            </div>

            <div>
              <label htmlFor={`suffix-${guestIndex}`} className="block text-sm font-medium text-gray-700 mb-1">
                Suffix
              </label>
              <select
                id={`suffix-${guestIndex}`}
                value={guest.suffix || ''}
                onChange={(e) => handleInputChange(guestIndex, 'suffix', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select suffix</option>
                <option value="Jr.">Jr.</option>
                <option value="Sr.">Sr.</option>
                <option value="II">II</option>
                <option value="III">III</option>
                <option value="IV">IV</option>
              </select>
            </div>
          </div>

          {/* Date of Birth */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor={`dateOfBirth-${guestIndex}`} className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth *
              </label>
              <input
                type="date"
                id={`dateOfBirth-${guestIndex}`}
                value={formatDateForInput(guest.dateOfBirth)}
                onChange={(e) => handleInputChange(guestIndex, 'dateOfBirth', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors[guestIndex]?.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors[guestIndex]?.dateOfBirth && (
                <p className="text-red-500 text-sm mt-1">{errors[guestIndex].dateOfBirth}</p>
              )}
            </div>
          </div>

          {/* Contact Information - Required for Adults */}
          {guest.type === 'Adult' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor={`email-${guestIndex}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id={`email-${guestIndex}`}
                  value={guest.email || ''}
                  onChange={(e) => handleInputChange(guestIndex, 'email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors[guestIndex]?.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter email address"
                />
                {errors[guestIndex]?.email && (
                  <p className="text-red-500 text-sm mt-1">{errors[guestIndex].email}</p>
                )}
              </div>

              <div>
                <label htmlFor={`phoneNumber-${guestIndex}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id={`phoneNumber-${guestIndex}`}
                  value={guest.phoneNumber || ''}
                  onChange={(e) => handleInputChange(guestIndex, 'phoneNumber', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors[guestIndex]?.phoneNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter phone number"
                />
                {errors[guestIndex]?.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors[guestIndex].phoneNumber}</p>
                )}
              </div>
            </div>
          )}

          {/* Optional Travel Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor={`redressNumber-${guestIndex}`} className="block text-sm font-medium text-gray-700 mb-1">
                Redress Number
              </label>
              <input
                type="text"
                id={`redressNumber-${guestIndex}`}
                value={guest.redressNumber || ''}
                onChange={(e) => handleInputChange(guestIndex, 'redressNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter redress number (optional)"
              />
            </div>

            <div>
              <label htmlFor={`knownTravellerNumber-${guestIndex}`} className="block text-sm font-medium text-gray-700 mb-1">
                Known Traveller Number
              </label>
              <input
                type="text"
                id={`knownTravellerNumber-${guestIndex}`}
                value={guest.knownTravellerNumber || ''}
                onChange={(e) => handleInputChange(guestIndex, 'knownTravellerNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter known traveller number (optional)"
              />
            </div>
          </div>
        </div>
      ))}

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Continue to Payment
        </button>
      </div>
    </form>
  );
}