'use client'

import { useState, useRef, useEffect } from 'react'

interface StyledVisaTypeSelectorProps {
  value: string
  onChange: (value: string) => void
  error?: boolean
  disabled?: boolean
  className?: string
  placeholder?: string
}

const visaTypes = [
  { value: 'Tourist', label: 'Tourist Visa', icon: 'luggage' },
  { value: 'Business', label: 'Business Visa', icon: 'business_center' },
  { value: 'Student', label: 'Student Visa', icon: 'school' },
  { value: 'Work', label: 'Work Visa', icon: 'work' },
  { value: 'Transit', label: 'Transit Visa', icon: 'connecting_airports' }
]

export function StyledVisaTypeSelector({
  value,
  onChange,
  error = false,
  disabled = false,
  className = '',
  placeholder = 'Select visa category'
}: StyledVisaTypeSelectorProps) {
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

  const selectedVisa = visaTypes.find(v => v.value === value)
  const displayText = selectedVisa ? selectedVisa.label : placeholder

  const handleSelect = (visaValue: string) => {
    onChange(visaValue)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between bg-transparent text-left outline-none cursor-pointer
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${!value ? 'text-brand-blue/60' : 'text-brand-blue'}
        `}
        style={{ zIndex: 10 }}
      >
        <span className="cursor-pointer font-medium text-sm sm:text-base">{displayText}</span>
        <span className="material-icons text-brand-blue/60 cursor-pointer flex-shrink-0 ml-2" style={{ fontSize: '20px' }}>
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {/* Popover */}
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-[9999] overflow-hidden" style={{ zIndex: 9999 }}>
          <div className="py-2">
            {visaTypes.map((visa) => (
              <button
                key={visa.value}
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleSelect(visa.value)
                }}
                className={`
                  w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3
                  ${value === visa.value ? 'bg-brand-blue/5 text-brand-blue' : 'text-gray-700'}
                `}
              >
                <span className="material-icons text-brand-blue/70" style={{ fontSize: '20px' }}>
                  {visa.icon}
                </span>
                <span className="font-medium">{visa.label}</span>
                {value === visa.value && (
                  <span className="material-icons ml-auto text-brand-blue" style={{ fontSize: '20px' }}>
                    check
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
