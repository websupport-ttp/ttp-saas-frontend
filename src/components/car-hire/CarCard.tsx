'use client';

import { CarCardProps } from '@/types/car-hire';
import { formatCarFeatures } from '@/lib/car-hire-utils';
import { getUIIcon } from '@/lib/constants/icons';

export default function CarCard({ car, onSelect, className = '' }: CarCardProps) {
  const handleSelect = () => {
    onSelect(car.id);
  };

  const features = formatCarFeatures(car);

  return (
    <div className={`bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 group ${className}`}>
      {/* Car Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={car.image}
          alt={car.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // Fallback to a solid color with car icon if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent && !parent.querySelector('.fallback-icon')) {
              const fallback = document.createElement('div');
              fallback.className = 'fallback-icon absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300';
              fallback.innerHTML = `
                <svg class="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              `;
              parent.appendChild(fallback);
            }
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300" />
        
        {/* Car Type Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-white bg-opacity-90 text-gray-800 text-xs font-medium px-2 py-1 rounded-full">
            {car.type.charAt(0).toUpperCase() + car.type.slice(1)}
          </span>
        </div>
      </div>

      {/* Car Information */}
      <div className="p-4 sm:p-6">
        {/* Car Name and Supplier */}
        <div className="mb-3">
          <h3 className="font-semibold text-lg text-gray-900 mb-1 truncate">
            {car.name}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{car.supplier?.name || 'The Travel Place'}</span>
            <div className="flex items-center">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-4 w-4 ${i < Math.floor(car.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-1 text-sm text-gray-600">{car.rating || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Car Features */}
        <div className="mb-4">
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
            {features.slice(0, 4).map((feature, index) => (
              <div key={index} className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 flex-shrink-0"></div>
                <span className="truncate">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Features Icons */}
        <div className="flex items-center space-x-3 mb-4 text-gray-500">
          {car.airConditioning && (
            <div className="flex items-center" title="Air Conditioning">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v20M2 12h20M6 6l12 12M6 18L18 6" />
              </svg>
            </div>
          )}
          {car.mileage === 'unlimited' && (
            <div className="flex items-center" title="Unlimited Mileage">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          )}
          {car.transmission === 'automatic' && (
            <div className="flex items-center" title="Automatic Transmission">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          )}
        </div>

        {/* Fuel Policy */}
        <div className="mb-4">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {car.fuelPolicy.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
        </div>

        {/* Price and Book Button */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div className="text-left">
            <div className="text-xl sm:text-2xl font-bold text-brand-red">
              ${car.pricePerDay}
            </div>
            <div className="text-sm text-gray-500">
              per day
            </div>
          </div>
          
          <button
            onClick={handleSelect}
            className="w-full sm:w-auto bg-brand-red hover:bg-red-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <span>Select Car</span>
            <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}