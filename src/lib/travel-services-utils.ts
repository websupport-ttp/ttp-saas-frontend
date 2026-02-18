// ============================================================================
// SHARED TRAVEL SERVICES UTILITIES
// ============================================================================

// Re-export service-specific utilities
export * from './car-hire-utils';
export * from './visa-utils';
export * from './insurance-utils';

/**
 * Format currency amount for display
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * Format date for display
 */
export function formatDate(date: Date, format: 'short' | 'long' | 'input' = 'short'): string {
  if (format === 'input') {
    return date.toISOString().split('T')[0];
  }

  const options: Intl.DateTimeFormatOptions = format === 'short' 
    ? { month: 'short', day: 'numeric', year: 'numeric' }
    : { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };

  return new Intl.DateTimeFormat('en-US', options).format(date);
}

/**
 * Validate email address
 */
export function validateEmail(email: string): { valid: boolean; message?: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    return { valid: false, message: 'Email is required' };
  }
  
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Please enter a valid email address' };
  }
  
  return { valid: true };
}

/**
 * Validate phone number
 */
export function validatePhoneNumber(phone: string): { valid: boolean; message?: string } {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  
  if (!phone) {
    return { valid: false, message: 'Phone number is required' };
  }
  
  if (!phoneRegex.test(phone)) {
    return { valid: false, message: 'Please enter a valid phone number' };
  }
  
  return { valid: true };
}

/**
 * Generate a random confirmation number
 */
export function generateConfirmationNumber(prefix: string = 'TRV'): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

/**
 * Calculate days between two dates
 */
export function daysBetween(startDate: Date, endDate: Date): number {
  const timeDiff = endDate.getTime() - startDate.getTime();
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
}

/**
 * Check if date is in the future
 */
export function isFutureDate(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date > today;
}

/**
 * Format duration in days to human readable format
 */
export function formatDuration(days: number): string {
  if (days === 1) return '1 day';
  if (days < 7) return `${days} days`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;
    if (remainingDays === 0) {
      return weeks === 1 ? '1 week' : `${weeks} weeks`;
    }
    return `${weeks} week${weeks > 1 ? 's' : ''} ${remainingDays} day${remainingDays > 1 ? 's' : ''}`;
  }
  const months = Math.floor(days / 30);
  const remainingDays = days % 30;
  if (remainingDays === 0) {
    return months === 1 ? '1 month' : `${months} months`;
  }
  return `${months} month${months > 1 ? 's' : ''} ${remainingDays} day${remainingDays > 1 ? 's' : ''}`;
}

/**
 * Sanitize string for URL slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Capitalize first letter of each word
 */
export function titleCase(text: string): string {
  return text.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
}