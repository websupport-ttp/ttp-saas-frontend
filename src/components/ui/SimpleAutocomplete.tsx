'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AutocompleteOption {
  value: string;
  label: string;
  subtitle?: string;
  data?: any;
}

interface SimpleAutocompleteProps {
  value: string;
  onChange: (value: string, option?: AutocompleteOption) => void;
  placeholder?: string;
  fetchSuggestions: (query: string) => Promise<AutocompleteOption[]>;
  minQueryLength?: number;
}

export function SimpleAutocomplete({
  value,
  onChange,
  placeholder = 'Type to search...',
  fetchSuggestions,
  minQueryLength = 3,
}: SimpleAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<AutocompleteOption[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Simple search without debounce for testing
  const handleSearch = async (query: string) => {
    if (query.length < minQueryLength) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const results = await fetchSuggestions(query);
      setSuggestions(results);
      setIsOpen(results.length > 0);
    } catch (error) {
      console.error('Airport search error:', error);
      setSuggestions([]);
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    // Trigger search with a small delay
    setTimeout(() => {
      handleSearch(newValue);
    }, 500);
  };

  const handleOptionSelect = (option: AutocompleteOption) => {
    onChange(option.label, option);
    setIsOpen(false);
    setSuggestions([]);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative flex-1">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={() => {
          if (value.length >= minQueryLength) {
            handleSearch(value);
          }
        }}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-brand-blue placeholder-brand-blue/60 outline-none text-sm sm:text-base font-medium w-full"
        autoComplete="off"
      />

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Simple dropdown - no portal */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-blue-300 rounded-lg shadow-2xl max-h-60 overflow-y-auto z-50">
          <div className="px-3 py-2 bg-blue-50 border-b border-blue-200">
            <span className="text-xs font-medium text-blue-700">
              ✨ Select an airport ({suggestions.length} found)
            </span>
          </div>
          <ul className="py-1">
            {suggestions.map((option, index) => (
              <li
                key={`${option.value}-${index}`}
                className="px-4 py-3 cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
                onClick={() => handleOptionSelect(option)}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    {option.label}
                  </span>
                  {option.subtitle && (
                    <span className="text-xs text-gray-500 mt-1">
                      {option.subtitle}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}


    </div>
  );
}