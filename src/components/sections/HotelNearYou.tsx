'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { hotelService } from '@/lib/services/hotel-service'
import { HotelOffer, HotelSearchCriteria } from '@/types/api'

interface HotelNearYouProps {
  destination?: string
  checkInDate?: string
  checkOutDate?: string
  rooms?: { adults: number; children: number }[]
}

export default function HotelNearYou({ 
  destination = 'Lagos', 
  checkInDate, 
  checkOutDate, 
  rooms = [{ adults: 2, children: 0 }] 
}: HotelNearYouProps) {
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

  // Fetch hotels when component mounts
  useEffect(() => {
    const fetchHotels = async () => {
      if (!destination) return

      setIsLoading(true)
      
      try {
        // Use current date + 1 day if no dates provided
        const defaultCheckIn = checkInDate || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        const defaultCheckOut = checkOutDate || new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

        const criteria: HotelSearchCriteria = {
          destination,
          checkInDate: defaultCheckIn,
          checkOutDate: defaultCheckOut,
          rooms,
          currency: 'NGN'
        }

        const response = await hotelService.searchHotels(criteria)
        
        // Handle different response structures
        const hotelsList = response.hotels || []
        
        // Sort by price (lowest first) and take top 6 for original design
        const sortedHotels = (Array.isArray(hotelsList) ? hotelsList : [])
          .sort((a, b) => {
            const priceA = a.rooms?.[0]?.price?.total || 0
            const priceB = b.rooms?.[0]?.price?.total || 0
            return priceA - priceB
          })
          .slice(0, 6) // Match original design with 6 hotels

        setHotels(sortedHotels)
      } catch (error: any) {
        console.error('❌ Error fetching hotels:', error)
        setHotels([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchHotels()
  }, [destination, checkInDate, checkOutDate, rooms])

  const handleHotelClick = (hotel: HotelOffer) => {
    // Navigate to hotel details page with search parameters
    const params = new URLSearchParams({
      destination,
      checkin: checkInDate || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      checkout: checkOutDate || new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
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
            className={`flex gap-6 lg:gap-10 ${isTransitioning ? 'transition-transform duration-500 ease-linear' : ''}`}
            style={{
              transform: `translateX(-${currentIndex * cardWidth}px)`,
              width: `${infiniteHotels.length * cardWidth}px`
            }}
          >
            {infiniteHotels.map((hotel, index) => (
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