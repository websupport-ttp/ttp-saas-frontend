'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { debounce } from '@/lib/utils';
import { Portal } from './Portal';

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

export function AutocompleteInput({
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
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0, showAbove: false });
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate dropdown position
  const updateDropdownPosition = useCallback(() => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      const dropdownHeight = 240; // max-h-60 = 240px
      
      // Determine if dropdown should appear above or below
      const shouldShowAbove = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;
      
      setDropdownPosition({
        top: shouldShowAbove 
          ? rect.top + window.scrollY - dropdownHeight - 4
          : rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
        showAbove: shouldShowAbove
      });
    }
  }, []);

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
          updateDropdownPosition();
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
    console.log('🎯 AutocompleteInput: Calling onChange with:', { value: option.label, option });
    
    // Call onChange with the selected option's label and the full option data
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

  // Update dropdown position on scroll and resize
  useEffect(() => {
    if (isOpen) {
      const handlePositionUpdate = () => {
        updateDropdownPosition();
      };

      // Update position immediately
      updateDropdownPosition();

      window.addEventListener('scroll', handlePositionUpdate, true);
      window.addEventListener('resize', handlePositionUpdate);

      return () => {
        window.removeEventListener('scroll', handlePositionUpdate, true);
        window.removeEventListener('resize', handlePositionUpdate);
      };
    }
  }, [isOpen, updateDropdownPosition]);

  // Fallback positioning check
  useEffect(() => {
    if (isOpen && suggestions.length > 0) {
      const checkDropdownPosition = () => {
        const dropdown = document.querySelector('.autocomplete-dropdown') as HTMLElement;
        const fallback = document.querySelector('.autocomplete-fallback') as HTMLElement;
        
        if (dropdown && fallback) {
          const dropdownRect = dropdown.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          
          // If dropdown is positioned at the bottom of screen (likely incorrect)
          if (dropdownRect.top > viewportHeight - 100) {
            console.warn('Autocomplete dropdown positioned incorrectly, using fallback');
            dropdown.style.display = 'none';
            fallback.style.display = 'block';
          } else {
            dropdown.style.display = 'block';
            fallback.style.display = 'none';
          }
        }
      };

      // Check position after a short delay to allow for rendering
      const timeoutId = setTimeout(checkDropdownPosition, 50);
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen, suggestions.length]);

  return (
    <div ref={containerRef} className="relative flex-1 autocomplete-container" style={{ overflow: 'visible' }}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          updateDropdownPosition();
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

      {/* Suggestions dropdown - try Portal first, fallback to absolute positioning */}
      {(isOpen && suggestions.length > 0) && (
        <>
          {/* Portal version for better positioning */}
          <Portal>
            <div 
              className="fixed bg-white border-2 border-blue-300 rounded-lg shadow-2xl max-h-60 overflow-y-auto autocomplete-dropdown"
              style={{ 
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: dropdownPosition.width,
                zIndex: 9999,
                maxWidth: '90vw',
                minWidth: '200px'
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
                    onMouseDown={(e) => {
                      // Use mousedown instead of click to prevent input blur
                      e.preventDefault();
                      e.stopPropagation();
                      handleOptionSelect(option);
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
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
          </Portal>
          
          {/* Fallback absolute positioned dropdown (hidden by default) */}
          <div 
            className="absolute top-full left-0 right-0 bg-white border-2 border-blue-300 rounded-lg shadow-2xl max-h-60 overflow-y-auto z-50 hidden autocomplete-fallback"
            style={{ marginTop: '4px' }}
          >
            <div className="px-3 py-2 bg-blue-50 border-b border-blue-200">
              <span className="text-xs font-medium text-blue-700">
                Select an option ({suggestions.length} found)
              </span>
            </div>
            <ul className="py-1">
              {suggestions.map((option, index) => (
                <li
                  key={`fallback-${option.value}-${index}`}
                  className={cn(
                    'px-4 py-2 cursor-pointer transition-colors',
                    'hover:bg-blue-50 focus:bg-blue-50',
                    index === selectedIndex && 'bg-blue-50',
                    'border-b border-gray-100 last:border-b-0'
                  )}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleOptionSelect(option);
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
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
        </>
      )}
    </div>
  );
}