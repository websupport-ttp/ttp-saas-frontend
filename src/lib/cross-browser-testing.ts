/**
 * Cross-browser testing utilities
 * Helps identify and test browser-specific issues
 */

export interface BrowserTestResult {
  browser: string;
  version: string;
  passed: boolean;
  issues: string[];
  warnings: string[];
}

export interface TestSuite {
  name: string;
  tests: BrowserTest[];
}

export interface BrowserTest {
  name: string;
  test: () => boolean;
  description: string;
  critical: boolean;
}

// Define test suites for different browser features
export const browserTestSuites: TestSuite[] = [
  {
    name: 'CSS Features',
    tests: [
      {
        name: 'CSS Grid Support',
        test: () => CSS.supports('display', 'grid'),
        description: 'Tests if the browser supports CSS Grid layout',
        critical: true,
      },
      {
        name: 'CSS Flexbox Support',
        test: () => CSS.supports('display', 'flex'),
        description: 'Tests if the browser supports CSS Flexbox',
        critical: true,
      },
      {
        name: 'CSS Custom Properties',
        test: () => CSS.supports('--custom', 'property'),
        description: 'Tests if the browser supports CSS custom properties (variables)',
        critical: false,
      },
      {
        name: 'CSS Backdrop Filter',
        test: () => CSS.supports('backdrop-filter', 'blur(10px)') || CSS.supports('-webkit-backdrop-filter', 'blur(10px)'),
        description: 'Tests if the browser supports backdrop-filter property',
        critical: false,
      },
      {
        name: 'CSS Aspect Ratio',
        test: () => CSS.supports('aspect-ratio', '16/9'),
        description: 'Tests if the browser supports aspect-ratio property',
        critical: false,
      },
      {
        name: 'CSS Transform 3D',
        test: () => CSS.supports('transform', 'translateZ(0)'),
        description: 'Tests if the browser supports 3D transforms',
        critical: false,
      },
    ],
  },
  {
    name: 'JavaScript APIs',
    tests: [
      {
        name: 'Intersection Observer',
        test: () => 'IntersectionObserver' in window,
        description: 'Tests if the browser supports Intersection Observer API',
        critical: false,
      },
      {
        name: 'Web Animations API',
        test: () => 'animate' in document.createElement('div'),
        description: 'Tests if the browser supports Web Animations API',
        critical: false,
      },
      {
        name: 'Fetch API',
        test: () => 'fetch' in window,
        description: 'Tests if the browser supports Fetch API',
        critical: true,
      },
      {
        name: 'Promise Support',
        test: () => 'Promise' in window,
        description: 'Tests if the browser supports Promises',
        critical: true,
      },
      {
        name: 'ES6 Classes',
        test: () => {
          try {
            eval('class Test {}');
            return true;
          } catch {
            return false;
          }
        },
        description: 'Tests if the browser supports ES6 classes',
        critical: true,
      },
      {
        name: 'Arrow Functions',
        test: () => {
          try {
            eval('() => {}');
            return true;
          } catch {
            return false;
          }
        },
        description: 'Tests if the browser supports arrow functions',
        critical: true,
      },
    ],
  },
  {
    name: 'Image Formats',
    tests: [
      {
        name: 'WebP Support',
        test: () => {
          const canvas = document.createElement('canvas');
          canvas.width = 1;
          canvas.height = 1;
          return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        },
        description: 'Tests if the browser supports WebP image format',
        critical: false,
      },
      {
        name: 'AVIF Support',
        test: () => {
          const canvas = document.createElement('canvas');
          canvas.width = 1;
          canvas.height = 1;
          return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
        },
        description: 'Tests if the browser supports AVIF image format',
        critical: false,
      },
    ],
  },
  {
    name: 'Performance Features',
    tests: [
      {
        name: 'Performance Observer',
        test: () => 'PerformanceObserver' in window,
        description: 'Tests if the browser supports Performance Observer API',
        critical: false,
      },
      {
        name: 'Service Worker',
        test: () => 'serviceWorker' in navigator,
        description: 'Tests if the browser supports Service Workers',
        critical: false,
      },
      {
        name: 'Web Workers',
        test: () => 'Worker' in window,
        description: 'Tests if the browser supports Web Workers',
        critical: false,
      },
    ],
  },
  {
    name: 'Accessibility Features',
    tests: [
      {
        name: 'ARIA Support',
        test: () => {
          const div = document.createElement('div');
          div.setAttribute('aria-label', 'test');
          return div.getAttribute('aria-label') === 'test';
        },
        description: 'Tests if the browser supports ARIA attributes',
        critical: true,
      },
      {
        name: 'Focus Management',
        test: () => 'focus' in document.createElement('div'),
        description: 'Tests if the browser supports focus management',
        critical: true,
      },
    ],
  },
];

