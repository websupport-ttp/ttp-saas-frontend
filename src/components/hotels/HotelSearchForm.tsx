'use client';

import { useState, useEffect, useRef } from 'react';
import { SearchCriteria } from '@/types/hotels';
import { getUIIcon } from '@/lib/constants/icons';

interface HotelSearchFormProps {
  onSearch: (criteria: SearchCriteria) => void;
  initialValues?: Partial<SearchCriteria>;
}

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder: string;
  minDate?: string;
  label: string;
}

function DatePicker({ value, onChange, placeholder, minDate, label }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedDate(value);
    if (value) {
      setCurrentMonth(new Date(value));
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateDisabled = (date: Date) => {
    if (!minDate) return false;
    return date < new Date(minDate);
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (isDateDisabled(newDate)) return;
    
    const dateStr = newDate.toISOString().split('T')[0];
    setSelectedDate(dateStr);
    onChange(dateStr);
    setIsOpen(false);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dateStr = date.toISOString().split('T')[0];
      const isSelected = selectedDate === dateStr;
      const isDisabled = isDateDisabled(date);
      const isToday = dateStr === new Date().toISOString().split('T')[0];

      days.push(
        <button
          key={day}
          type="button"
          onClick={() => handleDateSelect(day)}
          disabled={isDisabled}
          className={`w-8 h-8 text-sm rounded-full flex items-center justify-center transition-colors ${
            isSelected
              ? 'bg-brand-red text-white'
              : isToday
              ? 'bg-blue-100 text-blue-600'
              : isDisabled
              ? 'text-gray-300 cursor-not-allowed'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="relative" ref={datePickerRef}>
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <img 
            src={getUIIcon('calendar')} 
            alt="Calendar" 
            className="h-5 w-5 text-gray-400"
          />
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-700 mb-1">{label}</div>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="block w-full text-base font-medium text-gray-900 border-0 focus:outline-none focus:ring-0 p-0 text-left"
          >
            {selectedDate ? formatDisplayDate(selectedDate) : placeholder}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 p-4 w-80">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => navigateMonth('prev')}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <h3 className="text-lg font-semibold">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
            
            <button
              type="button"
              onClick={() => navigateMonth('next')}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="w-8 h-8 flex items-center justify-center text-xs font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {renderCalendar()}
          </div>
        </div>
      )}
    </div>
  );
}

interface HotelSearchFormProps {
  onSearch: (criteria: SearchCriteria) => void;
  initialValues?: Partial<SearchCriteria>;
}

export default function HotelSearchForm({ onSearch, initialValues }: HotelSearchFormProps) {
  const [location, setLocation] = useState(initialValues?.location || '');
  const [checkIn, setCheckIn] = useState(
    initialValues?.checkIn ? initialValues.checkIn.toISOString().split('T')[0] : ''
  );
  const [checkOut, setCheckOut] = useState(
    initialValues?.checkOut ? initialValues.checkOut.toISOString().split('T')[0] : ''
  );
  const [rooms, setRooms] = useState(initialValues?.rooms || 1);
  const [adults, setAdults] = useState(initialValues?.adults || 1);
  const [children, setChildren] = useState(initialValues?.children || 0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showGuestSelector, setShowGuestSelector] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  // Update form fields when initialValues change
  useEffect(() => {
    if (initialValues) {
      setLocation(initialValues.location || '');
      setCheckIn(initialValues.checkIn ? initialValues.checkIn.toISOString().split('T')[0] : '');
      setCheckOut(initialValues.checkOut ? initialValues.checkOut.toISOString().split('T')[0] : '');
      setRooms(initialValues.rooms || 1);
      setAdults(initialValues.adults || 1);
      setChildren(initialValues.children || 0);
    }
  }, [initialValues]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showGuestSelector) {
        const target = event.target as Element;
        if (!target.closest('.guest-selector-container')) {
          setShowGuestSelector(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showGuestSelector]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!checkIn) {
      newErrors.checkIn = 'Check-in date is required';
    }

    if (!checkOut) {
      newErrors.checkOut = 'Check-out date is required';
    }

    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (checkInDate < today) {
        newErrors.checkIn = 'Check-in date cannot be in the past';
      }

      if (checkOutDate <= checkInDate) {
        newErrors.checkOut = 'Check-out date must be after check-in date';
      }
    }

    if (rooms < 1 || rooms > 5) {
      newErrors.rooms = 'Number of rooms must be between 1 and 5';
    }

    if (adults < 1 || adults > 20) {
      newErrors.adults = 'Number of adults must be between 1 and 20';
    }

    if (children < 0 || children > 10) {
      newErrors.children = 'Number of children cannot be negative or exceed 10';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const searchCriteria: SearchCriteria = {
        location: location.trim(),
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        rooms,
        adults,
        children,
      };
      
      onSearch(searchCriteria);
    }
  };

  return (
    <div className="bg-white">
      <form onSubmit={handleSubmit}>
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
          {/* Location Input with Room/Guest Info */}
          <div className="flex-1 relative guest-selector-container">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <img 
                  src={getUIIcon('locationPin')} 
                  alt="Location" 
                  className="h-5 w-5 text-gray-400"
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Lagos, Nigeria"
                  className="block w-full text-base font-medium text-gray-900 placeholder-gray-500 border-0 focus:outline-none focus:ring-0 p-0"
                />
                <div 
                  className="text-sm text-gray-500 mt-1 cursor-pointer hover:text-gray-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowGuestSelector(!showGuestSelector);
                  }}
                >
                  {rooms} {rooms === 1 ? 'Room' : 'Rooms'} - {adults} {adults === 1 ? 'Adult' : 'Adults'}{children > 0 && `, ${children} ${children === 1 ? 'Child' : 'Children'}`}
                </div>
              </div>
            </div>
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">{errors.location}</p>
            )}
            
            {/* Guest Selector Dropdown */}
            {showGuestSelector && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10 w-80">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Rooms</span>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() => setRooms(Math.max(1, rooms - 1))}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{rooms}</span>
                      <button
                        type="button"
                        onClick={() => setRooms(Math.min(5, rooms + 1))}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Adults</span>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() => setAdults(Math.max(1, adults - 1))}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{adults}</span>
                      <button
                        type="button"
                        onClick={() => setAdults(Math.min(10, adults + 1))}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Children</span>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() => setChildren(Math.max(0, children - 1))}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{children}</span>
                      <button
                        type="button"
                        onClick={() => setChildren(Math.min(6, children + 1))}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setShowGuestSelector(false)}
                      className="px-4 py-2 bg-brand-red text-white rounded-lg text-sm hover:bg-red-700"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Vertical Divider */}
          <div className="h-12 w-px bg-gray-200"></div>

          {/* Check-in Date */}
          <div className="flex-1">
            <DatePicker
              value={checkIn}
              onChange={setCheckIn}
              placeholder="Select check-in date"
              minDate={new Date().toISOString().split('T')[0]}
              label="Check In"
            />
            {errors.checkIn && (
              <p className="mt-1 text-sm text-red-600">{errors.checkIn}</p>
            )}
          </div>

          {/* Vertical Divider */}
          <div className="h-12 w-px bg-gray-200"></div>

          {/* Check-out Date */}
          <div className="flex-1">
            <DatePicker
              value={checkOut}
              onChange={setCheckOut}
              placeholder="Select check-out date"
              minDate={checkIn || new Date().toISOString().split('T')[0]}
              label="Check Out"
            />
            {errors.checkOut && (
              <p className="mt-1 text-sm text-red-600">{errors.checkOut}</p>
            )}
          </div>

          {/* Search Button */}
          <div className="flex-shrink-0">
            <button
              type="submit"
              disabled={!location || !checkIn || !checkOut}
              className="bg-brand-red hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 whitespace-nowrap"
            >
              Search Another Hotel
            </button>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden space-y-4 p-4 border border-gray-200 rounded-lg">
          {/* Location Input */}
          <div className="relative guest-selector-container">
            <div className="flex items-center space-x-3">
              <img 
                src={getUIIcon('locationPin')} 
                alt="Location" 
                className="h-5 w-5 text-gray-400"
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Lagos, Nigeria"
                  className="block w-full text-base font-medium text-gray-900 placeholder-gray-500 border-0 focus:outline-none focus:ring-0 p-0"
                />
                <div 
                  className="text-sm text-gray-500 mt-1 cursor-pointer hover:text-gray-700"
                  onClick={() => setShowGuestSelector(!showGuestSelector)}
                >
                  {rooms} {rooms === 1 ? 'Room' : 'Rooms'} - {adults} {adults === 1 ? 'Adult' : 'Adults'}{children > 0 && `, ${children} ${children === 1 ? 'Child' : 'Children'}`}
                </div>
              </div>
            </div>
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">{errors.location}</p>
            )}
            
            {/* Mobile Guest Selector */}
            {showGuestSelector && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10 w-full">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Rooms</span>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() => setRooms(Math.max(1, rooms - 1))}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{rooms}</span>
                      <button
                        type="button"
                        onClick={() => setRooms(Math.min(5, rooms + 1))}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Adults</span>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() => setAdults(Math.max(1, adults - 1))}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{adults}</span>
                      <button
                        type="button"
                        onClick={() => setAdults(Math.min(10, adults + 1))}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Children</span>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() => setChildren(Math.max(0, children - 1))}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{children}</span>
                      <button
                        type="button"
                        onClick={() => setChildren(Math.min(6, children + 1))}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setShowGuestSelector(false)}
                      className="px-4 py-2 bg-brand-red text-white rounded-lg text-sm hover:bg-red-700"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Date Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <DatePicker
                value={checkIn}
                onChange={setCheckIn}
                placeholder="Select date"
                minDate={new Date().toISOString().split('T')[0]}
                label="Check In"
              />
              {errors.checkIn && (
                <p className="mt-1 text-sm text-red-600">{errors.checkIn}</p>
              )}
            </div>

            <div>
              <DatePicker
                value={checkOut}
                onChange={setCheckOut}
                placeholder="Select date"
                minDate={checkIn || new Date().toISOString().split('T')[0]}
                label="Check Out"
              />
              {errors.checkOut && (
                <p className="mt-1 text-sm text-red-600">{errors.checkOut}</p>
              )}
            </div>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            disabled={!location || !checkIn || !checkOut}
            className="w-full bg-brand-red hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Search Another Hotel
          </button>
        </div>
      </form>
    </div>
  );
}