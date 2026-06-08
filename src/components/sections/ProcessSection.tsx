'use client'

import { useInViewTyped } from '@/hooks/useInView'

const processSteps = [
  {
    number: '01',
    title: 'Know before you go',
    description: 'We surface everything you need upfront — visa rules, health requirements, entry restrictions, and travel advisories — so there are no nasty surprises at the airport.',
  },
  {
    number: '02',
    title: 'Travel covered, not just booked',
    description: "Our insurance plans protect you against trip cancellations, medical emergencies, lost luggage, and delays. One click and you're covered — no fine print maze.",
  },
  {
    number: '03',
    title: 'Requirements by destination',
    description: 'Every country is different. We give you a clear, up-to-date checklist for wherever you\'re headed — so you arrive prepared, not panicked.',
  },
]

export default function ProcessSection() {
  const { ref: headerRef, inView: headerInView } = useInViewTyped<HTMLDivElement>(0.1)
  const { ref: stepsRef, inView: stepsInView } = useInViewTyped<HTMLDivElement>(0.08)

  return (
    <section className="py-16 lg:py-24 bg-brand-red overflow-hidden">
      <div className="container-custom">

        {/* Header */}
        <div
          ref={headerRef}
          className="text-center mb-16"
          style={{
            opacity:   headerInView ? 1 : 0,
            transform: headerInView ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity 0.65s ease, transform 0.65s ease',
          }}
        >
          <h2 className="font-poppins font-bold text-4xl lg:text-5xl text-white mb-4">
            Plan your trip with confidence
          </h2>
          <p className="text-base text-white max-w-3xl mx-auto">
            We give you the information and tools to travel prepared — not just booked.
          </p>
        </div>

        {/* Steps */}
        <div ref={stepsRef} className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {processSteps.map((step, index) => (
            <div
              key={step.number}
              className="relative group"
              style={{
                opacity:   stepsInView ? 1 : 0,
                transform: stepsInView ? 'translateY(0)' : 'translateY(40px)',
                transition: `opacity 0.6s ${0.15 + index * 0.15}s ease, transform 0.6s ${0.15 + index * 0.15}s ease`,
              }}
            >
              {/* Step Number — shimmer on hover */}
              <div className="mb-6 relative">
                <div
                  className="process-step-number select-none"
                  style={{
                    display: 'inline-block',
                    transition: 'text-shadow 0.3s ease, opacity 0.3s ease',
                  }}
                >
                  {step.number}
                </div>
                {/* Animated underline under the number */}
                <div
                  className="absolute bottom-1 left-0 h-0.5 bg-white/40 w-0 group-hover:w-16 transition-all duration-400"
                />
              </div>

              {/* Content */}
              <div>
                <h3
                  className="font-poppins font-semibold text-xl lg:text-2xl text-white mb-4 leading-tight group-hover:opacity-90 transition-opacity duration-200"
                  dangerouslySetInnerHTML={{ __html: step.title.replace(/\n/g, '<br />') }}
                />
                <p className="text-white/80 leading-relaxed group-hover:text-white transition-colors duration-200">
                  {step.description}
                </p>
              </div>

              {/* Connector line */}
              {index < processSteps.length - 1 && (
                <div
                  className="hidden lg:block absolute top-8 left-16 h-0.5 bg-white/30 -z-10"
                  style={{
                    width: stepsInView ? 'calc(100% - 0px)' : '0%',
                    transition: `width 0.8s ${0.4 + index * 0.2}s ease`,
                  }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white/30 rounded-full" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
