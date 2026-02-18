'use client';

import { useState, useRef, useEffect } from 'react';
import { FilterOptions } from '@/types/hotels';
import { HOTEL_AMENITIES, HOTEL_CLASSIFICATIONS, BED_TYPES } from '@/lib/constants/hotels';

interface FilterBarProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

interface DropdownState {
  maxPrice: boolean;
  amenities: boolean;
  bedType: boolean;
  classification: boolean;
  more: boolean;
}

export default function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const [openDropdown, setOpenDropdown] = useState<keyof DropdownState | null>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown && dropdownRefs.current[openDropdown]) {
        const target = event.target as Element;
        if (!dropdownRefs.current[openDropdown]?.contains(target)) {
          setOpenDropdown(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  const toggleDropdown = (dropdown: keyof DropdownState) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const handlePriceChange = (maxPrice: number | undefined) => {
    onFilterChange({ ...filters, maxPrice });
    setOpenDropdown(null);
  };

  const handleAmenityToggle = (amenityId: string) => {
    const currentAmenities = filters.amenities || [];
    const updatedAmenities = currentAmenities.includes(amenityId)
      ? currentAmenities.filter(id => id !== amenityId)
      : [...currentAmenities, amenityId];
    
    onFilterChange({ ...filters, amenities: updatedAmenities });
  };

  const handleBedTypeChange = (bedType: string | undefined) => {
    onFilterChange({ ...filters, bedType });
    setOpenDropdown(null);
  };

  const handleClassificationChange = (classification: string | undefined) => {
    onFilterChange({ ...filters, classification });
    setOpenDropdown(null);
  };

  const clearAllFilters = () => {
    onFilterChange({});
    setOpenDropdown(null);
  };

  const getFilterButtonText = (filterType: keyof DropdownState) => {
    switch (filterType) {
      case 'maxPrice':
        return filters.maxPrice ? `Under $${filters.maxPrice}` : 'Max price';
      case 'amenities':
        const amenityCount = filters.amenities?.length || 0;
        return amenityCount > 0 ? `Amenities (${amenityCount})` : 'Amenities';
      case 'bedType':
        return filters.bedType || 'Bed Type';
      case 'classification':
        return filters.classification || 'Classification';
      case 'more':
        return 'More';
      default:
        return '';
    }
  };

  const hasActiveFilter = (filterType: keyof DropdownState) => {
    switch (filterType) {
      case 'maxPrice':
        return !!filters.maxPrice;
      case 'amenities':
        return !!(filters.amenities && filters.amenities.length > 0);
      case 'bedType':
        return !!filters.bedType;
      case 'classification':
        return !!filters.classification;
      default:
        return false;
    }
  };

  return (
    <div className="w-auto max-w-4xl">
      <div className="flex items-center space-x-3 flex-wrap sm:flex-nowrap gap-y-2">
        {/* Max Price Filter */}
        <div className="relative flex-shrink-0" ref={(el) => { dropdownRefs.current.maxPrice = el; }}>
          <button
            onClick={() => toggleDropdown('maxPrice')}
            className={`flex items-center justify-between px-3 py-2 border rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              hasActiveFilter('maxPrice')
                ? 'border-brand-red text-brand-red bg-red-50'
                : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
            }`}
          >
            <span>{getFilterButtonText('maxPrice')}</span>
            <svg
              className={`ml-2 h-4 w-4 transition-transform ${
                openDropdown === 'maxPrice' ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {openDropdown === 'maxPrice' && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <div className="p-2">
                {[
                  { label: 'Any price', value: undefined },
                  { label: 'Under $100', value: 100 },
                  { label: 'Under $200', value: 200 },
                  { label: 'Under $300', value: 300 },
                  { label: 'Under $500', value: 500 },
                ].map((option) => (
                  <button
                    key={option.label}
                    onClick={() => handlePriceChange(option.value)}
                    className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 ${
                      filters.maxPrice === option.value ? 'text-brand-red font-medium' : 'text-gray-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Amenities Filter */}
        <div className="relative flex-shrink-0" ref={(el) => { dropdownRefs.current.amenities = el; }}>
          <button
            onClick={() => toggleDropdown('amenities')}
            className={`flex items-center justify-between px-3 py-2 border rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              hasActiveFilter('amenities')
                ? 'border-brand-red text-brand-red bg-red-50'
                : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
            }`}
          >
            <span>{getFilterButtonText('amenities')}</span>
            <svg
              className={`ml-2 h-4 w-4 transition-transform ${
                openDropdown === 'amenities' ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {openDropdown === 'amenities' && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <div className="p-3">
                <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                  {HOTEL_AMENITIES.map((amenity) => (
                    <label key={amenity.id} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input
                        type="checkbox"
                        checked={filters.amenities?.includes(amenity.id) || false}
                        onChange={() => handleAmenityToggle(amenity.id)}
                        className="h-4 w-4 text-brand-red focus:ring-brand-red border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{amenity.name}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200 flex justify-end">
                  <button
                    onClick={() => setOpenDropdown(null)}
                    className="px-3 py-1 text-sm bg-brand-red text-white rounded hover:bg-red-700"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bed Type Filter */}
        <div className="relative flex-shrink-0" ref={(el) => { dropdownRefs.current.bedType = el; }}>
          <button
            onClick={() => toggleDropdown('bedType')}
            className={`flex items-center justify-between px-3 py-2 border rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              hasActiveFilter('bedType')
                ? 'border-brand-red text-brand-red bg-red-50'
                : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
            }`}
          >
            <span>{getFilterButtonText('bedType')}</span>
            <svg
              className={`ml-2 h-4 w-4 transition-transform ${
                openDropdown === 'bedType' ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {openDropdown === 'bedType' && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <div className="p-2">
                <button
                  onClick={() => handleBedTypeChange(undefined)}
                  className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 ${
                    !filters.bedType ? 'text-brand-red font-medium' : 'text-gray-700'
                  }`}
                >
                  Any bed type
                </button>
                {BED_TYPES.map((bedType) => (
                  <button
                    key={bedType}
                    onClick={() => handleBedTypeChange(bedType)}
                    className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 ${
                      filters.bedType === bedType ? 'text-brand-red font-medium' : 'text-gray-700'
                    }`}
                  >
                    {bedType}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Classification Filter */}
        <div className="relative flex-shrink-0" ref={(el) => { dropdownRefs.current.classification = el; }}>
          <button
            onClick={() => toggleDropdown('classification')}
            className={`flex items-center justify-between px-3 py-2 border rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              hasActiveFilter('classification')
                ? 'border-brand-red text-brand-red bg-red-50'
                : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
            }`}
          >
            <span>{getFilterButtonText('classification')}</span>
            <svg
              className={`ml-2 h-4 w-4 transition-transform ${
                openDropdown === 'classification' ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {openDropdown === 'classification' && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <div className="p-2">
                <button
                  onClick={() => handleClassificationChange(undefined)}
                  className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 ${
                    !filters.classification ? 'text-brand-red font-medium' : 'text-gray-700'
                  }`}
                >
                  Any hotel type
                </button>
                {HOTEL_CLASSIFICATIONS.map((classification) => (
                  <button
                    key={classification}
                    onClick={() => handleClassificationChange(classification)}
                    className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 ${
                      filters.classification === classification ? 'text-brand-red font-medium' : 'text-gray-700'
                    }`}
                  >
                    {classification}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* More Filter */}
        <div className="relative flex-shrink-0" ref={(el) => { dropdownRefs.current.more = el; }}>
          <button
            onClick={() => toggleDropdown('more')}
            className="flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            <span>More</span>
            <svg
              className={`ml-2 h-4 w-4 transition-transform ${
                openDropdown === 'more' ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {openDropdown === 'more' && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <div className="p-2">
                <button
                  onClick={clearAllFilters}
                  className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 text-gray-700"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}