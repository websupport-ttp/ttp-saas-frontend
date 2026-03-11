'use client';

import { useState } from 'react';
import PriceBreakdown from '@/components/common/PriceBreakdown';

interface HotelBookingSummaryProps {
  hotelData: {
    name: string;
    location: string;
    checkIn: string;
    checkOut: string;
    rooms: number;
    guests: number;
    roomType: string;
    basePrice: number;
  };
  userRole?: string;
  discountCode?: string;
}

export default function HotelBookingSummary({
  hotelData,
  userRole = 'user',
  discountCode
}: HotelBookingSummaryProps) {
  const [finalPrice, setFinalPrice] = useState(0);
  
  const nights = Math.ceil(
    (new Date(hotelData.checkOut).getTime() - new Date(hotelData.checkIn).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Hotel Booking Summary</h3>
      
      {/* Hotel Details */}
      <div className="mb-4 pb-4 border-b border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-1">{hotelData.name}</h4>
        <p className="text-sm text-gray-600">{hotelData.location}</p>
      </div>

      {/* Booking Details */}
      <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Check-in</span>
          <span className="text-gray-900">{new Date(hotelData.checkIn).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Check-out</span>
          <span className="text-gray-900">{new Date(hotelData.checkOut).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Duration</span>
          <span className="text-gray-900">{nights} night{nights !== 1 ? 's' : ''}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Room Type</span>
          <span className="text-gray-900">{hotelData.roomType}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Rooms</span>
          <span className="text-gray-900">{hotelData.rooms}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Guests</span>
          <span className="text-gray-900">{hotelData.guests}</span>
        </div>
      </div>

      {/* Pricing Breakdown */}
      <PriceBreakdown
        basePrice={hotelData.basePrice}
        serviceType="hotels"
        userRole={userRole}
        discountCode={discountCode}
        onPriceCalculated={(breakdown) => setFinalPrice(breakdown.finalPrice)}
        showDetails={true}
      />
    </div>
  );
}
