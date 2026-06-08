'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { useInViewTyped } from '@/hooks/useInView'

interface Destination {
  id: string; country: string; city: string; duration: string; price: string; image: string; alt: string;
}

const destinations: Destination[] = [
  { id: '1', country: 'Portugal', city: 'Lisbon, Portugal',   duration: '3 Days',  price: '$6,705.000 /person', image: '/images/portugal-destination.png',  alt: 'Beautiful view of Lisbon, Portugal' },
  { id: '2', country: 'Peru',     city: 'Cusco, Peru',        duration: '3 Days',  price: '$605.000 /person',   image: '/images/peru-destination.png',       alt: 'Ancient ruins in Cusco, Peru' },
  { id: '3', country: 'Japan',    city: 'Kyoto, Japan',       duration: '14 Days', price: '$1,400.000 /person', image: '/images/japan-destination.png',      alt: 'Traditional temple in Kyoto, Japan' },
  { id: '4', country: 'Australia',city: 'Vienna, Australia',  duration: '12 Days', price: '$1,205.000 /malam',  image: '/images/australia-destination.png',  alt: 'Scenic landscape in Vienna, Australia' },
  { id: '5', country: 'Australia',city: 'Vienna, Australia',  duration: '12 Days', price: '$1,205.000 /malam',  image: '/images/australia-destination.png',  alt: 'Scenic landscape in Vienna, Australia' },
  { id: '6', country: 'Australia',city: 'Vienna, Australia',  duration: '12 Days', price: '$1,205.000 /malam',  image: '/images/australia-destination.png',  alt: 'Scenic landscape in Vienna, Australia' },
]

const CARD_W = 220 + 24 // card width + gap

// Per-card 3D tilt hook
function useTilt() {
  const ref = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, shine: 0 })
  const raf = useRef<number | null>(null)

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (raf.current) cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(() => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width  - 0.5
      const y = (e.clientY - rect.top)  / rect.height - 0.5
      setTilt({ rx: y * -12, ry: x * 12, shine: (x + y + 2) / 4 })
    })
  }, [])

  const onLeave = useCallback(() => {
    if (raf.current) cancelAnimationFrame(raf.current)
    setTilt({ rx: 0, ry: 0, shine: 0 })
  }, [])

  return { ref, tilt, onMove, onLeave }
}

function DestinationCard({ destination, delay }: { destination: Destination; delay: number }) {
  const { ref, tilt, onMove, onLeave } = useTilt()
  const { ref: inRef, inView } = useInViewTyped<HTMLDivElement>(0.1)

  return (
    <div
      ref={node => { inRef.current = node; ref.current = node }}
      className="relative w-[220px] h-[320px] rounded-xl overflow-hidden shadow-lg cursor-pointer flex-shrink-0"
      style={{
        opacity:    inView ? 1 : 0,
        transform:  inView
          ? `perspective(600px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateY(0)`
          : 'translateY(30px)',
        transition: `opacity 0.55s ${delay}s ease, transform 0.18s ease`,
        willChange: 'transform, opacity',
        boxShadow: `0 ${8 + tilt.shine * 16}px ${24 + tilt.shine * 20}px rgba(0,0,0,${0.18 + tilt.shine * 0.18})`,
      }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {/* Background Image with inner zoom on hover */}
      <div className="absolute inset-0 group">
        <Image
          src={destination.image}
          alt={destination.alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="220px"
        />
      </div>

      {/* Shine overlay */}
      <div
        className="absolute inset-0 pointer-events-none rounded-xl"
        style={{
          background: `radial-gradient(circle at ${50 + tilt.ry * 30}% ${50 + tilt.rx * 30}%, rgba(255,255,255,${tilt.shine * 0.18}) 0%, transparent 65%)`,
          transition: 'background 0.12s ease',
        }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-4">
        <div className="flex justify-start">
          <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
            <Image
              src="/images/location-icon.svg"
              alt="Location"
              width={10} height={10}
              className="w-2.5 h-2.5"
              style={{ filter: 'brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%)' }}
            />
            <span className="text-white text-xs font-medium tracking-wide">{destination.country}</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="space-y-1">
            <h3 className="text-white font-bold text-lg leading-tight">{destination.city}</h3>
            <p className="text-white/80 text-sm font-normal">{destination.duration}</p>
          </div>
          <div className="pt-1">
            <p className="text-red-400 font-semibold text-base">{destination.price}</p>
          </div>
        </div>
      </div>

      {/* Hover border */}
      <div
        className="absolute inset-0 rounded-xl border-2 pointer-events-none transition-all duration-300"
        style={{ borderColor: `rgba(255,255,255,${tilt.shine * 0.5})` }}
      />
    </div>
  )
}

export default function PackagesSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const { ref: headerRef, inView: headerInView } = useInViewTyped<HTMLDivElement>(0.1)

  const infiniteDestinations = [...destinations, ...destinations, ...destinations]

  const startAutoSlide = () => {
    intervalRef.current = setInterval(() => setCurrentIndex(p => p + 1), 3000)
  }
  const stopAutoSlide = () => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
  }

  useEffect(() => {
    if (currentIndex === destinations.length) {
      const t = setTimeout(() => {
        setIsTransitioning(false)
        setCurrentIndex(0)
        setTimeout(() => setIsTransitioning(true), 50)
      }, 500)
      return () => clearTimeout(t)
    }
  }, [currentIndex])

  useEffect(() => { startAutoSlide(); return () => stopAutoSlide() }, [])

  return (
    <section className="py-16 lg:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Header */}
        <div
          ref={headerRef}
          className="text-left mb-8 lg:mb-16"
          style={{
            opacity:   headerInView ? 1 : 0,
            transform: headerInView ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-yellow-600 font-normal text-lg lg:text-xl">Packages</span>
          </div>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-800 mb-4 leading-tight">
            Amazing Tour Destinations
          </h2>
          <p className="text-gray-600 text-base lg:text-lg max-w-3xl leading-relaxed opacity-80">
            Discover breathtaking destinations and unforgettable experiences across the globe.
            Your next journey awaits, filled with endless possibilities!
          </p>
        </div>

        {/* Carousel */}
        <div className="overflow-hidden pb-4">
          <div
            className={`flex gap-4 lg:gap-6 ${isTransitioning ? 'transition-transform duration-500 ease-linear' : ''}`}
            style={{ transform: `translateX(-${currentIndex * CARD_W}px)`, width: `${infiniteDestinations.length * CARD_W}px` }}
          >
            {infiniteDestinations.map((destination, index) => (
              <div
                key={`${destination.id}-${index}`}
                onMouseEnter={stopAutoSlide}
                onMouseLeave={startAutoSlide}
              >
                <DestinationCard destination={destination} delay={(index % destinations.length) * 0.06} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
