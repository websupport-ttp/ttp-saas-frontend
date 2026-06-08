'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { cmsService, HotDeal } from '@/lib/services/cms-service'
import { useInViewTyped } from '@/hooks/useInView'

const defaultDeals: HotDeal[] = [
  {
    _id: '01',
    title: 'Bali Paradise',
    description: 'Experience the magic of Bali with our exclusive 7-day package including flights, accommodation, and guided tours.',
    image: { url: '/images/labuan-bajo.png' },
    originalPrice: 1299,
    discountedPrice: 899,
    discountPercentage: 30,
    category: 'Package',
    validFrom: new Date().toISOString(),
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    featured: true,
  },
]

export default function HotDealsSection() {
  const [hotDeals, setHotDeals] = useState<HotDeal[]>(defaultDeals)
  const { ref: sectionRef, inView } = useInViewTyped<HTMLDivElement>(0.1)

  useEffect(() => {
    cmsService.getHotDeals(true)
      .then(r => { if (r.data?.length) setHotDeals(r.data) })
      .catch(() => {})
  }, [])

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n)

  return (
    <section className="relative py-16 lg:py-24 bg-white overflow-hidden">
      <div ref={sectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="bg-brand-blue rounded-[50px] px-8 py-16 lg:px-16 lg:py-20 relative overflow-hidden">

          {/* Subtle animated background blobs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[50px]" aria-hidden>
            <div className="absolute w-72 h-72 rounded-full bg-white/5 -top-16 -right-16"
                 style={{ animation: 'blobDrift 12s ease-in-out infinite alternate' }} />
            <div className="absolute w-48 h-48 rounded-full bg-white/5 bottom-8 left-8"
                 style={{ animation: 'blobDrift 16s 2s ease-in-out infinite alternate-reverse' }} />
          </div>

          {/* Header */}
          <div
            className="text-left mb-12 lg:mb-16 relative z-10"
            style={{
              opacity:   inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(24px)',
              transition: 'opacity 0.65s ease, transform 0.65s ease',
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Image src="/images/services-icon.svg" alt="Hot Deals" width={20} height={20} className="w-5 h-5" />
              <span className="text-white font-semibold text-sm tracking-widest uppercase">Hot Deals</span>
            </div>
            <h2 className="text-white text-2xl lg:text-3xl xl:text-4xl font-bold leading-tight">
              Limited Time Offers
            </h2>
          </div>

          {/* Deal Cards */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 lg:gap-6 justify-center sm:justify-start relative z-10">
            {hotDeals.map((deal, i) => (
              <div
                key={deal._id}
                className="group cursor-pointer w-full sm:w-auto"
                style={{
                  opacity:   inView ? 1 : 0,
                  transform: inView ? 'translateY(0) scale(1)' : 'translateY(32px) scale(0.97)',
                  transition: `opacity 0.6s ${0.15 + i * 0.12}s ease, transform 0.6s ${0.15 + i * 0.12}s ease`,
                }}
              >
                <div className="relative w-full sm:w-32 lg:w-40 h-64 lg:h-80 rounded-2xl overflow-hidden transition-all duration-500 sm:group-hover:w-64 sm:group-hover:lg:w-80 shadow-lg group-hover:shadow-2xl">
                  <Image
                    src={deal.image?.url || '/images/labuan-bajo.png'}
                    alt={deal.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, 20vw"
                  />

                  {/* Discount badge */}
                  <div className="absolute top-4 right-4 bg-brand-red px-3 py-1 rounded-full shadow-md">
                    <span className="text-white text-xs font-bold">{deal.discountPercentage}% OFF</span>
                  </div>

                  {/* Collapsed title tab */}
                  <div className="absolute top-0 left-0 bg-brand-red px-2 sm:px-3 py-3 sm:py-4 rounded-br-2xl flex items-start justify-center w-10 sm:w-12 opacity-100 group-hover:opacity-0 transition-opacity duration-500"
                       style={{ height: '160px' }}>
                    <span className="text-white font-bold whitespace-nowrap"
                          style={{ writingMode: 'vertical-lr', textOrientation: 'mixed', fontSize: '14px', transform: 'rotate(180deg)', marginTop: '8px' }}>
                      {deal.title}
                    </span>
                  </div>

                  {/* Hover content */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center p-4 sm:p-6">
                    <div className="bg-brand-blue/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 text-left max-w-full w-full"
                         style={{ animation: inView ? 'none' : undefined }}>
                      <h3 className="text-white text-base sm:text-lg font-bold mb-2 sm:mb-3">{deal.title}</h3>
                      <p className="text-white text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">{deal.description}</p>
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white/70 text-xs line-through">{formatCurrency(deal.originalPrice)}</span>
                          <span className="text-white text-sm font-bold">{formatCurrency(deal.discountedPrice)}</span>
                        </div>
                      </div>
                      <button className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-white text-xs font-semibold hover:bg-white hover:text-brand-blue transition-all duration-300 border border-white">
                        Book Now <span>→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blobDrift {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(30px, 20px) scale(1.1); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="blobDrift"] { animation: none !important; }
        }
      `}</style>
    </section>
  )
}
