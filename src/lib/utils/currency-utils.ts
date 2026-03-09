/**
 * Currency utility functions for formatting and conversion
 */

export const CURRENCY_SYMBOLS: Record<string, string> = {
  NGN: '₦',
  USD: '$',
  EUR: '€',
  GBP: '£',
  ZAR: 'R',
  GHS: '₵',
  KES: 'KSh',
  UGX: 'USh',
  TZS: 'TSh',
  XOF: 'CFA',
  XAF: 'FCFA',
  JPY: '¥',
  CNY: '¥',
  INR: '₹',
  AUD: 'A$',
  CAD: 'C$',
  CHF: 'CHF',
  SEK: 'kr',
  NOK: 'kr',
  DKK: 'kr',
  AED: 'د.إ',
  SAR: '﷼',
};

/**
 * Format a number as currency with symbol
 */
export function formatPrice(
  amount: number,
  currencyCode: string = 'NGN',
  symbol?: string
): string {
  const currencySymbol = symbol || CURRENCY_SYMBOLS[currencyCode] || currencyCode;
  
  // Format number with commas and 2 decimal places
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  // For currencies like USD, EUR, GBP - symbol before amount
  if (['USD', 'EUR', 'GBP', 'AUD', 'CAD'].includes(currencyCode)) {
    return `${currencySymbol}${formatted}`;
  }

  // For most African and Asian currencies - symbol after amount
  return `${currencySymbol} ${formatted}`;
}

/**
 * Convert price using exchange rate
 */
export function convertPrice(amount: number, exchangeRate: number): number {
  return amount * exchangeRate;
}

/**
 * Format price with conversion tooltip data
 */
export function formatPriceWithOriginal(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  exchangeRate: number,
  fromSymbol?: string,
  toSymbol?: string
): { display: string; original: string; converted: number } {
  const convertedAmount = convertPrice(amount, exchangeRate);
  
  return {
    display: formatPrice(convertedAmount, toCurrency, toSymbol),
    original: formatPrice(amount, fromCurrency, fromSymbol),
    converted: convertedAmount,
  };
}

/**
 * Parse currency string to number
 */
export function parseCurrencyString(value: string): number {
  // Remove all non-numeric characters except decimal point
  const cleaned = value.replace(/[^0-9.]/g, '');
  return parseFloat(cleaned) || 0;
}

/**
 * Get currency symbol by code
 */
export function getCurrencySymbol(currencyCode: string): string {
  return CURRENCY_SYMBOLS[currencyCode] || currencyCode;
}

/**
 * Format compact currency (e.g., 1.2K, 1.5M)
 */
export function formatCompactPrice(
  amount: number,
  currencyCode: string = 'NGN',
  symbol?: string
): string {
  const currencySymbol = symbol || CURRENCY_SYMBOLS[currencyCode] || currencyCode;
  
  const formatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  });

  const formatted = formatter.format(amount);

  if (['USD', 'EUR', 'GBP', 'AUD', 'CAD'].includes(currencyCode)) {
    return `${currencySymbol}${formatted}`;
  }

  return `${currencySymbol} ${formatted}`;
}

/**
 * Validate currency code format
 */
export function isValidCurrencyCode(code: string): boolean {
  return /^[A-Z]{3}$/.test(code);
}

/**
 * Round to 2 decimal places
 */
export function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}
