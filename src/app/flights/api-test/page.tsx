'use client'

import { useState } from 'react'
import { flightService } from '@/lib/services/flight-service'
import { apiClient } from '@/lib/api-client'

export default function ApiTestPage() {
  const [testResults, setTestResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const runTests = async () => {
    setIsLoading(true)
    const results: any[] = []

    // Test 1: Basic API connectivity
    try {
      const response = await fetch('http://localhost:8080/health')
      const data = await response.json()
      results.push({
        test: 'Backend Health Check',
        status: response.ok ? 'PASS' : 'FAIL',
        data: data,
        error: null
      })
    } catch (error) {
      results.push({
        test: 'Backend Health Check',
        status: 'FAIL',
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }

    // Test 2: API Client Configuration
    try {
      const response = await apiClient.get('/health', { requiresAuth: false })
      results.push({
        test: 'API Client Health Check',
        status: 'PASS',
        data: response,
        error: null
      })
    } catch (error) {
      results.push({
        test: 'API Client Health Check',
        status: 'FAIL',
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }

    // Test 3: Flight Search Endpoint
    try {
      const testCriteria = {
        origin: 'LOS',
        destination: 'JFK',
        departureDate: '2024-12-15',
        passengers: {
          adults: 1,
          children: 0,
          infants: 0
        },
        cabinClass: 'economy' as const,
        tripType: 'one_way' as const
      }

      const response = await flightService.searchFlights(testCriteria)
      results.push({
        test: 'Flight Search Service',
        status: 'PASS',
        data: response,
        error: null
      })
    } catch (error) {
      results.push({
        test: 'Flight Search Service',
        status: 'FAIL',
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }

    // Test 4: Direct API call to flight search
    try {
      const response = await fetch('http://localhost:8080/api/v1/products/flights/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originLocationCode: 'LOS',
          destinationLocationCode: 'JFK',
          departureDate: '2024-12-15',
          adults: 1,
          children: 0,
          infants: 0,
          currencyCode: 'NGN',
          max: 50,
          travelClass: 'ECONOMY',
          nonStop: false
        })
      })
      
      const data = await response.json()
      results.push({
        test: 'Direct Flight Search API',
        status: response.ok ? 'PASS' : 'FAIL',
        data: data,
        error: null
      })
    } catch (error) {
      results.push({
        test: 'Direct Flight Search API',
        status: 'FAIL',
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }

    setTestResults(results)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          API Connection Test
        </h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Configuration</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Frontend URL:</strong> http://localhost:3000</p>
            <p><strong>Backend URL:</strong> http://localhost:8080/api/v1</p>
            <p><strong>Health Check:</strong> http://localhost:8080/health</p>
            <p><strong>Flight Search:</strong> http://localhost:8080/api/v1/products/flights/search</p>
          </div>
        </div>

        <button
          onClick={runTests}
          disabled={isLoading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 mb-6"
        >
          {isLoading ? 'Running Tests...' : 'Run API Tests'}
        </button>

        {testResults.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Test Results</h2>
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${
                  result.status === 'PASS' 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{result.test}</h3>
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      result.status === 'PASS'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {result.status}
                  </span>
                </div>
                
                {result.error && (
                  <div className="mb-2">
                    <p className="text-red-600 text-sm">
                      <strong>Error:</strong> {result.error}
                    </p>
                  </div>
                )}
                
                {result.data && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                      View Response Data
                    </summary>
                    <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-40">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">Troubleshooting Steps:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-700">
            <li>Make sure your backend is running on port 3004</li>
            <li>Check if MongoDB is running and accessible</li>
            <li>Verify CORS is properly configured in the backend</li>
            <li>Check browser console for any network errors</li>
            <li>Ensure environment variables are properly loaded</li>
          </ol>
        </div>
      </div>
    </div>
  )
}