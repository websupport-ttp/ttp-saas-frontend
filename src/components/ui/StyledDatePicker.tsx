'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

interface StyledDatePickerProps {
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

export function StyledDatePicker({
  value = '',
  onChange,
  placeholder = 'Select dates',
  minDate,
  maxDate,
  error = false,
  required = false,
  disabled = false,
  className = ''
}: StyledDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  // Initialize both calendars to show current month
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date()
    return new Date(today.getFullYear(), today.getMonth(), 1)
  })
  
  // Initialize right calendar to also show current month (not next month)
  const [rightMonth, setRightMonth] = useState(() => {
    const today = new Date()
    return new Date(today.getFullYear(), today.getMonth(), 1)
  })
  
  // Determine if this is a flight date picker based on placeholder
  const isFlightDatePicker = placeholder === 'Select dates' || placeholder.includes('Depart')
  
  const [tripType, setTripType] = useState<'round-trip' | 'one-way'>(isFlightDatePicker ? 'round-trip' : 'one-way')
  const [selectedDates, setSelectedDates] = useState<{departure?: string, return?: string}>({})
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Year/Month picker state
  const [showYearPicker, setShowYearPicker] = useState<'left' | 'right' | null>(null)
  const [yearPickerYear, setYearPickerYear] = useState(new Date().getFullYear())

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

  // Clear return date when switching to one-way
  useEffect(() => {
    if (tripType === 'one-way' && selectedDates.return) {
      setSelectedDates(prev => ({ ...prev, return: undefined }))
    }
  }, [tripType, selectedDates.return])

  const formatDisplayDate = () => {
    if (selectedDates.departure) {
      // For non-flight date pickers (like Date of Birth, License Expiry), show full date with year
      if (!isFlightDatePicker) {
        const depDate = new Date(selectedDates.departure).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: 'numeric'
        })
        return depDate
      }
      
      // Flight date picker logic - show without year for brevity
      const depDate = new Date(selectedDates.departure).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
      
      if (tripType === 'round-trip' && selectedDates.return) {
        const retDate = new Date(selectedDates.return).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })
        return `${depDate} - ${retDate}`
      }
      if (tripType === 'one-way') {
        return depDate
      }
      // Round trip but no return date selected yet
      return `${depDate} - Return`
    }
    
    // Use the placeholder passed from parent component
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

  const formatDateToString = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const isDateSelected = (date: Date, isSecondCalendar = false) => {
    const dateStr = formatDateToString(date)
    if (tripType === 'one-way') {
      return dateStr === selectedDates.departure
    }
    // For round-trip, left calendar shows departure, right calendar shows return
    if (isSecondCalendar) {
      return dateStr === selectedDates.return
    } else {
      return dateStr === selectedDates.departure
    }
  }

  const isDateInRange = (date: Date) => {
    if (!selectedDates.departure || !selectedDates.return) return false
    const dateStr = formatDateToString(date)
    return dateStr > selectedDates.departure && dateStr < selectedDates.return
  }

  const handleDateClick = (date: Date, isSecondCalendar = false) => {
    const dateStr = formatDateToString(date)
    
    // For non-flight date pickers (like hotel check-in/check-out), always select single date
    if (!isFlightDatePicker) {
      setSelectedDates({ departure: dateStr })
      onChange?.(dateStr)
      setIsOpen(false)
      return
    }
    
    // Flight date picker logic
    if (tripType === 'one-way') {
      setSelectedDates({ departure: dateStr })
      onChange?.(dateStr)
      setIsOpen(false)
    } else {
      // Round-trip logic - simplified and more intuitive
      if (!selectedDates.departure) {
        // First click - set departure
        setSelectedDates({ departure: dateStr })
      } else if (!selectedDates.return) {
        // Second click - set return
        const depDate = new Date(selectedDates.departure)
        const selDate = new Date(dateStr)
        
        if (selDate >= depDate) {
          // Valid return date (same day or later)
          const newSelectedDates = { departure: selectedDates.departure, return: dateStr }
          setSelectedDates(newSelectedDates)
          onChange?.(selectedDates.departure + ' - ' + dateStr)
          setIsOpen(false)
        } else {
          // Earlier date - reset and set as new departure
          setSelectedDates({ departure: dateStr })
        }
      } else {
        // Both dates selected - reset and set new departure
        setSelectedDates({ departure: dateStr })
      }
    }
  }

  const navigateMonth = (direction: 'prev' | 'next', isRightCalendar = false) => {
    if (isRightCalendar) {
      setRightMonth(prev => {
        const newMonth = new Date(prev)
        if (direction === 'prev') {
          newMonth.setMonth(newMonth.getMonth() - 1)
        } else {
          newMonth.setMonth(newMonth.getMonth() + 1)
        }
        return newMonth
      })
    } else {
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
  }

  const handleYearMonthSelect = (year: number, month: number, isRightCalendar = false) => {
    const newDate = new Date(year, month, 1)
    if (isRightCalendar) {
      setRightMonth(newDate)
    } else {
      setCurrentMonth(newDate)
    }
    setShowYearPicker(null)
  }

  const navigateYearPicker = (direction: 'prev' | 'next') => {
    setYearPickerYear(prev => direction === 'prev' ? prev - 1 : prev + 1)
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const monthNamesShort = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]

  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Input Field */}
      <div
        onClick={() => setIsOpen(!isOpen)}
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
        <span className={`flex-1 ${selectedDates.departure ? 'text-brand-blue' : 'text-brand-blue/60'}`}>
          {formatDisplayDate()}
        </span>
      </div>

      {/* Popover */}
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-xl shadow-lg z-[9999] p-0 overflow-hidden">
          {/* Trip Type Radio Buttons - Only show for flight date pickers */}
          {isFlightDatePicker && (
            <div style={{ 
              padding: '16px', 
              borderBottom: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb'
            }}>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '0' }}>
                <button 
                  type="button"
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    cursor: 'pointer',
                    padding: '8px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    outline: 'none'
                  }}
                  onMouseDown={(e) => {
                    console.log('Round trip button mousedown')
                    setTripType('round-trip')
                  }}
                  onClick={(e) => {
                    console.log('Round trip button clicked')
                    setTripType('round-trip')
                  }}
                >
                  <div style={{ 
                    width: '16px', 
                    height: '16px', 
                    borderRadius: '50%', 
                    border: tripType === 'round-trip' ? '2px solid #2563eb' : '2px solid #9ca3af',
                    backgroundColor: tripType === 'round-trip' ? '#2563eb' : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {tripType === 'round-trip' && (
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: 'white'
                      }} />
                    )}
                  </div>
                  <span style={{ 
                    color: '#6b7280', 
                    fontSize: '14px'
                  }}>
                    Round trip
                  </span>
                </button>
                
                <button 
                  type="button"
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    cursor: 'pointer',
                    padding: '8px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    outline: 'none'
                  }}
                  onMouseDown={(e) => {
                    console.log('One way button mousedown')
                    setTripType('one-way')
                  }}
                  onClick={(e) => {
                    console.log('One way button clicked')
                    setTripType('one-way')
                  }}
                >
                  <div style={{ 
                    width: '16px', 
                    height: '16px', 
                    borderRadius: '50%', 
                    border: tripType === 'one-way' ? '2px solid #2563eb' : '2px solid #9ca3af',
                    backgroundColor: tripType === 'one-way' ? '#2563eb' : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {tripType === 'one-way' && (
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: 'white'
                      }} />
                    )}
                  </div>
                  <span style={{ 
                    color: '#6b7280', 
                    fontSize: '14px'
                  }}>
                    One way
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Header Section */}
          <div className="px-6 py-5 border-b border-gray-200">
            {/* Date Input and Done Button */}
            <div className={`flex ${isFlightDatePicker && tripType === 'one-way' ? 'flex-col gap-3' : 'gap-2'}`}>
              <div className={`${isFlightDatePicker && tripType === 'one-way' ? 'w-full' : 'flex-1'} px-3 py-2 border border-gray-300 rounded bg-white`}>
                <span className="text-gray-400 text-lg">{formatDisplayDate()}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className={`${isFlightDatePicker && tripType === 'one-way' ? 'w-full' : ''} px-5 py-2 bg-gray-900 text-white rounded text-lg font-medium hover:bg-gray-800`}
              >
                Done
              </button>
            </div>
          </div>

          {/* Calendar Section */}
          <div className="px-2 py-4 relative z-0">
            {/* Calendar Grid - Dynamic based on trip type and picker type */}
            <div className={`flex ${(!isFlightDatePicker || tripType === 'one-way') ? 'justify-center' : 'gap-8'}`}>
              {/* Left Calendar */}
              <div className="w-64">
                {/* Left Calendar Header with Navigation */}
                <div className="flex items-center justify-between mb-2">
                  <button
                    type="button"
                    onClick={() => showYearPicker === 'left' ? navigateYearPicker('prev') : navigateMonth('prev', false)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Image
                      src="/images/popover-icons/chevron-left.svg"
                      alt="Previous"
                      width={16}
                      height={16}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (showYearPicker === 'left') {
                        setShowYearPicker(null)
                      } else {
                        setYearPickerYear(currentMonth.getFullYear())
                        setShowYearPicker('left')
                      }
                    }}
                    className="font-semibold text-gray-900 hover:bg-gray-100 px-2 py-1 rounded"
                  >
                    {showYearPicker === 'left' 
                      ? yearPickerYear 
                      : `${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`
                    }
                  </button>
                  <button
                    type="button"
                    onClick={() => showYearPicker === 'left' ? navigateYearPicker('next') : navigateMonth('next', false)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Image
                      src="/images/popover-icons/chevron-right.svg"
                      alt="Next"
                      width={16}
                      height={16}
                    />
                  </button>
                </div>
                  
                {showYearPicker === 'left' ? (
                  /* Year/Month Picker */
                  <div className="grid grid-cols-3 gap-2 p-2">
                    {monthNamesShort.map((month, index) => (
                      <button
                        type="button"
                        key={index}
                        onClick={() => handleYearMonthSelect(yearPickerYear, index, false)}
                        className="py-2 px-3 text-sm rounded hover:bg-blue-100 hover:text-blue-600 text-gray-900"
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                ) : (
                  <>
                    {/* Day Headers */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {dayNames.map((day, index) => (
                        <div key={`day-header-1-${index}`} className="h-8 flex items-center justify-center">
                          <span className="text-sm font-semibold text-gray-900">{day}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Calendar Days */}
                    <div className="grid grid-cols-7 gap-1">
                      {generateCalendarDays(currentMonth).map((date, index) => {
                        const isCurrentMonth = isDateInCurrentMonth(date, currentMonth)
                        const isSelected = isDateSelected(date, false)
                        const dateStr = formatDateToString(date)
                        const isDisabled = !!(minDate && dateStr < minDate)
                        
                        return (
                          <button
                            type="button"
                            key={index}
                            onClick={() => !isDisabled && handleDateClick(date, false)}
                            disabled={isDisabled}
                            className={`
                              h-8 w-8 flex items-center justify-center text-sm rounded
                              ${isSelected 
                                ? 'bg-blue-600 text-white' 
                                : isDateInRange(date)
                                  ? 'bg-blue-100 text-blue-600'
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
                  </>
                )}
              </div>

              {/* Right Calendar - Only show for round-trip flights */}
              {isFlightDatePicker && tripType === 'round-trip' && (
                <div className="w-64">
                  {/* Right Calendar Header with Navigation */}
                  <div className="flex items-center justify-between mb-2">
                    <button
                      type="button"
                      onClick={() => showYearPicker === 'right' ? navigateYearPicker('prev') : navigateMonth('prev', true)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Image
                        src="/images/popover-icons/chevron-left.svg"
                        alt="Previous"
                        width={16}
                        height={16}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (showYearPicker === 'right') {
                          setShowYearPicker(null)
                        } else {
                          setYearPickerYear(rightMonth.getFullYear())
                          setShowYearPicker('right')
                        }
                      }}
                      className="font-semibold text-gray-900 hover:bg-gray-100 px-2 py-1 rounded"
                    >
                      {showYearPicker === 'right' 
                        ? yearPickerYear 
                        : `${monthNames[rightMonth.getMonth()]} ${rightMonth.getFullYear()}`
                      }
                    </button>
                    <button
                      type="button"
                      onClick={() => showYearPicker === 'right' ? navigateYearPicker('next') : navigateMonth('next', true)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Image
                        src="/images/popover-icons/chevron-right.svg"
                        alt="Next"
                        width={16}
                        height={16}
                      />
                    </button>
                  </div>
                  
                  {showYearPicker === 'right' ? (
                    /* Year/Month Picker */
                    <div className="grid grid-cols-3 gap-2 p-2">
                      {monthNamesShort.map((month, index) => (
                        <button
                          type="button"
                          key={index}
                          onClick={() => handleYearMonthSelect(yearPickerYear, index, true)}
                          className="py-2 px-3 text-sm rounded hover:bg-blue-100 hover:text-blue-600 text-gray-900"
                        >
                          {month}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <>
                      {/* Day Headers */}
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {dayNames.map((day, index) => (
                          <div key={`day-header-2-${index}`} className="h-8 flex items-center justify-center">
                            <span className="text-sm font-semibold text-gray-900">{day}</span>
                          </div>
                        ))}
                      </div>
                      
                      {/* Calendar Days */}
                      <div className="grid grid-cols-7 gap-1">
                        {generateCalendarDays(rightMonth).map((date, index) => {
                          const isCurrentMonth = isDateInCurrentMonth(date, rightMonth)
                          const isSelected = isDateSelected(date, true)
                          const dateStr = formatDateToString(date)
                          const isDisabled = !!(minDate && dateStr < minDate)
                          
                          return (
                            <button
                              type="button"
                              key={index}
                              onClick={() => !isDisabled && handleDateClick(date, true)}
                              disabled={isDisabled}
                              className={`
                                h-8 w-8 flex items-center justify-center text-sm rounded
                                ${isSelected 
                                  ? 'bg-blue-600 text-white' 
                                  : isDateInRange(date)
                                    ? 'bg-blue-100 text-blue-600'
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
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}