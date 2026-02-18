/**
 * Environment Configuration
 * Handles environment variables with validation and type safety
 */

export interface AppConfig {
  // Environment
  nodeEnv: 'development' | 'production' | 'test';
  
  // Site Configuration
  siteName: string;
  siteUrl: string;
  siteDescription: string;
  
  // Optional Analytics
  gaId?: string;
  gtmId?: string;
  
  // API Configuration (Required)
  apiBaseUrl: string;
  apiTimeout: number;
  apiKey?: string;
  
  // Authentication Configuration
  authCookieName: string;
  refreshTokenName: string;
  
  // Payment Configuration
  paystackPublicKey: string;
  
  // Optional Database
  databaseUrl?: string;
  databaseSsl?: boolean;
  
  // Optional Email
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPass?: string;
  fromEmail?: string;
  
  // Optional External Services
  unsplashAccessKey?: string;
  mapboxToken?: string;
  
  // Optional Security
  nextAuthSecret?: string;
  nextAuthUrl?: string;
  
  // Optional CMS
  cmsApiUrl?: string;
  cmsApiKey?: string;
  
  // Development Features
  debugMode: boolean;
  showPerformanceMetrics: boolean;
  enableGuestCheckout: boolean;
  enableRealTimeUpdates: boolean;
  
  // Build Configuration
  analyzeBundle: boolean;
  disableSourceMaps: boolean;
}

/**
 * Get environment variable with optional validation
 */
function getEnvVar(
  key: string,
  defaultValue?: string,
  required: boolean = false
): string | undefined {
  const value = process.env[key] || defaultValue;
  
  if (required && !value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  
  return value;
}

/**
 * Get boolean environment variable
 */
function getBooleanEnvVar(key: string, defaultValue: boolean = false): boolean {
  const value = process.env[key];
  if (!value) return defaultValue;
  
  return value.toLowerCase() === 'true' || value === '1';
}

/**
 * Get number environment variable
 */
function getNumberEnvVar(key: string, defaultValue?: number): number | undefined {
  const value = process.env[key];
  if (!value) return defaultValue;
  
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    console.warn(`Invalid number for environment variable ${key}: ${value}`);
    return defaultValue;
  }
  
  return parsed;
}

/**
 * Validate required environment variables
 */
