'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

interface SimpleDatePickerProps {
  value?: string
  onChange?: (date: string) => void
  placeholder?: string
  minDate?: string
  maxDate?: string
  error?: boolean
  required?: boolean
  disabled?: boolean
  className?: string
}

export function SimpleDatePicker({
  value = '',
  onChange,
  placeholder = 'Select date',
  minDate,
  maxDate,
  error = false,
  required = false,
  disabled = false,
  className = ''
}: SimpleDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string>(value)
  const containerRef = useRef<HTMLDivElement>(null)

  // Update selected date when value prop changes
  useEffect(() => {
    setSelectedDate(value)
  }, [value])

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

  const formatDateToString = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const formatDisplayDate = () => {
    if (selectedDate) {
      const date = new Date(selectedDate)
      // Use a more compact format: DD/MM/YY
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = String(date.getFullYear()).slice(-2) // Last 2 digits of year
      return `${day}/${month}/${year}`
    }
    return placeholder
  }

  const generateCalendarDays = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    const currentDate = new Date(startDate)
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    return days
  }

  const isDateInCurrentMonth = (date: Date, currentMonth: Date) => {
    return date.getMonth() === currentMonth.getMonth() && date.getFullYear() === currentMonth.getFullYear()
  }

  const isDateSelected = (date: Date) => {
    const dateStr = formatDateToString(date)
    return dateStr === selectedDate
  }

  const handleDateClick = (date: Date) => {
    const dateStr = formatDateToString(date)
    
    // Check against maxDate if provided
    if (maxDate && dateStr > maxDate) {
      return
    }
    
    // Check against minDate if provided
    if (minDate && dateStr < minDate) {
      return
    }
    
    setSelectedDate(dateStr)
    onChange?.(dateStr)
    setIsOpen(false)
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev)
      if (direction === 'prev') {
        newMonth.setMonth(newMonth.getMonth() - 1)
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1)
      }
      return newMonth
    })
  }

  const handleMonthChange = (month: number) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(month)
      return newDate
    })
  }

  const handleYearChange = (year: number) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      newDate.setFullYear(year)
      return newDate
    })
  }

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear()
    const startYear = currentYear - 100 // 100 years ago
    const years = []
    for (let year = currentYear; year >= startYear; year--) {
      years.push(year)
    }
    return years
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Input Field */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-3 py-2 cursor-pointer bg-transparent
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <Image
          src="/images/popover-icons/calendar-icon.svg"
          alt="Calendar"
          width={20}
          height={20}
          className="opacity-70"
          style={{ filter: 'brightness(0) invert(0)' }}
        />
        <span className={`flex-1 text-lg ${selectedDate ? 'text-gray-600' : 'text-gray-600'}`}>
          {formatDisplayDate()}
        </span>
      </div>

      {/* Popover */}
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-xl shadow-lg z-[9999] p-4 overflow-hidden">
          {/* Calendar Section */}
          <div className="flex flex-col gap-4">
            {/* Month and Year Selectors */}
            <div className="flex items-center justify-between gap-2">
              {/* Previous Month Button */}
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-gray-100 rounded flex-shrink-0"
                type="button"
              >
                <Image
                  src="/images/popover-icons/chevron-left.svg"
                  alt="Previous"
                  width={18}
                  height={18}
                />
              </button>

              {/* Month Dropdown */}
              <select
                value={currentMonth.getMonth()}
                onChange={(e) => handleMonthChange(parseInt(e.target.value))}
                className="px-2 py-1 border border-gray-300 rounded text-sm font-semibold text-gray-900 bg-white cursor-pointer hover:bg-gray-50"
              >
                {monthNames.map((month, index) => (
                  <option key={index} value={index}>
                    {month}
                  </option>
                ))}
              </select>

              {/* Year Dropdown */}
              <select
                value={currentMonth.getFullYear()}
                onChange={(e) => handleYearChange(parseInt(e.target.value))}
                className="px-2 py-1 border border-gray-300 rounded text-sm font-semibold text-gray-900 bg-white cursor-pointer hover:bg-gray-50"
              >
                {generateYearOptions().map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              {/* Next Month Button */}
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-gray-100 rounded flex-shrink-0"
                type="button"
              >
                <Image
                  src="/images/popover-icons/chevron-right.svg"
                  alt="Next"
                  width={18}
                  height={18}
                />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="w-64">
              <div className="text-center mb-2 hidden">
                <h3 className="font-semibold text-gray-900">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
              </div>
              
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map((day, index) => (
                  <div key={`day-header-${index}`} className="h-8 flex items-center justify-center">
                    <span className="text-sm font-semibold text-gray-900">{day}</span>
                  </div>
                ))}
              </div>
              
              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {generateCalendarDays(currentMonth).map((date, index) => {
                  const isCurrentMonth = isDateInCurrentMonth(date, currentMonth)
                  const isSelected = isDateSelected(date)
                  const dateStr = formatDateToString(date)
                  const isDisabled = 
                    !!(minDate && dateStr < minDate) || 
                    !!(maxDate && dateStr > maxDate)
                  
                  return (
                    <button
                      key={index}
                      onClick={() => !isDisabled && handleDateClick(date)}
                      disabled={isDisabled}
                      type="button"
                      className={`
                        h-8 w-8 flex items-center justify-center text-sm rounded
                        ${isSelected 
                          ? 'bg-blue-600 text-white' 
                          : isCurrentMonth 
                            ? 'text-gray-900 hover:bg-gray-100' 
                            : 'text-gray-400'
                        }
                        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                    >
                      {date.getDate()}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Done Button */}
          <div className="flex justify-end pt-2 border-t border-gray-200">
            <button
              onClick={() => setIsOpen(false)}
              className="px-5 py-2 bg-gray-900 text-white rounded text-sm font-medium hover:bg-gray-800"
              type="button"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
