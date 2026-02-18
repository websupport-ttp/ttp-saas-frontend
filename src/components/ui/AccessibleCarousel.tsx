'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { KeyboardKeys, handleArrowKeyNavigation, announceToScreenReader } from '@/lib/accessibility';

interface CarouselItem {
  id: string;
  content: React.ReactNode;
}

interface AccessibleCarouselProps {
  items: CarouselItem[];
  autoPlay?: boolean;
  interval?: number;
  className?: string;
  showIndicators?: boolean;
  showControls?: boolean;
  ariaLabel?: string;
  onSlideChange?: (index: number) => void;
}

export default function AccessibleCarousel({
  items,
  autoPlay = false,
  interval = 5000,
  className = '',
  showIndicators = true,
  showControls = true,
  ariaLabel = 'Carousel',
  onSlideChange,
}: AccessibleCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [focusedIndicator, setFocusedIndicator] = useState(-1);
  
  const carouselRef = useRef<HTMLDivElement>(null);
  const indicatorsRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const goToSlide = useCallback((index: number, announce = true) => {
    const newIndex = Math.max(0, Math.min(index, items.length - 1));
    setCurrentIndex(newIndex);
    onSlideChange?.(newIndex);
    
    if (announce) {
      announceToScreenReader(`Slide ${newIndex + 1} of ${items.length}`, 'polite');
    }
  }, [items.length, onSlideChange]);

  const goToPrevious = useCallback(() => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
    goToSlide(newIndex);
  }, [currentIndex, items.length, goToSlide]);

  const goToNext = useCallback(() => {
    const newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
    goToSlide(newIndex);
  }, [currentIndex, items.length, goToSlide]);

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && autoPlay) {
      intervalRef.current = setInterval(goToNext, interval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, autoPlay, interval, goToNext]);

  // Pause on hover/focus
  const handleMouseEnter = () => setIsPlaying(false);
  const handleMouseLeave = () => setIsPlaying(autoPlay);
  const handleFocus = () => setIsPlaying(false);
  const handleBlur = () => setIsPlaying(autoPlay);

  // Keyboard navigation for carousel
  const handleCarouselKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case KeyboardKeys.ARROW_LEFT:
        event.preventDefault();
        goToPrevious();
        break;
      case KeyboardKeys.ARROW_RIGHT:
        event.preventDefault();
        goToNext();
        break;
      case KeyboardKeys.HOME:
        event.preventDefault();
        goToSlide(0);
        break;
      case KeyboardKeys.END:
        event.preventDefault();
        goToSlide(items.length - 1);
        break;
    }
  };

  // Keyboard navigation for indicators
  const handleIndicatorKeyDown = (event: React.KeyboardEvent) => {
    const indicators = indicatorsRef.current?.querySelectorAll('button') || [];
    const indicatorArray = Array.from(indicators) as HTMLElement[];
    
    const newIndex = handleArrowKeyNavigation(
      event.nativeEvent,
      indicatorArray,
      focusedIndicator,
      {
        orientation: 'horizontal',
        onSelect: (index) => goToSlide(index),
      }
    );
    
    setFocusedIndicator(newIndex);
  };

  return (
    <div
      ref={carouselRef}
      className={`relative ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      role="region"
      aria-label={ariaLabel}
      aria-live="polite"
      aria-atomic="false"
    >
      {/* Carousel Content */}
      <div
        className="overflow-hidden"
        onKeyDown={handleCarouselKeyDown}
        tabIndex={0}
        role="group"
        aria-label={`Slide ${currentIndex + 1} of ${items.length}`}
      >
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item, index) => (
            <div
              key={item.id}
              className="w-full flex-shrink-0"
              aria-hidden={index !== currentIndex}
            >
              {item.content}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Controls */}
      {showControls && items.length > 1 && (
        <>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2"
            onClick={goToPrevious}
            aria-label="Previous slide"
            type="button"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2"
            onClick={goToNext}
            aria-label="Next slide"
            type="button"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {showIndicators && items.length > 1 && (
        <div
          ref={indicatorsRef}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2"
          role="tablist"
          aria-label="Carousel slides"
          onKeyDown={handleIndicatorKeyDown}
        >
          {items.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 ${
                index === currentIndex
                  ? 'bg-white'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              onClick={() => goToSlide(index)}
              onFocus={() => setFocusedIndicator(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-selected={index === currentIndex}
              role="tab"
              type="button"
            />
          ))}
        </div>
      )}

      {/* Play/Pause Button */}
      {autoPlay && (
        <button
          className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
          onClick={() => setIsPlaying(!isPlaying)}
          aria-label={isPlaying ? 'Pause carousel' : 'Play carousel'}
          type="button"
        >
          {isPlaying ? (
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      )}

      {/* Screen Reader Status */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Slide {currentIndex + 1} of {items.length}
        {isPlaying ? ', auto-playing' : ', paused'}
      </div>
    </div>
  );
}