'use client';

import { CarRental, DriverInformation, CarExtra } from '@/types/car-hire';
import { calculateRentalDays } from '@/lib/car-hire-utils';

interface CarBookingSummaryProps {
  car: CarRental;
  location: string;
  pickupDate: Date;
  returnDate: Date;
  driverInfo: DriverInformation;
  extras: CarExtra[];
  subtotal: number;
  taxes: number;
  total: number;
}

export default function CarBookingSummary({
  car,
  location,
  pickupDate,
  returnDate,
  driverInfo,
  extras,
  subtotal,
  taxes,
  total
}: CarBookingSummaryProps) {
  const rentalDays = calculateRentalDays(pickupDate, returnDate);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
      
      {/* Car Details */}
      <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-200">
        <div className="w-16 h-12 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
          <img
            src={car.image}
            alt={car.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent && !parent.querySelector('.fallback-car-icon')) {
                const fallback = document.createElement('div');
                fallback.className = 'fallback-car-icon w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300';
                fallback.innerHTML = `
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                `;
                parent.appendChild(fallback);
              }
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 truncate">{car.name}</h4>
          <p className="text-sm text-gray-600">{car.supplier.name}</p>
          <p className="text-sm text-gray-600">{car.capacity} passengers • {car.transmission}</p>
        </div>
      </div>

      {/* Rental Details */}
      <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Pickup Location</span>
          <span className="text-gray-900 text-right">{location}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Pickup Date</span>
          <span className="text-gray-900">{pickupDate.toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Return Date</span>
          <span className="text-gray-900">{returnDate.toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Rental Period</span>
          <span className="text-gray-900">{rentalDays} day{rentalDays !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Driver Information */}
      <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
        <h4 className="font-medium text-gray-900">Driver Information</h4>
        <p className="text-sm text-gray-600">
          {driverInfo.firstName} {driverInfo.lastName}
        </p>
        <p className="text-sm text-gray-600">{driverInfo.email}</p>
      </div>

      {/* Pricing Breakdown */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            Car rental ({rentalDays} day{rentalDays !== 1 ? 's' : ''})
          </span>
          <span className="text-gray-900">${(car.pricePerDay * rentalDays).toFixed(2)}</span>
        </div>
        
        {extras && extras.length > 0 && (
          <>
            {extras.map((extra, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {extra.name} ({extra.quantity}x)
                </span>
                <span className="text-gray-900">
                  ${(extra.pricePerDay * extra.quantity * rentalDays).toFixed(2)}
                </span>
              </div>
            ))}
          </>
        )}
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Taxes & fees</span>
          <span className="text-gray-900">${taxes.toFixed(2)}</span>
        </div>
        
        <div className="border-t border-gray-200 pt-2">
          <div className="flex justify-between font-semibold">
            <span className="text-gray-900">Total</span>
            <span className="text-gray-900">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}