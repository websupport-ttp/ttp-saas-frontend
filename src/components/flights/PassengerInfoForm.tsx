'use client'

import { useState } from 'react'
import { SimpleDatePicker } from '@/components/ui/SimpleDatePicker'
import CountryCodeSelector from '@/components/ui/CountryCodeSelector'
import { PassengerData } from '@/types'

interface PassengerInfoFormProps {
  passengerNumber?: number
  passengerType?: string
  ageCategory?: string
  onDataChange?: (data: PassengerData) => void
}

export default function PassengerInfoForm({
  passengerNumber = 1,
  passengerType = "Adult",
  ageCategory = "Adult",
  onDataChange
}: PassengerInfoFormProps) {
  // Helper function to get age range based on category
  const getAgeRange = (category: string) => {
    switch (category.toLowerCase()) {
      case 'adult':
        return '(16 yrs+)'
      case 'child':
        return '(2-15 yrs)'
      case 'infant':
        return '(0-23 months)'
      default:
        return '(16 yrs+)'
    }
  }

  const [formData, setFormData] = useState<PassengerData>({
    firstName: '',
    middle: '',
    lastName: '',
    title: 'Mr',
    dateOfBirth: '',
    email: '',
    phone: '',
    countryCode: 'NG',
    dialCode: '+234',
    agreeToTerms: false
  })

  const handleInputChange = (field: keyof PassengerData, value: string | boolean) => {
    const updatedData = { ...formData, [field]: value }
    setFormData(updatedData)
    onDataChange?.(updatedData)
  }

  const handleCountryChange = (countryCode: string, dialCode: string) => {
    const updatedData = { ...formData, countryCode, dialCode }
    setFormData(updatedData)
    onDataChange?.(updatedData)
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-[648px]">
      {/* Contact Details - Moved to top */}
      <div className="flex flex-col gap-6">
        <div>
          <h4 className="text-gray-600 text-lg font-semibold">
            Contact Details
          </h4>
          <p className="text-gray-500 text-sm mt-1">
            We will send your booking confirmation to these contact details.
          </p>
        </div>
        
        <div className="flex gap-6">
          <div className="flex flex-col gap-1 w-[300px]">
            <div className="border border-gray-300 rounded bg-white h-12 flex items-center focus-within:border-red-600">
              <CountryCodeSelector
                selectedCountry={formData.countryCode}
                onCountryChange={handleCountryChange}
              />
              <input
                type="tel"
                placeholder="Phone number*"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="flex-1 px-3 text-lg text-gray-600 placeholder-gray-600 border-none outline-none bg-transparent focus:outline-none focus:ring-0"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1 w-[300px]">
            <div className="border border-gray-300 rounded bg-white px-3 py-2 h-12 flex items-end focus-within:border-red-600">
              <input
                type="email"
                placeholder="Email address*"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full text-lg text-gray-600 placeholder-gray-600 border-none outline-none bg-transparent focus:outline-none focus:ring-0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Passenger(s) Details Section */}
      <div className="flex flex-col gap-6">
        <div>
          <h4 className="text-gray-600 text-lg font-semibold">
            Passenger(s) Details
          </h4>
          <div className="mt-2">
            <p className="text-red-600 text-sm font-medium">Name Requirements</p>
            <p className="text-gray-500 text-sm mt-1">
              The passenger's name must be entered exactly as it appears on passport.
            </p>
            <p className="text-gray-500 text-sm">
              All names must be entered in English.
            </p>
          </div>
        </div>
      </div>

      {/* Passenger Information */}
      <div className="flex flex-col gap-6">
        <h3 className="text-gray-600 text-lg font-semibold">
          {ageCategory} {passengerNumber} {getAgeRange(ageCategory)}
        </h3>

        {/* Title Radio Buttons */}
        <div className="flex gap-6">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={`title-${passengerNumber}`}
                value="Mr"
                checked={formData.title === 'Mr'}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
              />
              <span className="text-gray-600 text-sm">Mr</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={`title-${passengerNumber}`}
                value="Ms"
                checked={formData.title === 'Ms'}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
              />
              <span className="text-gray-600 text-sm">Ms</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={`title-${passengerNumber}`}
                value="Mrs"
                checked={formData.title === 'Mrs'}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
              />
              <span className="text-gray-600 text-sm">Mrs</span>
            </label>
          </div>
        </div>

        {/* Name Fields - All in one row */}
        <div className="flex gap-4">
          <div className="flex flex-col gap-1 flex-1">
            <div className="border border-gray-300 rounded bg-white px-3 py-2 h-12 flex items-end focus-within:border-red-600">
              <input
                type="text"
                placeholder="First name*"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="w-full text-lg text-gray-600 placeholder-gray-600 border-none outline-none bg-transparent focus:outline-none focus:ring-0"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1 flex-1">
            <div className="border border-gray-300 rounded bg-white px-3 py-2 h-12 flex items-end focus-within:border-red-600">
              <input
                type="text"
                placeholder="Last name*"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="w-full text-lg text-gray-600 placeholder-gray-600 border-none outline-none bg-transparent focus:outline-none focus:ring-0"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1 flex-1">
            <div className="border border-gray-300 rounded bg-white px-3 py-2 h-12 flex items-end focus-within:border-red-600">
              <input
                type="text"
                placeholder="Middle name"
                value={formData.middle}
                onChange={(e) => handleInputChange('middle', e.target.value)}
                className="w-full text-lg text-gray-600 placeholder-gray-600 border-none outline-none bg-transparent focus:outline-none focus:ring-0"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1 w-[200px]">
            <div className="border border-gray-300 rounded bg-white h-12 flex items-center focus-within:border-red-600">
              <SimpleDatePicker
                value={formData.dateOfBirth}
                onChange={(date) => handleInputChange('dateOfBirth', date)}
                placeholder="Date of birth*"
                maxDate={new Date().toISOString().split('T')[0]}
                required={true}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="flex items-start gap-2 py-4">
        <input
          type="checkbox"
          id="agreeToTerms"
          checked={formData.agreeToTerms}
          onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
          className="w-4 h-4 mt-1 border border-gray-600 rounded-sm bg-white checked:bg-red-600 checked:border-red-600"
        />
        <label htmlFor="agreeToTerms" className="text-gray-600 text-base">
          I agree to the{' '}
          <a href="/terms" target="_blank" className="text-blue-600 hover:underline">
            Terms and Conditions
          </a>
          {' '}and{' '}
          <a href="/privacy" target="_blank" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>
          *
        </label>
      </div>
    </div>
  )
}