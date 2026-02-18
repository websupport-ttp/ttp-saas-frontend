'use client';

import { useState, useEffect, useRef, ReactNode } from 'react';
import { Skeleton } from './SkeletonLoader';

interface LazyLoadProps {
  children: ReactNode;
  fallback?: ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
  once?: boolean;
}

export default function LazyLoad({
  children,
  fallback,
  threshold = 0.1,
  rootMargin = '50px',
  className = '',
  once = true,
}: LazyLoadProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;
        setIsVisible(isIntersecting);
        
        if (isIntersecting && once) {
          setHasBeenVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  const shouldRender = once ? (isVisible || hasBeenVisible) : isVisible;

  return (
    <div ref={ref} className={className}>
      {shouldRender ? (
        children
      ) : (
        fallback || <Skeleton className="h-64 w-full rounded" />
      )}
    </div>
  );
}