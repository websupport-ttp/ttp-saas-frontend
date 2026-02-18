'use client'

import { useState, useRef, useEffect } from 'react'

export type TripType = 'oneWay' | 'roundTrip'

interface TripTypeOption {
  value: TripType
  label: string
}

interface StyledTripTypeSelectorProps {
  value: TripType
  onChange: (tripType: TripType) => void
  error?: boolean
  disabled?: boolean
  className?: string
}

const tripTypeOptions: TripTypeOption[] = [
  { value: 'oneWay', label: 'One Way' },
  { value: 'roundTrip', label: 'Round Trip' }
]

export function StyledTripTypeSelector({
  value,
  onChange,
  error = false,
  disabled = false,
  className = ''
}: StyledTripTypeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const selectedOption = tripTypeOptions.find(option => option.value === value)
  const displayText = selectedOption?.label || 'Select Trip Type'

  const handleOptionSelect = (option: TripTypeOption) => {
    onChange(option.value)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full h-full flex items-center justify-between bg-transparent text-left outline-none
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <span className="text-brand-blue font-medium">{displayText}</span>
        <svg 
          className={`w-4 h-4 text-brand-blue/60 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Popover */}
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-full min-w-[160px] bg-white border border-gray-200 rounded-lg shadow-lg z-[9999] overflow-hidden">
          <div className="py-1">
            {tripTypeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleOptionSelect(option)}
                className={`
                  w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors
                  ${value === option.value ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'}
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}