// Run all browser tests
export const runBrowserTests = (): BrowserTestResult => {
  const userAgent = navigator.userAgent;
  let browser = 'Unknown';
  let version = 'Unknown';

  // Detect browser
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
    browser = 'Chrome';
    const match = userAgent.match(/Chrome\/(\d+)/);
    version = match ? match[1] : 'Unknown';
  } else if (userAgent.includes('Firefox')) {
    browser = 'Firefox';
    const match = userAgent.match(/Firefox\/(\d+)/);
    version = match ? match[1] : 'Unknown';
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    browser = 'Safari';
    const match = userAgent.match(/Version\/(\d+)/);
    version = match ? match[1] : 'Unknown';
  } else if (userAgent.includes('Edg')) {
    browser = 'Edge';
    const match = userAgent.match(/Edg\/(\d+)/);
    version = match ? match[1] : 'Unknown';
  }

  const issues: string[] = [];
  const warnings: string[] = [];
  let allCriticalTestsPassed = true;

  // Run all test suites
  browserTestSuites.forEach(suite => {
    suite.tests.forEach(test => {
      try {
        const result = test.test();
        if (!result) {
          const message = `${suite.name}: ${test.name} - ${test.description}`;
          if (test.critical) {
            issues.push(message);
            allCriticalTestsPassed = false;
          } else {
            warnings.push(message);
          }
        }
      } catch (error) {
        const message = `${suite.name}: ${test.name} - Test failed with error: ${error}`;
        if (test.critical) {
          issues.push(message);
          allCriticalTestsPassed = false;
        } else {
          warnings.push(message);
        }
      }
    });
  });

  return {
    browser,
    version,
    passed: allCriticalTestsPassed,
    issues,
    warnings,
  };
};

// Get browser-specific recommendations
export const getBrowserRecommendations = (testResult: BrowserTestResult): string[] => {
  const recommendations: string[] = [];

  // Browser-specific recommendations
  if (testResult.browser === 'Safari') {
    recommendations.push('Consider using -webkit- prefixes for newer CSS properties');
    recommendations.push('Test image loading behavior, especially with lazy loading');
    recommendations.push('Verify backdrop-filter fallbacks are working');
  }

  if (testResult.browser === 'Firefox') {
    recommendations.push('Test scrollbar styling and behavior');
    recommendations.push('Verify CSS Grid behavior in complex layouts');
  }

  if (testResult.browser === 'Edge') {
    recommendations.push('Test with both Chromium-based and legacy Edge if supporting older versions');
    recommendations.push('Verify CSS Grid and Flexbox behavior');
  }

  // Feature-specific recommendations
  if (testResult.issues.some(issue => issue.includes('CSS Grid'))) {
    recommendations.push('Implement Flexbox fallbacks for CSS Grid layouts');
  }

  if (testResult.warnings.some(warning => warning.includes('WebP'))) {
    recommendations.push('Ensure JPEG/PNG fallbacks are provided for WebP images');
  }

  if (testResult.warnings.some(warning => warning.includes('Intersection Observer'))) {
    recommendations.push('Consider loading Intersection Observer polyfill');
  }

  return recommendations;
};

// Generate browser compatibility report
export const generateCompatibilityReport = (): {
  testResult: BrowserTestResult;
  recommendations: string[];
  summary: string;
} => {
  const testResult = runBrowserTests();
  const recommendations = getBrowserRecommendations(testResult);

  let summary = `Browser: ${testResult.browser} ${testResult.version}\n`;
  summary += `Overall Status: ${testResult.passed ? 'PASSED' : 'FAILED'}\n`;
  summary += `Critical Issues: ${testResult.issues.length}\n`;
  summary += `Warnings: ${testResult.warnings.length}`;

  return {
    testResult,
    recommendations,
    summary,
  };
};

// Browser compatibility checker component data
export const getCompatibilityStatus = () => {
  const report = generateCompatibilityReport();
  
  return {
    isCompatible: report.testResult.passed,
    browser: `${report.testResult.browser} ${report.testResult.version}`,
    issues: report.testResult.issues,
    warnings: report.testResult.warnings,
    recommendations: report.recommendations,
  };
};