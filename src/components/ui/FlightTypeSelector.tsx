'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export type FlightType = 'one-way' | 'round-trip';

interface FlightTypeSelectorProps {
  value: FlightType;
  onChange: (type: FlightType) => void;
  className?: string;
}

export function FlightTypeSelector({ value, onChange, className }: FlightTypeSelectorProps) {
  return (
    <div className={cn('flex rounded-lg p-0.5', className)}>
      <button
        type="button"
        onClick={() => onChange('one-way')}
        className={cn(
          'flex-1 px-2 py-1.5 text-xs font-medium rounded-md transition-all duration-200 whitespace-nowrap',
          value === 'one-way'
            ? 'bg-white text-brand-blue shadow-sm'
            : 'text-brand-blue/70 hover:text-brand-blue hover:bg-white/10'
        )}
      >
        One-way
      </button>
      <button
        type="button"
        onClick={() => onChange('round-trip')}
        className={cn(
          'flex-1 px-2 py-1.5 text-xs font-medium rounded-md transition-all duration-200 whitespace-nowrap',
          value === 'round-trip'
            ? 'bg-white text-brand-blue shadow-sm'
            : 'text-brand-blue/70 hover:text-brand-blue hover:bg-white/10'
        )}
      >
        Round-trip
      </button>
    </div>
  );
}