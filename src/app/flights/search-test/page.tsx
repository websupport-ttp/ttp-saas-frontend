'use client'

import { useState } from 'react'
import SearchForm from '@/components/ui/SearchForm'

export default function SearchTestPage() {
  const [searchResults, setSearchResults] = useState(null)

  const handleSearch = (data: any) => {
    console.log('🔍 Search function called with data:', data)
    alert('Search function called! Check console for data.')
    setSearchResults(data)
    // Here you would normally call an API to get flight results
    // For now, we'll just show the search data
  }

  return (
    <div className="min-h-screen bg-gray-100" style={{ isolation: 'auto' }}>
      {/* Hero Section - This simulates the container that might be clipping dropdowns */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white relative" style={{ overflow: 'visible' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" style={{ overflow: 'visible' }}>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Find Your Perfect Flight</h1>
            <p className="text-xl text-blue-100">Search and compare flights from hundreds of airlines</p>
          </div>
          
          {/* Search Form Container */}
          <div className="max-w-4xl mx-auto" style={{ overflow: 'visible' }}>
            <div className="bg-white rounded-lg shadow-xl p-6" style={{ overflow: 'visible' }}>
              <SearchForm 
                serviceType="flights"
                onSearch={handleSearch}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content Section Below Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {searchResults ? (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Search Results</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <pre className="text-sm text-gray-700">
                {JSON.stringify(searchResults, null, 2)}
              </pre>
            </div>
            <button 
              onClick={() => setSearchResults(null)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              New Search
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Popular Destinations</h2>
            <p className="text-gray-600 mb-6">
              Use the search form above to find flights, or browse our popular destinations below.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">New York</h3>
                <p className="text-gray-600">Starting from $299</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">London</h3>
                <p className="text-gray-600">Starting from $599</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Dubai</h3>
                <p className="text-gray-600">Starting from $799</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}