/**
 * Responsive design utilities for consistent breakpoint handling
 * and smooth transitions across all screen sizes
 */

// Breakpoint definitions matching Tailwind config
export const breakpoints = {
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
  '3xl': 1600,
} as const;

export type Breakpoint = keyof typeof breakpoints;

/**
 * Get responsive classes for consistent spacing
 */
export const getResponsiveSpacing = (
  mobile: string,
  tablet?: string,
  desktop?: string,
  large?: string
) => {
  const classes = [mobile];
  if (tablet) classes.push(`md:${tablet}`);
  if (desktop) classes.push(`lg:${desktop}`);
  if (large) classes.push(`xl:${large}`);
  return classes.join(' ');
};

/**
 * Get responsive text sizes with optimal line heights
 */
export const getResponsiveText = (
  mobile: string,
  tablet?: string,
  desktop?: string,
  large?: string
) => {
  const classes = [mobile];
  if (tablet) classes.push(`md:${tablet}`);
  if (desktop) classes.push(`lg:${desktop}`);
  if (large) classes.push(`xl:${large}`);
  return classes.join(' ');
};

/**
 * Get responsive grid classes for consistent layouts
 */
export const getResponsiveGrid = (
  mobile: number,
  tablet?: number,
  desktop?: number,
  large?: number
) => {
  const classes = [`grid-cols-${mobile}`];
  if (tablet) classes.push(`md:grid-cols-${tablet}`);
  if (desktop) classes.push(`lg:grid-cols-${desktop}`);
  if (large) classes.push(`xl:grid-cols-${large}`);
  return classes.join(' ');
};

/**
 * Get responsive container padding
 */
export const getContainerPadding = () => {
  return 'px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16';
};

/**
 * Get responsive section padding
 */
export const getSectionPadding = () => {
  return 'py-12 sm:py-16 lg:py-20 xl:py-24 2xl:py-28';
};

/**
 * Get responsive card spacing
 */
export const getCardSpacing = () => {
  return 'gap-4 sm:gap-6 lg:gap-8 xl:gap-10';
};

/**
 * Get responsive image aspect ratios
 */
export const getImageAspectRatio = (type: 'card' | 'hero' | 'feature') => {
  switch (type) {
    case 'card':
      return 'aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3]';
    case 'hero':
      return 'aspect-[16/9] sm:aspect-[21/9] lg:aspect-[32/9]';
    case 'feature':
      return 'aspect-square sm:aspect-[4/3] lg:aspect-square';
    default:
      return 'aspect-[4/3]';
  }
};

/**
 * Check if current viewport matches breakpoint
 */
export const useBreakpoint = (breakpoint: Breakpoint): boolean => {
  if (typeof window === 'undefined') return false;
  
  return window.innerWidth >= breakpoints[breakpoint];
};

/**
 * Get optimal image sizes for responsive images
 */
export const getImageSizes = (type: 'card' | 'hero' | 'thumbnail' | 'full') => {
  switch (type) {
    case 'card':
      return '(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw';
    case 'hero':
      return '100vw';
    case 'thumbnail':
      return '(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw';
    case 'full':
      return '(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 70vw';
    default:
      return '100vw';
  }
};

/**
 * Responsive typography scale
 */
export const responsiveTypography = {
  h1: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl',
  h2: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl',
  h3: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl',
  h4: 'text-lg sm:text-xl md:text-2xl lg:text-3xl',
  h5: 'text-base sm:text-lg md:text-xl lg:text-2xl',
  h6: 'text-sm sm:text-base md:text-lg lg:text-xl',
  body: 'text-sm sm:text-base md:text-lg',
  caption: 'text-xs sm:text-sm md:text-base',
  button: 'text-sm sm:text-base md:text-lg',
};

/**
 * Responsive button sizes
 */
export const responsiveButtonSizes = {
  small: 'px-3 py-1.5 sm:px-4 sm:py-2 text-sm',
  medium: 'px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 text-sm sm:text-base',
  large: 'px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 text-base sm:text-lg md:text-xl',
};

/**
 * Responsive card dimensions
 */
export const responsiveCardSizes = {
  small: 'p-4 sm:p-6',
  medium: 'p-6 sm:p-8 lg:p-10',
  large: 'p-8 sm:p-10 lg:p-12 xl:p-16',
};