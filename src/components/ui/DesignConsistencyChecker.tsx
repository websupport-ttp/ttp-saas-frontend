'use client';

import { useEffect, useState } from 'react';
import { designTokens } from '@/lib/design-validation';

interface DesignIssue {
  element: string;
  issue: string;
  severity: 'low' | 'medium' | 'high';
  suggestion: string;
}

interface DesignConsistencyCheckerProps {
  enabled?: boolean;
  showInProduction?: boolean;
}

export default function DesignConsistencyChecker({
  enabled = process.env.NODE_ENV === 'development',
  showInProduction = false,
}: DesignConsistencyCheckerProps) {
  const [issues, setIssues] = useState<DesignIssue[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!enabled && !showInProduction) return;

    const checkDesignConsistency = () => {
      const foundIssues: DesignIssue[] = [];

      // Check for inconsistent font families
      const elements = document.querySelectorAll('*');
      elements.forEach((element) => {
        const computedStyle = window.getComputedStyle(element);
        const fontFamily = computedStyle.fontFamily;

        // Check if font family matches our design tokens
        const validFonts = Object.values(designTokens.typography.fontFamilies);
        const isValidFont = validFonts.some(font => 
          fontFamily.toLowerCase().includes(font.toLowerCase().split(',')[0])
        );

        if (!isValidFont && element.textContent?.trim()) {
          foundIssues.push({
            element: element.tagName.toLowerCase(),
            issue: `Inconsistent font family: ${fontFamily}`,
            severity: 'medium',
            suggestion: 'Use Poppins for headings, Nunito Sans for body text',
          });
        }

        // Check for inconsistent colors
        const color = computedStyle.color;
        const backgroundColor = computedStyle.backgroundColor;

        // Check if colors match our brand palette (simplified check)
        if (color && color !== 'rgba(0, 0, 0, 0)' && !color.includes('rgb(0, 0, 0)')) {
          // This is a simplified check - in production you'd have more sophisticated color matching
          const isBrandColor = color.includes('226, 30, 36') || // brand red
                              color.includes('20, 27, 52') ||   // brand blue
                              color.includes('255, 107, 53');  // brand orange

          if (!isBrandColor && element.textContent?.trim()) {
            foundIssues.push({
              element: element.tagName.toLowerCase(),
              issue: `Non-brand color used: ${color}`,
              severity: 'low',
              suggestion: 'Use brand colors from design tokens',
            });
          }
        }

        // Check for inconsistent spacing
        const margin = computedStyle.margin;
        const padding = computedStyle.padding;

        // Check if spacing follows our scale (simplified)
        const spacingValues = Object.values(designTokens.spacing);
        const checkSpacing = (value: string) => {
          if (value && value !== '0px' && !spacingValues.some(s => value.includes(s.replace('rem', '')))) {
            return false;
          }
          return true;
        };

        if (!checkSpacing(margin) || !checkSpacing(padding)) {
          foundIssues.push({
            element: element.tagName.toLowerCase(),
            issue: 'Inconsistent spacing values',
            severity: 'low',
            suggestion: 'Use spacing scale from design tokens',
          });
        }
      });

      // Limit to first 10 issues to avoid overwhelming output
      setIssues(foundIssues.slice(0, 10));
    };

    // Run check after a delay to allow components to render
    const timer = setTimeout(checkDesignConsistency, 2000);

    return () => clearTimeout(timer);
  }, [enabled, showInProduction]);

  if (!enabled && !showInProduction) return null;
  if (issues.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-brand-red text-white px-4 py-2 rounded-full shadow-lg hover:bg-brand-red-dark transition-colors duration-200 text-sm font-medium"
      >
        Design Issues ({issues.length})
      </button>

      {isVisible && (
        <div className="absolute bottom-12 right-0 w-96 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Design Consistency Issues</h3>
            <p className="text-sm text-gray-600">Development mode only</p>
          </div>
          
          <div className="p-4 space-y-3">
            {issues.map((issue, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border-l-4 ${
                  issue.severity === 'high'
                    ? 'border-red-500 bg-red-50'
                    : issue.severity === 'medium'
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-blue-500 bg-blue-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    {issue.element}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      issue.severity === 'high'
                        ? 'bg-red-100 text-red-800'
                        : issue.severity === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {issue.severity}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{issue.issue}</p>
                <p className="text-xs text-gray-600">{issue.suggestion}</p>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-600">
              This checker helps maintain design consistency during development.
              It will not appear in production builds.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}