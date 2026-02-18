'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { hotelService } from '@/lib/services/hotel-service'
import { HotelOffer, HotelSearchCriteria } from '@/types/api'

interface HotelSliderProps {
  destination: string
  checkInDate: string
  checkOutDate: string
  rooms?: { adults: number; children: number }[]
}

export default function HotelSlider({ 
  destination, 
  checkInDate, 
  checkOutDate, 
  rooms = [{ adults: 2, children: 0 }] 
}: HotelSliderProps) {
  // Only log in development mode
  if (process.env.NODE_ENV === 'development') {
    console.log('🏨 HotelSlider rendered with props:', { 
      destination, 
      checkInDate, 
      checkOutDate, 
      rooms,
      timestamp: new Date().toISOString()
    })
  }
  
  const [hotels, setHotels] = useState<HotelOffer[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Create multiple copies for seamless infinite scroll
  const infiniteHotels = hotels.length > 0 ? [...hotels, ...hotels, ...hotels] : []
  const cardWidth = 296 + 40 // card width + gap (matching original design)

  const startAutoSlide = () => {
    if (hotels.length <= 1) return
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => prevIndex + 1)
    }, 3000) // Slide every 3 seconds (matching original)
  }

  const stopAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  // Handle the infinite loop reset
  useEffect(() => {
    if (hotels.length > 0 && currentIndex === hotels.length) {
      // When we reach the end of the first set, instantly reset to the beginning
      const timer = setTimeout(() => {
        setIsTransitioning(false)
        setCurrentIndex(0)
        // Re-enable transitions after the reset
        setTimeout(() => setIsTransitioning(true), 50)
      }, 500) // Match transition duration

      return () => clearTimeout(timer)
    }
  }, [currentIndex, hotels.length])

  useEffect(() => {
    if (hotels.length > 1) {
      startAutoSlide()
    }
    return () => stopAutoSlide()
  }, [hotels.length])

  const handleMouseEnter = () => {
    stopAutoSlide()
  }

  const handleMouseLeave = () => {
    if (hotels.length > 1) {
      startAutoSlide()
    }
  }

  // Track if we've already fetched to prevent duplicate calls for the same destination
  const [hasFetched, setHasFetched] = useState(false)
  const [lastDestination, setLastDestination] = useState<string>('')

  // Reset hasFetched when destination changes
  useEffect(() => {
    if (destination !== lastDestination) {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 Destination changed from', lastDestination, 'to', destination)
      }
      setHasFetched(false)
      setLastDestination(destination)
      setHotels([]) // Clear previous hotels
    }
  }, [destination, lastDestination])

  // Fetch hotels when component mounts or destination changes
  useEffect(() => {
    const fetchHotels = async () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 HotelSlider fetchHotels called with:', { 
          destination, 
          checkInDate, 
          checkOutDate, 
          hasFetched,
          rooms 
        })
      }
      
      if (!destination || !checkInDate || !checkOutDate) {
        if (process.env.NODE_ENV === 'development') {
          console.log('❌ Missing required data for hotel search:', {
            destination: !!destination,
            checkInDate: !!checkInDate,
            checkOutDate: !!checkOutDate
          })
        }
        return
      }

      // Prevent duplicate fetches
      if (hasFetched) {
        return
      }

      setIsLoading(true)
      setHasFetched(true)
      
      try {
        const criteria: HotelSearchCriteria = {
          destination,
          checkInDate,
          checkOutDate,
          rooms,
          currency: 'NGN'
        }

        const response = await hotelService.searchHotels(criteria)
        
        // Handle different response structures
        // The response should have hotels directly based on HotelSearchResponse type
        const hotelsList = response.hotels || []
        
        // Sort by price (lowest first) and take top 6 for original design
        const sortedHotels = (Array.isArray(hotelsList) ? hotelsList : [])
          .sort((a, b) => {
            const priceA = a.rooms?.[0]?.price?.total || 0
            const priceB = b.rooms?.[0]?.price?.total || 0
            return priceA - priceB
          })
          .slice(0, 6) // Match original design with 6 hotels

        if (process.env.NODE_ENV === 'development') {
          console.log('✅ Final sorted hotels:', sortedHotels.length, 'hotels loaded for', destination)
        }
        setHotels(sortedHotels)
      } catch (error: any) {
        console.error('❌ Error fetching hotels:', error)
        if (process.env.NODE_ENV === 'development') {
          console.error('❌ Error details:', {
            message: error?.message,
            stack: error?.stack,
            response: error?.response?.data
          })
        }
        setHotels([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchHotels()
  }, [destination, checkInDate, checkOutDate, rooms, hasFetched, lastDestination])

  const handleHotelClick = (hotel: HotelOffer) => {
    // Navigate to hotel details page with search parameters
    const params = new URLSearchParams({
      destination,
      checkin: checkInDate,
      checkout: checkOutDate,
      rooms: JSON.stringify(rooms)
    })
    router.push(`/hotels/${hotel.id}?${params.toString()}`)
  }

  const formatPrice = (price: number, currency: string = 'NGN') => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  const getHotelImage = (hotel: HotelOffer) => {
    if (hotel.images && hotel.images.length > 0) {
      return hotel.images[0]
    }
    // Use original image paths for consistency
    const imageMap = [
      '/images/hotel-1.png',
      '/images/hotel-2.png', 
      '/images/hotel-3.png',
      '/images/hotel-4.png',
      '/images/hotel-5.png',
      '/images/hotel-6.png'
    ]
    const hash = (hotel.name || 'hotel').split('').reduce((a, b) => a + b.charCodeAt(0), 0)
    return imageMap[hash % imageMap.length]
  }

  if (!destination) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
              Hotels
            </h2>
            <p className="text-gray-600">
              No destination provided for hotel search
            </p>
          </div>
        </div>
      </section>
    )
  }

  if (isLoading) {
    return (
      <section className="py-6 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="text-left mb-2 lg:mb-16">
            <p className="text-gray-600 text-base lg:text-lg max-w-3xl leading-relaxed opacity-80">
              Find Places to stay in <span className="text-red-600 font-medium">{destination}</span>
            </p>
          </div>
          
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <span className="ml-3 text-gray-600">Loading hotels...</span>
          </div>
        </div>
      </section>
    )
  }

  if (hotels.length === 0) {
    return null // Don't show section if no hotels found
  }

  return (
    <section className="py-6 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Section Header - Original Design */}
        <div className="text-left mb-2 lg:mb-16">
          <p className="text-gray-600 text-base lg:text-lg max-w-3xl leading-relaxed opacity-80">
            Find Places to stay in <span className="text-red-600 font-medium">{destination}</span>
          </p>
        </div>

        {/* Hotel Cards - Infinite Carousel with Original Design */}
        <div
          className="overflow-hidden pb-4"
          ref={containerRef}
        >
          <div
            className={`flex gap-6 lg:gap-10 ${
              isTransitioning && hotels.length > 1 
                ? 'transition-transform duration-500 ease-linear' 
                : ''
            }`}
            style={{
              transform: hotels.length > 1 ? `translateX(-${currentIndex * cardWidth}px)` : 'none',
              width: hotels.length > 1 ? `${infiniteHotels.length * cardWidth}px` : 'auto'
            }}
          >
            {(hotels.length > 1 ? infiniteHotels : hotels).map((hotel, index) => (
              <div
                key={`${hotel.id}-${index}`}
                className="group relative w-[296px] bg-white backdrop-blur-sm border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer flex-shrink-0"
                style={{
                  backdropFilter: 'blur(4px)',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), -2px 0 4px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleHotelClick(hotel)}
              >
                {/* Hotel Image - Original Design */}
                <div className="relative w-[264px] h-[180px] mx-4 mt-4 rounded-lg overflow-hidden shadow-md">
                  <Image
                    src={getHotelImage(hotel)}
                    alt={hotel.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="264px"
                  />
                </div>

                {/* Card Content - Original Design */}
                <div className="px-6 pt-6 pb-12">
                  <div className="space-y-4">
                    {/* Location with Location Icon */}
                    <div className="flex items-center gap-1">
                      <Image
                        src="/images/location-icon.svg"
                        alt="Location"
                        width={12}
                        height={12}
                        className="w-3 h-3"
                      />
                      <span className="text-gray-500 text-xs font-normal tracking-wide">
                        {hotel.location?.address || `${destination} Area`}
                      </span>
                    </div>

                    {/* Hotel Name */}
                    <div className="space-y-2">
                      <h3 className="text-gray-800 font-bold text-base leading-snug">
                        {hotel.name}
                      </h3>
                    </div>

                    {/* Description */}
                    <div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {hotel.rooms?.[0]?.description || 'Comfortable accommodation with modern amenities and excellent service.'}
                      </p>
                    </div>
                  </div>

                  {/* Price - Original Design */}
                  <div className="mt-4">
                    <p className="text-red-600 text-sm font-medium">
                      {hotel.rooms && hotel.rooms.length > 0 
                        ? `${formatPrice(hotel.rooms[0].price.total, hotel.rooms[0].price.currency)} /night`
                        : '₦25,000 /night'
                      }
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}