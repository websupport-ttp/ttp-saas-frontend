'use client';

import { useEffect } from 'react';
import { initBrowserCompatibility } from '@/lib/browser-compatibility';

export default function BrowserCompatibilityInit() {
  useEffect(() => {
    // Initialize browser compatibility features
    initBrowserCompatibility();
  }, []);

  // This component doesn't render anything
  return null;
}