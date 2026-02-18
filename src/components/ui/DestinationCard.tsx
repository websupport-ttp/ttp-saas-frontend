'use client';

import Image from 'next/image';
import { Destination } from '@/types';

interface DestinationCardProps {
  destination: Destination;
  className?: string;
  showPrice?: boolean;
  showDuration?: boolean;
  onClick?: (destination: Destination) => void;
}

export default function DestinationCard({
  destination,
  className = '',
  showPrice = true,
  showDuration = true,
  onClick,
}: DestinationCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(destination);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && onClick) {
      e.preventDefault();
      onClick(destination);
    }
  };

  return (
    <div
      className={`group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : -1}
      role={onClick ? 'button' : undefined}
      aria-label={onClick ? `View details for ${destination.name}, ${destination.country}` : undefined}
    >
      {/* Image Container */}
      <div className="relative h-40 sm:h-48 md:h-56 lg:h-64 xl:h-72 overflow-hidden">
        <Image
          src={destination.image}
          alt={`${destination.name}, ${destination.country}`}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={false}
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Price badge */}
        {showPrice && (
          <div className="absolute top-2 sm:top-3 lg:top-4 right-2 sm:right-3 lg:right-4 bg-white/90 backdrop-blur-sm rounded-full px-2 sm:px-3 py-1 shadow-md">
            <span className="text-xs sm:text-sm font-semibold text-gray-900">
              ${destination.price.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 lg:p-6">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 group-hover:text-brand-red transition-colors duration-200 line-clamp-2">
              {destination.name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              {destination.country}
            </p>
          </div>
        </div>

        {/* Duration */}
        {showDuration && (
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <svg 
              className="w-4 h-4 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <span>{destination.duration}</span>
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
          {destination.description}
        </p>

        {/* Highlights */}
        <div className="flex flex-wrap gap-1 mb-4">
          {destination.highlights.slice(0, 2).map((highlight, index) => (
            <span
              key={index}
              className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
            >
              {highlight}
            </span>
          ))}
          {destination.highlights.length > 2 && (
            <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
              +{destination.highlights.length - 2} more
            </span>
          )}
        </div>

        {/* Call to action */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Best time: {destination.bestTimeToVisit.split(',')[0]}
          </div>
          <div className="flex items-center text-brand-red group-hover:text-brand-red-dark transition-colors duration-200">
            <span className="text-sm font-medium mr-1">Explore</span>
            <svg 
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" 
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
          </div>
        </div>
      </div>
    </div>
  );
}