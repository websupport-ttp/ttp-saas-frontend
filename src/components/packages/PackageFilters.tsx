'use client';

import { useState } from 'react';
import { PackageFilters as PackageFiltersType } from '@/types/api';

interface PackageFiltersProps {
  filters: PackageFiltersType;
  availableFilters: any;
  onFilterChange: (filters: PackageFiltersType) => void;
}

export default function PackageFilters({ 
  filters, 
  availableFilters, 
  onFilterChange 
}: PackageFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof PackageFiltersType, value: any) => {
    const newFilters = { ...filters, [key]: value };
    onFilterChange(newFilters);
  };

  const handlePriceRangeChange = (min?: number, max?: number) => {
    const priceFilter = min !== undefined || max !== undefined 
      ? { min, max } 
      : undefined;
    handleFilterChange('price', priceFilter);
  };

  const handleDurationRangeChange = (min?: number, max?: number) => {
    const durationFilter = min !== undefined || max !== undefined 
      ? { min, max } 
      : undefined;
    handleFilterChange('duration', durationFilter);
  };

  const clearAllFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key as keyof PackageFiltersType];
    return value !== undefined && value !== '' && value !== null;
  });

  const categories = availableFilters?.categories || [
    'Adventure', 'Cultural', 'Luxury', 'Family', 'Romantic', 
    'Wildlife', 'Beach', 'City Break', 'Cruise', 'Group Tours'
  ];

  const destinations = availableFilters?.destinations || [
    'Dubai', 'Paris', 'London', 'Tokyo', 'New York', 
    'Bali', 'Thailand', 'Maldives', 'Turkey', 'Egypt'
  ];

  const priceRanges = [
    { label: 'Under $500', min: 0, max: 500 },
    { label: '$500 - $1,000', min: 500, max: 1000 },
    { label: '$1,000 - $2,000', min: 1000, max: 2000 },
    { label: '$2,000 - $5,000', min: 2000, max: 5000 },
    { label: 'Over $5,000', min: 5000, max: undefined }
  ];

  const durationRanges = [
    { label: '1-3 days', min: 1, max: 3 },
    { label: '4-7 days', min: 4, max: 7 },
    { label: '8-14 days', min: 8, max: 14 },
    { label: '15+ days', min: 15, max: undefined }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-4 text-left"
        >
          <span className="font-semibold text-gray-900">Filters</span>
          <svg
            className={`h-5 w-5 transform transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Filter Content */}
      <div className={`${isExpanded ? 'block' : 'hidden'} lg:block p-4 space-y-6`}>
        {/* Filter Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Filter Packages</h3>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-brand-red hover:text-red-700 font-medium"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Destination Filter */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Destination</h4>
          <div className="space-y-2">
            {destinations.map((destination: string) => (
              <label key={destination} className="flex items-center">
                <input
                  type="radio"
                  name="destination"
                  value={destination.toLowerCase()}
                  checked={filters.destination === destination.toLowerCase()}
                  onChange={(e) => handleFilterChange('destination', e.target.value)}
                  className="h-4 w-4 text-brand-red focus:ring-brand-red border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">{destination}</span>
              </label>
            ))}
            <label className="flex items-center">
              <input
                type="radio"
                name="destination"
                value=""
                checked={!filters.destination}
                onChange={(e) => handleFilterChange('destination', '')}
                className="h-4 w-4 text-brand-red focus:ring-brand-red border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">All Destinations</span>
            </label>
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Category</h4>
          <div className="space-y-2">
            {categories.map((category: string) => (
              <label key={category} className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value={category.toLowerCase()}
                  checked={filters.category === category.toLowerCase()}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="h-4 w-4 text-brand-red focus:ring-brand-red border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">{category}</span>
              </label>
            ))}
            <label className="flex items-center">
              <input
                type="radio"
                name="category"
                value=""
                checked={!filters.category}
                onChange={(e) => handleFilterChange('category', '')}
                className="h-4 w-4 text-brand-red focus:ring-brand-red border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">All Categories</span>
            </label>
          </div>
        </div>

        {/* Price Range Filter */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
          <div className="space-y-2">
            {priceRanges.map((range) => (
              <label key={range.label} className="flex items-center">
                <input
                  type="radio"
                  name="priceRange"
                  checked={
                    filters.price?.min === range.min && 
                    filters.price?.max === range.max
                  }
                  onChange={() => handlePriceRangeChange(range.min, range.max)}
                  className="h-4 w-4 text-brand-red focus:ring-brand-red border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">{range.label}</span>
              </label>
            ))}
            <label className="flex items-center">
              <input
                type="radio"
                name="priceRange"
                checked={!filters.price}
                onChange={() => handlePriceRangeChange()}
                className="h-4 w-4 text-brand-red focus:ring-brand-red border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Any Price</span>
            </label>
          </div>
        </div>

        {/* Duration Filter */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Duration</h4>
          <div className="space-y-2">
            {durationRanges.map((range) => (
              <label key={range.label} className="flex items-center">
                <input
                  type="radio"
                  name="durationRange"
                  checked={
                    filters.duration?.min === range.min && 
                    filters.duration?.max === range.max
                  }
                  onChange={() => handleDurationRangeChange(range.min, range.max)}
                  className="h-4 w-4 text-brand-red focus:ring-brand-red border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">{range.label}</span>
              </label>
            ))}
            <label className="flex items-center">
              <input
                type="radio"
                name="durationRange"
                checked={!filters.duration}
                onChange={() => handleDurationRangeChange()}
                className="h-4 w-4 text-brand-red focus:ring-brand-red border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Any Duration</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}