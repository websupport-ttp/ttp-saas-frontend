'use client'

import { useState, useEffect, useRef } from 'react'

interface Country {
  name: {
    common: string
  }
  cca2: string
  idd: {
    root: string
    suffixes: string[]
  }
  flag: string
  flags: {
    svg: string
    png: string
  }
}

interface CountryCodeSelectorProps {
  selectedCountry?: string
  onCountryChange: (countryCode: string, dialCode: string) => void
  className?: string
}

export default function CountryCodeSelector({
  selectedCountry = 'NG',
  onCountryChange,
  className = ''
}: CountryCodeSelectorProps) {
  const [countries, setCountries] = useState<Country[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fetch countries data
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd,flag,flags')
        const data: Country[] = await response.json()
        
        // Filter countries that have dial codes and sort by name
        const validCountries = data
          .filter(country => country.idd?.root && country.idd?.suffixes?.length > 0)
          .sort((a, b) => a.name.common.localeCompare(b.name.common))
        
        setCountries(validCountries)
      } catch (error) {
        console.error('Failed to fetch countries:', error)
        // Fallback to common countries if API fails
        setCountries([
          {
            name: { common: 'Nigeria' },
            cca2: 'NG',
            idd: { root: '+234', suffixes: [''] },
            flag: '🇳🇬',
            flags: { svg: '', png: '' }
          },
          {
            name: { common: 'United States' },
            cca2: 'US',
            idd: { root: '+1', suffixes: [''] },
            flag: '🇺🇸',
            flags: { svg: '', png: '' }
          },
          {
            name: { common: 'United Kingdom' },
            cca2: 'GB',
            idd: { root: '+44', suffixes: [''] },
            flag: '🇬🇧',
            flags: { svg: '', png: '' }
          },
          {
            name: { common: 'Canada' },
            cca2: 'CA',
            idd: { root: '+1', suffixes: [''] },
            flag: '🇨🇦',
            flags: { svg: '', png: '' }
          },
          {
            name: { common: 'Germany' },
            cca2: 'DE',
            idd: { root: '+49', suffixes: [''] },
            flag: '🇩🇪',
            flags: { svg: '', png: '' }
          },
          {
            name: { common: 'France' },
            cca2: 'FR',
            idd: { root: '+33', suffixes: [''] },
            flag: '🇫🇷',
            flags: { svg: '', png: '' }
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchCountries()
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedCountryData = countries.find(country => country.cca2 === selectedCountry)
  const getDialCode = (country: Country) => {
    return country.idd.root + (country.idd.suffixes[0] || '')
  }

  const getFlagUrl = (countryCode: string) => {
    return `https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`
  }

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getDialCode(country).includes(searchTerm)
  )

  const handleCountrySelect = (country: Country) => {
    const dialCode = getDialCode(country)
    onCountryChange(country.cca2, dialCode)
    setIsOpen(false)
    setSearchTerm('')
  }

  if (loading) {
    return (
      <div className="flex items-center px-3 border-r border-gray-300">
        <div className="flex items-center gap-2">
          <div className="w-5 h-4 bg-gray-200 rounded animate-pulse"></div>
          <span className="text-gray-400 text-sm">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center h-full px-3 border-r border-gray-300 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {selectedCountryData ? (
            <>
              <img 
                src={getFlagUrl(selectedCountryData.cca2)} 
                alt={`${selectedCountryData.name.common} flag`}
                className="w-5 h-4 object-cover rounded-sm"
                onError={(e) => {
                  // Fallback to emoji if image fails to load
                  const img = e.currentTarget
                  const emoji = img.nextElementSibling as HTMLElement
                  img.style.display = 'none'
                  if (emoji) emoji.style.display = 'inline'
                }}
              />
              <span className="text-lg hidden">{selectedCountryData.flag}</span>
              <span className="text-gray-600 text-sm">{getDialCode(selectedCountryData)}</span>
            </>
          ) : (
            <>
              <img 
                src={getFlagUrl('ng')} 
                alt="Nigeria flag"
                className="w-5 h-4 object-cover rounded-sm"
                onError={(e) => {
                  const img = e.currentTarget
                  const emoji = img.nextElementSibling as HTMLElement
                  img.style.display = 'none'
                  if (emoji) emoji.style.display = 'inline'
                }}
              />
              <span className="text-lg hidden">🇳🇬</span>
              <span className="text-gray-600 text-sm">+234</span>
            </>
          )}
          <svg 
            className={`w-3 h-3 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-60 overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Countries list */}
          <div className="overflow-y-auto max-h-48">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <button
                  key={country.cca2}
                  type="button"
                  onClick={() => handleCountrySelect(country)}
                  className={`w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center gap-3 ${
                    selectedCountry === country.cca2 ? 'bg-red-50 text-red-600' : 'text-gray-700'
                  }`}
                >
                  <img 
                    src={getFlagUrl(country.cca2)} 
                    alt={`${country.name.common} flag`}
                    className="w-5 h-4 object-cover rounded-sm flex-shrink-0"
                    onError={(e) => {
                      // Fallback to emoji if image fails to load
                      const img = e.currentTarget
                      const emoji = img.nextElementSibling as HTMLElement
                      img.style.display = 'none'
                      if (emoji) emoji.style.display = 'inline'
                    }}
                  />
                  <span className="text-lg hidden">{country.flag}</span>
                  <span className="flex-1 text-sm">{country.name.common}</span>
                  <span className="text-sm text-gray-500">{getDialCode(country)}</span>
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">
                No countries found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}