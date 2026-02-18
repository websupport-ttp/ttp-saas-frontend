'use client'

import { useState } from 'react'
import { 
  StyledDatePicker, 
  StyledAutocompleteInput, 
  StyledPassengerSelector, 
  StyledRoomSelector 
} from '@/components/ui/styled-popovers'

export default function StyledPopoversDemo() {
  const [dateValue, setDateValue] = useState('')
  const [autocompleteValue, setAutocompleteValue] = useState('')
  const [passengers, setPassengers] = useState({ adults: 1, children: 0, infants: 0 })
  const [rooms, setRooms] = useState({ rooms: 1, adults: 1, children: 0 })

  // Mock airport data for autocomplete
  const mockAirports = [
    { value: 'LOS', label: 'Murtala Muhammed International Airport (LOS)', subtitle: 'Lagos, Nigeria' },
    { value: 'ABV', label: 'Nnamdi Azikiwe International Airport (ABV)', subtitle: 'Abuja, Nigeria' },
    { value: 'LHR', label: 'London Heathrow Airport (LHR)', subtitle: 'London, United Kingdom' },
    { value: 'JFK', label: 'John F. Kennedy International Airport (JFK)', subtitle: 'New York, United States' },
    { value: 'DXB', label: 'Dubai International Airport (DXB)', subtitle: 'Dubai, United Arab Emirates' },
    { value: 'CDG', label: 'Charles de Gaulle Airport (CDG)', subtitle: 'Paris, France' },
    { value: 'AMS', label: 'Amsterdam Airport Schiphol (AMS)', subtitle: 'Amsterdam, Netherlands' },
    { value: 'FRA', label: 'Frankfurt Airport (FRA)', subtitle: 'Frankfurt, Germany' }
  ]

  const searchAirports = async (query: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const searchTerm = query.toLowerCase()
    return mockAirports.filter(airport => 
      airport.label.toLowerCase().includes(searchTerm) ||
      airport.value.toLowerCase().includes(searchTerm) ||
      airport.subtitle.toLowerCase().includes(searchTerm)
    ).slice(0, 5)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Styled Popover Components Demo
          </h1>
          <p className="text-gray-600">
            Redesigned popover components matching the Figma design specifications. All popovers now open above the input fields to prevent clipping in the hero section, with completely transparent backgrounds, no borders, and consistent brand-blue text colors that match the original design system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Date Picker */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Date Picker</h2>
            <p className="text-gray-600 mb-4">
              Dynamic date picker that shows single calendar for one-way trips and dual calendar for round-trip. Try switching between trip types!
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Travel Dates
                </label>
                <StyledDatePicker
                  value={dateValue}
                  onChange={setDateValue}
                  placeholder="Select dates"
                  minDate={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="text-sm text-gray-500">
                Selected: {dateValue || 'None'}
              </div>
            </div>
          </div>

          {/* Autocomplete Input */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Autocomplete Input</h2>
            <p className="text-gray-600 mb-4">
              Airport search with styled dropdown list, hover states, and keyboard navigation.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Airports
                </label>
                <StyledAutocompleteInput
                  value={autocompleteValue}
                  onChange={(value, option) => {
                    setAutocompleteValue(value)
                    if (option) {
                      console.log('Selected airport:', option)
                    }
                  }}
                  placeholder="Type 'Lagos' or 'LHR'..."
                  fetchSuggestions={searchAirports}
                  minQueryLength={2}
                />
              </div>
              <div className="text-sm text-gray-500">
                Current input: {autocompleteValue || 'None'}
              </div>
            </div>
          </div>

          {/* Passenger Selector */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Passenger Selector</h2>
            <p className="text-gray-600 mb-4">
              Flight passenger counter with styled increment/decrement buttons and proper constraints.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Passengers
                </label>
                <StyledPassengerSelector
                  value={passengers}
                  onChange={setPassengers}
                />
              </div>
              <div className="text-sm text-gray-500">
                Adults: {passengers.adults}, Children: {passengers.children}, Infants: {passengers.infants}
              </div>
            </div>
          </div>

          {/* Room Selector */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Room Selector</h2>
            <p className="text-gray-600 mb-4">
              Hotel room and guest counter with rooms, adults, and children options.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Rooms & Guests
                </label>
                <StyledRoomSelector
                  value={rooms}
                  onChange={setRooms}
                />
              </div>
              <div className="text-sm text-gray-500">
                Rooms: {rooms.rooms}, Adults: {rooms.adults}, Children: {rooms.children}
              </div>
            </div>
          </div>
        </div>

        {/* SearchForm Integration */}
        <div className="mt-12 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">SearchForm Integration</h2>
          <p className="text-gray-600 mb-4">
            The styled components are now integrated into the main SearchForm used on the homepage service tabs.
            Visit the homepage to see them in action!
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Integration Status</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✅ Flights: StyledAutocompleteInput, StyledDatePicker, StyledPassengerSelector</li>
              <li>✅ Hotels: StyledAutocompleteInput, StyledDatePicker, StyledRoomSelector</li>
              <li>✅ Car Hire: StyledAutocompleteInput, StyledDatePicker</li>
              <li>✅ Insurance: StyledAutocompleteInput, StyledDatePicker</li>
              <li>✅ Visa: StyledAutocompleteInput</li>
            </ul>
          </div>
        </div>

        {/* Features List */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Features Implemented</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Design Features</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✅ Figma-accurate styling and colors</li>
                <li>✅ Proper shadows and border radius</li>
                <li>✅ Consistent spacing and typography</li>
                <li>✅ Hover and focus states</li>
                <li>✅ Responsive design</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Functionality</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✅ Click outside to close</li>
                <li>✅ Keyboard navigation</li>
                <li>✅ Proper validation and constraints</li>
              <li>✅ Fixed passenger counter button logic</li>
              <li>✅ Improved date range selection</li>
              <li>✅ Fixed React key warnings</li>
              <li>✅ Clean production-ready code</li>
                <li>✅ Loading states</li>
                <li>✅ Error handling</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}