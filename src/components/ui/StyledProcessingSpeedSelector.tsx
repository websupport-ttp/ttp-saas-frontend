'use client'

import { useState, useRef, useEffect } from 'react'

interface StyledProcessingSpeedSelectorProps {
  value: string
  onChange: (value: string) => void
  error?: boolean
  disabled?: boolean
  className?: string
  placeholder?: string
}

const processingOptions = [
  { 
    value: 'Standard', 
    label: 'Standard Processing', 
    description: '2-4 weeks',
    icon: 'schedule'
  },
  { 
    value: 'Express', 
    label: 'Express Processing', 
    description: '1-2 weeks',
    icon: 'fast_forward'
  },
  { 
    value: 'Super Express', 
    label: 'Rush Processing', 
    description: '3-5 days',
    icon: 'bolt'
  }
]

export function StyledProcessingSpeedSelector({
  value,
  onChange,
  error = false,
  disabled = false,
  className = '',
  placeholder = 'Choose processing speed'
}: StyledProcessingSpeedSelectorProps) {
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

  const selectedOption = processingOptions.find(o => o.value === value)
  const displayText = selectedOption ? selectedOption.label : placeholder

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
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
        <div className="absolute bottom-full left-0 mb-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-[9999] overflow-hidden" style={{ zIndex: 9999 }}>
          <div className="py-2">
            {processingOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleSelect(option.value)
                }}
                className={`
                  w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3
                  ${value === option.value ? 'bg-brand-blue/5 text-brand-blue' : 'text-gray-700'}
                `}
              >
                <span className="material-icons text-brand-blue/70" style={{ fontSize: '22px' }}>
                  {option.icon}
                </span>
                <div className="flex-1">
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{option.description}</div>
                </div>
                {value === option.value && (
                  <span className="material-icons text-brand-blue" style={{ fontSize: '20px' }}>
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
