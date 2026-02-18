'use client';

import { Hotel } from '@/types/hotels';
import { formatPrice } from '@/lib/hotels';

interface HotelInformationProps {
  hotel: Hotel;
}

export default function HotelInformation({ hotel }: HotelInformationProps) {
  return (
    <div className="hotel-information">
      {/* Hotel Name and Location */}
      <div className="hotel-header mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{hotel.name}</h1>
        <div className="flex items-start sm:items-center text-gray-600 mb-2">
          <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5 sm:mt-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm sm:text-base">{hotel.location.address}, {hotel.location.city}, {hotel.location.country}</span>
        </div>
        <div className="flex items-center">
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
            {hotel.classification}
          </span>
        </div>
      </div>

      {/* Hotel Description */}
      <div className="hotel-description mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">About this hotel</h2>
        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{hotel.description}</p>
      </div>

      {/* Amenities Grid */}
      <div className="hotel-amenities mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Amenities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {hotel.amenities.map((amenity) => (
            <div key={amenity.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 mr-3 flex items-center justify-center bg-blue-100 rounded-full">
                {/* Icon placeholder - will be replaced with actual icons */}
                <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
              </div>
              <span className="text-gray-800 font-medium text-sm">{amenity.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Room Types */}
      <div className="room-types mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Available Room Types</h2>
        <div className="flex flex-wrap gap-2">
          {hotel.bedTypes.map((bedType, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg text-sm font-medium"
            >
              {bedType} Bed
            </span>
          ))}
        </div>
      </div>

      {/* Pricing Information */}
      <div className="pricing-info bg-blue-50 p-4 sm:p-6 rounded-lg">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Pricing</h2>
        <div className="flex items-baseline">
          <span className="text-2xl sm:text-3xl font-bold text-blue-600">
            {formatPrice(hotel.pricePerNight)}
          </span>
          <span className="text-gray-600 ml-2">per night</span>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Prices may vary based on dates and availability. Taxes and fees not included.
        </p>
      </div>
    </div>
  );
}