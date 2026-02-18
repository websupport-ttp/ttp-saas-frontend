import Image from 'next/image'
// Inline SVG icons
const Plane = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
)

const MapPin = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const Package = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
)

const Car = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 6H4L2 4v4l15 1 1-3z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 17h8m4 0h2v-6a1 1 0 00-1-1h-4l-1-2H9L7 6H4" />
  </svg>
)

const FileText = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

const features = [
  {
    icon: Plane,
    title: 'Flight Ticket',
    description: 'Enjoy Competitive Prices, Flexible Options, and Hassle-Free Booking Tailored to Your Travel Needs',
  },
  {
    icon: MapPin,
    title: 'Exceptional Hotel Services',
    description: 'From Luxurious Rooms and Fine Dining to 24/7 Concierge, and Thoughtful Amenities Designed for Your Comfort.',
  },
  {
    icon: Package,
    title: 'Packaged Tour',
    description: 'Carefully Curated Itineraries, Comfortable Accommodations, and Unforgettable Experiences All in One Convenient Bundle',
  },
  {
    icon: Car,
    title: 'Car Hire Services',
    description: 'Affordable Rates, Flexible Options, and a Wide Range of Vehicles to Suit Every Journey.',
  },
  {
    icon: FileText,
    title: 'Visa Application',
    description: 'Reliable Visa Application Assistance Ensuring You Meet Every Requirement for a Successful and Stress-Free Journey.',
  },
]

export default function WhyChooseUsSection() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Illustration */}
          <div className="relative">
            {/* Background */}
            <div className="relative w-full h-[500px] lg:h-[600px]">
              <Image
                src="/images/why-choose-bg.svg"
                alt="Why choose us background"
                fill
                className="object-contain"
              />
              
              {/* People Illustration */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/images/why-choose-people.svg"
                  alt="Happy travelers"
                  width={300}
                  height={400}
                  className="object-contain"
                />
              </div>

              {/* Floating Cards */}
              <div className="absolute top-16 right-8 bg-white rounded-lg shadow-lg p-3 animate-bounce">
                <div className="flex items-center gap-2">
                  <Plane className="w-5 h-5 text-brand-red" />
                  <span className="text-sm font-medium">Jakarta - Bali</span>
                </div>
              </div>

              <div className="absolute top-32 left-4 bg-white rounded-lg shadow-lg p-3 animate-pulse">
                <Image
                  src="/images/hotel-booking-card.svg"
                  alt="Hotel booking"
                  width={40}
                  height={40}
                />
              </div>

              <div className="absolute bottom-32 right-4 bg-white rounded-lg shadow-lg p-3 max-w-[200px]">
                <div className="relative w-full h-20 mb-2 rounded overflow-hidden">
                  <Image
                    src="/images/labuan-bajo-image.png"
                    alt="Labuan Bajo"
                    fill
                    className="object-cover"
                  />
                </div>
                <h4 className="font-semibold text-sm mb-1">Explore Labuan Bajo</h4>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-gray-500" />
                  <span className="text-xs text-gray-500">NTT, Indonesia</span>
                </div>
              </div>

              <div className="absolute bottom-16 left-8 bg-white rounded-lg shadow-lg p-3 max-w-[180px]">
                <div className="relative w-full h-16 mb-2 rounded overflow-hidden">
                  <Image
                    src="/images/le-pirate-hotel-image.png"
                    alt="Le Pirate Hotel"
                    fill
                    className="object-cover"
                  />
                </div>
                <h4 className="font-semibold text-sm mb-1">Le Pirate Hotel</h4>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-gray-500" />
                  <span className="text-xs text-gray-500">Flores, Indonesia</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            {/* Section Header */}
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full mb-6">
                <span className="w-2 h-2 bg-brand-red rounded-full"></span>
                <span className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Services
                </span>
              </div>
              <h2 className="font-poppins font-bold text-3xl lg:text-4xl text-gray-900 mb-4">
                Why Choose Us
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                The Travel Place (TTP) is your one-stop shop for unbeatable deals and seamless travel experiences across the globe. We specialize in making your travel dreams a reality.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-8">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-brand-red/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-brand-red" />
                    </div>
                    <div>
                      <h3 className="font-poppins font-semibold text-xl text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}