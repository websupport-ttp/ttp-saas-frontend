'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

interface Destination {
  id: string
  country: string
  city: string
  duration: string
  price: string
  image: string
  alt: string
}

const destinations: Destination[] = [
  {
    id: '1',
    country: 'Portugal',
    city: 'Lisbon, Portugal',
    duration: '3 Days',
    price: '$6,705.000 /person',
    image: '/images/portugal-destination.png',
    alt: 'Beautiful view of Lisbon, Portugal'
  },
  {
    id: '2',
    country: 'Peru',
    city: 'Cusco, Peru',
    duration: '3 Days',
    price: '$605.000 /person',
    image: '/images/peru-destination.png',
    alt: 'Ancient ruins in Cusco, Peru'
  },
  {
    id: '3',
    country: 'Japan',
    city: 'Kyoto, Japan',
    duration: '14 Days',
    price: '$1,400.000 /person',
    image: '/images/japan-destination.png',
    alt: 'Traditional temple in Kyoto, Japan'
  },
  {
    id: '4',
    country: 'Australia',
    city: 'Vienna, Australia',
    duration: '12 Days',
    price: '$1,205.000 /malam',
    image: '/images/australia-destination.png',
    alt: 'Scenic landscape in Vienna, Australia'
  },
  {
    id: '5',
    country: 'Australia',
    city: 'Vienna, Australia',
    duration: '12 Days',
    price: '$1,205.000 /malam',
    image: '/images/australia-destination.png',
    alt: 'Scenic landscape in Vienna, Australia'
  },
  {
    id: '6',
    country: 'Australia',
    city: 'Vienna, Australia',
    duration: '12 Days',
    price: '$1,205.000 /malam',
    image: '/images/australia-destination.png',
    alt: 'Scenic landscape in Vienna, Australia'
  }
]

export default function PackagesSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Create multiple copies for seamless infinite scroll
  const infiniteDestinations = [...destinations, ...destinations, ...destinations]
  const cardWidth = 220 + 24 // card width + gap

  const startAutoSlide = () => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => prevIndex + 1)
    }, 3000) // Slide every 3 seconds
  }

  const stopAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  // Handle the infinite loop reset
  useEffect(() => {
    if (currentIndex === destinations.length) {
      // When we reach the end of the first set, instantly reset to the beginning
      // after the transition completes
      const timer = setTimeout(() => {
        setIsTransitioning(false)
        setCurrentIndex(0)
        // Re-enable transitions after the reset
        setTimeout(() => setIsTransitioning(true), 50)
      }, 500) // Match transition duration

      return () => clearTimeout(timer)
    }
  }, [currentIndex])

  useEffect(() => {
    startAutoSlide()
    return () => stopAutoSlide()
  }, [])

  const handleMouseEnter = () => {
    stopAutoSlide()
  }

  const handleMouseLeave = () => {
    startAutoSlide()
  }

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Section Header */}
        <div className="text-left mb-8 lg:mb-16">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-yellow-600 font-normal text-lg lg:text-xl">
              Packages
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-800 mb-4 leading-tight">
            Amazing Tour Destinations
          </h2>
          <p className="text-gray-600 text-base lg:text-lg max-w-3xl leading-relaxed opacity-80">
            Discover breathtaking destinations and unforgettable experiences across the globe.
            Your next journey awaits, filled with endless possibilities!
          </p>
        </div>

        {/* Destination Cards - Infinite Carousel */}
        <div
          className="overflow-hidden pb-4"
          ref={containerRef}
        >
          <div
            className={`flex gap-4 lg:gap-6 ${isTransitioning ? 'transition-transform duration-500 ease-linear' : ''}`}
            style={{
              transform: `translateX(-${currentIndex * (220 + 24)}px)`,
              width: `${infiniteDestinations.length * (220 + 24)}px`
            }}
          >
            {infiniteDestinations.map((destination, index) => (
              <div
                key={`${destination.id}-${index}`}
                className="group relative w-[220px] h-[320px] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer flex-shrink-0"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src={destination.image}
                    alt={destination.alt}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="220px"
                  />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-between p-4">
                  {/* Top Content - Country Badge */}
                  <div className="flex justify-start">
                    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                      <Image
                        src="/images/location-icon.svg"
                        alt="Location"
                        width={10}
                        height={10}
                        className="w-2.5 h-2.5"
                        style={{ filter: 'brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%)' }}
                      />
                      <span className="text-white text-xs font-medium tracking-wide">
                        {destination.country}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Content */}
                  <div className="space-y-2">
                    {/* City and Duration */}
                    <div className="space-y-1">
                      <h3 className="text-white font-bold text-lg leading-tight">
                        {destination.city}
                      </h3>
                      <p className="text-white/80 text-sm font-normal">
                        {destination.duration}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="pt-1">
                      <p className="text-red-500 font-semibold text-base">
                        {destination.price}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 rounded-xl transition-colors duration-300" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}