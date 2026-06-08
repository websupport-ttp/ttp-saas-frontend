'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { useInViewTyped } from '@/hooks/useInView'
import { useMouseParallax } from '@/hooks/useMouseParallax'

const services = [
  {
    id: 1,
    title: 'Flights at the best price',
    description: 'Search hundreds of airlines in seconds. Flexible dates, multiple cabins, and no hidden fees — just the fare you see.',
    icon: '/images/service-flight-icon.svg'
  },
  {
    id: 2,
    title: "Hotels you'll actually love",
    description: 'From budget-friendly stays to luxury escapes — real photos, honest reviews, and instant confirmation.',
    icon: '/images/service-hotel-icon.svg'
  },
  {
    id: 3,
    title: 'Packages that do the thinking',
    description: 'Curated bundles that combine flights, hotels, and experiences. One price, zero planning headaches.',
    icon: '/images/service-tour-icon.svg'
  },
  {
    id: 4,
    title: 'Cars ready when you land',
    description: 'Pick up at the airport or in town. Wide range of vehicles, transparent pricing, flexible drop-off.',
    icon: '/images/service-car-icon.svg'
  },
  {
    id: 5,
    title: 'Visa help, simplified',
    description: 'We walk you through every requirement, document, and deadline — so your application goes in right the first time.',
    icon: '/images/service-visa-icon.svg'
  }
]

