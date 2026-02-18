'use client'

import { useState, useRef } from 'react'
import { HotelCard } from '../hotels';
import { Button } from '../ui';
import { getFeaturedHotels } from '@/lib/data/hotels'

// Navigation arrow icons
const ChevronLeft = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
)

const ChevronRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

export default function HotelsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const hotels = getFeaturedHotels(8)
  
  const itemsPerView = {
    mobile: 1,
    tablet: 2,
    desktop: 3
  }

  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const itemWidth = container.scrollWidth / hotels.length
      container.scrollTo({
        left: itemWidth * index,
        behavior: 'smooth'
      })
      setCurrentIndex(index)
    }
  }

  const scrollLeft = () => {
    const newIndex = Math.max(0, currentIndex - 1)
    scrollToIndex(newIndex)
  }

  const scrollRight = () => {
    const maxIndex = hotels.length - itemsPerView.desktop
    const newIndex = Math.min(maxIndex, currentIndex + 1)
    scrollToIndex(newIndex)
  }

  const canScrollLeft = currentIndex > 0
  const canScrollRight = currentIndex < hotels.length - itemsPerView.desktop

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12 lg:mb-16">
            <div className="mb-6 lg:mb-0">
              <div className="inline-flex items-center gap-2 bg-brand-red/10 px-4 py-2 rounded-full mb-4">
                <div className="w-2 h-2 bg-brand-red rounded-full" />
                <span className="text-sm font-medium text-brand-red uppercase tracking-wider">
                  Featured Hotels
                </span>
              </div>
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4">
                Well Liked Hotels <span className="text-brand-red">Close To You</span>
              </h2>
              <p className="text-lg lg:text-xl text-gray-600 max-w-2xl leading-relaxed">
                Discover handpicked accommodations that offer exceptional comfort, service, and value for your perfect stay.
              </p>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-4">
              <button
                onClick={scrollLeft}
                disabled={!canScrollLeft}
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  canScrollLeft
                    ? 'border-brand-red text-brand-red hover:bg-brand-red hover:text-white'
                    : 'border-gray-300 text-gray-300 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={scrollRight}
                disabled={!canScrollRight}
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  canScrollRight
                    ? 'border-brand-red text-brand-red hover:bg-brand-red hover:text-white'
                    : 'border-gray-300 text-gray-300 cursor-not-allowed'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Hotels Carousel */}
          <div className="relative">
            <div
              ref={scrollContainerRef}
              className="flex gap-6 lg:gap-8 overflow-x-auto scrollbar-hide pb-4"
              style={{
                scrollSnapType: 'x mandatory',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              {hotels.map((hotel, index) => (
                <div
                  key={hotel.id}
                  className="flex-none w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)]"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <HotelCard 
                    hotel={hotel}
                    className="h-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  />
                </div>
              ))}
            </div>

            {/* Mobile Navigation Dots */}
            <div className="flex lg:hidden justify-center mt-6 gap-2">
              {Array.from({ length: Math.ceil(hotels.length / itemsPerView.mobile) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    Math.floor(currentIndex / itemsPerView.mobile) === index
                      ? 'bg-brand-red w-6'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12 lg:mt-16">
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-brand-red text-brand-red hover:bg-brand-red hover:text-white px-8 py-3 text-lg font-semibold rounded-full transition-all duration-300"
            >
              View All Hotels
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 lg:mt-20 bg-white rounded-2xl p-8 lg:p-12 shadow-lg">
            <div className="text-center mb-8">
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Why Book Hotels With Us?
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We partner with trusted hotels worldwide to ensure you get the best rates and exceptional service.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Best Price Guarantee</h4>
                <p className="text-gray-600 text-sm">Find a lower price? We'll match it and give you an extra discount.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Secure Booking</h4>
                <p className="text-gray-600 text-sm">Your personal and payment information is always protected.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">24/7 Support</h4>
                <p className="text-gray-600 text-sm">Get help anytime, anywhere with our round-the-clock customer service.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Verified Reviews</h4>
                <p className="text-gray-600 text-sm">Read authentic reviews from real guests to make informed decisions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}