import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { currencyService, Currency } from '@/lib/services/currency-service';
import { formatPrice, convertPrice } from '@/lib/utils/currency-utils';

interface CurrencyContextType {
  currencies: Currency[];
  selectedCurrency: string;
  baseCurrency: string;
  loading: boolean;
  error: string | null;
  setSelectedCurrency: (code: string) => void;
  convertAmount: (amount: number, fromCurrency?: string) => number;
  formatAmount: (amount: number, fromCurrency?: string) => string;
  refreshCurrencies: () => Promise<void>;
  refreshRates: () => Promise<void>;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const STORAGE_KEY = 'selected_currency';
const DEFAULT_CURRENCY = 'NGN';

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [selectedCurrency, setSelectedCurrencyState] = useState<string>(DEFAULT_CURRENCY);
  const [baseCurrency] = useState<string>(DEFAULT_CURRENCY);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load selected currency from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setSelectedCurrencyState(stored);
    }
  }, []);

  // Fetch currencies on mount
  useEffect(() => {
    fetchCurrencies();
  }, []);

  const fetchCurrencies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await currencyService.getCurrencies();
      setCurrencies(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load currencies');
      console.error('Failed to fetch currencies:', err);
    } finally {
      setLoading(false);
    }
  };

  const setSelectedCurrency = useCallback((code: string) => {
    setSelectedCurrencyState(code);
    localStorage.setItem(STORAGE_KEY, code);
  }, []);

  const convertAmount = useCallback((amount: number, fromCurrency: string = baseCurrency): number => {
    if (fromCurrency === selectedCurrency) {
      return amount;
    }

    const targetCurrency = currencies.find(c => c.code === selectedCurrency);
    if (!targetCurrency) {
      return amount;
    }

    return convertPrice(amount, targetCurrency.rate);
  }, [selectedCurrency, currencies, baseCurrency]);

  const formatAmount = useCallback((amount: number, fromCurrency: string = baseCurrency): string => {
    const convertedAmount = convertAmount(amount, fromCurrency);
    const targetCurrency = currencies.find(c => c.code === selectedCurrency);
    
    return formatPrice(convertedAmount, selectedCurrency, targetCurrency?.symbol);
  }, [convertAmount, selectedCurrency, currencies]);

  const refreshCurrencies = useCallback(async () => {
    await fetchCurrencies();
  }, []);

  const refreshRates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await currencyService.updateRates();
      await fetchCurrencies();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update rates');
      console.error('Failed to update rates:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value: CurrencyContextType = useMemo(() => ({
    currencies,
    selectedCurrency,
    baseCurrency,
    loading,
    error,
    setSelectedCurrency,
    convertAmount,
    formatAmount,
    refreshCurrencies,
    refreshRates,
  }), [
    currencies,
    selectedCurrency,
    baseCurrency,
    loading,
    error,
    setSelectedCurrency,
    convertAmount,
    formatAmount,
    refreshCurrencies,
    refreshRates,
  ]);

  return (
    <CurrencyContext.Provider value={value}>
      {/* Screen reader announcement for currency changes */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {selectedCurrency && `Currency changed to ${selectedCurrency}`}
      </div>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
