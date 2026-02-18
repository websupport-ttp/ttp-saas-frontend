'use client';

import Image from 'next/image';
import { Hotel, HotelCardProps } from '@/types';

export default function HotelCard({
  hotel,
  className = '',
  showRating = true,
  showAmenities = true,
  onClick,
}: HotelCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(hotel);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && onClick) {
      e.preventDefault();
      onClick(hotel);
    }
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg
          key={i}
          className="w-4 h-4 text-yellow-400 fill-current"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg
          key="half"
          className="w-4 h-4 text-yellow-400"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="half-star">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path
            fill="url(#half-star)"
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          />
        </svg>
      );
    }

    return stars;
  };

  return (
    <div
      className={`group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : -1}
      role={onClick ? 'button' : undefined}
      aria-label={onClick ? `View details for ${hotel.name} in ${hotel.location}` : undefined}
    >
      {/* Image Container */}
      <div className="relative h-40 sm:h-48 md:h-56 lg:h-64 xl:h-72 overflow-hidden">
        <Image
          src={hotel.image}
          alt={`${hotel.name} in ${hotel.location}`}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 50vw, 33vw"
          priority={false}
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Price badge */}
        <div className="absolute top-2 sm:top-3 lg:top-4 right-2 sm:right-3 lg:right-4 bg-white/90 backdrop-blur-sm rounded-full px-2 sm:px-3 py-1 shadow-md">
          <span className="text-xs sm:text-sm font-semibold text-gray-900">
            ${hotel.price}
            <span className="text-xs text-gray-600">/night</span>
          </span>
        </div>

        {/* Rating badge */}
        {showRating && (
          <div className="absolute top-2 sm:top-3 lg:top-4 left-2 sm:left-3 lg:left-4 bg-white/90 backdrop-blur-sm rounded-full px-2 sm:px-3 py-1 shadow-md flex items-center">
            <span className="text-xs sm:text-sm font-semibold text-gray-900 mr-1">
              {hotel.rating}
            </span>
            <svg
              className="w-3 h-3 text-yellow-400 fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 lg:p-6">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 group-hover:text-brand-red transition-colors duration-200 line-clamp-2">
              {hotel.name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 flex items-center">
              <svg 
                className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                />
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                />
              </svg>
              <span className="truncate">{hotel.location}, {hotel.country}</span>
            </p>
          </div>
        </div>

        {/* Rating and Reviews */}
        {showRating && (
          <div className="flex items-center mb-3">
            <div className="flex items-center mr-2">
              {renderStars(hotel.rating)}
            </div>
            <span className="text-sm text-gray-600">
              {hotel.rating} ({hotel.reviewCount.toLocaleString()} reviews)
            </span>
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
          {hotel.description}
        </p>

        {/* Amenities */}
        {showAmenities && (
          <div className="flex flex-wrap gap-1 mb-4">
            {hotel.amenities.slice(0, 3).map((amenity, index) => (
              <span
                key={index}
                className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full"
              >
                {amenity}
              </span>
            ))}
            {hotel.amenities.length > 3 && (
              <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                +{hotel.amenities.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Call to action */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            From ${hotel.price}/{hotel.currency.toLowerCase()}
          </div>
          <div className="flex items-center text-brand-red group-hover:text-brand-red-dark transition-colors duration-200">
            <span className="text-sm font-medium mr-1">Book Now</span>
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