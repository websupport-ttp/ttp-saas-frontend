'use client';

import { useState } from 'react';
import { CarFilterOptions } from '@/types/car-hire';
import { CAR_TYPE_LABELS, CAR_FILTER_OPTIONS } from '@/lib/constants/car-hire';
import { getUIIconComponent } from '@/lib/constants/icons';
import FilterListIcon from '@mui/icons-material/FilterList';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface CarFilterBarProps {
  filters: CarFilterOptions;
  onFilterChange: (filters: CarFilterOptions) => void;
  availableSuppliers: string[];
}

export default function CarFilterBar({ filters, onFilterChange, availableSuppliers }: CarFilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCarTypeToggle = (carType: string) => {
    const currentTypes = filters.carType || [];
    const updatedTypes = currentTypes.includes(carType)
      ? currentTypes.filter(type => type !== carType)
      : [...currentTypes, carType];
    
    onFilterChange({ ...filters, carType: updatedTypes });
  };

  const handleCapacityChange = (capacity: number | undefined) => {
    onFilterChange({ ...filters, capacity });
  };

  const handlePriceChange = (maxPrice: number | undefined) => {
    onFilterChange({ ...filters, maxPrice });
  };

  const handleSupplierToggle = (supplier: string) => {
    const currentSuppliers = filters.supplier || [];
    const updatedSuppliers = currentSuppliers.includes(supplier)
      ? currentSuppliers.filter(s => s !== supplier)
      : [...currentSuppliers, supplier];
    
    onFilterChange({ ...filters, supplier: updatedSuppliers });
  };

  const handleTransmissionChange = (transmission: 'automatic' | 'manual' | undefined) => {
    onFilterChange({ ...filters, transmission });
  };

  const clearAllFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = 
    (filters.carType && filters.carType.length > 0) ||
    filters.capacity ||
    filters.maxPrice || 
    (filters.supplier && filters.supplier.length > 0) ||
    filters.transmission;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Filter Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <FilterListIcon className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
          {hasActiveFilters && (
            <span className="bg-brand-red text-white text-xs px-2 py-1 rounded-full">
              Active
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-brand-red hover:text-red-700 font-medium hidden sm:block"
            >
              Clear All
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            {isExpanded ? (
              <KeyboardArrowUpIcon className="h-5 w-5" />
            ) : (
              <KeyboardArrowDownIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Filter Content */}
      {isExpanded && (
        <div className="p-3 sm:p-4 space-y-4 sm:space-y-6">
          {/* Car Type Filter */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Car Type</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(CAR_TYPE_LABELS).map(([type, label]) => (
                <label key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.carType?.includes(type) || false}
                    onChange={() => handleCarTypeToggle(type)}
                    className="h-4 w-4 text-brand-red focus:ring-brand-red border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Capacity Filter */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Minimum Capacity</h4>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="capacity"
                  checked={!filters.capacity}
                  onChange={() => handleCapacityChange(undefined)}
                  className="h-4 w-4 text-brand-red focus:ring-brand-red border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Any capacity</span>
              </label>
              {CAR_FILTER_OPTIONS.CAPACITY.map((capacity) => (
                <label key={capacity} className="flex items-center">
                  <input
                    type="radio"
                    name="capacity"
                    checked={filters.capacity === capacity}
                    onChange={() => handleCapacityChange(capacity)}
                    className="h-4 w-4 text-brand-red focus:ring-brand-red border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {capacity}+ passengers
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Max Price per day</h4>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="price"
                  checked={!filters.maxPrice}
                  onChange={() => handlePriceChange(undefined)}
                  className="h-4 w-4 text-brand-red focus:ring-brand-red border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Any price</span>
              </label>
              {CAR_FILTER_OPTIONS.PRICE_RANGES.map((range) => (
                <label key={range.label} className="flex items-center">
                  <input
                    type="radio"
                    name="price"
                    checked={filters.maxPrice === range.max}
                    onChange={() => handlePriceChange(range.max === 999999 ? undefined : range.max)}
                    className="h-4 w-4 text-brand-red focus:ring-brand-red border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">{range.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Car Hire Company Filter */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Car Hire Company</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {availableSuppliers.map((supplier) => (
                <label key={supplier} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.supplier?.includes(supplier) || false}
                    onChange={() => handleSupplierToggle(supplier)}
                    className="h-4 w-4 text-brand-red focus:ring-brand-red border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{supplier}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Transmission Filter */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Transmission</h4>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="transmission"
                  checked={!filters.transmission}
                  onChange={() => handleTransmissionChange(undefined)}
                  className="h-4 w-4 text-brand-red focus:ring-brand-red border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Any transmission</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="transmission"
                  checked={filters.transmission === 'automatic'}
                  onChange={() => handleTransmissionChange('automatic')}
                  className="h-4 w-4 text-brand-red focus:ring-brand-red border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Automatic</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="transmission"
                  checked={filters.transmission === 'manual'}
                  onChange={() => handleTransmissionChange('manual')}
                  className="h-4 w-4 text-brand-red focus:ring-brand-red border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Manual</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Compact Filter Display (when collapsed) */}
      {!isExpanded && hasActiveFilters && (
        <div className="p-3 sm:p-4">
          <div className="flex flex-wrap gap-2">
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-brand-red hover:text-red-700 font-medium sm:hidden mb-2 w-full text-left"
              >
                Clear All Filters
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.carType?.map((type) => (
              <span key={type} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {CAR_TYPE_LABELS[type as keyof typeof CAR_TYPE_LABELS]}
                <button
                  onClick={() => handleCarTypeToggle(type)}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </span>
            ))}
            
            {filters.capacity && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {filters.capacity}+ passengers
                <button
                  onClick={() => handleCapacityChange(undefined)}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </span>
            )}
            
            {filters.maxPrice && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Under ${filters.maxPrice}
                <button
                  onClick={() => handlePriceChange(undefined)}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </span>
            )}
            
            {filters.supplier?.map((supplier) => (
              <span key={supplier} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {supplier}
                <button
                  onClick={() => handleSupplierToggle(supplier)}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </span>
            ))}
            
            {filters.transmission && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {filters.transmission.charAt(0).toUpperCase() + filters.transmission.slice(1)}
                <button
                  onClick={() => handleTransmissionChange(undefined)}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}