export default function AboutUsSection() {
  // Scroll-triggered reveal for the list
  const { ref: listRef, inView: listInView } = useInViewTyped<HTMLDivElement>(0.1)
  // Scroll-triggered reveal for the illustration
  const { ref: ilRef, inView: ilInView } = useInViewTyped<HTMLDivElement>(0.1)
  // Mouse parallax for illustration overlay cards
  const { ref: paraRef, pos } = useMouseParallax<HTMLDivElement>()

  return (
    <section className="relative py-16 lg:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">

          {/* ── Left illustration (desktop only) ── */}
          <div
            ref={node => { ilRef.current = node; paraRef.current = node }}
            className="relative w-full lg:w-1/2 max-w-2xl hidden lg:block"
            style={{
              opacity:   ilInView ? 1 : 0,
              transform: ilInView ? 'translateX(0)' : 'translateX(-40px)',
              transition: 'opacity 0.75s ease, transform 0.75s ease',
            }}
          >
            <div className="relative w-full aspect-[648/594] max-w-[648px] mx-auto">
              {/* Background pattern */}
              <div className="absolute" style={{ left: '8.97%', top: '4.89%', width: '82.06%', height: '89.51%' }}>
                <Image src="/images/about-bg.svg" alt="Background pattern" width={532} height={532} className="w-full h-full object-contain" />
              </div>

              {/* People illustration */}
              <div className="absolute" style={{ left: '13%', top: '11%', width: '75.73%', height: '84.14%' }}>
                <Image src="/images/about-people.svg" alt="Travel people illustration" width={493} height={498} className="w-full h-full object-contain z-10" />
              </div>

              {/* Flight card — parallax: moves opposite to cursor (floats away) */}
              <div
                className="absolute z-20"
                style={{
                  left: '66.2%', top: '18%',
                  transform: `translate(${pos.x * -6}px, ${pos.y * -4}px)`,
                  transition: 'transform 0.18s ease-out',
                  willChange: 'transform',
                }}
              >
                <div className="bg-white rounded-3xl px-7 py-2.5 shadow-lg flex items-center gap-2 whitespace-nowrap hover:shadow-xl transition-shadow duration-300">
                  <Image src="/images/flight-card-icon.svg" alt="Flight icon" width={20} height={20} className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-normal text-[#636363]">Jakarta - Bali</span>
                </div>
              </div>

              {/* Coffee icon card — parallax: moves with cursor */}
              <div
                className="absolute z-20"
                style={{
                  left: '16.8%', top: '12%',
                  transform: `translate(${pos.x * 5}px, ${pos.y * 5}px)`,
                  transition: 'transform 0.22s ease-out',
                  willChange: 'transform',
                }}
              >
                <div className="bg-white rounded-3xl p-2.5 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <Image src="/images/coffee-icon.svg" alt="Coffee icon" width={24} height={24} className="w-6 h-6" />
                </div>
              </div>

              {/* Destination card — gentle float */}
              <div
                className="absolute z-20"
                style={{
                  left: '-2%', top: '62%', width: '36%', height: '34%',
                  transform: `translate(${pos.x * -8}px, ${pos.y * 4}px)`,
                  transition: 'transform 0.25s ease-out',
                  willChange: 'transform',
                  animation: 'aboutFloat 6s ease-in-out infinite',
                }}
              >
                <div className="border-[5px] border-white bg-white rounded-2xl shadow-lg h-full overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="relative w-full h-[59.1%]">
                    <Image src="/images/labuan-bajo.png" alt="Labuan Bajo" fill className="object-cover rounded-2xl" />
                  </div>
                  <div className="p-3 h-[40.9%] flex flex-col justify-center">
                    <h4 className="font-bold md:text-[0.875rem] sm:text-[10px] text-[#333333] mb-1">Explore Labuan Bajo</h4>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 text-[#42A7C3] flex-shrink-0">
                        <svg viewBox="0 0 12 12" fill="currentColor"><path d="M6 0C3.79 0 2 1.79 2 4c0 3 4 8 4 8s4-5 4-8c0-2.21-1.79-4-4-4zm0 5.5c-.83 0-1.5-.67-1.5-1.5S5.17 2.5 6 2.5s1.5.67 1.5 1.5S6.83 5.5 6 5.5z" /></svg>
                      </div>
                      <span className="md:text-[0.625rem] sm:text-[8px] text-[#8F8F8F]">NTT, Indonesia</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hotel card */}
              <div
                className="absolute z-20"
                style={{
                  left: '74.5%', top: '51%', width: '19.6%', height: '19.8%',
                  transform: `translate(${pos.x * 7}px, ${pos.y * -5}px)`,
                  transition: 'transform 0.2s ease-out',
                  willChange: 'transform',
                  animation: 'aboutFloat 8s 1.5s ease-in-out infinite',
                }}
              >
                <div className="border-2 border-white bg-white rounded-lg shadow-lg h-full overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="relative w-full h-[59.1%]">
                    <Image src="/images/le-pirate-hotel.png" alt="Le Pirate Hotel" fill className="object-cover rounded-lg" />
                  </div>
                  <div className="p-2 h-[40.9%] flex flex-col justify-start">
                    <h4 className="font-bold md:text-[0.5rem] sm:text-[6px] text-[#333333] mb-1 leading-tight">Le Pirate Hotel</h4>
                    <div className="flex items-center gap-1">
                      <div className="w-2.5 h-2.5 text-[#42A7C3] flex-shrink-0">
                        <svg viewBox="0 0 10 10" fill="currentColor"><path d="M5 0C3.13 0 1.67 1.46 1.67 3.25c0 2.44 3.33 6.75 3.33 6.75s3.33-4.31 3.33-6.75C8.33 1.46 6.87 0 5 0zm0 4.42c-.65 0-1.17-.52-1.17-1.17S4.35 2.08 5 2.08s1.17.52 1.17 1.17S5.65 4.42 5 4.42z" /></svg>
                      </div>
                      <span className="md:text-[0.55rem] sm:text-[4px] text-[#8F8F8F] leading-tight">Flores, Indonesia</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right content ── */}
          <div ref={listRef} className="w-full lg:w-1/2 max-w-full lg:max-w-2xl">
            {/* Header */}
            <div
              className="mb-6"
              style={{
                opacity:   listInView ? 1 : 0,
                transform: listInView ? 'translateY(0)' : 'translateY(28px)',
                transition: 'opacity 0.6s ease, transform 0.6s ease',
              }}
            >
              <p className="text-yellow-600 text-xl font-normal mb-2">Why us</p>
              <h2 className="text-gray-900 text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                Everything you need,<br />nothing you don't
              </h2>
              <p className="text-gray-600 text-base leading-relaxed">
                We built The Travel Place because booking travel should feel exciting — not like a second job. Here's what sets us apart.
              </p>
            </div>

            {/* Services List — staggered */}
            <div className="space-y-6">
              {services.map((service, index) => (
                <div
                  key={service.id}
                  className="group flex items-center gap-4 bg-white rounded-lg shadow-[0px_16px_24px_0px_rgba(96,97,112,0.12),0px_2px_8px_0px_rgba(40,41,61,0.02)] p-4 lg:p-6 hover:shadow-[0px_20px_40px_0px_rgba(96,97,112,0.18),0px_4px_12px_0px_rgba(40,41,61,0.06)] hover:-translate-y-0.5 transition-all duration-300 cursor-default"
                  style={{
                    opacity:   listInView ? 1 : 0,
                    transform: listInView ? 'translateX(0)' : 'translateX(30px)',
                    transition: `opacity 0.55s ${0.1 + index * 0.08}s ease, transform 0.55s ${0.1 + index * 0.08}s ease, box-shadow 0.3s ease, translate 0.3s ease`,
                  }}
                >
                  {/* Icon — spins a tiny bit on hover */}
                  <div className="flex-shrink-0 w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-4 group-hover:scale-110 transition-transform duration-300">
                    <Image
                      src={service.icon}
                      alt={`${service.title} icon`}
                      width={64}
                      height={64}
                      className="w-8 h-8 group-hover:rotate-6 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[#121212] text-lg lg:text-xl font-bold mb-1 lg:mb-2 group-hover:text-brand-red transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-[#636363] text-sm lg:text-base leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                  {/* Subtle arrow that appears on hover */}
                  <div className="flex-shrink-0 w-5 h-5 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-brand-red">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes aboutFloat {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-8px); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="aboutFloat"] { animation: none !important; }
        }
      `}</style>
    </section>
  )
}
