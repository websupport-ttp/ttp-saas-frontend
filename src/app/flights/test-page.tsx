'use client'

export default function TestFlightsPage() {
  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Flight Booking Test Page
      </h1>
      <p className="text-gray-600 mb-8">
        This is a test page to check if the basic structure works.
      </p>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-900 mb-2">
          Test Content
        </h2>
        <p className="text-blue-700">
          If you can see this content, the basic page structure is working.
        </p>
      </div>
    </div>
  )
}