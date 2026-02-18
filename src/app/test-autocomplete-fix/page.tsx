'use client';

import { useState } from 'react';
import { AutocompleteInput } from '@/components/ui/AutocompleteInput';

// Mock data for testing
const mockAirports = [
  { value: 'LHR', label: 'London Heathrow Airport (LHR)', subtitle: 'London, United Kingdom' },
  { value: 'JFK', label: 'John F. Kennedy International Airport (JFK)', subtitle: 'New York, United States' },
  { value: 'CDG', label: 'Charles de Gaulle Airport (CDG)', subtitle: 'Paris, France' },
  { value: 'DXB', label: 'Dubai International Airport (DXB)', subtitle: 'Dubai, United Arab Emirates' },
  { value: 'LAX', label: 'Los Angeles International Airport (LAX)', subtitle: 'Los Angeles, United States' },
  { value: 'LOS', label: 'Murtala Muhammed International Airport (LOS)', subtitle: 'Lagos, Nigeria' },
  { value: 'ABV', label: 'Nnamdi Azikiwe International Airport (ABV)', subtitle: 'Abuja, Nigeria' },
  { value: 'SIN', label: 'Singapore Changi Airport (SIN)', subtitle: 'Singapore' },
  { value: 'NRT', label: 'Narita International Airport (NRT)', subtitle: 'Tokyo, Japan' },
  { value: 'SYD', label: 'Sydney Kingsford Smith Airport (SYD)', subtitle: 'Sydney, Australia' }
];

interface SelectedOption {
  value: string;
  label: string;
  subtitle?: string;
}

interface SelectedOptions {
  from?: SelectedOption;
  to?: SelectedOption;
}

export default function TestAutocompleteFix() {
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});

  const fetchAirportSuggestions = async (query: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    if (query.length === 0) {
      return mockAirports.slice(0, 5);
    }

    return mockAirports.filter(airport =>
      airport.label.toLowerCase().includes(query.toLowerCase()) ||
      airport.value.toLowerCase().includes(query.toLowerCase()) ||
      airport.subtitle.toLowerCase().includes(query.toLowerCase())
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Autocomplete Positioning Test
          </h1>

          <div className="space-y-8">
            {/* Test at top of page */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700">Test 1: Top of Page</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">From</label>
                  <div className="border border-gray-300 rounded-lg p-3">
                    <AutocompleteInput
                      value={fromValue}
                      onChange={(value, option) => {
                        console.log('Test page: From changed:', { value, option });
                        setFromValue(value);
                        if (option) {
                          setSelectedOptions(prev => ({ ...prev, from: option }));
                        }
                      }}
                      placeholder="Select departure airport"
                      fetchSuggestions={fetchAirportSuggestions}
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">To</label>
                  <div className="border border-gray-300 rounded-lg p-3">
                    <AutocompleteInput
                      value={toValue}
                      onChange={(value, option) => {
                        console.log('Test page: To changed:', { value, option });
                        setToValue(value);
                        if (option) {
                          setSelectedOptions(prev => ({ ...prev, to: option }));
                        }
                      }}
                      placeholder="Select destination airport"
                      fetchSuggestions={fetchAirportSuggestions}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Add some content to push the next test down */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700">Spacing Content</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900">Card {i}</h3>
                    <p className="text-gray-600 mt-2">
                      This is some sample content to create spacing and test autocomplete positioning
                      at different scroll positions on the page.
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Test in middle of page */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700">Test 2: Middle of Page</h2>
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">From (Middle)</label>
                    <div className="border border-gray-300 rounded-lg p-3 bg-white">
                      <AutocompleteInput
                        value=""
                        onChange={() => { }}
                        placeholder="Test middle positioning"
                        fetchSuggestions={fetchAirportSuggestions}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">To (Middle)</label>
                    <div className="border border-gray-300 rounded-lg p-3 bg-white">
                      <AutocompleteInput
                        value=""
                        onChange={() => { }}
                        placeholder="Test middle positioning"
                        fetchSuggestions={fetchAirportSuggestions}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* More spacing content */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700">More Spacing</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-gray-100 p-6 rounded-lg">
                    <h3 className="font-medium text-gray-900">Content Block {i}</h3>
                    <p className="text-gray-600 mt-2">
                      Additional content to test autocomplete positioning at different scroll positions.
                      The dropdown should always appear near the input field, not at the bottom of the screen.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-12 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">Testing Instructions</h3>
            <ul className="text-yellow-700 space-y-1">
              <li>• Click on any autocomplete input field</li>
              <li>• Type a few characters (e.g., "lon" for London)</li>
              <li>• Verify the dropdown appears directly below the input field</li>
              <li>• Test at different scroll positions on the page</li>
              <li>• The dropdown should never appear at the bottom of the screen</li>
              <li>• Try scrolling while the dropdown is open</li>
            </ul>
          </div>

          {/* Debug info */}
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Debug Info</h3>
            <p className="text-gray-600 text-sm">
              Current values: From = "{fromValue}", To = "{toValue}"
            </p>
            {selectedOptions.from && (
              <p className="text-green-600 text-sm mt-1">
                From option: {selectedOptions.from.label} ({selectedOptions.from.value})
              </p>
            )}
            {selectedOptions.to && (
              <p className="text-green-600 text-sm mt-1">
                To option: {selectedOptions.to.label} ({selectedOptions.to.value})
              </p>
            )}
            <div className="mt-2 text-xs text-gray-500">
              <p>• Type in the autocomplete fields above</p>
              <p>• Select an option from the dropdown</p>
              <p>• The selected value should appear in the input field</p>
              <p>• Check browser console for detailed logs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}