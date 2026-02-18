// Performance monitoring and optimization utilities
import { useState, useEffect, useRef } from 'react';

/**
 * Web Vitals measurement and reporting
 */
export interface WebVitalsMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

/**
 * Report Web Vitals to analytics
 */
export function reportWebVitals(metric: WebVitalsMetric) {
  // In production, send to your analytics service
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vitals:', metric);
  }
  
  // Example: Send to Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    });
  }
}

/**
 * Lazy load components with intersection observer
 */
export function useLazyLoad(threshold = 0.1) {
  if (typeof window === 'undefined') return { ref: null, isVisible: true };
  
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => observer.disconnect();
  }, [threshold]);
  
  return { ref, isVisible };
}

/**
 * Preload critical resources
 */
export function preloadResource(href: string, as: string, type?: string) {
  if (typeof document === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (type) link.type = type;
  
  document.head.appendChild(link);
}

/**
 * Prefetch resources for next navigation
 */
export function prefetchResource(href: string) {
  if (typeof document === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  
  document.head.appendChild(link);
}

/**
 * Measure and log performance metrics
 */
export class PerformanceMonitor {
  private marks: Map<string, number> = new Map();
  
  mark(name: string) {
    const timestamp = performance.now();
    this.marks.set(name, timestamp);
    
    if (typeof performance.mark === 'function') {
      performance.mark(name);
    }
  }
  
  measure(name: string, startMark: string, endMark?: string) {
    const startTime = this.marks.get(startMark);
    const endTime = endMark ? this.marks.get(endMark) : performance.now();
    
    if (startTime && endTime) {
      const duration = endTime - startTime;
      
      if (typeof performance.measure === 'function') {
        performance.measure(name, startMark, endMark);
      }
      
      console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`);
      return duration;
    }
    
    return 0;
  }
  
  getNavigationTiming() {
    if (typeof window === 'undefined') return null;
    
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    return {
      dns: navigation.domainLookupEnd - navigation.domainLookupStart,
      tcp: navigation.connectEnd - navigation.connectStart,
      request: navigation.responseStart - navigation.requestStart,
      response: navigation.responseEnd - navigation.responseStart,
      dom: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      load: navigation.loadEventEnd - navigation.loadEventStart,
      total: navigation.loadEventEnd - navigation.fetchStart,
    };
  }
}

/**
 * Optimize images with lazy loading and intersection observer
 */
export function useImageOptimization() {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  
  const markImageAsLoaded = (src: string) => {
    setLoadedImages(prev => new Set(prev).add(src));
  };
  
  const isImageLoaded = (src: string) => loadedImages.has(src);
  
  return { markImageAsLoaded, isImageLoaded };
}

/**
 * Bundle size analyzer (development only)
 */
export function analyzeBundleSize() {
  if (process.env.NODE_ENV !== 'development') return;
  
  // This would integrate with webpack-bundle-analyzer in a real implementation
  console.log('Bundle analysis would run here in development mode');
}

/**
 * Critical CSS extraction helper
 */
export function extractCriticalCSS(html: string): string {
  // This is a simplified version - in production you'd use a proper critical CSS tool
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _html = html;
  
  const criticalSelectors = [
    'body', 'html', 'header', 'nav', 'main', 'footer',
    '.container', '.mx-auto', '.px-4', '.py-4',
    '.text-', '.bg-', '.font-', '.flex', '.grid',
    '.hidden', '.block', '.inline', '.relative', '.absolute',
  ];
  
  // Extract only critical CSS rules (simplified)
  return criticalSelectors.join(', ') + ' { /* critical styles */ }';
}

/**
 * Resource hints for better loading performance
 */
export function addResourceHints() {
  if (typeof document === 'undefined') return;
  
  // Preconnect to external domains
  const preconnectDomains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://images.unsplash.com',
  ];
  
  preconnectDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
  
  // DNS prefetch for other domains
  const dnsPrefetchDomains = [
    '//www.google-analytics.com',
    '//www.googletagmanager.com',
  ];
  
  dnsPrefetchDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  });
}

