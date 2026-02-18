'use client'

import Image from 'next/image'

const hotDeals = [
    {
        id: '01',
        title: 'Bali Paradise',
        description: 'Experience the magic of Bali with our exclusive 7-day package including flights, accommodation, and guided tours.',
        image: '/images/labuan-bajo.png',
        alt: 'Bali Paradise deal',
        originalPrice: '$1,299',
        salePrice: '$899',
        discount: '30% OFF',
        cta: 'Book Now'
    },
    {
        id: '02',
        title: 'Tokyo Adventure',
        description: 'Discover the vibrant culture of Tokyo with our 5-day city break including hotel stays and cultural experiences.',
        image: '/images/le-pirate-hotel.png',
        alt: 'Tokyo Adventure deal',
        originalPrice: '$1,599',
        salePrice: '$1,199',
        discount: '25% OFF',
        cta: 'Book Now'
    },
    {
        id: '03',
        title: 'European Explorer',
        description: 'Visit 4 European capitals in 10 days with our comprehensive tour package including all transfers and meals.',
        image: '/images/testimonial-bg.png',
        alt: 'European Explorer deal',
        originalPrice: '$2,499',
        salePrice: '$1,899',
        discount: '24% OFF',
        cta: 'Book Now'
    },
    {
        id: '04',
        title: 'Safari Experience',
        description: 'Embark on an unforgettable African safari adventure with luxury lodges and expert wildlife guides.',
        image: '/images/labuan-bajo.png',
        alt: 'Safari Experience deal',
        originalPrice: '$3,299',
        salePrice: '$2,499',
        discount: '24% OFF',
        cta: 'Book Now'
    },
    {
        id: '05',
        title: 'Caribbean Cruise',
        description: 'Sail through the beautiful Caribbean islands with our 7-night luxury cruise package with all meals included.',
        image: '/images/le-pirate-hotel.png',
        alt: 'Caribbean Cruise deal',
        originalPrice: '$1,899',
        salePrice: '$1,399',
        discount: '26% OFF',
        cta: 'Book Now'
    }
]

export default function HotDealsSection() {
    return (
        <section className="relative py-16 lg:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
                <div className="bg-brand-blue rounded-[50px] px-8 py-16 lg:px-16 lg:py-20 relative overflow-hidden">
                    {/* Section Header */}
                    <div className="text-left mb-12 lg:mb-16">
                        <div className="flex items-center gap-2 mb-4">
                            <Image
                                src="/images/services-icon.svg"
                                alt="Hot Deals"
                                width={20}
                                height={20}
                                className="w-5 h-5"
                            />
                            <span className="text-white font-semibold text-sm tracking-widest uppercase">
                                Hot Deals
                            </span>
                        </div>
                        <h2 className="text-white text-2xl lg:text-3xl xl:text-4xl font-bold leading-tight">
                            Limited Time Offers
                        </h2>
                    </div>

                    {/* Hot Deals Grid - Mobile: single column, Desktop: horizontal expansion */}
                    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 lg:gap-6 justify-center sm:justify-start">
                        {hotDeals.map((deal) => (
                            <div
                                key={deal.id}
                                className="group cursor-pointer w-full sm:w-auto"
                            >
                                {/* Card Container - Mobile: full width, Desktop: half width initially, expands horizontally on hover */}
                                <div className="relative w-full sm:w-32 lg:w-40 h-64 lg:h-80 rounded-2xl overflow-hidden transition-all duration-500 sm:group-hover:w-64 sm:group-hover:lg:w-80">
                                    {/* Deal Image Background */}
                                    <Image
                                        src={deal.image}
                                        alt={deal.alt}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                                    />

                                    {/* Discount Badge - Top Right */}
                                    <div className="absolute top-4 right-4 bg-brand-red px-3 py-1 rounded-full">
                                        <span className="text-white text-xs font-bold">
                                            {deal.discount}
                                        </span>
                                    </div>

                                    {/* Red Title Tab - Visible only when not hovered, responsive positioning */}
                                    <div className="absolute top-0 left-0 bg-brand-red px-2 sm:px-3 py-3 sm:py-4 rounded-br-2xl flex items-start justify-center w-10 sm:w-12 opacity-100 group-hover:opacity-0 transition-opacity duration-500" style={{ height: '160px' }}>
                                        <span
                                            className="text-white font-bold whitespace-nowrap"
                                            style={{
                                                writingMode: 'vertical-lr',
                                                textOrientation: 'mixed',
                                                fontSize: '14px',
                                                transform: 'rotate(180deg)',
                                                marginTop: '8px'
                                            }}
                                        >
                                            {deal.title}
                                        </span>
                                    </div>

                                    {/* Content Overlay - Appears on hover, responsive padding and text */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center p-4 sm:p-6">
                                        <div className="bg-brand-blue/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 text-left max-w-full w-full">
                                            <h3 className="text-white text-base sm:text-lg font-bold mb-2 sm:mb-3">
                                                {deal.title}
                                            </h3>
                                            <p className="text-white text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
                                                {deal.description}
                                            </p>

                                            {/* Pricing */}
                                            <div className="mb-4">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-white/70 text-xs line-through">
                                                        {deal.originalPrice}
                                                    </span>
                                                    <span className="text-white text-sm font-bold">
                                                        {deal.salePrice}
                                                    </span>
                                                </div>
                                            </div>

                                            <button
                                                className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-white text-xs font-semibold hover:bg-white hover:text-brand-blue transition-all duration-300"
                                                style={{
                                                    border: '1px solid #ffffff'
                                                }}
                                            >
                                                {deal.cta}
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