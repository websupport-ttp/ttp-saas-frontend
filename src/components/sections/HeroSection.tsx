'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import ServiceTabs from '../ui/ServiceTabs'
import { cmsService, HeroSlide } from '@/lib/services/cms-service'

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

const defaultSlides = [
  {
    _id: '1',
    title: "Your next trip starts right here",
    subtitle: "Flights, hotels, insurance, visas — all in one place, all at the best price",
    image: { url: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" },
    order: 0, isActive: true,
  },
  {
    _id: '2',
    title: "The world is closer than you think",
    subtitle: "Let us handle the details while you focus on the adventure",
    image: { url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" },
    order: 1, isActive: true,
  },
  {
    _id: '3',
    title: "Travel made effortless",
    subtitle: "From first search to safe return — we've got every step covered",
    image: { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" },
    order: 2, isActive: true,
  },
]

export default function HeroSection() {
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(defaultSlides)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Mouse parallax state for background images
  const sectionRef = useRef<HTMLElement>(null)
  const [parallax, setParallax] = useState({ x: 0, y: 0 })
  const rafRef = useRef<number | null>(null)

  // Track previous slide to know direction for text animation
  const [prevSlide, setPrevSlide] = useState(0)
  const [textKey, setTextKey] = useState(0) // bump to retrigger enter animation

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    cmsService.getHeroSlides(true)
      .then(r => { if (r.data?.length) setHeroSlides(r.data) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!isAutoPlaying || heroSlides.length === 0) return
    const t = setInterval(() => setCurrentSlide(p => (p + 1) % heroSlides.length), 5000)
    return () => clearInterval(t)
  }, [isAutoPlaying, heroSlides.length])

  // --- Parallax on mouse move ---
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      const rect = sectionRef.current?.getBoundingClientRect()
      if (!rect) return
      const x = (e.clientX - rect.left) / rect.width  - 0.5 // -0.5 → 0.5
      const y = (e.clientY - rect.top)  / rect.height - 0.5
      setParallax({ x, y })
    })
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    setParallax({ x: 0, y: 0 })
  }, [])

  const changeSlide = (index: number) => {
    setPrevSlide(currentSlide)
    setCurrentSlide(index)
    setTextKey(k => k + 1)
    setIsAutoPlaying(false)
  }
  const goToPrevious = () => changeSlide((currentSlide - 1 + heroSlides.length) % heroSlides.length)
  const goToNext    = () => changeSlide((currentSlide + 1) % heroSlides.length)

  // Max parallax shift in px
  const PX = 18, PY = 10

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      id="home"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Images with parallax shift */}
      {heroSlides.map((slide, index) => (
        <div
          key={slide._id}
          className="absolute inset-0"
          style={{
            opacity: index === currentSlide ? 1 : 0,
            transition: 'opacity 1s ease',
            // Slightly scale up so parallax shift never reveals blank edge
            willChange: 'transform, opacity',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: `-${PY * 2}px -${PX * 2}px`,
              transition: 'transform 0.12s linear',
              transform: `translate(${parallax.x * PX}px, ${parallax.y * PY}px) scale(1.04)`,
              willChange: 'transform',
            }}
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
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-brand-blue/80 via-brand-blue/40 to-brand-blue/90" />
        </div>
      ))}

      {/* Subtle floating particles (purely decorative) */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
          {[
            { size: 6, left: '12%', top: '18%', delay: 0,   dur: 7  },
            { size: 4, left: '78%', top: '22%', delay: 1.5, dur: 9  },
            { size: 8, left: '55%', top: '65%', delay: 0.8, dur: 11 },
            { size: 5, left: '30%', top: '75%', delay: 2.2, dur: 8  },
            { size: 3, left: '88%', top: '50%', delay: 0.4, dur: 10 },
          ].map((p, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/10"
              style={{
                width:  p.size,
                height: p.size,
                left:   p.left,
                top:    p.top,
                animation: `heroDrift ${p.dur}s ${p.delay}s ease-in-out infinite alternate`,
              }}
            />
          ))}
        </div>
      )}

      {/* Slide nav */}
      <div className="absolute bottom-32 sm:bottom-40 md:bottom-48 right-4 sm:right-8 lg:right-16 xl:right-24 flex items-center gap-2 sm:gap-3 lg:gap-4 z-10">
        <button
          onClick={goToPrevious}
          className="w-12 h-8 sm:w-14 sm:h-9 md:w-16 md:h-10 lg:w-20 lg:h-12 bg-white/90 hover:bg-white border-2 border-white rounded-full transition-all duration-300 hover:scale-110 flex items-center justify-center"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-800" />
        </button>
        <span className="text-white font-medium text-sm sm:text-base lg:text-lg min-w-[32px] sm:min-w-[40px] text-center">
          {currentSlide + 1}/{heroSlides.length}
        </span>
        <button
          onClick={goToNext}
          className="w-12 h-8 sm:w-14 sm:h-9 md:w-16 md:h-10 lg:w-20 lg:h-12 bg-white/90 hover:bg-white border-2 border-white rounded-full transition-all duration-300 hover:scale-110 flex items-center justify-center"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-800" />
        </button>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col justify-center min-h-screen py-20" style={{ overflow: 'visible' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 w-full text-left flex flex-col justify-between min-h-[80vh]" style={{ overflow: 'visible' }}>
          <div className="flex-1 flex flex-col justify-center">
            {/* Text block re-animates on each slide change */}
            <div
              key={textKey}
              className="mb-4 sm:mb-6"
              style={{ animation: 'heroTextEnter 0.7s cubic-bezier(0.22,1,0.36,1) both' }}
            >
              <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-3 sm:mb-4">
                Travel Made Effortless, From Start to Finish
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed mb-4 sm:mb-6 max-w-2xl"
                 style={{ animation: 'heroTextEnter 0.7s 0.12s cubic-bezier(0.22,1,0.36,1) both' }}>
                Flights, hotels, car rentals, visa help, and travel insurance — everything you need to plan a great trip, all in one place. No stress, no surprises.
              </p>
            </div>

            <div className="flex justify-start"
                 style={{ animation: 'heroTextEnter 0.7s 0.22s cubic-bezier(0.22,1,0.36,1) both' }}>
              <button className="group bg-brand-red hover:bg-brand-red-dark text-white px-6 py-3 text-base font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 whitespace-nowrap">
                Take a Trip
                <ArrowRight className="w-4 h-4 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Service Tabs */}
          <div className="w-full mt-auto" style={{ overflow: 'visible' }}>
            <ServiceTabs />
          </div>
        </div>
      </div>

      {/* Keyframes injected inline — small, no external dep */}
      <style>{`
        @keyframes heroDrift {
          from { transform: translateY(0) scale(1); }
          to   { transform: translateY(-14px) scale(1.15); }
        }
        @keyframes heroTextEnter {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="heroDrift"], [style*="heroTextEnter"] { animation: none !important; }
        }
      `}</style>
    </section>
  )
}
