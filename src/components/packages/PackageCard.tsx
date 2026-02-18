'use client';

import { PackageSummary } from '@/types/api';
import { getUIIcon } from '@/lib/constants/icons';

interface PackageCardProps {
  package: PackageSummary;
  onViewPackage: (packageId: string) => void;
}

export default function PackageCard({ package: pkg, onViewPackage }: PackageCardProps) {
  const handleViewPackage = () => {
    onViewPackage(pkg.id);
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      {/* Package Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={pkg.images[0] || '/images/placeholder-package.png'}
          alt={pkg.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/placeholder-package.png';
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300" />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-brand-red text-white text-xs font-semibold px-2 py-1 rounded-full">
            {pkg.category}
          </span>
        </div>

        {/* Duration Badge */}
        <div className="absolute top-3 right-3">
          <span className="bg-white bg-opacity-90 text-gray-900 text-xs font-semibold px-2 py-1 rounded-full">
            {pkg.duration} days
          </span>
        </div>
      </div>

      {/* Package Information */}
      <div className="p-4 sm:p-6">
        {/* Package Title */}
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
          {pkg.title}
        </h3>

        {/* Destination */}
        <div className="flex items-center text-gray-600 mb-3">
          <img 
            src={getUIIcon('locationPin')} 
            alt="Location" 
            className="h-4 w-4 mr-1 flex-shrink-0"
          />
          <span className="text-sm">{pkg.destination}</span>
        </div>

        {/* Highlights */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {pkg.highlights.slice(0, 3).map((highlight, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
              >
                {highlight}
              </span>
            ))}
            {pkg.highlights.length > 3 && (
              <span className="text-xs text-gray-500">
                +{pkg.highlights.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(pkg.rating)
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {pkg.rating} ({pkg.reviewCount} reviews)
            </span>
          </div>
        </div>

        {/* Price and View Button */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div className="text-left">
            <div className="text-xl sm:text-2xl font-bold text-brand-red">
              {formatPrice(pkg.price.from, pkg.price.currency)}
            </div>
            <div className="text-sm text-gray-500">
              from / person
            </div>
          </div>
          
          <button
            onClick={handleViewPackage}
            className="w-full sm:w-auto bg-brand-red hover:bg-red-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <span>View Details</span>
            <img 
              src={getUIIcon('arrowRight')} 
              alt="Arrow" 
              className="h-4 w-4"
            />
          </button>
        </div>
      </div>
    </div>
  );
}