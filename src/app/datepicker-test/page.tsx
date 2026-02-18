'use client';

import { useState } from 'react';
import { DatePicker } from '@/components/ui/DatePicker';

export default function DatePickerTestPage() {
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">DatePicker Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Departure Date */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Departure Date</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Departure Date
            </label>
            <DatePicker
              value={departureDate}
              onChange={setDepartureDate}
              placeholder="Click to select departure date"
              minDate={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          <div className="mt-4 text-sm">
            <strong>Selected:</strong> {departureDate || '(none)'}
          </div>
        </div>

        {/* Return Date */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Return Date</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Return Date
            </label>
            <DatePicker
              value={returnDate}
              onChange={setReturnDate}
              placeholder="Click to select return date"
              minDate={departureDate || new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          <div className="mt-4 text-sm">
            <strong>Selected:</strong> {returnDate || '(none)'}
          </div>
        </div>
      </div>

      {/* Test Results */}
      <div className="mt-8 bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Test Results</h3>
        <div className="space-y-2 text-sm">
          <div>
            <strong>Departure Date:</strong> {departureDate || 'Not selected'}
          </div>
          <div>
            <strong>Return Date:</strong> {returnDate || 'Not selected'}
          </div>
          <div>
            <strong>Valid Selection:</strong> {
              departureDate && returnDate && new Date(returnDate) > new Date(departureDate)
                ? '✅ Yes'
                : '❌ No'
            }
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Instructions</h3>
        <ul className="list-disc list-inside space-y-1 text-blue-700">
          <li>Click on the date picker input to open the calendar</li>
          <li>Select a departure date (today or later)</li>
          <li>Select a return date (after departure date)</li>
          <li>The calendar should show with proper navigation</li>
          <li>Selected dates should appear in the inputs</li>
        </ul>
      </div>
    </div>
  );
}