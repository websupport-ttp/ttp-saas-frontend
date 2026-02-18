'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface FlightSearchData {
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
  passengers: {
    adults: number
    children: number
    infants: number
  }
  tripType: 'one-way' | 'round-trip'
  cabinClass: string
}

interface FigmaFlightSearchFormProps {
  onSearch: (data: FlightSearchData) => void
  isLoading?: boolean
  initialData?: any
}

export default function FigmaFlightSearchForm({ 
  onSearch, 
  isLoading = false, 
  initialData 
}: FigmaFlightSearchFormProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isCabinClassOpen, setIsCabinClassOpen] = useState(false)
  const [isRouteOpen, setIsRouteOpen] = useState(false)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [isPassengerOpen, setIsPassengerOpen] = useState(false)
  const [routeSearchQuery, setRouteSearchQuery] = useState('')
  const [routeSearchResults, setRouteSearchResults] = useState<any[]>([])
  const [editingField, setEditingField] = useState<'origin' | 'destination' | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDateType, setSelectedDateType] = useState<'departure' | 'return'>('departure')

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (isDropdownOpen && !target.closest('.flight-type-dropdown')) {
        setIsDropdownOpen(false)
      }
      if (isCabinClassOpen && !target.closest('.cabin-class-dropdown')) {
        setIsCabinClassOpen(false)
      }
      if (isRouteOpen && !target.closest('.route-dropdown')) {
        setIsRouteOpen(false)
        setEditingField(null)
        setRouteSearchQuery('')
      }
      if (isDatePickerOpen && !target.closest('.date-picker-dropdown')) {
        setIsDatePickerOpen(false)
      }
      if (isPassengerOpen && !target.closest('.passenger-dropdown')) {
        setIsPassengerOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isDropdownOpen, isCabinClassOpen, isRouteOpen, isDatePickerOpen, isPassengerOpen])

  // Helper function to format location display (city + code only)
  const formatLocationDisplay = (location: string) => {
    if (!location) return location
    
    // If location already in correct format (City (CODE)), return as is
    if (location.match(/^[^(]+\s\([A-Z]{3}\)$/) && !location.toLowerCase().includes('airport')) {
      return location
    }
    
    // Extract airport code first
    const codeMatch = location.match(/\(([A-Z]{3})\)/)
    if (!codeMatch) return location
    
    const code = codeMatch[1]
    
    // Extract city name - be more aggressive about removing airport terms
    let cityName = location.split('(')[0].trim()
    
    // Remove common airport terms
    cityName = cityName
      .replace(/\s+(International|Intl|Airport|City|Municipal|Regional|Field)(\s+Airport)?$/gi, '')
      .replace(/\s+Airport$/gi, '')
      .trim()
    
    // If we still have multiple words, take the first significant word(s)
    // Handle cases like "John F Kennedy" -> "New York" or "London Heathrow" -> "London"
    const words = cityName.split(/\s+/)
    if (words.length > 2) {
      // For airports like "John F Kennedy", "Los Angeles International", etc.
      // Try to get the city name which is usually the first 1-2 words
      if (words[0].length > 2) {
        cityName = words[0]
      }
    }
    
    return `${cityName} (${code})`
  }

  const [formData, setFormData] = useState<FlightSearchData>({
    origin: 'London (LGW)',
    destination: 'Lagos (LOS)',
    departureDate: '2021-06-14',
    returnDate: '2021-06-16',
    passengers: {
      adults: 1,
      children: 0,
      infants: 0
    },
    tripType: 'round-trip',
    cabinClass: 'economy'
  })

  // Initialize with data from URL params or props
  useEffect(() => {
    if (initialData) {
      console.log('🔍 FigmaFlightSearchForm initialData:', initialData);
      
      // Map from SearchForm format to FigmaFlightSearchForm format
      let tripType: 'one-way' | 'round-trip' = 'one-way';
      
      // Map flightType values
      if (initialData.flightType === 'roundTrip') {
        tripType = 'round-trip';
      } else if (initialData.flightType === 'oneWay') {
        tripType = 'one-way';
      } else if (initialData.return) {
        // Fallback: infer from return date if flightType is not set
        tripType = 'round-trip';
      }
      
      console.log('🔍 Mapped tripType:', tripType, 'departure:', initialData.departure, 'return:', initialData.return);
      
      setFormData(prev => ({
        ...prev,
        origin: initialData.from ? formatLocationDisplay(initialData.from) : prev.origin,
        destination: initialData.to ? formatLocationDisplay(initialData.to) : prev.destination,
        departureDate: initialData.departure || prev.departureDate,
        returnDate: initialData.return || (tripType === 'round-trip' ? prev.returnDate : undefined),
        passengers: typeof initialData.passengers === 'object' && initialData.passengers !== null
          ? {
              adults: initialData.passengers.adults || prev.passengers.adults,
              children: initialData.passengers.children || prev.passengers.children,
              infants: initialData.passengers.infants || prev.passengers.infants
            }
          : {
              adults: parseInt(initialData.passengers) || prev.passengers.adults,
              children: prev.passengers.children,
              infants: prev.passengers.infants
            },
        tripType: tripType
      }))
    }
  }, [initialData])

  const formatDate = (dateString: string) => {
    // Fix timezone issue by parsing the date correctly
    const [year, month, day] = dateString.split('-').map(Number)
    const date = new Date(year, month - 1, day) // month is 0-indexed
    
    // Use the actual day from the date string to avoid timezone issues
    const dayNum = day // Use the original day number directly
    const monthName = date.toLocaleDateString('en-US', { month: 'short' })
    return `${dayNum} ${monthName}`
  }

  const getTotalPassengers = () => {
    const { adults, children, infants } = formData.passengers
    const total = adults + children + infants
    return `${total} passenger${total !== 1 ? 's' : ''}`
  }

  const handleSearch = () => {
    onSearch(formData)
  }

  const handleRouteClick = () => {
    setIsRouteOpen(true)
    setEditingField('origin')
  }

  const handlePassengersClick = () => {
    setIsPassengerOpen(!isPassengerOpen)
  }

  const handleDateClick = () => {
    setIsDatePickerOpen(!isDatePickerOpen)
  }

  const handleRouteSearch = async (query: string) => {
    setRouteSearchQuery(query)
    if (query.length >= 2) {
      // Mock airport search - replace with actual API call
      const mockResults = [
        { iataCode: 'LHR', name: 'London Heathrow Airport', city: 'London', country: 'United Kingdom' },
        { iataCode: 'LGW', name: 'London Gatwick Airport', city: 'London', country: 'United Kingdom' },
        { iataCode: 'STN', name: 'London Stansted Airport', city: 'London', country: 'United Kingdom' },
        { iataCode: 'LTN', name: 'London Luton Airport', city: 'London', country: 'United Kingdom' },
        { iataCode: 'JFK', name: 'John F Kennedy International Airport', city: 'New York', country: 'United States' },
        { iataCode: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'United States' },
        { iataCode: 'LOS', name: 'Murtala Muhammed International Airport', city: 'Lagos', country: 'Nigeria' },
        { iataCode: 'ABV', name: 'Nnamdi Azikiwe International Airport', city: 'Abuja', country: 'Nigeria' },
        { iataCode: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'United Arab Emirates' },
        { iataCode: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France' },
        { iataCode: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany' },
        { iataCode: 'AMS', name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', country: 'Netherlands' },
        { iataCode: 'MAD', name: 'Madrid-Barajas Airport', city: 'Madrid', country: 'Spain' },
        { iataCode: 'FCO', name: 'Leonardo da Vinci Airport', city: 'Rome', country: 'Italy' },
        { iataCode: 'IST', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey' },
        { iataCode: 'CAI', name: 'Cairo International Airport', city: 'Cairo', country: 'Egypt' },
        { iataCode: 'JNB', name: 'OR Tambo International Airport', city: 'Johannesburg', country: 'South Africa' },
        { iataCode: 'NBO', name: 'Jomo Kenyatta International Airport', city: 'Nairobi', country: 'Kenya' }
      ].filter(airport => 
        airport.city.toLowerCase().includes(query.toLowerCase()) ||
        airport.iataCode.toLowerCase().includes(query.toLowerCase()) ||
        airport.name.toLowerCase().includes(query.toLowerCase())
      )
      setRouteSearchResults(mockResults)
    } else {
      setRouteSearchResults([])
    }
  }

  const handleRouteSelect = (airport: any) => {
    const formattedLocation = `${airport.city} (${airport.iataCode})`
    
    if (editingField === 'origin') {
      setFormData(prev => ({ ...prev, origin: formattedLocation }))
      // Switch to destination selection and keep dropdown open
      setEditingField('destination')
      setRouteSearchQuery('')
      // Don't close the dropdown - keep it open for destination selection
    } else if (editingField === 'destination') {
      setFormData(prev => ({ ...prev, destination: formattedLocation }))
      // Close dropdown after selecting destination
      setIsRouteOpen(false)
      setEditingField(null)
      setRouteSearchQuery('')
    }
  }

  const updatePassengerCount = (type: 'adults' | 'children' | 'infants', increment: boolean) => {
    setFormData(prev => ({
      ...prev,
      passengers: {
        ...prev.passengers,
        [type]: Math.max(0, prev.passengers[type] + (increment ? 1 : -1))
      }
    }))
  }

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const formatDateForInput = (date: Date) => {
    // Format date without timezone issues
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const isDateSelected = (date: Date) => {
    const dateStr = formatDateForInput(date)
    if (selectedDateType === 'departure') {
      return dateStr === formData.departureDate
    } else {
      return dateStr === formData.returnDate
    }
  }

  const isDateInRange = (date: Date) => {
    if (formData.tripType !== 'round-trip' || !formData.departureDate || !formData.returnDate) {
      return false
    }
    const dateStr = formatDateForInput(date)
    return dateStr > formData.departureDate && dateStr < formData.returnDate
  }

  const handleDateSelect = (date: Date) => {
    const dateStr = formatDateForInput(date)
    if (selectedDateType === 'departure') {
      setFormData(prev => ({ ...prev, departureDate: dateStr }))
      // If round-trip and no return date, switch to return selection
      if (formData.tripType === 'round-trip' && !formData.returnDate) {
        setSelectedDateType('return')
      }
    } else {
      setFormData(prev => ({ ...prev, returnDate: dateStr }))
    }
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev)
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1)
      } else {
        newMonth.setMonth(prev.getMonth() + 1)
      }
      return newMonth
    })
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDay = getFirstDayOfMonth(currentMonth)
    const today = new Date()
    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      const isToday = date.toDateString() === today.toDateString()
      const isSelected = isDateSelected(date)
      const isInRange = isDateInRange(date)
      const isPast = date < today && !isToday

      days.push(
        <button
          key={day}
          onClick={() => handleDateSelect(date)}
          disabled={isPast}
          className={`w-8 h-8 text-sm rounded transition-colors ${
            isSelected
              ? 'bg-brand-red text-white'
              : isInRange
              ? 'bg-brand-red-100 text-brand-red'
              : isToday
              ? 'bg-blue-100 text-blue-600 font-medium'
              : isPast
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {day}
        </button>
      )
    }

    return days
  }

  const formatDateDisplay = () => {
    console.log('🔍 formatDateDisplay - tripType:', formData.tripType, 'returnDate:', formData.returnDate, 'departureDate:', formData.departureDate);
    
    if (formData.tripType === 'round-trip' && formData.returnDate) {
      return `${formatDate(formData.departureDate)} - ${formatDate(formData.returnDate)}`
    }
    return formatDate(formData.departureDate)
  }

  const getDateLabel = () => {
    return formData.tripType === 'round-trip' ? 'Dept - Ret' : 'Dept'
  }

  const getCabinClassDisplay = () => {
    switch (formData.cabinClass) {
      case 'economy': return 'Economy'
      case 'premium_economy': return 'Premium Economy'
      case 'business': return 'Business'
      case 'first': return 'First Class'
      default: return 'Economy'
    }
  }

  return (
    <div className="bg-white rounded-b-2xl shadow-sm">
      {/* Input Fields Row */}
      <div className="flex items-center gap-8 px-16 pt-6 py-6">
        {/* Route Section - flex-2 */}
        <div className="flex flex-col justify-center flex-[2] relative route-dropdown">
          <div 
            className="flex items-center gap-1 p-1 bg-white rounded border-0 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={handleRouteClick}
          >
            <Image
              src="/images/icons/plane-departure.svg"
              alt="Departure"
              width={20}
              height={20}
              className="w-5 h-5"
            />
            <span className="font-bold text-sm text-gray-800 whitespace-nowrap">
              {formatLocationDisplay(formData.origin)}
            </span>
            <span className="text-sm text-gray-800 mx-1">-</span>
            <Image
              src="/images/icons/plane-arrival.svg"
              alt="Arrival"
              width={20}
              height={20}
              className="w-5 h-5"
            />
            <span className="font-bold text-sm text-gray-800 whitespace-nowrap">
              {formatLocationDisplay(formData.destination)}
            </span>
          </div>

          {/* Route Autocomplete Dropdown */}
          {isRouteOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 w-full min-w-[400px] max-w-[500px]">
              <div className="p-3 border-b border-gray-200">
                <div className="flex gap-2 mb-2">
                  <button
                    onClick={() => setEditingField('origin')}
                    className={`px-3 py-1 text-xs rounded ${editingField === 'origin' ? 'bg-brand-red text-white' : 'bg-gray-100 text-gray-600'}`}
                  >
                    From
                  </button>
                  <button
                    onClick={() => setEditingField('destination')}
                    className={`px-3 py-1 text-xs rounded ${editingField === 'destination' ? 'bg-brand-red text-white' : 'bg-gray-100 text-gray-600'}`}
                  >
                    To
                  </button>
                </div>
                <input
                  type="text"
                  placeholder={`Search ${editingField === 'origin' ? 'departure' : 'destination'} city or airport...`}
                  value={routeSearchQuery}
                  onChange={(e) => handleRouteSearch(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-brand-red"
                  autoFocus
                />
              </div>
              <div className="max-h-48 overflow-y-auto">
                {routeSearchResults.map((airport) => (
                  <button
                    key={airport.iataCode}
                    onClick={() => handleRouteSelect(airport)}
                    className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium text-sm text-gray-900">
                      {airport.city} ({airport.iataCode})
                    </div>
                    <div className="text-xs text-gray-500">
                      {airport.name}, {airport.country}
                    </div>
                  </button>
                ))}
                {routeSearchQuery.length >= 2 && routeSearchResults.length === 0 && (
                  <div className="px-3 py-4 text-sm text-gray-500 text-center">
                    No airports found for "{routeSearchQuery}"
                  </div>
                )}
                {routeSearchQuery.length < 2 && (
                  <div className="px-3 py-4 text-sm text-gray-500 text-center">
                    Type at least 2 characters to search airports
                  </div>
                )}
                {routeSearchQuery.length === 0 && (
                  <div className="px-3 py-4 text-sm text-gray-400 text-center">
                    Popular destinations: London, New York, Lagos, Dubai, Paris
                  </div>
                )}
              </div>
              
              {/* Done Button */}
              <div className="border-t border-gray-200 p-3">
                <button
                  onClick={() => {
                    setIsRouteOpen(false)
                    setEditingField(null)
                    setRouteSearchQuery('')
                  }}
                  className="w-full px-3 py-2 bg-brand-red text-white rounded text-sm hover:bg-brand-red-600 transition-colors font-medium"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Vertical Divider */}
        <div className="w-px h-8 bg-gray-800 opacity-50"></div>

        {/* Date Section - flex-1 */}
        <div className="flex flex-col justify-center flex-1 relative date-picker-dropdown">
          <div 
            className="flex items-center gap-1 p-1 bg-white rounded border-0 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={handleDateClick}
          >
            <Image
              src="/images/icons/calendar-day.svg"
              alt="Calendar"
              width={20}
              height={20}
              className="w-5 h-5"
            />
            <span className="font-bold text-sm text-gray-800">
              {getDateLabel()}
            </span>
          </div>
          <div className="mt-1">
            <span className="text-sm text-brand-red font-medium cursor-pointer hover:text-brand-red-600 transition-colors">
              {formatDateDisplay()}
            </span>
          </div>

          {/* Date Picker Dropdown */}
          {isDatePickerOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30 p-4 min-w-[320px]">
              {/* Date Type Selector for Round Trip */}
              {formData.tripType === 'round-trip' && (
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setSelectedDateType('departure')}
                    className={`flex-1 px-3 py-2 text-sm rounded transition-colors ${
                      selectedDateType === 'departure'
                        ? 'bg-brand-red text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Departure: {formData.departureDate ? formatDate(formData.departureDate) : 'Select'}
                  </button>
                  <button
                    onClick={() => setSelectedDateType('return')}
                    className={`flex-1 px-3 py-2 text-sm rounded transition-colors ${
                      selectedDateType === 'return'
                        ? 'bg-brand-red text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Return: {formData.returnDate ? formatDate(formData.returnDate) : 'Select'}
                  </button>
                </div>
              )}

              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <h3 className="text-sm font-medium text-gray-900">
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
                
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="mb-4">
                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                    <div key={day} className="w-8 h-6 text-xs font-medium text-gray-500 flex items-center justify-center">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1">
                  {renderCalendar()}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setCurrentMonth(new Date())
                    const today = formatDateForInput(new Date())
                    if (selectedDateType === 'departure') {
                      setFormData(prev => ({ ...prev, departureDate: today }))
                    } else {
                      setFormData(prev => ({ ...prev, returnDate: today }))
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 transition-colors"
                >
                  Today
                </button>
                <button
                  onClick={() => setIsDatePickerOpen(false)}
                  className="flex-1 px-3 py-2 bg-brand-red text-white rounded text-sm hover:bg-brand-red-600 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Vertical Divider */}
        <div className="w-px h-8 bg-gray-800 opacity-50"></div>

        {/* Passengers Section - flex-1 */}
        <div className="flex flex-col justify-center flex-1 relative passenger-dropdown">
          <div 
            className="flex items-center gap-1 p-1 bg-white rounded border-0 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={handlePassengersClick}
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="font-bold text-sm text-gray-800">
              Passengers
            </span>
          </div>
          <div className="mt-1">
            <span className="text-sm text-brand-red font-medium cursor-pointer hover:text-brand-red-600 transition-colors">
              {getTotalPassengers()}
            </span>
          </div>

          {/* Passenger Counter Dropdown */}
          {isPassengerOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30 p-4 min-w-[200px]">
              <div className="space-y-3">
                {/* Adults */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Adults</div>
                    <div className="text-xs text-gray-500">12+ years</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updatePassengerCount('adults', false)}
                      disabled={formData.passengers.adults <= 1}
                      className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm">{formData.passengers.adults}</span>
                    <button
                      onClick={() => updatePassengerCount('adults', true)}
                      className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-sm hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Children */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Children</div>
                    <div className="text-xs text-gray-500">2-11 years</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updatePassengerCount('children', false)}
                      disabled={formData.passengers.children <= 0}
                      className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm">{formData.passengers.children}</span>
                    <button
                      onClick={() => updatePassengerCount('children', true)}
                      className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-sm hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Infants */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Infants</div>
                    <div className="text-xs text-gray-500">Under 2 years</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updatePassengerCount('infants', false)}
                      disabled={formData.passengers.infants <= 0}
                      className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm">{formData.passengers.infants}</span>
                    <button
                      onClick={() => updatePassengerCount('infants', true)}
                      className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-sm hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsPassengerOpen(false)}
                className="w-full mt-4 px-3 py-2 bg-brand-red text-white rounded text-sm hover:bg-brand-red-600 transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>

        {/* Vertical Divider */}
        <div className="w-px h-8 bg-gray-800 opacity-50"></div>

        {/* Cabin Class Section - flex-1 */}
        <div className="flex flex-col justify-center flex-1">
          <div className="relative cabin-class-dropdown">
            <div 
              className="flex items-center gap-1 p-1 bg-white rounded border-0 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setIsCabinClassOpen(!isCabinClassOpen)}
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="font-bold text-sm text-gray-800">
                Class
              </span>
              <svg 
                className={`w-3 h-3 text-gray-500 transition-transform ${isCabinClassOpen ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            <div className="mt-1">
              <span className="text-sm text-brand-red font-medium">
                {getCabinClassDisplay()}
              </span>
            </div>

            {isCabinClassOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[140px]">
                {[
                  { value: 'economy', label: 'Economy' },
                  { value: 'premium_economy', label: 'Premium Economy' },
                  { value: 'business', label: 'Business' },
                  { value: 'first', label: 'First Class' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setFormData(prev => ({ ...prev, cabinClass: option.value }))
                      setIsCabinClassOpen(false)
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Flight Type and Search Button Row */}
      <div className="flex justify-between items-center px-16 pb-6">
        {/* Flight Type Dropdown */}
        <div className="relative inline-block flight-type-dropdown">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-sm font-medium text-gray-700">
              {formData.tripType === 'one-way' ? 'One-way' : 'Round-trip'}
            </span>
            <svg 
              className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
              <button
                onClick={() => {
                  setFormData(prev => ({ ...prev, tripType: 'one-way', returnDate: undefined }))
                  setIsDropdownOpen(false)
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
              >
                One-way
              </button>
              <button
                onClick={() => {
                  setFormData(prev => ({ ...prev, tripType: 'round-trip', returnDate: prev.returnDate || '2021-06-16' }))
                  setIsDropdownOpen(false)
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
              >
                Round-trip
              </button>
            </div>
          )}
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="bg-brand-red text-white px-6 py-3 rounded-lg font-medium text-sm hover:bg-brand-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Searching...
            </>
          ) : (
            'Search'
          )}
        </button>
      </div>
    </div>
  )
}