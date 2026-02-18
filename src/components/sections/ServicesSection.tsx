'use client'

import Image from 'next/image'

const services = [
  {
    id: '01',
    title: 'Flight Booking',
    description: 'Book domestic and international flights with ease and get the best deals available.',
    image: '/images/country-01.png',
    alt: 'Flight booking service',
    cta: 'Book Flight'
  },
  {
    id: '02',
    title: 'Hotel Reservations',
    description: 'Find and book the perfect accommodation for your stay anywhere in the world.',
    image: '/images/country-02.png',
    alt: 'Hotel reservation service',
    cta: 'Find Hotels'
  },
  {
    id: '03',
    title: 'Travel Insurance',
    description: 'Protect your journey with comprehensive travel insurance coverage.',
    image: '/images/country-03.png',
    alt: 'Travel insurance service',
    cta: 'Get Quote'
  },
  {
    id: '04',
    title: 'Visa Assistance',
    description: 'Apply for travel visas without stress — we handle the paperwork while you plan the adventure',
    image: '/images/country-04.png',
    alt: 'Visa assistance service',
    cta: 'Apply Now'
  },
  {
    id: '05',
    title: 'Car Hire',
    description: 'Rent vehicles for your travel needs with flexible options and competitive rates.',
    image: '/images/country-01.png',
    alt: 'Car rental service',
    cta: 'Rent Car'
  }
]

export default function OurServicesSection() {
  return (
    <section className="relative py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="bg-brand-blue rounded-[50px] px-8 py-16 lg:px-16 lg:py-20 relative overflow-hidden">
          {/* Section Header */}
          <div className="text-left mb-12 lg:mb-16">
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/images/services-icon.svg"
                alt="Services"
                width={20}
                height={20}
                className="w-5 h-5"
              />
              <span className="text-white font-semibold text-sm tracking-widest uppercase">
                Our Services
              </span>
            </div>
            <h2 className="text-white text-2xl lg:text-3xl xl:text-4xl font-bold leading-tight">
              Making Memories Around World Unforgettable
            </h2>
          </div>

          {/* Services Grid - Mobile: vertical stack, Desktop: horizontal expansion */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 lg:gap-6 justify-center sm:justify-start">
            {services.map((service) => (
              <div
                key={service.id}
                className="group cursor-pointer w-full sm:w-auto"
              >
                {/* Card Container - Mobile: full width, Desktop: half width initially, expands horizontally on hover */}
                <div className="relative w-full sm:w-32 lg:w-40 h-64 lg:h-80 rounded-2xl overflow-hidden transition-all duration-500 sm:group-hover:w-64 sm:group-hover:lg:w-80">
                  {/* Service Image Background */}
                  <Image
                    src={service.image}
                    alt={service.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />

                  {/* Red Title Tab - Visible only when not hovered */}
                  <div className="absolute top-0 left-0 bg-brand-red px-3 py-4 rounded-br-2xl flex items-start justify-center w-12 opacity-100 group-hover:opacity-0 transition-opacity duration-500" style={{ height: '200px' }}>
                    <span
                      className="text-white font-bold whitespace-nowrap"
                      style={{
                        writingMode: 'vertical-lr',
                        textOrientation: 'mixed',
                        fontSize: '16px',
                        transform: 'rotate(180deg)',
                        marginTop: '8px'
                      }}
                    >
                      {service.title}
                    </span>
                  </div>

                  {/* Content Overlay - Appears on hover with blue background behind content only */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center p-6">
                    <div className="bg-brand-blue/95 backdrop-blur-sm rounded-2xl p-6 text-left max-w-full">
                      <h3 className="text-white text-lg font-bold mb-3">
                        {service.title}
                      </h3>
                      <p className="text-white text-xs leading-relaxed mb-6">
                        {service.description}
                      </p>

                      <button
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white text-xs font-semibold hover:bg-white hover:text-brand-blue transition-all duration-300"
                        style={{
                          border: '1px solid #ffffff'
                        }}
                      >
                        {service.cta}
                        <span className="text-xs">→</span>
                      </button>
                    </div>
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