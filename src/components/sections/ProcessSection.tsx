const processSteps = [
  {
    number: '01',
    title: 'Know before you go',
    description: 'We surface everything you need upfront — visa rules, health requirements, entry restrictions, and travel advisories — so there are no nasty surprises at the airport.',
  },
  {
    number: '02',
    title: 'Travel covered, not just booked',
    description: 'Our insurance plans protect you against trip cancellations, medical emergencies, lost luggage, and delays. One click and you\'re covered — no fine print maze.',
  },
  {
    number: '03',
    title: 'Requirements by destination',
    description: 'Every country is different. We give you a clear, up-to-date checklist for wherever you\'re headed — so you arrive prepared, not panicked.',
  },
]

export default function ProcessSection() {
  return (
    <section className="py-16 lg:py-24 bg-brand-red">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-poppins font-bold text-4xl lg:text-5xl text-white mb-4">
            Plan your trip with confidence
          </h2>
          <p className="text-base text-white max-w-3xl mx-auto">
            We give you the information and tools to travel prepared — not just booked.
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