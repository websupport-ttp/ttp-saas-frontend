'use client'

import { useState } from 'react'
import Image from 'next/image'

const testimonials = [
  {
    id: 1,
    name: 'Albert Flores',
    role: 'Traveller',
    image: '/images/albert-flores.png',
    quote: 'We have been operating for over an providin top-notch services to our clients and build strong track record in the industry.We have been operating for over a decad providi ina top-notch We have been operating'
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
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const currentData = testimonials[currentTestimonial]

  return (
    <section className="relative py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Dark Blue Container with Rounded Corners */}
        <div className="bg-[#141B34] rounded-[50px] px-8 py-16 lg:px-16 lg:py-20 relative overflow-hidden">

          {/* Section Header */}
          <div className="text-center mb-12 lg:mb-16">
            <div className="flex items-center justify-center gap-2.5 mb-1">
              <Image
                src="/images/testimonials-icon.svg"
                alt="Testimonials"
                width={20}
                height={20}
                className="w-5 h-5"
              />
              <span className="text-white font-semibold text-sm tracking-[10%] uppercase">
                Testimonials
              </span>
            </div>
            <h2 className="text-white text-2xl lg:text-3xl font-bold leading-tight">
              Happy Travellers
            </h2>
          </div>

          {/* Testimonial Content */}
          <div className="flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12">

            {/* Left Side - Background Image (40% width) */}
            <div className="relative w-full lg:w-[35%]">
              <div className="relative w-full h-[300px] lg:h-[400px] rounded-[30px] overflow-hidden">
                <Image
                  src="/images/testimonial-bg.png"
                  alt="Happy travellers jumping"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
            </div>

            {/* Right Side - Testimonial Content (60% width) */}
            <div className="w-full lg:w-[65%]">
              <div className="bg-white rounded-[20px] p-6 lg:p-12 relative h-[300px] lg:h-[400px] flex flex-col justify-between">

                {/* Quote Icon */}
                <div className="mb-6">
                  <Image
                    src="/images/quote-icon.svg"
                    alt="Quote icon"
                    width={64}
                    height={39}
                    className="w-12 lg:w-16 h-auto"
                  />
                </div>

                {/* Testimonial Text */}
                <div className="flex-1 mb-6">
                  <p className="text-[#333333] text-base lg:text-[22px] leading-relaxed font-normal overflow-hidden text-ellipsis line-clamp-3">
                    {currentData.quote}
                  </p>
                </div>

                {/* Author Info */}
                <div className="mb-6">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 lg:w-16 lg:h-16 rounded-full overflow-hidden">
                      <Image
                        src={currentData.image}
                        alt={currentData.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-[#333333] text-lg lg:text-[22px] font-bold leading-tight">
                        {currentData.name}
                      </h4>
                      <p className="text-[#333333] text-sm lg:text-base font-normal">
                        {currentData.role}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Line and Navigation */}
                <div className="relative">
                  {/* Bottom Line - Starts from left and ends before navigation */}
                  <div className="h-px bg-[#333333] mr-[180px]"></div>

                  {/* Navigation Buttons - Positioned at bottom right */}
                  <div className="absolute top-[-80px] right-0 flex items-center gap-5">
                    <button
                      onClick={prevTestimonial}
                      className="w-15 h-15 p-6 rounded-full bg-[#141B34] shadow-[0px_6px_50px_0px_rgba(37,37,37,0.05)] flex items-center justify-center hover:scale-110 transition-all duration-200"
                      aria-label="Previous testimonial"
                    >
                      <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.5 12L4.5 8L8.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>

                    <button
                      onClick={nextTestimonial}
                      className="w-15 h-15 p-6 rounded-full bg-[#141B34] flex items-center justify-center hover:scale-110 transition-all duration-200"
                      aria-label="Next testimonial"
                    >
                      <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
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