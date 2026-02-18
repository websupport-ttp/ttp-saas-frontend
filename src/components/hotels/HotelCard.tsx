'use client';

import { HotelCardProps } from '@/types';
import { formatPrice } from '@/lib/hotels';
import { getUIIcon } from '@/lib/constants/icons';

export default function HotelCard({ 
  hotel,
  className = '',
  showRating = true,
  showAmenities = true,
  onClick
}: HotelCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(hotel);
    }
  };

  return (
    <div 
      className={`bg-white rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300 group cursor-pointer shadow-md ${className}`} 
      onClick={handleClick}
    >
      {/* Hotel Image */}
      <div className="relative h-48 sm:h-56 overflow-hidden p-3">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-xl"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/placeholder-hotel.png';
          }}
        />
        <div className="absolute inset-3 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300 rounded-xl" />
      </div>

      {/* Hotel Information */}
      <div className="p-4 sm:p-5 h-48 sm:h-56 flex flex-col justify-between text-left">
        <div>
          {/* Location */}
          <div className="flex items-center text-gray-500 mb-2">
            <svg className="h-3 w-3 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="text-xs sm:text-sm font-medium text-left">{hotel.city}, {hotel.country}</span>
          </div>

          {/* Hotel Name */}
          <h3 className="font-bold text-sm sm:text-base text-gray-900 mb-2 leading-tight text-left">
            {hotel.name}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-xs sm:text-sm mb-2 leading-relaxed text-left" style={{ 
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {hotel.description}
          </p>

          {/* Price */}
          <div className="mb-2 text-left">
            <div className="text-base sm:text-lg font-bold text-red-500">
              {formatPrice(hotel.price, 'NGN')} <span className="text-xs font-normal text-gray-500">/Night</span>
            </div>
          </div>
        </div>

        {/* Book Now Link */}
        <div className="text-left">
          <button 
            onClick={handleClick}
            className="text-green-500 hover:text-green-600 font-semibold text-sm flex items-center group transition-colors duration-200 bg-transparent border-none cursor-pointer"
          >
            <span className="mr-2">Book Now</span>
            <svg 
              className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}