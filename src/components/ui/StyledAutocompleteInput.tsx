'use client'

import { useState, useRef, useEffect } from 'react'

interface Option {
  value: string
  label: string
  subtitle?: string
  data?: any
  type?: 'location' | 'airport' | 'current' | 'map'
}

interface StyledAutocompleteInputProps {
  value?: string
  onChange?: (value: string, option?: Option) => void
  placeholder?: string
  fetchSuggestions?: (query: string) => Promise<Option[]>
  minQueryLength?: number
  error?: boolean
  disabled?: boolean
  className?: string
  showLocationOptions?: boolean // For car hire pickup/dropoff
}

export function StyledAutocompleteInput({
  value = '',
  onChange,
  placeholder = 'Search...',
  fetchSuggestions,
  minQueryLength = 1,
  error = false,
  disabled = false,
  className = '',
  showLocationOptions = false
}: StyledAutocompleteInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<Option[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [gettingLocation, setGettingLocation] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Nigerian airports for car hire
  const nigerianAirports: Option[] = [
    { value: 'LOS', label: 'Murtala Muhammed International Airport', subtitle: 'Lagos (LOS)', type: 'airport' },
    { value: 'ABV', label: 'Nnamdi Azikiwe International Airport', subtitle: 'Abuja (ABV)', type: 'airport' },
    { value: 'PHC', label: 'Port Harcourt International Airport', subtitle: 'Port Harcourt (PHC)', type: 'airport' },
    { value: 'KAN', label: 'Mallam Aminu Kano International Airport', subtitle: 'Kano (KAN)', type: 'airport' },
    { value: 'ENU', label: 'Akanu Ibiam International Airport', subtitle: 'Enugu (ENU)', type: 'airport' },
  ]

  // Add CSS to hide scrollbar
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .hide-scrollbar::-webkit-scrollbar {
        display: none;
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Fetch suggestions when value changes
  useEffect(() => {
    const fetchOptions = async () => {
      if (!fetchSuggestions || !value || value.length < minQueryLength) {
        setOptions([])
        setIsOpen(false)
        return
      }

      setLoading(true)
      try {
        const results = await fetchSuggestions(value)
        setOptions(results)
        setIsOpen(results.length > 0)
        setSelectedIndex(-1)
      } catch (error) {
        console.error('Error fetching suggestions:', error)
        setOptions([])
        setIsOpen(false)
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(fetchOptions, 300) // Debounce
    return () => clearTimeout(timeoutId)
  }, [value, fetchSuggestions, minQueryLength])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange?.(newValue)
  }

  const handleOptionClick = (option: Option) => {
    onChange?.(option.label, option)
    setIsOpen(false)
    setSelectedIndex(-1)
  }

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser')
      return
    }

    setGettingLocation(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        
        // Use reverse geocoding to get address (simplified - in production use Google Maps API)
        const locationName = `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`
        
        onChange?.(locationName, {
          value: 'current',
          label: locationName,
          type: 'current',
          data: { latitude, longitude }
        })
        
        setGettingLocation(false)
        setIsOpen(false)
      },
      (error) => {
        console.error('Error getting location:', error)
        alert('Unable to get your location. Please check your browser permissions.')
        setGettingLocation(false)
      }
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || options.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => (prev < options.length - 1 ? prev + 1 : 0))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : options.length - 1))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < options.length) {
          handleOptionClick(options[selectedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Input Field */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (showLocationOptions || options.length > 0) {
            setIsOpen(true)
          }
        }}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full px-3 py-2 bg-transparent text-brand-blue placeholder-brand-blue/60 outline-none
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      />

      {/* Loading Indicator */}
      {(loading || gettingLocation) && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div 
          className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[9999] max-h-80 overflow-y-scroll hide-scrollbar"
          style={{
            scrollbarWidth: 'none', /* Firefox */
            msOverflowStyle: 'none', /* Internet Explorer 10+ */
          }}
        >
          <div className="py-2">
            {/* Location Options for Car Hire */}
            {showLocationOptions && !value && (
              <>
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Quick Options</div>
                
                <button
                  type="button"
                  onClick={handleCurrentLocation}
                  disabled={gettingLocation}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors flex items-center gap-3"
                >
                  <svg className="w-5 h-5 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <div className="font-medium text-gray-900">Use Current Location</div>
                    <div className="text-sm text-gray-500">Get your current position</div>
                  </div>
                </button>

                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase mt-2">Nearby Airports</div>
                
                {nigerianAirports.map((airport) => (
                  <button
                    key={airport.value}
                    type="button"
                    onClick={() => handleOptionClick(airport)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors"
                  >
                    <div className="font-medium text-gray-900">{airport.label}</div>
                    <div className="text-sm text-gray-500">{airport.subtitle}</div>
                  </button>
                ))}
              </>
            )}

            {/* Search Results */}
            {options.length > 0 && (
              <>
                {showLocationOptions && <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Search Results</div>}
                {options.map((option, index) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleOptionClick(option)}
                    className={`
                      w-full px-4 py-2 text-left transition-colors
                      ${index === selectedIndex 
                        ? 'bg-gray-900 text-white' 
                        : 'text-gray-900 hover:bg-gray-100'
                      }
                    `}
                  >
                    <div className="font-medium">{option.label}</div>
                    {option.subtitle && (
                      <div className={`text-sm ${
                        index === selectedIndex ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        {option.subtitle}
                      </div>
                    )}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}