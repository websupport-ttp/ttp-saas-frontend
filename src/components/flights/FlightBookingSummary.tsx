'use client';

import { useState, useEffect } from 'react';
import PriceBreakdown from '@/components/common/PriceBreakdown';

interface FlightBookingSummaryProps {
  flightData: {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
    passengers: {
      adults: number;
      children: number;
      infants: number;
    };
    cabin: string;
    basePrice: number;
  };
  userRole?: string;
  discountCode?: string;
}

export default function FlightBookingSummary({
  flightData,
  userRole = 'user',
  discountCode
}: FlightBookingSummaryProps) {
  const [finalPrice, setFinalPrice] = useState(0);
  const totalPassengers = flightData.passengers.adults + flightData.passengers.children + flightData.passengers.infants;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Flight Summary</h3>
      
      {/* Flight Details */}
      <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Route</span>
          <span className="text-gray-900 text-right font-medium">
            {flightData.origin} → {flightData.destination}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Departure</span>
          <span className="text-gray-900">{new Date(flightData.departureDate).toLocaleDateString()}</span>
        </div>
        {flightData.returnDate && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Return</span>
            <span className="text-gray-900">{new Date(flightData.returnDate).toLocaleDateString()}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Cabin Class</span>
          <span className="text-gray-900 capitalize">{flightData.cabin}</span>
        </div>
      </div>

      {/* Passenger Details */}
      <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
        <h4 className="font-medium text-gray-900">Passengers</h4>
        {flightData.passengers.adults > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Adults</span>
            <span className="text-gray-900">{flightData.passengers.adults}</span>
          </div>
        )}
        {flightData.passengers.children > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Children</span>
            <span className="text-gray-900">{flightData.passengers.children}</span>
          </div>
        )}
        {flightData.passengers.infants > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Infants</span>
            <span className="text-gray-900">{flightData.passengers.infants}</span>
          </div>
        )}
        <div className="flex justify-between text-sm font-medium pt-2 border-t border-gray-100">
          <span className="text-gray-900">Total Passengers</span>
          <span className="text-gray-900">{totalPassengers}</span>
        </div>
      </div>

      {/* Pricing Breakdown */}
      <PriceBreakdown
        basePrice={flightData.basePrice}
        serviceType="flights"
        userRole={userRole}
        discountCode={discountCode}
        onPriceCalculated={(breakdown) => setFinalPrice(breakdown.finalPrice)}
        showDetails={true}
      />
    </div>
  );
}
