'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useInViewTyped } from '@/hooks/useInView'

const testimonials = [
  {
    id: 1,
    name: 'Albert Flores',
    role: 'Traveller',
    image: '/images/albert-flores.png',
    quote: 'We have been operating for over an providin top-notch services to our clients and build strong track record in the industry. We have been operating for over a decade providing top-notch services We have been operating'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    role: 'Adventure Seeker',
    image: '/images/albert-flores.png',
    quote: 'Amazing experience with The Travel Place! Their attention to detail and customer service exceeded all my expectations. Every aspect of my trip was perfectly planned and executed.'
  },
  {
    id: 3,
    name: 'Michael Chen',
    role: 'Business Traveller',
    image: '/images/albert-flores.png',
    quote: 'Professional, reliable, and efficient. The Travel Place has become my go-to for all business travel needs. They understand the importance of seamless travel arrangements.'
  }
]

export default function TestimonialSection() {
  const [current, setCurrent] = useState(0)
  const [animDir, setAnimDir] = useState<'left' | 'right' | null>(null)
  const { ref, inView } = useInViewTyped<HTMLDivElement>(0.1)

  const change = (dir: 'left' | 'right') => {
    setAnimDir(dir)
    setTimeout(() => {
      setCurrent(p => dir === 'right'
        ? (p + 1) % testimonials.length
        : (p - 1 + testimonials.length) % testimonials.length
      )
      setAnimDir(null)
    }, 220)
  }

  const data = testimonials[current]

  return (
    <section className="relative py-16 lg:py-24 bg-white">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="bg-[#141B34] rounded-[50px] px-8 py-16 lg:px-16 lg:py-20 relative overflow-hidden">

          {/* Subtle bg glow */}
          <div className="absolute inset-0 pointer-events-none rounded-[50px] overflow-hidden" aria-hidden>
            <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full"
                 style={{ background: 'radial-gradient(circle, rgba(226,30,36,0.08) 0%, transparent 70%)' }} />
          </div>

          {/* Header */}
          <div
            className="text-center mb-12 lg:mb-16 relative z-10"
            style={{
              opacity:   inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(24px)',
              transition: 'opacity 0.6s ease, transform 0.6s ease',
            }}
          >
            <div className="flex items-center justify-center gap-2.5 mb-1">
              <Image src="/images/testimonials-icon.svg" alt="Testimonials" width={20} height={20} className="w-5 h-5" />
              <span className="text-white font-semibold text-sm tracking-[10%] uppercase">Testimonials</span>
            </div>
            <h2 className="text-white text-2xl lg:text-3xl font-bold leading-tight">Happy Travellers</h2>
          </div>

          {/* Content */}
          <div
            className="flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12 relative z-10"
            style={{
              opacity:   inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(32px)',
              transition: 'opacity 0.7s 0.15s ease, transform 0.7s 0.15s ease',
            }}
          >
            {/* Left image — subtle scale on inView */}
            <div className="relative w-full lg:w-[35%]">
              <div
                className="relative w-full h-[300px] lg:h-[400px] rounded-[30px] overflow-hidden"
                style={{
                  transform: inView ? 'scale(1)' : 'scale(0.96)',
                  transition: 'transform 0.8s 0.1s ease',
                }}
              >
                <Image
                  src="/images/testimonial-bg.png"
                  alt="Happy travellers"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
            </div>

            {/* Quote card */}
            <div className="w-full lg:w-[65%]">
              <div
                className="bg-white rounded-[20px] p-6 lg:p-12 relative h-[300px] lg:h-[400px] flex flex-col justify-between hover:shadow-xl transition-shadow duration-400"
                style={{
                  opacity:   animDir ? 0 : 1,
                  transform: animDir === 'right' ? 'translateX(-20px)' : animDir === 'left' ? 'translateX(20px)' : 'translateX(0)',
                  transition: 'opacity 0.22s ease, transform 0.22s ease, box-shadow 0.3s ease',
                }}
              >
                <div className="mb-6">
                  <Image src="/images/quote-icon.svg" alt="Quote icon" width={64} height={39} className="w-12 lg:w-16 h-auto" />
                </div>
                <div className="flex-1 mb-6">
                  <p className="text-[#333333] text-base lg:text-[22px] leading-relaxed font-normal overflow-hidden text-ellipsis line-clamp-3">
                    {data.quote}
                  </p>
                </div>
                <div className="mb-6">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 lg:w-16 lg:h-16 rounded-full overflow-hidden ring-2 ring-brand-red/20 hover:ring-brand-red transition-all duration-300">
                      <Image src={data.image} alt={data.name} fill className="object-cover" />
                    </div>
                    <div>
                      <h4 className="text-[#333333] text-lg lg:text-[22px] font-bold leading-tight">{data.name}</h4>
                      <p className="text-[#333333] text-sm lg:text-base font-normal">{data.role}</p>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="h-px bg-[#333333] mr-[180px]" />
                  <div className="absolute top-[-80px] right-0 flex items-center gap-5">
                    <button
                      onClick={() => change('left')}
                      className="w-15 h-15 p-6 rounded-full bg-[#141B34] flex items-center justify-center hover:scale-110 hover:bg-brand-red transition-all duration-200"
                      aria-label="Previous testimonial"
                    >
                      <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
                        <path d="M8.5 12L4.5 8L8.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <button
                      onClick={() => change('right')}
                      className="w-15 h-15 p-6 rounded-full bg-[#141B34] flex items-center justify-center hover:scale-110 hover:bg-brand-red transition-all duration-200"
                      aria-label="Next testimonial"
                    >
                      <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
                        <path d="M5.5 4L9.5 8L5.5 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
