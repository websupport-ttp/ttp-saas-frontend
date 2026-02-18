'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  value?: string;
  onChange: (date: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  minDate?: string;
  maxDate?: string;
  error?: boolean;
  required?: boolean;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function DatePicker({
  value = '',
  onChange,
  onBlur,
  placeholder = 'Select date',
  className = '',
  disabled = false,
  minDate,
  maxDate,
  error = false,
  required = false,
  ...ariaProps
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle mounting for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Format date for display
  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  // Update display value when value changes
  useEffect(() => {
    setDisplayValue(formatDisplayDate(value));
    if (value) {
      const date = new Date(value);
      setCurrentMonth(date.getMonth());
      setCurrentYear(date.getFullYear());
    }
  }, [value]);

  // Calculate dropdown position
  const updateDropdownPosition = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      
      // Ensure the dropdown appears in a visible location
      let top = rect.bottom + 8;
      let left = rect.left;
      
      // If the calculated position is off-screen, adjust it
      if (top < 0) {
        top = Math.max(10, rect.top - 320); // Position above the input if below is off-screen
      }
      
      // Ensure it's not too far left or right
      left = Math.max(10, Math.min(left, window.innerWidth - 320));
      
      // Position below the input field
      // No need to force position anymore
      
      const position = { top, left };
      setDropdownPosition(position);
    }
  }, []);

  // Update position when opening
  useEffect(() => {
    if (isOpen) {
      updateDropdownPosition();
    }
  }, [isOpen]);

  // Close calendar when clicking outside and handle repositioning
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current && 
        !containerRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        onBlur?.();
      }
    };

    const handleResize = () => {
      if (isOpen) {
        updateDropdownPosition();
      }
    };

    const handleScroll = () => {
      if (isOpen) {
        updateDropdownPosition();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll, true);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen, onBlur]);

  // Get days in month
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Check if date is disabled
  const isDateDisabled = (day: number, month: number, year: number) => {
    const date = new Date(year, month, day);
    const dateString = date.toISOString().split('T')[0];

    if (minDate && dateString < minDate) return true;
    if (maxDate && dateString > maxDate) return true;

    return false;
  };

  // Handle date selection
  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(currentYear, currentMonth, day);
    const dateString = selectedDate.toISOString().split('T')[0];

    if (!isDateDisabled(day, currentMonth, currentYear)) {
      console.log('DatePicker: Calling onChange with:', dateString);
      onChange(dateString);
      setIsOpen(false);
      inputRef.current?.focus();
    }
  };

  // Handle month navigation
  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const selectedDate = value ? new Date(value) : null;
  const isSelectedMonth = selectedDate?.getMonth() === currentMonth && selectedDate?.getFullYear() === currentYear;
  


  return (
    <div ref={containerRef} className="relative flex-1" style={{ zIndex: 'auto' }}>
      {/* Input Field */}
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          placeholder={placeholder}
          readOnly
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              !disabled && setIsOpen(!isOpen);
            }
            if (e.key === 'Escape') {
              setIsOpen(false);
            }
          }}
          className={cn(
            'flex-1 bg-transparent text-brand-blue placeholder-brand-blue/60 outline-none text-sm sm:text-base font-medium cursor-pointer pr-6',
            error && 'border-b-2 border-red-400',
            disabled && 'cursor-not-allowed opacity-50',
            className
          )}
          disabled={disabled}
          required={required}
          {...ariaProps}
        />

        {/* Calendar Icon */}
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg
            className="w-4 h-4 text-brand-blue/60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>

      {/* Calendar Dropdown - Rendered via Portal */}
      {isOpen && !disabled && mounted && createPortal(
        <div 
          ref={dropdownRef}
          className="fixed bg-white border border-gray-200 rounded-lg shadow-xl p-4 min-w-[300px] max-w-[320px]"
          style={{ 
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            zIndex: 999999,
            position: 'fixed',
          }}>
          {/* Month/Year Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => navigateMonth('prev')}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              aria-label="Previous month"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="text-lg font-semibold text-gray-900">
              {months[currentMonth]} {currentYear}
            </div>

            <button
              type="button"
              onClick={() => navigateMonth('next')}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              aria-label="Next month"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={index} className="p-2" />;
              }

              const isSelected = isSelectedMonth && selectedDate?.getDate() === day;
              const isDisabled = isDateDisabled(day, currentMonth, currentYear);
              const isToday = new Date().toDateString() === new Date(currentYear, currentMonth, day).toDateString();

              return (
                <button
                  key={`${currentYear}-${currentMonth}-${day}`}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Date button clicked:', day);
                    handleDateSelect(day);
                  }}
                  disabled={isDisabled}
                  className={`p-2 text-sm rounded-md transition-colors min-w-[32px] min-h-[32px] ${
                    isSelected 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : isToday 
                        ? 'bg-blue-100 text-blue-900 hover:bg-blue-200'
                        : isDisabled
                          ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                          : 'text-gray-700 hover:bg-blue-50 bg-white border border-gray-200'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Today Button */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Today button clicked');
                const today = new Date();
                const todayString = today.toISOString().split('T')[0];
                if (!isDateDisabled(today.getDate(), today.getMonth(), today.getFullYear())) {
                  console.log('DatePicker: Calling onChange with today:', todayString);
                  onChange(todayString);
                  setIsOpen(false);
                }
              }}
              className="w-full px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              Today
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}