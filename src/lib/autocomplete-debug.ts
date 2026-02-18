// Autocomplete debugging utilities

export const debugAutocompletePositioning = () => {
  const dropdown = document.querySelector('.autocomplete-dropdown') as HTMLElement;
  const input = document.querySelector('input[role="combobox"]') as HTMLElement;
  
  if (!dropdown || !input) {
    console.log('🔍 Autocomplete Debug: Elements not found');
    return;
  }

  const dropdownRect = dropdown.getBoundingClientRect();
  const inputRect = input.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;

  console.log('🔍 Autocomplete Debug Info:', {
    input: {
      top: inputRect.top,
      bottom: inputRect.bottom,
      left: inputRect.left,
      right: inputRect.right,
      width: inputRect.width,
      height: inputRect.height
    },
    dropdown: {
      top: dropdownRect.top,
      bottom: dropdownRect.bottom,
      left: dropdownRect.left,
      right: dropdownRect.right,
      width: dropdownRect.width,
      height: dropdownRect.height
    },
    viewport: {
      width: viewportWidth,
      height: viewportHeight
    },
    positioning: {
      isDropdownBelowInput: dropdownRect.top > inputRect.bottom,
      distanceFromInput: dropdownRect.top - inputRect.bottom,
      isNearBottomOfScreen: dropdownRect.top > viewportHeight - 200,
      isOffScreen: dropdownRect.bottom > viewportHeight || dropdownRect.top < 0
    }
  });

  // Visual debugging
  if (dropdownRect.top > viewportHeight - 100) {
    console.warn('⚠️ Dropdown appears to be positioned at bottom of screen!');
    dropdown.style.border = '3px solid red';
    dropdown.style.boxShadow = '0 0 10px red';
  } else {
    console.log('✅ Dropdown positioning looks correct');
    dropdown.style.border = '2px solid green';
    dropdown.style.boxShadow = '0 0 10px green';
  }
};

export const enableAutocompleteDebugMode = () => {
  document.body.classList.add('debug-autocomplete');
  
  // Add debug styles
  const style = document.createElement('style');
  style.textContent = `
    .debug-autocomplete .autocomplete-dropdown {
      border: 3px solid red !important;
      box-shadow: 0 0 10px red !important;
    }
    
    .debug-autocomplete .autocomplete-container {
      border: 2px solid blue !important;
      background: rgba(0, 0, 255, 0.1) !important;
    }
    
    .debug-autocomplete input[role="combobox"] {
      border: 2px solid green !important;
      background: rgba(0, 255, 0, 0.1) !important;
    }
  `;
  document.head.appendChild(style);
  
  console.log('🐛 Autocomplete debug mode enabled');
};

export const disableAutocompleteDebugMode = () => {
  document.body.classList.remove('debug-autocomplete');
  console.log('🐛 Autocomplete debug mode disabled');
};

// Auto-debug when dropdown opens
export const setupAutocompleteDebugger = () => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        const dropdown = document.querySelector('.autocomplete-dropdown');
        if (dropdown && !dropdown.hasAttribute('data-debugged')) {
          dropdown.setAttribute('data-debugged', 'true');
          setTimeout(() => debugAutocompletePositioning(), 100);
        }
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  console.log('🔍 Autocomplete debugger setup complete');
};