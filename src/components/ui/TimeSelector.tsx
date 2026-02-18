'use client'

import { useState, useRef, useEffect } from 'react'

interface TimeSelectorProps {
  value: string
  onChange: (time: string) => void
  placeholder?: string
  className?: string
}

export default function TimeSelector({ value, onChange, placeholder = 'Pick up time', className = '' }: TimeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedHour, setSelectedHour] = useState('')
  const [selectedMinute, setSelectedMinute] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Parse initial value
  useEffect(() => {
    if (value) {
      const [hour, minute] = value.split(':')
      setSelectedHour(hour || '')
      setSelectedMinute(minute || '')
    }
  }, [value])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Generate all hours (00-23)
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
  
  // Generate all minutes (00-59)
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'))

  const handleHourChange = (hour: string) => {
    setSelectedHour(hour)
    if (hour && selectedMinute) {
      onChange(`${hour}:${selectedMinute}`)
    }
  }

  const handleMinuteChange = (minute: string) => {
    setSelectedMinute(minute)
    if (selectedHour && minute) {
      onChange(`${selectedHour}:${minute}`)
    }
  }

  const displayValue = (selectedHour && selectedMinute) ? `${selectedHour}:${selectedMinute}` : placeholder

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 bg-transparent text-left outline-none"
      >
        <span className={value ? 'text-brand-blue' : 'text-brand-blue/60'}>{displayValue}</span>
        <svg 
          className={`w-4 h-4 text-brand-blue/60 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-[9999] p-4">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hour</label>
              <select
                value={selectedHour}
                onChange={(e) => handleHourChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red"
              >
                <option value="" disabled>Select hour</option>
                {hours.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minute</label>
              <select
                value={selectedMinute}
                onChange={(e) => handleMinuteChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red"
              >
                <option value="" disabled>Select minute</option>
                {minutes.map((minute) => (
                  <option key={minute} value={minute}>
                    {minute}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
