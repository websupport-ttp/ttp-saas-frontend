'use client'

import { useState } from 'react'
import CountryCodeSelector from './CountryCodeSelector'

interface PhoneInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  placeholder?: string
  required?: boolean
  className?: string
}

export default function PhoneInput({
  label,
  value,
  onChange,
  error,
  placeholder = 'Enter phone number',
  required = false,
  className = ''
}: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState('NG')
  const [dialCode, setDialCode] = useState('+234')

  const handleCountryChange = (countryCode: string, newDialCode: string) => {
    setSelectedCountry(countryCode)
    setDialCode(newDialCode)
    
    // Update the phone number with new dial code if there's a value
    if (value) {
      // Remove old dial code if present
      const phoneWithoutCode = value.replace(/^\+\d+\s*/, '')
      onChange(phoneWithoutCode)
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phoneNumber = e.target.value
    // Just store the phone number without dial code
    onChange(phoneNumber)
  }

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className={`flex border rounded-md ${error ? 'border-red-500' : 'border-gray-300'} focus-within:ring-2 focus-within:ring-brand-red focus-within:border-brand-red`}>
        <CountryCodeSelector
          selectedCountry={selectedCountry}
          onCountryChange={handleCountryChange}
        />
        <input
          type="tel"
          value={value}
          onChange={handlePhoneChange}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 outline-none rounded-r-md"
          required={required}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
