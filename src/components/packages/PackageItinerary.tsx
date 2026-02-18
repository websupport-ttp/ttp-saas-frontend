'use client';

import { ItineraryDay } from '@/types/api';

interface PackageItineraryProps {
  itinerary: ItineraryDay[];
}

export default function PackageItinerary({ itinerary }: PackageItineraryProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">Day by Day Itinerary</h3>
        <p className="text-gray-600 mb-6">
          Detailed breakdown of your {itinerary.length}-day journey
        </p>
      </div>

      <div className="space-y-6">
        {itinerary.map((day, index) => (
          <div key={day.day} className="relative">
            {/* Timeline Line */}
            {index < itinerary.length - 1 && (
              <div className="absolute left-6 top-12 w-0.5 h-full bg-gray-200"></div>
            )}

            <div className="flex space-x-4">
              {/* Day Number Circle */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-brand-red text-white rounded-full flex items-center justify-center font-semibold">
                  {day.day}
                </div>
              </div>

              {/* Day Content */}
              <div className="flex-1 bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Day {day.day}: {day.title}
                </h4>
                
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {day.description}
                </p>

                {/* Activities */}
                {day.activities && day.activities.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-medium text-gray-900 mb-2">Activities</h5>
                    <ul className="space-y-1">
                      {day.activities.map((activity, actIndex) => (
                        <li key={actIndex} className="flex items-start space-x-2">
                          <svg
                            className="h-4 w-4 text-brand-red mt-0.5 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                          <span className="text-sm text-gray-700">{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Meals */}
                {day.meals && day.meals.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-medium text-gray-900 mb-2">Meals Included</h5>
                    <div className="flex flex-wrap gap-2">
                      {day.meals.map((meal, mealIndex) => (
                        <span
                          key={mealIndex}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                        >
                          {meal}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Accommodation */}
                {day.accommodation && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    <span>
                      <strong>Accommodation:</strong> {day.accommodation}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-6 mt-8">
        <h4 className="font-semibold text-gray-900 mb-3">Itinerary Summary</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-900">Total Duration:</span>
            <p className="text-gray-700">{itinerary.length} days</p>
          </div>
          <div>
            <span className="font-medium text-gray-900">Total Activities:</span>
            <p className="text-gray-700">
              {itinerary.reduce((total, day) => total + (day.activities?.length || 0), 0)} activities
            </p>
          </div>
          <div>
            <span className="font-medium text-gray-900">Meals Included:</span>
            <p className="text-gray-700">
              {itinerary.reduce((total, day) => total + (day.meals?.length || 0), 0)} meals
            </p>
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h5 className="font-medium text-blue-900 mb-2">Important Notes</h5>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Itinerary is subject to change based on weather conditions and local circumstances</li>
          <li>• Activity timings may vary depending on group size and local conditions</li>
          <li>• Optional activities and excursions may be available at additional cost</li>
          <li>• Please inform us of any dietary restrictions or accessibility requirements</li>
        </ul>
      </div>
    </div>
  );
}