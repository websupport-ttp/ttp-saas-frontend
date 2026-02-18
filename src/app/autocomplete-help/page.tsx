'use client';

import { useState } from 'react';
import { AutocompleteInput } from '@/components/ui/AutocompleteInput';
import { referenceDataService } from '@/lib/services/reference-data-service';

export default function AutocompleteHelpPage() {
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');
  const [fromSelected, setFromSelected] = useState<any>(null);
  const [toSelected, setToSelected] = useState<any>(null);

  const searchAirports = async (query: string) => {
    try {
      if (!query || query.length < 3) return [];
      const airports = await referenceDataService.searchAirports(query, 5);
      return airports.map(airport => referenceDataService.formatAirportOption(airport));
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  };

  const handleFromChange = (value: string, option?: any) => {
    console.log('From changed:', { value, option });
    setFromValue(value);
    setFromSelected(option || null);
  };

  const handleToChange = (value: string, option?: any) => {
    console.log('To changed:', { value, option });
    setToValue(value);
    setToSelected(option || null);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">How to Use Airport Search</h1>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-blue-800 mb-4">Instructions</h2>
        <ol className="list-decimal list-inside space-y-2 text-blue-700">
          <li>Type at least 3 characters in the airport field (e.g., "Lon" for London)</li>
          <li>Wait for the dropdown to appear with airport suggestions</li>
          <li><strong>Click on one of the suggestions</strong> - don't just type and leave</li>
          <li>The selected airport will be highlighted and the field will show the airport name</li>
          <li>Only then will the form validation pass</li>
        </ol>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* From Field */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">From Airport</h3>
          <div className="border border-gray-300 rounded-lg p-3">
            <AutocompleteInput
              value={fromValue}
              onChange={handleFromChange}
              placeholder="Type 'London' then click suggestion"
              fetchSuggestions={searchAirports}
              minQueryLength={3}
              maxSuggestions={5}
            />
          </div>
          <div className="mt-3 text-sm">
            <div><strong>Display Value:</strong> {fromValue || '(empty)'}</div>
            <div><strong>Selected Airport:</strong> {fromSelected ? `${fromSelected.label} (${fromSelected.value})` : '(none)'}</div>
            <div className={`font-medium ${fromSelected ? 'text-green-600' : 'text-red-600'}`}>
              Status: {fromSelected ? '✅ Valid Selection' : '❌ No Selection'}
            </div>
          </div>
        </div>

        {/* To Field */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">To Airport</h3>
          <div className="border border-gray-300 rounded-lg p-3">
            <AutocompleteInput
              value={toValue}
              onChange={handleToChange}
              placeholder="Type 'Paris' then click suggestion"
              fetchSuggestions={searchAirports}
              minQueryLength={3}
              maxSuggestions={5}
            />
          </div>
          <div className="mt-3 text-sm">
            <div><strong>Display Value:</strong> {toValue || '(empty)'}</div>
            <div><strong>Selected Airport:</strong> {toSelected ? `${toSelected.label} (${toSelected.value})` : '(none)'}</div>
            <div className={`font-medium ${toSelected ? 'text-green-600' : 'text-red-600'}`}>
              Status: {toSelected ? '✅ Valid Selection' : '❌ No Selection'}
            </div>
          </div>
        </div>
      </div>

      {/* Test Button */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Form Validation Test</h3>
        <button
          onClick={() => {
            const isValid = fromSelected && toSelected;
            alert(isValid 
              ? `✅ Form is valid!\nFrom: ${fromSelected.value}\nTo: ${toSelected.value}` 
              : '❌ Please select both airports from the dropdown suggestions'
            );
          }}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 font-medium"
        >
          Test Form Validation
        </button>
        
        <div className="mt-4 p-4 bg-gray-50 rounded border">
          <h4 className="font-medium mb-2">Current Form State:</h4>
          <div className="text-sm space-y-1">
            <div>From: {fromSelected ? `✅ ${fromSelected.value}` : '❌ Not selected'}</div>
            <div>To: {toSelected ? `✅ ${toSelected.value}` : '❌ Not selected'}</div>
            <div className="font-medium mt-2">
              Form Valid: {fromSelected && toSelected ? '✅ Yes' : '❌ No'}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Common Issues</h3>
        <ul className="list-disc list-inside space-y-1 text-yellow-700">
          <li><strong>Typing but not selecting:</strong> You must click on a dropdown suggestion</li>
          <li><strong>Dropdown not visible:</strong> Make sure you type at least 3 characters</li>
          <li><strong>No suggestions:</strong> Try different search terms like "London", "Paris", "New York"</li>
          <li><strong>Form validation fails:</strong> Both airports must be selected from dropdown</li>
        </ul>
      </div>
    </div>
  );
}