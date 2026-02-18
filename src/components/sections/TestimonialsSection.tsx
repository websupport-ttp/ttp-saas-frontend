'use client';

import { useState, useEffect, useCallback } from 'react';
import { Testimonial } from '@/types';
import { customerTestimonials } from '@/lib/data/testimonials';
import { Button } from '@/components/ui/Button';

// Simple icon components to avoid external dependencies
const ChevronLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
  </svg>
);

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
  autoPlay?: boolean;
  interval?: number;
  className?: string;
}

export function TestimonialsSection({
  testimonials = customerTestimonials,
  autoPlay = true,
  interval = 5000,
  className = ''
}: TestimonialsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);

  const nextTestimonial = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  }, [testimonials.length]);

  const prevTestimonial = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  }, [testimonials.length]);

  const goToTestimonial = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(nextTestimonial, interval);
    return () => clearInterval(timer);
  }, [isAutoPlaying, interval, nextTestimonial]);

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(autoPlay);

  if (!testimonials.length) {
    return null;
  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className={`py-16 lg:py-24 bg-gradient-to-br from-blue-50 to-indigo-100 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            What Our Travelers Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover why thousands of travelers trust us with their dream vacations
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div 
          className="relative max-w-4xl mx-auto"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          role="region"
          aria-label="Customer testimonials"
          aria-live="polite"
        >
          {/* Main Testimonial Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand-red/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
            
            {/* Quote Icon */}
            <div className="absolute top-6 left-6 w-12 h-12 bg-brand-red/10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-brand-red" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
              </svg>
            </div>

            {/* Testimonial Content */}
            <div className="pt-8">
              {/* Rating Stars */}
              <div className="flex items-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-5 h-5 ${
                      i < currentTestimonial.rating
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {currentTestimonial.rating}/5
                </span>
              </div>

              {/* Testimonial Text */}
              <blockquote 
                className="text-lg lg:text-xl text-gray-700 leading-relaxed mb-8"
                aria-label={`Testimonial from ${currentTestimonial.author}`}
              >
                "{currentTestimonial.text}"
              </blockquote>

              {/* Author Info */}
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  <img
                    src={currentTestimonial.avatar}
                    alt={currentTestimonial.author}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/author-avatar.svg';
                    }}
                  />
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900 text-lg">
                    {currentTestimonial.author}
                  </h4>
                  <p className="text-gray-600">
                    {currentTestimonial.role}
                    {currentTestimonial.company && (
                      <span> at {currentTestimonial.company}</span>
                    )}
                  </p>
                  <p className="text-sm text-gray-500">
                    {currentTestimonial.location}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-8">
            {/* Previous Button */}
            <Button
              variant="outline"
              size="md"
              onClick={prevTestimonial}
              className="flex items-center gap-2 hover:bg-brand-red hover:text-white hover:border-brand-red transition-all duration-300"
              aria-label="Previous testimonial"
            >
              <ChevronLeftIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Previous</span>
            </Button>

            {/* Dots Indicator */}
            <div 
              className="flex items-center gap-2"
              role="tablist"
              aria-label="Testimonial navigation"
            >
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2 ${
                    index === currentIndex
                      ? 'bg-brand-red scale-125'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to testimonial ${index + 1} of ${testimonials.length}`}
                  aria-selected={index === currentIndex}
                  role="tab"
                  type="button"
                />
              ))}
            </div>

            {/* Next Button */}
            <Button
              variant="outline"
              size="md"
              onClick={nextTestimonial}
              className="flex items-center gap-2 hover:bg-brand-red hover:text-white hover:border-brand-red transition-all duration-300"
              aria-label="Next testimonial"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRightIcon className="w-5 h-5" />
            </Button>
          </div>

          {/* Auto-play Indicator */}
          {autoPlay && (
            <div className="flex items-center justify-center mt-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className={`w-2 h-2 rounded-full ${isAutoPlaying ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span>{isAutoPlaying ? 'Auto-playing' : 'Paused'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Additional Testimonials Preview (Mobile Hidden) */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6 mt-16">
          {testimonials
            .filter((_, index) => index !== currentIndex)
            .slice(0, 3)
            .map((testimonial, index) => (
              <div
                key={testimonial.id}
                className="bg-white/70 backdrop-blur-sm rounded-xl p-6 cursor-pointer hover:bg-white hover:shadow-lg transition-all duration-300"
                onClick={() => goToTestimonial(testimonials.findIndex(t => t.id === testimonial.id))}
              >
                <div className="flex items-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonial.rating
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-700 text-sm mb-4 overflow-hidden" style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical'
                }}>
                  "{testimonial.text}"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/author-avatar.svg';
                      }}
                    />
                  </div>
                  <div className="ml-3">
                    <h5 className="font-medium text-gray-900 text-sm">
                      {testimonial.author}
                    </h5>
                    <p className="text-xs text-gray-600">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}