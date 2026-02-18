'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

export interface TravelerCounts {
  adults: number;
  children: number;
}

interface TravelerSelectorProps {
  value: TravelerCounts;
  onChange: (travelers: TravelerCounts) => void;
  maxAdults?: number;
  maxChildren?: number;
  disabled?: boolean;
  className?: string;
}

export function TravelerSelector({
  value,
  onChange,
  maxAdults = 10,
  maxChildren = 9,
  disabled = false,
  className = ''
}: TravelerSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0, openUpward: false });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current && 
        !containerRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function updatePosition() {
      if (containerRef.current && isOpen) {
        const rect = containerRef.current.getBoundingClientRect();
        const dropdownHeight = 250; // Approximate height of dropdown
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        const openUpward = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;
        
        // Calculate position to align dropdown just below (or above) the input field
        const top = openUpward 
          ? Math.max(8, rect.top - dropdownHeight - 8) // 8px gap above, with minimum 8px from top of viewport
          : rect.bottom + 8; // 8px gap below
        
        // Ensure dropdown doesn't go off-screen horizontally
        const left = Math.min(
          rect.left,
          window.innerWidth - 320 - 16 // 320px dropdown width + 16px margin
        );
        
        setDropdownPosition({
          top,
          left: Math.max(8, left), // Minimum 8px from left edge
          width: rect.width,
          openUpward
        });
      }
    }

    if (isOpen) {
      updatePosition();
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isOpen]);

  const updateCount = (type: 'adults' | 'children', delta: number) => {
    const newValue = { ...value };
    const currentValue = value[type];
    const newCount = currentValue + delta;

    if (type === 'adults') {
      if (newCount >= 1 && newCount <= maxAdults) {
        newValue.adults = newCount;
      }
    } else if (type === 'children') {
      if (newCount >= 0 && newCount <= maxChildren) {
        newValue.children = newCount;
      }
    }

    onChange(newValue);
  };

  const getTotalTravelers = () => {
    return value.adults + value.children;
  };

  const getDisplayText = () => {
    const total = getTotalTravelers();
    if (total === 1) return '1 Traveler';
    
    const parts = [];
    if (value.adults > 0) {
      parts.push(`${value.adults} ${value.adults === 1 ? 'Adult' : 'Adults'}`);
    }
    if (value.children > 0) {
      parts.push(`${value.children} ${value.children === 1 ? 'Child' : 'Children'}`);
    }
    
    return parts.join(', ') || '0 Travelers';
  };

  const dropdownContent = isOpen && mounted ? createPortal(
    <>
      <div 
        className="fixed inset-0 z-[9998]" 
        onClick={() => setIsOpen(false)}
      />
      <div 
        ref={dropdownRef}
        className="fixed z-[9999] bg-white border border-gray-200 rounded-lg shadow-xl max-w-sm"
        style={{
          top: `${dropdownPosition.top}px`,
          left: `${dropdownPosition.left}px`,
          width: '320px',
          maxHeight: '400px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 space-y-4">
          {/* Adults */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Adults</div>
              <div className="text-sm text-gray-500">18 years and above</div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => updateCount('adults', -1)}
                disabled={value.adults <= 1}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <span className="text-lg font-medium text-gray-600">−</span>
              </button>
              <span className="w-8 text-center font-medium text-gray-900">{value.adults}</span>
              <button
                type="button"
                onClick={() => updateCount('adults', 1)}
                disabled={value.adults >= maxAdults}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <span className="text-lg font-medium text-gray-600">+</span>
              </button>
            </div>
          </div>

          {/* Children */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Children</div>
              <div className="text-sm text-gray-500">Under 18 years</div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => updateCount('children', -1)}
                disabled={value.children <= 0}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <span className="text-lg font-medium text-gray-600">−</span>
              </button>
              <span className="w-8 text-center font-medium text-gray-900">{value.children}</span>
              <button
                type="button"
                onClick={() => updateCount('children', 1)}
                disabled={value.children >= maxChildren}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <span className="text-lg font-medium text-gray-600">+</span>
              </button>
            </div>
          </div>

          {/* Done Button */}
          <div className="pt-2 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  ) : null;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full h-12 px-4 bg-transparent border-none text-left flex items-center justify-between focus:outline-none transition-colors ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <span className="text-brand-blue font-medium">{getDisplayText()}</span>
        <svg
          className={`w-5 h-5 text-brand-blue/60 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {dropdownContent}
    </div>
  );
}
