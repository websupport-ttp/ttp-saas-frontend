'use client'

import { useState, useEffect, useRef } from 'react'

interface Country {
  value: string
  label: string
  flag?: string
}

interface CountrySelectProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: Country[]
  error?: string
  placeholder?: string
  required?: boolean
  className?: string
}

export default function CountrySelect({
  label,
  value,
  onChange,
  options,
  error,
  placeholder = 'Select country',
  required = false,
  className = ''
}: CountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const getFlagUrl = (countryCode: string) => {
    return `https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`
  }

  const selectedCountry = options.find(opt => opt.value === value)

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.value.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSelect = (option: Country) => {
    onChange(option.value)
    setIsOpen(false)
    setSearchTerm('')
  }

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-3 py-2 border rounded-md text-left flex items-center justify-between ${
            error ? 'border-red-500' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-brand-red`}
        >
          <div className="flex items-center gap-2">
            {selectedCountry ? (
              <>
                <img 
                  src={getFlagUrl(selectedCountry.value)} 
                  alt={`${selectedCountry.label} flag`}
                  className="w-5 h-4 object-cover rounded-sm"
                  onError={(e) => {
                    const img = e.currentTarget
                    img.style.display = 'none'
                  }}
                />
                <span className="text-gray-900">{selectedCountry.label}</span>
              </>
            ) : (
              <span className="text-gray-400">{placeholder}</span>
            )}
          </div>
          <svg 
            className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-60 overflow-hidden">
            {/* Search input */}
            <div className="p-2 border-b border-gray-200">
              <input
                type="text"
                placeholder="Search countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-brand-red"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Countries list */}
            <div className="overflow-y-auto max-h-48">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center gap-3 ${
                      value === option.value ? 'bg-red-50 text-red-600' : 'text-gray-700'
                    }`}
                  >
                    <img 
                      src={getFlagUrl(option.value)} 
                      alt={`${option.label} flag`}
                      className="w-5 h-4 object-cover rounded-sm flex-shrink-0"
                      onError={(e) => {
                        const img = e.currentTarget
                        img.style.display = 'none'
                      }}
                    />
                    <span className="text-sm">{option.label}</span>
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500 text-center">
                  No countries found
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
