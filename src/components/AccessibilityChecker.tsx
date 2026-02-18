'use client';

import { useEffect } from 'react';

/**
 * Accessibility and Visual Consistency Checker
 * This component runs accessibility checks and ensures visual consistency
 * across all travel services in development mode only
 */
export default function AccessibilityChecker() {
  useEffect(() => {
    // Only run in development mode
    if (process.env.NODE_ENV !== 'development') return;

    const runAccessibilityChecks = () => {
      const issues: string[] = [];

      // Check for missing alt attributes on images
      const images = document.querySelectorAll('img');
      images.forEach((img, index) => {
        if (!img.alt && !img.getAttribute('aria-label')) {
          issues.push(`Image ${index + 1} missing alt text: ${img.src}`);
        }
      });

      // Check for buttons without accessible names
      const buttons = document.querySelectorAll('button');
      buttons.forEach((button, index) => {
        const hasText = button.textContent?.trim();
        const hasAriaLabel = button.getAttribute('aria-label');
        const hasAriaLabelledBy = button.getAttribute('aria-labelledby');
        
        if (!hasText && !hasAriaLabel && !hasAriaLabelledBy) {
          issues.push(`Button ${index + 1} missing accessible name`);
        }
      });

      // Check for form inputs without labels
      const inputs = document.querySelectorAll('input, select, textarea');
      inputs.forEach((input, index) => {
        const id = input.id;
        const hasLabel = id && document.querySelector(`label[for="${id}"]`);
        const hasAriaLabel = input.getAttribute('aria-label');
        const hasAriaLabelledBy = input.getAttribute('aria-labelledby');
        
        if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
          issues.push(`Form input ${index + 1} missing label association`);
        }
      });

      // Check for proper heading hierarchy
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let previousLevel = 0;
      headings.forEach((heading, index) => {
        const currentLevel = parseInt(heading.tagName.charAt(1));
        if (index === 0 && currentLevel !== 1) {
          issues.push('Page should start with h1 heading');
        }
        if (currentLevel > previousLevel + 1) {
          issues.push(`Heading level skipped: ${heading.tagName} after h${previousLevel}`);
        }
        previousLevel = currentLevel;
      });

      // Check for sufficient color contrast (basic check)
      const checkColorContrast = (element: Element) => {
        const styles = window.getComputedStyle(element);
        const backgroundColor = styles.backgroundColor;
        const color = styles.color;
        
        // Basic check for common low-contrast combinations
        if (backgroundColor === 'rgb(255, 255, 255)' && color === 'rgb(192, 192, 192)') {
          issues.push(`Low contrast detected on element: ${element.tagName}`);
        }
      };

      document.querySelectorAll('*').forEach(checkColorContrast);

      // Check for keyboard navigation support
      const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex]');
      interactiveElements.forEach((element, index) => {
        const tabIndex = element.getAttribute('tabindex');
        if (tabIndex && parseInt(tabIndex) > 0) {
          issues.push(`Element ${index + 1} has positive tabindex, which can disrupt keyboard navigation`);
        }
      });

      // Visual consistency checks
      const checkVisualConsistency = () => {
        const consistencyIssues: string[] = [];

        // Check for consistent button styling
        const primaryButtons = document.querySelectorAll('.btn-primary, [class*="bg-blue"]');
        const buttonStyles = new Set();
        primaryButtons.forEach(button => {
          const styles = window.getComputedStyle(button);
          const styleKey = `${styles.backgroundColor}-${styles.borderRadius}-${styles.padding}`;
          buttonStyles.add(styleKey);
        });
        
        if (buttonStyles.size > 2) {
          consistencyIssues.push('Inconsistent primary button styling detected');
        }

        // Check for consistent spacing
        const cards = document.querySelectorAll('.service-card, [class*="card"]');
        const spacings = new Set();
        cards.forEach(card => {
          const styles = window.getComputedStyle(card);
          spacings.add(styles.padding);
        });
        
        if (spacings.size > 3) {
          consistencyIssues.push('Inconsistent card padding detected');
        }

        return consistencyIssues;
      };

      const visualIssues = checkVisualConsistency();
      issues.push(...visualIssues);

      // Log issues to console in development
      if (issues.length > 0) {
        console.group('🔍 Accessibility & Consistency Issues');
        issues.forEach(issue => console.warn('⚠️', issue));
        console.groupEnd();
      } else {
        console.log('✅ No accessibility or consistency issues detected');
      }
    };

    // Run checks after a delay to ensure DOM is fully loaded
    const timeoutId = setTimeout(runAccessibilityChecks, 1000);

    // Also run checks when the DOM changes
    const observer = new MutationObserver(() => {
      clearTimeout(timeoutId);
      setTimeout(runAccessibilityChecks, 500);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style', 'aria-label', 'alt']
    });

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  // This component doesn't render anything visible
  return null;
}