function validateRequiredEnvVars(): void {
  const requiredVars = [
    'NEXT_PUBLIC_SITE_NAME',
    'NEXT_PUBLIC_SITE_URL',
    'NEXT_PUBLIC_SITE_DESCRIPTION',
    'NEXT_PUBLIC_API_BASE_URL',
    'NEXT_PUBLIC_AUTH_COOKIE_NAME',
    'NEXT_PUBLIC_REFRESH_TOKEN_NAME',
    'NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY'
  ];
  
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    // Only log in development mode to avoid console spam
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Missing environment variables: ${missing.join(', ')}`);
      console.warn('Available env vars:', Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_')));
    }
    
    // In production, throw error for missing required vars
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        `Missing required environment variables: ${missing.join(', ')}\n` +
        'Please check your .env.local file or environment configuration.'
      );
    }
  }
}

/**
 * Create application configuration from environment variables
 */
export function createAppConfig(): AppConfig {
  // Validate required environment variables
  validateRequiredEnvVars();
  
  const nodeEnv = (process.env.NODE_ENV || 'development') as AppConfig['nodeEnv'];
  
  return {
    // Environment
    nodeEnv,
    
    // Site Configuration (Required)
    siteName: getEnvVar('NEXT_PUBLIC_SITE_NAME', 'The Travel Place', false) || 'The Travel Place',
    siteUrl: getEnvVar('NEXT_PUBLIC_SITE_URL', 'http://localhost:3000', false) || 'http://localhost:3000',
    siteDescription: getEnvVar(
      'NEXT_PUBLIC_SITE_DESCRIPTION',
      'Discover amazing destinations and plan your perfect trip with The Travel Place',
      false
    ) || 'Discover amazing destinations and plan your perfect trip with The Travel Place',
    
    // Optional Analytics
    gaId: getEnvVar('NEXT_PUBLIC_GA_MEASUREMENT_ID'),
    gtmId: getEnvVar('NEXT_PUBLIC_GTM_ID'),
    
    // API Configuration (Required)
    apiBaseUrl: getEnvVar('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:8080/api/v1', false) || 'http://localhost:8080/api/v1',
    apiTimeout: getNumberEnvVar('NEXT_PUBLIC_API_TIMEOUT', 30000) || 30000,
    apiKey: getEnvVar('API_KEY'),
    
    // Authentication Configuration
    authCookieName: getEnvVar('NEXT_PUBLIC_AUTH_COOKIE_NAME', 'ttp_auth_token', false) || 'ttp_auth_token',
    refreshTokenName: getEnvVar('NEXT_PUBLIC_REFRESH_TOKEN_NAME', 'ttp_refresh_token', false) || 'ttp_refresh_token',
    
    // Payment Configuration
    paystackPublicKey: getEnvVar('NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY', 'pk_live_b67ab554158f2e0cc06689af2d07fbdbdae6fe6d', false) || 'pk_live_b67ab554158f2e0cc06689af2d07fbdbdae6fe6d',
    
    // Optional Database
    databaseUrl: getEnvVar('DATABASE_URL'),
    databaseSsl: getBooleanEnvVar('DATABASE_SSL', nodeEnv === 'production'),
    
    // Optional Email
    smtpHost: getEnvVar('SMTP_HOST'),
    smtpPort: getNumberEnvVar('SMTP_PORT', 587),
    smtpUser: getEnvVar('SMTP_USER'),
    smtpPass: getEnvVar('SMTP_PASS'),
    fromEmail: getEnvVar('FROM_EMAIL'),
    
    // Optional External Services
    unsplashAccessKey: getEnvVar('UNSPLASH_ACCESS_KEY'),
    mapboxToken: getEnvVar('MAPBOX_ACCESS_TOKEN'),
    
    // Optional Security
    nextAuthSecret: getEnvVar('NEXTAUTH_SECRET'),
    nextAuthUrl: getEnvVar('NEXTAUTH_URL'),
    
    // Optional CMS
    cmsApiUrl: getEnvVar('CMS_API_URL'),
    cmsApiKey: getEnvVar('CMS_API_KEY'),
    
    // Development Features
    debugMode: getBooleanEnvVar('NEXT_PUBLIC_DEBUG_MODE', nodeEnv === 'development'),
    showPerformanceMetrics: getBooleanEnvVar(
      'NEXT_PUBLIC_SHOW_PERFORMANCE_METRICS',
      nodeEnv === 'development'
    ),
    enableGuestCheckout: getBooleanEnvVar('NEXT_PUBLIC_ENABLE_GUEST_CHECKOUT', true),
    enableRealTimeUpdates: getBooleanEnvVar('NEXT_PUBLIC_ENABLE_REAL_TIME_UPDATES', true),
    
    // Build Configuration
    analyzeBundle: getBooleanEnvVar('ANALYZE_BUNDLE', false),
    disableSourceMaps: getBooleanEnvVar('DISABLE_SOURCE_MAPS', nodeEnv === 'production'),
  };
}

/**
 * Application configuration instance
 */
export const appConfig = createAppConfig();

/**
 * Check if we're in development mode
 */
export const isDevelopment = appConfig.nodeEnv === 'development';

/**
 * Check if we're in production mode
 */
export const isProduction = appConfig.nodeEnv === 'production';

/**
 * Check if we're in test mode
 */
export const isTest = appConfig.nodeEnv === 'test';

/**
 * Get site metadata for SEO
 */
export function getSiteMetadata() {
  return {
    title: appConfig.siteName,
    description: appConfig.siteDescription,
    url: appConfig.siteUrl,
    siteName: appConfig.siteName,
  };
}

/**
 * Get analytics configuration
 */
export function getAnalyticsConfig() {
  return {
    gaId: appConfig.gaId,
    gtmId: appConfig.gtmId,
    enabled: isProduction && (appConfig.gaId || appConfig.gtmId),
  };
}

/**
 * Get API configuration
 */
export function getApiConfig() {
  return {
    baseUrl: appConfig.apiBaseUrl,
    timeout: appConfig.apiTimeout,
    apiKey: appConfig.apiKey,
    authCookieName: appConfig.authCookieName,
    refreshTokenName: appConfig.refreshTokenName,
  };
}

/**
 * Get payment configuration
 */
export function getPaymentConfig() {
  return {
    paystackPublicKey: appConfig.paystackPublicKey,
  };
}

/**
 * Get feature flags
 */
export function getFeatureFlags() {
  return {
    enableGuestCheckout: appConfig.enableGuestCheckout,
    enableRealTimeUpdates: appConfig.enableRealTimeUpdates,
    debugMode: appConfig.debugMode,
    showPerformanceMetrics: appConfig.showPerformanceMetrics,
  };
}

/**
 * Development utilities
 */
export const devUtils = {
  log: (...args: any[]) => {
    if (appConfig.debugMode) {
      console.log('[DEV]', ...args);
    }
  },
  warn: (...args: any[]) => {
    if (appConfig.debugMode) {
      console.warn('[DEV]', ...args);
    }
  },
  error: (...args: any[]) => {
    if (appConfig.debugMode) {
      console.error('[DEV]', ...args);
    }
  },
};