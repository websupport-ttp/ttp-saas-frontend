'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface PackageSearchFormProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export default function PackageSearchForm({ onSearch, isLoading = false }: PackageSearchFormProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [destination, setDestination] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build search query from form inputs
    let query = searchQuery.trim();
    
    if (destination && !query.includes(destination)) {
      query = query ? `${query} ${destination}` : destination;
    }
    
    if (category && !query.includes(category)) {
      query = query ? `${query} ${category}` : category;
    }
    
    onSearch(query || '');
  };

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'luxury', label: 'Luxury' },
    { value: 'family', label: 'Family' },
    { value: 'romantic', label: 'Romantic' },
    { value: 'wildlife', label: 'Wildlife' },
    { value: 'beach', label: 'Beach' },
    { value: 'city', label: 'City Break' },
    { value: 'cruise', label: 'Cruise' },
    { value: 'group', label: 'Group Tours' }
  ];

  const popularDestinations = [
    { value: '', label: 'Any Destination' },
    { value: 'dubai', label: 'Dubai' },
    { value: 'paris', label: 'Paris' },
    { value: 'london', label: 'London' },
    { value: 'tokyo', label: 'Tokyo' },
    { value: 'new-york', label: 'New York' },
    { value: 'bali', label: 'Bali' },
    { value: 'thailand', label: 'Thailand' },
    { value: 'maldives', label: 'Maldives' },
    { value: 'turkey', label: 'Turkey' },
    { value: 'egypt', label: 'Egypt' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Find Your Perfect Package</h2>
          <p className="text-gray-600">Search through our curated travel experiences</p>
        </div>

        {/* Main Search Input */}
        <div>
          <Input
            label="Search Packages"
            type="text"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            placeholder="Search by destination, activity, or package name..."
            className="text-lg"
          />
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Select
              label="Destination"
              value={destination}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDestination(e.target.value)}
              options={popularDestinations}
            />
          </div>
          <div>
            <Select
              label="Category"
              value={category}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value)}
              options={categoryOptions}
            />
          </div>
        </div>

        {/* Search Button */}
        <div className="pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full md:w-auto px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <LoadingSpinner size="sm" color="white" />
                <span>Searching Packages...</span>
              </div>
            ) : (
              'Search Packages'
            )}
          </Button>
        </div>

        {/* Quick Search Tags */}
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-3">Popular searches:</p>
          <div className="flex flex-wrap gap-2">
            {['Dubai Adventure', 'Paris Romance', 'Bali Beach', 'Tokyo Culture', 'Maldives Luxury'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setSearchQuery(tag);
                  onSearch(tag);
                }}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}