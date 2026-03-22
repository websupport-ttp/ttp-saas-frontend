import React, { useState, useRef, useEffect } from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { ChevronDown, Check, Loader2 } from 'lucide-react';

const CurrencyPicker: React.FC = () => {
  const { currencies, selectedCurrency, setSelectedCurrency, loading } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

  const handleSelect = (code: string) => {
    setSelectedCurrency(code);
    setIsOpen(false);
  };

  const selectedCurrencyData = currencies.find(c => c.code === selectedCurrency);

  if (loading && currencies.length === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        aria-label="Select currency"
        aria-expanded={isOpen}
      >
        <span className="font-semibold">{selectedCurrencyData?.symbol || selectedCurrency}</span>
        <span className="hidden sm:inline">{selectedCurrency}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Select Currency
            </p>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {currencies.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-gray-500">
                No currencies available
              </div>
            ) : (
              <ul className="py-1">
                {currencies.map((currency) => (
                  <li key={currency.code}>
                    <button
                      onClick={() => handleSelect(currency.code)}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                        currency.code === selectedCurrency ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-semibold w-6 text-center">
                          {currency.symbol}
                        </span>
                        <div className="text-left">
                          <p className="font-medium text-gray-900">{currency.code}</p>
                          <p className="text-xs text-gray-500">{currency.name}</p>
                        </div>
                      </div>
                      {currency.code === selectedCurrency && (
                        <Check className="w-5 h-5 text-blue-600" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>


        </div>
      )}
    </div>
  );
};

export default CurrencyPicker;
