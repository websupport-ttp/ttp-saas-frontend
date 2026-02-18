'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { debounce } from '@/lib/utils';

interface AutocompleteOption {
  value: string;
  label: string;
  subtitle?: string;
  data?: any;
}

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string, option?: AutocompleteOption) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: boolean;
  required?: boolean;
  fetchSuggestions: (query: string) => Promise<AutocompleteOption[]>;
  minQueryLength?: number;
  maxSuggestions?: number;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
}

export function AutocompleteInputFixed({
  value,
  onChange,
  onBlur,
  placeholder = 'Type to search...',
  className = '',
  disabled = false,
  error = false,
  required = false,
  fetchSuggestions,
  minQueryLength = 0,
  maxSuggestions = 10,
  ...ariaProps
}: AutocompleteInputProps) {
  const [suggestions, setSuggestions] = useState<AutocompleteOption[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [useAbsolutePositioning, setUseAbsolutePositioning] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.length < minQueryLength) {
        setSuggestions([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      try {
        const results = await fetchSuggestions(query);
        setSuggestions(results.slice(0, maxSuggestions));
        if (results.length > 0) {
          setIsOpen(true);
        } else {
          setIsOpen(false);
        }
        setSelectedIndex(-1);
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
        setSuggestions([]);
        setIsOpen(false);
      } finally {
        setIsLoading(false);
      }
    }, 800),
    [fetchSuggestions, minQueryLength, maxSuggestions]
  );

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    debouncedSearch(newValue);
  };

  // Handle option selection
  const handleOptionSelect = (option: AutocompleteOption) => {
    console.log('🎯 AutocompleteInput: Option selected:', option);
    onChange(option.label, option);
    setIsOpen(false);
    setSuggestions([]);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleOptionSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
        onBlur?.();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onBlur]);

  // Scroll selected option into view
  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    }
  }, [selectedIndex]);

  // Check if we should use absolute positioning (fallback)
  useEffect(() => {
    if (isOpen && inputRef.current) {
      const checkPositioning = () => {
        const rect = inputRef.current!.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - rect.bottom;
        
        // If there's very little space below and we're in the bottom half of the screen
        if (spaceBelow < 200 && rect.top > viewportHeight / 2) {
          setUseAbsolutePositioning(true);
        } else {
          setUseAbsolutePositioning(false);
        }
      };

      checkPositioning();
      
      const handleResize = () => checkPositioning();
      const handleScroll = () => checkPositioning();
      
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll, true);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll, true);
      };
    }
  }, [isOpen]);

  return (
    <div 
      ref={containerRef} 
      className="relative flex-1 autocomplete-container" 
      style={{ overflow: 'visible', zIndex: isOpen ? 50 : 'auto' }}
    >
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          // Trigger search on focus to show suggestions immediately
          if (value.length >= minQueryLength) {
            debouncedSearch(value);
          } else if (value.length === 0) {
            // Show popular suggestions when clicking on empty field
            debouncedSearch('');
          }
        }}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={cn(
          'flex-1 bg-transparent text-brand-blue placeholder-brand-blue/60 outline-none text-sm sm:text-base font-medium',
          error && 'border-b-2 border-red-400',
          disabled && 'cursor-not-allowed opacity-50',
          className
        )}
        autoComplete="off"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-autocomplete="list"
        {...ariaProps}
      />

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin"></div>
        </div>
      )}

      {/* Suggestions dropdown */}
      {(isOpen && suggestions.length > 0) && (
        <div 
          ref={dropdownRef}
          className={cn(
            "bg-white border-2 border-blue-300 rounded-lg shadow-2xl max-h-60 overflow-y-auto z-50",
            useAbsolutePositioning 
              ? "absolute top-full left-0 right-0 mt-1" 
              : "absolute top-full left-0 right-0 mt-1"
          )}
          style={{
            minWidth: '200px',
            maxWidth: '90vw',
            zIndex: 9999
          }}
          onMouseDown={(e) => e.preventDefault()} // Prevent input blur
        >
          <div className="px-3 py-2 bg-blue-50 border-b border-blue-200">
            <span className="text-xs font-medium text-blue-700">
              Select an option ({suggestions.length} found)
            </span>
          </div>
          <ul
            ref={listRef}
            role="listbox"
            className="py-1"
          >
            {suggestions.map((option, index) => (
              <li
                key={`${option.value}-${index}`}
                role="option"
                aria-selected={index === selectedIndex}
                className={cn(
                  'px-4 py-2 cursor-pointer transition-colors',
                  'hover:bg-blue-50 focus:bg-blue-50',
                  index === selectedIndex && 'bg-blue-50',
                  'border-b border-gray-100 last:border-b-0'
                )}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleOptionSelect(option);
                }}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    {option.label}
                  </span>
                  {option.subtitle && (
                    <span className="text-xs text-gray-500">
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