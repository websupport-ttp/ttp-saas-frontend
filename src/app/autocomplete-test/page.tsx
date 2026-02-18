'use client';

import { useState } from 'react';
import { AutocompleteInput } from '@/components/ui/AutocompleteInput';
import { referenceDataService } from '@/lib/services/reference-data-service';

export default function AutocompleteTestPage() {
  const [value, setValue] = useState('');
  const [selectedOption, setSelectedOption] = useState<any>(null);
  interface DebugInfo {
    lastQuery?: string;
    searching?: boolean;
    results?: any[];
    error?: string;
    rawAirports?: any[];
  }
  
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({});

  const searchAirports = async (query: string) => {
    console.log('🔍 Searching for:', query);
    setDebugInfo(prev => ({ ...prev, lastQuery: query, searching: true }));
    
    try {
      if (!query || query.length < 3) {
        setDebugInfo(prev => ({ ...prev, results: [], searching: false }));
        return [];
      }
      
      const airports = await referenceDataService.searchAirports(query, 5);
      console.log('✅ Found airports:', airports);
      
      const formatted = airports.map(airport => referenceDataService.formatAirportOption(airport));
      console.log('📝 Formatted options:', formatted);
      
      setDebugInfo(prev => ({ 
        ...prev, 
        results: formatted, 
        searching: false,
        rawAirports: airports 
      }));
      
      return formatted;
    } catch (error) {
      console.error('❌ Search error:', error);
      setDebugInfo(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : String(error), 
        searching: false 
      }));
      return [];
    }
  };

  const handleChange = (newValue: string, option?: any) => {
    console.log('📝 Value changed:', newValue, 'Option:', option);
    setValue(newValue);
    setSelectedOption(option);
    setDebugInfo(prev => ({ ...prev, selectedOption: option }));
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Autocomplete Debug Test</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Input */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Airport Search Test</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Airport (type at least 3 characters)
              </label>
              <div className="border border-gray-300 rounded-lg p-3 bg-white relative">
                <AutocompleteInput
                  value={value}
                  onChange={handleChange}
                  placeholder="Type 'London' or 'New York'..."
                  fetchSuggestions={searchAirports}
                  minQueryLength={3}
                  maxSuggestions={5}
                />
              </div>
            </div>
            
            <div className="text-sm">
              <strong>Current Value:</strong> {value || '(empty)'}
            </div>
            
            {selectedOption && (
              <div className="text-sm">
                <strong>Selected:</strong> {selectedOption.label} ({selectedOption.value})
              </div>
            )}
          </div>
        </div>

        {/* Debug Info */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
          
          <div className="space-y-3 text-sm">
            <div>
              <strong>Last Query:</strong> {debugInfo.lastQuery || '(none)'}
            </div>
            
            <div>
              <strong>Searching:</strong> {debugInfo.searching ? '🔄 Yes' : '✅ No'}
            </div>
            
            <div>
              <strong>Results Count:</strong> {debugInfo.results?.length || 0}
            </div>
            
            {debugInfo.error && (
              <div className="text-red-600">
                <strong>Error:</strong> {debugInfo.error}
              </div>
            )}
            
            {debugInfo.results && debugInfo.results.length > 0 && (
              <div>
                <strong>Formatted Results:</strong>
                <ul className="mt-2 space-y-1">
                  {debugInfo.results.map((result: any, index: number) => (
                    <li key={index} className="bg-white p-2 rounded border text-xs">
                      <div><strong>Label:</strong> {result.label}</div>
                      <div><strong>Value:</strong> {result.value}</div>
                      <div><strong>Subtitle:</strong> {result.subtitle}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Manual Test Buttons */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Manual Tests</h2>
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={() => {
              setValue('London');
              searchAirports('London');
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Test "London"
          </button>
          <button
            onClick={() => {
              setValue('New York');
              searchAirports('New York');
            }}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Test "New York"
          </button>
          <button
            onClick={() => {
              setValue('');
              setSelectedOption(null);
              setDebugInfo({});
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Raw Debug Data */}
      {debugInfo.rawAirports && (
        <div className="mt-6 bg-gray-100 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Raw API Response:</h3>
          <pre className="text-xs overflow-auto bg-white p-3 rounded border">
            {JSON.stringify(debugInfo.rawAirports, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}