'use client'

import { useState, useRef, useEffect } from 'react'

interface SimplePassengerSelectorProps {
  value: number
  onChange: (count: number) => void
  placeholder?: string
  className?: string
  min?: number
  max?: number
}

export default function SimplePassengerSelector({ 
  value, 
  onChange, 
  placeholder = '1 passenger', 
  className = '',
  min = 1,
  max = 8
}: SimplePassengerSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [count, setCount] = useState(value || 1)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setCount(value || 1)
  }, [value])

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

  const handleIncrement = () => {
    if (count < max) {
      const newCount = count + 1
      setCount(newCount)
      onChange(newCount)
    }
  }

  const handleDecrement = () => {
    if (count > min) {
      const newCount = count - 1
      setCount(newCount)
      onChange(newCount)
    }
  }

  const displayText = count === 1 ? '1 passenger' : `${count} passengers`

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 bg-transparent text-left outline-none"
      >
        <span className="text-brand-blue">{displayText}</span>
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
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Passengers</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDecrement}
                disabled={count <= min}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="w-8 text-center font-medium text-gray-900">{count}</span>
              <button
                type="button"
                onClick={handleIncrement}
                disabled={count >= max}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}