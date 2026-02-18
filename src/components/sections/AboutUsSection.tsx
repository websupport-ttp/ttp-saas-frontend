'use client'

import Image from 'next/image'

const services = [
  {
    id: 1,
    title: 'Flight Ticket',
    description: 'Enjoy Competitive Prices, Flexible Options, and Hassle-Free Booking Tailored to Your Travel Needs',
    icon: '/images/service-flight-icon.svg'
  },
  {
    id: 2,
    title: 'Exceptional Hotel Services',
    description: 'From Luxurious Rooms and Fine Dining to 24/7 Concierge, and Thoughtful Amenities Designed for Your Comfort.',
    icon: '/images/service-hotel-icon.svg'
  },
  {
    id: 3,
    title: 'Packaged Tour',
    description: 'Carefully Curated Itineraries, Comfortable Accommodations, and Unforgettable Experiences All in One Convenient Bundle',
    icon: '/images/service-tour-icon.svg'
  },
  {
    id: 4,
    title: 'Car Hire Services',
    description: 'Affordable Rates, Flexible Options, and a Wide Range of Vehicles to Suit Every Journey.',
    icon: '/images/service-car-icon.svg'
  },
  {
    id: 5,
    title: 'Visa Application',
    description: 'Reliable Visa Application Assistance Ensuring You Meet Every Requirement for a Successful and Stress-Free Journey.',
    icon: '/images/service-visa-icon.svg'
  }
]

export default function AboutUsSection() {
  return (
    <section className="relative py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">

          {/* Left Side - Illustration - Hidden on mobile */}
          <div className="relative w-full lg:w-1/2 max-w-2xl hidden lg:block">
            <div className="relative w-full aspect-[648/594] max-w-[648px] mx-auto">
              {/* Background Rectangle */}
              <div className="absolute inset-0"></div>

              {/* Background Pattern SVG */}
              <div className="absolute" style={{
                left: '8.97%',
                top: '4.89%',
                width: '82.06%',
                height: '89.51%'
              }}>
                <Image
                  src="/images/about-bg.svg"
                  alt="Background pattern"
                  width={532}
                  height={532}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* People Illustration */}
              <div className="absolute" style={{
                left: '13%',
                top: '11%',
                width: '75.73%',
                height: '84.14%'
              }}>
                <Image
                  src="/images/about-people.svg"
                  alt="Travel people illustration"
                  width={493}
                  height={498}
                  className="w-full h-full object-contain z-10"
                />
              </div>

              {/* Flight Card - Top Right */}
              <div className="absolute z-20" style={{
                left: '66.2%',
                top: '18%'
              }}>
                <div className="bg-white rounded-3xl px-7 py-2.5 shadow-lg flex items-center gap-2 whitespace-nowrap">
                  <Image
                    src="/images/flight-card-icon.svg"
                    alt="Flight icon"
                    width={20}
                    height={20}
                    className="w-5 h-5 flex-shrink-0"
                  />
                  <span className="text-sm font-normal text-[#636363]">Jakarta - Bali</span>
                </div>
              </div>

              {/* Coffee Icon Card - Left Side */}
              <div className="absolute z-20" style={{
                left: '16.8%',
                top: '12%'
              }}>
                <div className="bg-white rounded-3xl p-2.5 shadow-lg">
                  <Image
                    src="/images/coffee-icon.svg"
                    alt="Coffee icon"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                </div>
              </div>

              {/* Destination Card - Bottom Left */}
              <div className="absolute z-20" style={{
                left: '-2%',
                top: '62%',
                width: '36%',
                height: '34%'
              }}>
                <div className="border border-solid border-white border-[5px] bg-white rounded-2xl shadow-lg h-full overflow-hidden">
                  <div className="relative w-full h-[59.1%]">
                    <Image
                      src="/images/labuan-bajo.png"
                      alt="Labuan Bajo"
                      fill
                      className="object-cover rounded-2xl"
                    />
                  </div>
                  <div className="p-3 h-[40.9%] flex flex-col justify-center">
                    <h4 className="font-bold md:text-[0.875rem] sm:text-[10px]  text-[#333333] mb-1">Explore Labuan Bajo</h4>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 text-[#42A7C3] flex-shrink-0">
                        <svg viewBox="0 0 12 12" fill="currentColor">
                          <path d="M6 0C3.79 0 2 1.79 2 4c0 3 4 8 4 8s4-5 4-8c0-2.21-1.79-4-4-4zm0 5.5c-.83 0-1.5-.67-1.5-1.5S5.17 2.5 6 2.5s1.5.67 1.5 1.5S6.83 5.5 6 5.5z" />
                        </svg>
                      </div>
                      <span className="md:text-[0.625rem] sm:text-[8px] text-[#8F8F8F]">NTT, Indonesia</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hotel Card - Bottom Right */}
              <div className="absolute z-20" style={{
                left: '74.5%',
                top: '51%',
                width: '19.6%',
                height: '19.8%'
              }}>
                <div className="border border-solid border-white border-2 bg-white rounded-lg shadow-lg h-full overflow-hidden">
                  <div className="relative w-full h-[59.1%]">
                    <Image
                      src="/images/le-pirate-hotel.png"
                      alt="Le Pirate Hotel"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="p-2 h-[40.9%] flex flex-col justify-start">
                    <h4 className="font-bold md:text-[0.5rem] sm:text-[6px] text-[#333333] mb-1 leading-tight">Le Pirate Hotel</h4>
                    <div className="flex items-center gap-1">
                      <div className="w-2.5 h-2.5 text-[#42A7C3] flex-shrink-0">
                        <svg viewBox="0 0 10 10" fill="currentColor">
                          <path d="M5 0C3.13 0 1.67 1.46 1.67 3.25c0 2.44 3.33 6.75 3.33 6.75s3.33-4.31 3.33-6.75C8.33 1.46 6.87 0 5 0zm0 4.42c-.65 0-1.17-.52-1.17-1.17S4.35 2.08 5 2.08s1.17.52 1.17 1.17S5.65 4.42 5 4.42z" />
                        </svg>
                      </div>
                      <span className="md:text-[0.55rem] sm:text-[4px] text-[#8F8F8F] leading-tight">Flores, Indonesia</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="w-full lg:w-1/2 max-w-full lg:max-w-2xl">
            {/* Header */}
            <div className="mb-6">
              <p className="text-yellow-600 text-xl font-normal mb-2">Services</p>
              <h2 className="text-gray-900 text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                Why Choose Us
              </h2>
              <p className="text-gray-600 text-base leading-relaxed">
                Enjoy different experiences in every place you visit and discover new and affordable adventures of course.
              </p>
            </div>

            {/* Services List */}
            <div className="space-y-6">
              {services.map((service, index) => (
                <div
                  key={service.id}
                  className={`flex items-center gap-4 bg-white rounded-lg transition-shadow duration-300 ${index === 0
                    ? 'p-4 lg:p-6 shadow-[0px_16px_24px_0px_rgba(96,97,112,0.12),0px_2px_8px_0px_rgba(40,41,61,0.02)]'
                    : 'p-2 lg:p-6 shadow-[0px_16px_24px_0px_rgba(96,97,112,0.12),0px_2px_8px_0px_rgba(40,41,61,0.02)]'
                    }`}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-4">
                    <Image
                      src={service.icon}
                      alt={`${service.title} icon`}
                      width={64}
                      height={64}
                      className="w-8 h-8"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-[#121212] text-lg lg:text-xl font-bold mb-1 lg:mb-2">
                      {service.title}
                    </h3>
                    <p className="text-[#636363] text-sm lg:text-base leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}