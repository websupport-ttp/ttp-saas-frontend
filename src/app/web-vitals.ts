import { reportWebVitals, WebVitalsMetric } from '@/lib/performance';

// Simple Web Vitals measurement without external library
export function setupWebVitals() {
  if (typeof window === 'undefined') return;

  // Measure First Contentful Paint (FCP)
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === 'first-contentful-paint') {
        const metric: WebVitalsMetric = {
          name: 'FCP',
          value: entry.startTime,
          rating: entry.startTime < 1800 ? 'good' : entry.startTime < 3000 ? 'needs-improvement' : 'poor',
          delta: entry.startTime,
          id: 'fcp-' + Math.random().toString(36).substring(2, 11),
        };
        reportWebVitals(metric);
      }
      
      if (entry.name === 'largest-contentful-paint') {
        const metric: WebVitalsMetric = {
          name: 'LCP',
          value: entry.startTime,
          rating: entry.startTime < 2500 ? 'good' : entry.startTime < 4000 ? 'needs-improvement' : 'poor',
          delta: entry.startTime,
          id: 'lcp-' + Math.random().toString(36).substring(2, 11),
        };
        reportWebVitals(metric);
      }
    }
  });

  try {
    observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
  } catch (e) {
    // Fallback for browsers that don't support these metrics
    console.log('Performance Observer not supported');
  }

  // Measure page load time
  window.addEventListener('load', () => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      const loadTime = navigation.loadEventEnd - navigation.fetchStart;
      const metric: WebVitalsMetric = {
        name: 'Load Time',
        value: loadTime,
        rating: loadTime < 3000 ? 'good' : loadTime < 5000 ? 'needs-improvement' : 'poor',
        delta: loadTime,
        id: 'load-' + Math.random().toString(36).substring(2, 11),
      };
      reportWebVitals(metric);
    }
  });
}

// Initialize Web Vitals reporting
if (typeof window !== 'undefined') {
  setupWebVitals();
}