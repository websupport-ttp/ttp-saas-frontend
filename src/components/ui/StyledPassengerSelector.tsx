'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

interface PassengerCounts {
  adults: number
  children: number
  infants: number
}

interface StyledPassengerSelectorProps {
  value: PassengerCounts
  onChange: (passengers: PassengerCounts) => void
  error?: boolean
  disabled?: boolean
  className?: string
}

export function StyledPassengerSelector({
  value,
  onChange,
  error = false,
  disabled = false,
  className = ''
}: StyledPassengerSelectorProps) {
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

  const formatDisplayText = () => {
    const total = value.adults + value.children + value.infants
    if (total === 1) {
      return '1 Passenger'
    }
    return `${total} Passengers`
  }

  const handleCountChange = (type: keyof PassengerCounts, newCount: number) => {
    // Ensure minimum values
    const clampedCount = Math.max(type === 'adults' ? 1 : 0, newCount)
    
    // Calculate what the new total would be
    const currentTotal = value.adults + value.children + value.infants
    const changeAmount = clampedCount - value[type]
    const newTotal = currentTotal + changeAmount
    
    // Only block if the new total would exceed 9
    if (newTotal > 9) {
      return
    }
    
    // Create the updated object
    const updated = { ...value, [type]: clampedCount }
    onChange(updated)
  }

  const CounterRow = ({ 
    label, 
    count, 
    onIncrement, 
    onDecrement, 
    minValue = 0,
    incrementDisabled = false
  }: {
    label: string
    count: number
    onIncrement: () => void
    onDecrement: () => void
    minValue?: number
    incrementDisabled?: boolean
  }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-gray-600 flex-1">{label}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onDecrement}
          disabled={count <= minValue}
          className={`
            w-8 h-8 rounded border border-gray-300 flex items-center justify-center
            ${count <= minValue 
              ? 'opacity-50 cursor-not-allowed bg-gray-100' 
              : 'hover:bg-gray-50 bg-gray-100'
            }
          `}
        >
          <Image
            src="/images/popover-icons/minus-icon.svg"
            alt="Decrease"
            width={16}
            height={16}
            className="opacity-70"
          />
        </button>
        
        <span className="w-8 text-center font-medium text-lg text-gray-600">
          {count}
        </span>
        
        <button
          type="button"
          onClick={onIncrement}
          disabled={incrementDisabled}
          className={`
            w-8 h-8 rounded border border-gray-300 flex items-center justify-center
            ${incrementDisabled
              ? 'opacity-50 cursor-not-allowed bg-gray-100'
              : 'hover:bg-gray-50 bg-gray-100'
            }
          `}
        >
          <Image
            src="/images/popover-icons/plus-icon.svg"
            alt="Increase"
            width={16}
            height={16}
            className="opacity-70"
          />
        </button>
      </div>
    </div>
  )

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between px-3 py-2 bg-transparent text-left outline-none
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <span className="text-brand-blue">{formatDisplayText()}</span>
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
        <div className="absolute bottom-full left-0 mb-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-[9999] overflow-hidden">
          <div className="p-4 space-y-2">
            <CounterRow
              label="Adults - Age 12+"
              count={value.adults}
              onIncrement={() => handleCountChange('adults', value.adults + 1)}
              onDecrement={() => handleCountChange('adults', value.adults - 1)}
              minValue={1}
              incrementDisabled={value.adults + value.children + value.infants >= 9}
            />
            
            <CounterRow
              label="Children - Ages 2-11"
              count={value.children}
              onIncrement={() => handleCountChange('children', value.children + 1)}
              onDecrement={() => handleCountChange('children', value.children - 1)}
              minValue={0}
              incrementDisabled={value.adults + value.children + value.infants >= 9}
            />
            
            <CounterRow
              label="Infants - Age < 2"
              count={value.infants}
              onIncrement={() => handleCountChange('infants', value.infants + 1)}
              onDecrement={() => handleCountChange('infants', value.infants - 1)}
              minValue={0}
              incrementDisabled={value.adults + value.children + value.infants >= 9}
            />
          </div>
        </div>
      )}
    </div>
  )
}