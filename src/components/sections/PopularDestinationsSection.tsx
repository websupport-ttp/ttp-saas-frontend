'use client'

import { useState } from 'react'
import DestinationCard from '../ui/DestinationCard'
import { getFeaturedDestinations } from '@/lib/data/destinations'

export default function PopularDestinationsSection() {
  const [visibleCount, setVisibleCount] = useState(8)
  const destinations = getFeaturedDestinations(12) // Get 12 destinations
  const visibleDestinations = destinations.slice(0, visibleCount)
  const hasMore = visibleCount < destinations.length

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + 4, destinations.length))
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 xl:py-24 2xl:py-28 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16 xl:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6">
              Popular <span className="text-brand-red">Destinations</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-4 sm:px-0">
              Discover the world's most sought-after travel destinations, carefully curated for unforgettable experiences
            </p>
          </div>

          {/* Destinations Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 xl:gap-10 mb-8 sm:mb-12 lg:mb-16">
            {visibleDestinations.map((destination, index) => (
              <div
                key={destination.id}
                className="transform transition-all duration-300 hover:scale-105"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <DestinationCard 
                  destination={destination}
                  className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300"
                />
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center">
              <button
                onClick={handleLoadMore}
                className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-red-dark text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg lg:text-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Explore More Destinations
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}

          {/* Stats Section */}
          <div className="mt-12 sm:mt-16 lg:mt-20 xl:mt-24 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-center">
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-brand-red mb-1 sm:mb-2">50+</div>
              <div className="text-sm sm:text-base lg:text-lg text-gray-600 font-medium">Countries</div>
            </div>
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-brand-red mb-1 sm:mb-2">200+</div>
              <div className="text-sm sm:text-base lg:text-lg text-gray-600 font-medium">Destinations</div>
            </div>
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-brand-red mb-1 sm:mb-2">10K+</div>
              <div className="text-sm sm:text-base lg:text-lg text-gray-600 font-medium">Happy Travelers</div>
            </div>
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-brand-red mb-1 sm:mb-2">24/7</div>
              <div className="text-sm sm:text-base lg:text-lg text-gray-600 font-medium">Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}