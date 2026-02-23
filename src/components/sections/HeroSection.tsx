'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import ServiceTabs from '../ui/ServiceTabs'
import { cmsService, HeroSlide } from '@/lib/services/cms-service'

// Inline SVG icons
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

const ArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
)

// Default slides as fallback
const defaultSlides = [
  {
    _id: '1',
    title: "Discover Amazing Destinations",
    subtitle: "Explore the world's most beautiful places",
    image: { url: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" },
    order: 0,
    isActive: true,
  },
  {
    _id: '2',
    title: "Adventure Awaits You",
    subtitle: "Create memories that last a lifetime",
    image: { url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" },
    order: 1,
    isActive: true,
  },
  {
    _id: '3',
    title: "Your Journey Starts Here",
    subtitle: "Plan your perfect getaway with us",
    image: { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" },
    order: 2,
    isActive: true,
  },
]

export default function HeroSection() {
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(defaultSlides)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSlides()
  }, [])

  const fetchSlides = async () => {
    try {
      const response = await cmsService.getHeroSlides(true)
      if (response.data && response.data.length > 0) {
        setHeroSlides(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch hero slides:', error)
      // Keep using default slides
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isAutoPlaying || heroSlides.length === 0) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, heroSlides.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
    setIsAutoPlaying(false)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    setIsAutoPlaying(false)
  }

  return (
    <section
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      id="home"
    >
      {/* Background Images */}
      {heroSlides.map((slide, index) => (
        <div
          key={slide._id}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <Image
            src={slide.image?.url || defaultSlides[0].image.url}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
            sizes="100vw"
            quality={85}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-blue/80 via-brand-blue/40 to-brand-blue/90" />
        </div>
      ))}
      {/* Slider Navigation */}
      <div className="absolute bottom-32 sm:bottom-40 md:bottom-48 right-4 sm:right-8 lg:right-16 xl:right-24 flex items-center gap-2 sm:gap-3 lg:gap-4 z-10">
        <button
          onClick={goToPrevious}
          className="w-12 h-8 sm:w-14 sm:h-9 md:w-16 md:h-10 lg:w-20 lg:h-12 bg-white/90 hover:bg-white border-2 border-white rounded-full transition-all duration-300 hover:scale-105 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-800" />
        </button>

        <span className="text-white font-medium text-sm sm:text-base lg:text-lg min-w-[32px] sm:min-w-[40px] text-center">
          {currentSlide + 1}/{heroSlides.length}
        </span>

        <button
          onClick={goToNext}
          className="w-12 h-8 sm:w-14 sm:h-9 md:w-16 md:h-10 lg:w-20 lg:h-12 bg-white/90 hover:bg-white border-2 border-white rounded-full transition-all duration-300 hover:scale-105 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-800" />
        </button>
      </div>

      {/* Hero Content and Service Tabs */}
      <div className="relative z-10 flex flex-col justify-center min-h-screen py-20" style={{ overflow: 'visible' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 w-full text-left flex flex-col justify-between min-h-[80vh]" style={{ overflow: 'visible' }}>
          {/* Hero Content */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="mb-4 sm:mb-6">
              <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-3 sm:mb-4">
                Travel Made Effortless, From Start to Finish
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed mb-4 sm:mb-6 max-w-2xl">
                From International and local flight booking to visa applications, hotel bookings, travel insurance, and local car rentals — The Travel Place brings everything you need to plan your trip together in one seamless, easy-to-use platform
              </p>
            </div>

            <div className="flex justify-start">
              <button className="bg-brand-red hover:bg-brand-red-dark text-white px-6 py-3 text-base font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 whitespace-nowrap">
                Take a Trip
                <ArrowRight className="w-4 h-4 flex-shrink-0" />
              </button>
            </div>
          </div>

          {/* Service Tabs */}
          <div className="w-full mt-auto" style={{ overflow: 'visible' }}>
            <ServiceTabs />
          </div>
        </div>
      </div>
    </section>
  )
}