const processSteps = [
  {
    number: '01',
    title: 'Travel requirement for your trips',
    description: 'Ensure a hassle-free journey by staying informed on all essential travel requirements from visa applications and health certifications to local regulations and travel insurance ,everything you need to make your trip smooth, safe, and fully prepared',
  },
  {
    number: '02',
    title: 'Multi-risk travel insurance',
    description: 'Comprehensive Protection for Every Journey — Safeguard Yourself Against Unexpected Events Like Trip Cancellations, Medical Emergencies, Lost Luggage, and More',
  },
  {
    number: '03',
    title: 'Travel requirements by desinations',
    description: 'Find Destination-Specific Travel Requirements — From Visa and Entry Rules to Health Guidelines and Local Regulations, Tailored for Every Country You Plan to Visit',
  },
]

export default function ProcessSection() {
  return (
    <section className="py-16 lg:py-24 bg-brand-red">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-poppins font-bold text-4xl lg:text-5xl text-white mb-4">
            Plan your travel with confidence
          </h2>
          <p className="text-base text-white max-w-3xl mx-auto">
            Get assistance with your bookings and travel plans, and explore what to expect every step of your journey.
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {processSteps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Step Number */}
              <div className="mb-6">
                <div className="process-step-number">
                  {step.number}
                </div>
              </div>

              {/* Step Content */}
              <div>
                <h3
                  className="font-poppins font-semibold text-xl lg:text-2xl text-white mb-4 leading-tight"
                  dangerouslySetInnerHTML={{ __html: step.title.replace(/\n/g, '<br />') }}
                />
                <p className="text-white leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connector Line (hidden on mobile, shown on desktop) */}
              {index < processSteps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-16 w-full h-0.5 bg-white bg-opacity-30 -z-10">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white bg-opacity-30 rounded-full" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}