'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

interface RoomCounts {
  rooms: number
  adults: number
  children: number
}

interface StyledRoomSelectorProps {
  value: RoomCounts
  onChange: (rooms: RoomCounts) => void
  error?: boolean
  disabled?: boolean
  className?: string
}

export function StyledRoomSelector({
  value,
  onChange,
  error = false,
  disabled = false,
  className = ''
}: StyledRoomSelectorProps) {
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
    const roomText = value.rooms === 1 ? '1 Room' : `${value.rooms} Rooms`
    const guestText = value.adults + value.children === 1 ? '1 Guest' : `${value.adults + value.children} Guests`
    return `${roomText}, ${guestText}`
  }

  const handleCountChange = (type: keyof RoomCounts, newCount: number) => {
    // Ensure minimum values
    let clampedCount = newCount
    if (type === 'rooms' && newCount < 1) clampedCount = 1
    if (type === 'adults' && newCount < 1) clampedCount = 1
    if (type === 'children' && newCount < 0) clampedCount = 0
    
    // Check limits before updating
    if (type === 'rooms' && clampedCount > 8) return
    
    const updated = { ...value, [type]: clampedCount }
    if ((type === 'adults' || type === 'children') && updated.adults + updated.children > 16) return
    
    onChange(updated)
  }

  const CounterRow = ({ 
    label, 
    count, 
    onIncrement, 
    onDecrement, 
    minValue = 0,
    maxReached = false
  }: {
    label: string
    count: number
    onIncrement: () => void
    onDecrement: () => void
    minValue?: number
    maxReached?: boolean
  }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-gray-600 flex-1">{label}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onDecrement()
          }}
          disabled={count <= minValue}
          className={`
            w-8 h-8 rounded border border-gray-300 flex items-center justify-center cursor-pointer
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
            className="opacity-70 pointer-events-none"
          />
        </button>
        
        <span className="w-8 text-center font-medium text-lg text-gray-600">
          {count}
        </span>
        
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onIncrement()
          }}
          disabled={maxReached}
          className={`
            w-8 h-8 rounded border border-gray-300 flex items-center justify-center cursor-pointer
            ${maxReached
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
            className="opacity-70 pointer-events-none"
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
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between px-3 py-2 bg-transparent text-left outline-none cursor-pointer
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        style={{ zIndex: 10 }}
      >
        <span className="text-brand-blue cursor-pointer">{formatDisplayText()}</span>
        <svg 
          className={`w-4 h-4 text-brand-blue/60 transition-transform cursor-pointer ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Popover */}
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-58 bg-white border border-gray-200 rounded-lg shadow-lg z-[9999] overflow-hidden" style={{ zIndex: 9999 }}>
          <div className="p-4 space-y-2">
            <CounterRow
              label="Rooms"
              count={value.rooms}
              onIncrement={() => handleCountChange('rooms', value.rooms + 1)}
              onDecrement={() => handleCountChange('rooms', value.rooms - 1)}
              minValue={1}
              maxReached={value.rooms >= 8}
            />
            
            <CounterRow
              label="Adults:"
              count={value.adults}
              onIncrement={() => handleCountChange('adults', value.adults + 1)}
              onDecrement={() => handleCountChange('adults', value.adults - 1)}
              minValue={1}
              maxReached={value.adults + value.children >= 16}
            />
            
            <CounterRow
              label="Minors:"
              count={value.children}
              onIncrement={() => handleCountChange('children', value.children + 1)}
              onDecrement={() => handleCountChange('children', value.children - 1)}
              minValue={0}
              maxReached={value.adults + value.children >= 16}
            />
          </div>
        </div>
      )}
    </div>
  )
}