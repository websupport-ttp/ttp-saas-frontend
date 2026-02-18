/**
 * Currency formatting utilities
 */

export interface CurrencyFormatOptions {
  currency?: string
  locale?: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
}

/**
 * Format currency amount with proper locale and currency symbol
 */
export function formatCurrency(
  amount: number | string,
  options: CurrencyFormatOptions = {}
): string {
  const {
    currency = 'NGN',
    locale = 'en-NG',
    minimumFractionDigits = 2,
    maximumFractionDigits = 2
  } = options

  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount

  if (isNaN(numericAmount)) {
    return '₦0.00'
  }

  try {
    // Use Intl.NumberFormat for proper currency formatting
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits,
      maximumFractionDigits
    })

    return formatter.format(numericAmount)
  } catch (error) {
    // Fallback formatting for NGN
    if (currency === 'NGN') {
      return `₦${numericAmount.toLocaleString('en-NG', {
        minimumFractionDigits,
        maximumFractionDigits
      })}`
    }

    // Generic fallback
    return `${currency} ${numericAmount.toLocaleString('en-US', {
      minimumFractionDigits,
      maximumFractionDigits
    })}`
  }
}

/**
 * Format number with proper thousands separators
 */
export function formatNumber(
  amount: number | string,
  options: { minimumFractionDigits?: number; maximumFractionDigits?: number } = {}
): string {
  const {
    minimumFractionDigits = 0,
    maximumFractionDigits = 2
  } = options

  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount

  if (isNaN(numericAmount)) {
    return '0'
  }

  return numericAmount.toLocaleString('en-NG', {
    minimumFractionDigits,
    maximumFractionDigits
  })
}

/**
 * Get currency symbol for a given currency code
 */
export function getCurrencySymbol(currencyCode: string): string {
  const symbols: Record<string, string> = {
    NGN: '₦',
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥'
  }

  return symbols[currencyCode] || currencyCode
}