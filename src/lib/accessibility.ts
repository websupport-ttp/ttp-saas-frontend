// Accessibility utilities and helpers

/**
 * Manages focus for modal dialogs and overlays
 */
export class FocusManager {
  private previousActiveElement: Element | null = null;
  private focusableElements: NodeListOf<Element> | null = null;
  private firstFocusableElement: Element | null = null;
  private lastFocusableElement: Element | null = null;

  constructor(private container: HTMLElement) {
    this.updateFocusableElements();
  }

  private updateFocusableElements() {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ].join(', ');

    this.focusableElements = this.container.querySelectorAll(focusableSelectors);
    this.firstFocusableElement = this.focusableElements[0] || null;
    this.lastFocusableElement = this.focusableElements[this.focusableElements.length - 1] || null;
  }

  trapFocus() {
    this.previousActiveElement = document.activeElement;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === this.firstFocusableElement) {
          e.preventDefault();
          (this.lastFocusableElement as HTMLElement)?.focus();
        }
      } else {
        if (document.activeElement === this.lastFocusableElement) {
          e.preventDefault();
          (this.firstFocusableElement as HTMLElement)?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    (this.firstFocusableElement as HTMLElement)?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      this.restoreFocus();
    };
  }

  restoreFocus() {
    if (this.previousActiveElement) {
      (this.previousActiveElement as HTMLElement).focus();
    }
  }
}

/**
 * Announces messages to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Generates unique IDs for form elements and ARIA relationships
 */
let idCounter = 0;
export function generateId(prefix = 'id'): string {
  return `${prefix}-${++idCounter}`;
}

/**
 * Keyboard navigation helpers
 */
export const KeyboardKeys = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
  TAB: 'Tab',
} as const;

/**
 * Handles keyboard navigation for lists and menus
 */
export function handleArrowKeyNavigation(
  event: KeyboardEvent,
  items: HTMLElement[],
  currentIndex: number,
  options: {
    loop?: boolean;
    orientation?: 'horizontal' | 'vertical';
    onSelect?: (index: number) => void;
  } = {}
) {
  const { loop = true, orientation = 'vertical', onSelect } = options;
  
  let nextIndex = currentIndex;

  switch (event.key) {
    case KeyboardKeys.ARROW_UP:
      if (orientation === 'vertical') {
        event.preventDefault();
        nextIndex = currentIndex > 0 ? currentIndex - 1 : (loop ? items.length - 1 : 0);
      }
      break;
    case KeyboardKeys.ARROW_DOWN:
      if (orientation === 'vertical') {
        event.preventDefault();
        nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : (loop ? 0 : items.length - 1);
      }
      break;
    case KeyboardKeys.ARROW_LEFT:
      if (orientation === 'horizontal') {
        event.preventDefault();
        nextIndex = currentIndex > 0 ? currentIndex - 1 : (loop ? items.length - 1 : 0);
      }
      break;
    case KeyboardKeys.ARROW_RIGHT:
      if (orientation === 'horizontal') {
        event.preventDefault();
        nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : (loop ? 0 : items.length - 1);
      }
      break;
    case KeyboardKeys.HOME:
      event.preventDefault();
      nextIndex = 0;
      break;
    case KeyboardKeys.END:
      event.preventDefault();
      nextIndex = items.length - 1;
      break;
    case KeyboardKeys.ENTER:
    case KeyboardKeys.SPACE:
      event.preventDefault();
      onSelect?.(currentIndex);
      return currentIndex;
  }

  if (nextIndex !== currentIndex && items[nextIndex]) {
    items[nextIndex].focus();
    return nextIndex;
  }

  return currentIndex;
}

/**
 * Checks if an element is visible to screen readers
 */
export function isElementVisible(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element);
  return (
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    style.opacity !== '0' &&
    element.offsetWidth > 0 &&
    element.offsetHeight > 0
  );
}

/**
 * Creates accessible button props
 */
export function createAccessibleButtonProps(
  label: string,
  options: {
    expanded?: boolean;
    controls?: string;
    describedBy?: string;
    pressed?: boolean;
  } = {}
) {
  const { expanded, controls, describedBy, pressed } = options;
  
  return {
    'aria-label': label,
    ...(expanded !== undefined && { 'aria-expanded': expanded }),
    ...(controls && { 'aria-controls': controls }),
    ...(describedBy && { 'aria-describedby': describedBy }),
    ...(pressed !== undefined && { 'aria-pressed': pressed }),
    role: 'button',
    tabIndex: 0,
  };
}

/**
 * Creates accessible form field props
 */
export function createAccessibleFieldProps(
  id: string,
  options: {
    label?: string;
    required?: boolean;
    invalid?: boolean;
    describedBy?: string;
    errorId?: string;
  } = {}
) {
  const { label, required, invalid, describedBy, errorId } = options;
  
  return {
    id,
    'aria-label': label,
    'aria-required': required,
    'aria-invalid': invalid,
    'aria-describedby': [describedBy, errorId].filter(Boolean).join(' ') || undefined,
  };
}

/**
 * Manages reduced motion preferences
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Creates a skip link component
 */
export function createSkipLink(targetId: string, text: string = 'Skip to main content') {
  return {
    href: `#${targetId}`,
    className: 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-brand-red text-white px-6 py-3 rounded-lg font-medium z-[9999] transition-all duration-200 focus:shadow-lg',
    children: text,
  };
}