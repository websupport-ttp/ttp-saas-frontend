/**
 * Google OAuth Authentication Helper
 * Handles Google Sign-In integration
 */

declare global {
  interface Window {
    google?: any;
  }
}

export interface GoogleUser {
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
  otherNames?: string;
  picture?: string;
}

/**
 * Initialize Google Sign-In
 */
export const initializeGoogleSignIn = (callback: (user: GoogleUser) => void) => {
  if (typeof window === 'undefined') return;

  // Check if Google Client ID is configured
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  console.log('Google Client ID from env:', clientId ? 'Present' : 'Missing');
  
  if (!clientId) {
    console.error('Google Client ID not configured in environment variables');
    // Show fallback message
    const buttonContainer = document.getElementById('google-signin-button');
    if (buttonContainer) {
      buttonContainer.innerHTML = `
        <div class="text-center text-sm text-gray-500 py-3">
          Google Sign-In integration coming soon!
        </div>
      `;
    }
    return;
  }

  // Check if script is already loaded
  if (window.google) {
    console.log('Google SDK already loaded, initializing...');
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response: any) => handleGoogleResponse(response, callback),
    });
    
    setTimeout(() => {
      renderGoogleButton('google-signin-button');
    }, 100);
    return;
  }

  // Load Google Sign-In script
  const script = document.createElement('script');
  script.src = 'https://accounts.google.com/gsi/client';
  script.async = true;
  script.defer = true;
  
  script.onload = () => {
    console.log('Google SDK script loaded successfully');
    if (window.google) {
      console.log('Initializing Google Sign-In with client ID:', clientId.substring(0, 10) + '...');
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response: any) => handleGoogleResponse(response, callback),
      });
      
      // Render button after initialization
      setTimeout(() => {
        console.log('Rendering Google Sign-In button');
        renderGoogleButton('google-signin-button');
      }, 100);
    } else {
      console.error('window.google not available after script load');
    }
  };

  script.onerror = () => {
    console.error('Failed to load Google Sign-In script from accounts.google.com');
    const buttonContainer = document.getElementById('google-signin-button');
    if (buttonContainer) {
      buttonContainer.innerHTML = `
        <div class="text-center text-sm text-red-500 py-3">
          Failed to load Google Sign-In. Please try again later.
        </div>
      `;
    }
  };

  console.log('Appending Google SDK script to document');
  document.body.appendChild(script);
};

/**
 * Handle Google Sign-In response
 */
const handleGoogleResponse = (response: any, callback: (user: GoogleUser) => void) => {
  try {
    console.log('Google Sign-In response received');
    
    // Decode JWT token from Google
    const credential = response.credential;
    if (!credential) {
      console.error('No credential in Google response');
      throw new Error('No credential received from Google');
    }
    
    const payload = parseJwt(credential);
    console.log('Google JWT decoded successfully');

    const googleUser: GoogleUser = {
      googleId: payload.sub,
      email: payload.email,
      firstName: payload.given_name || '',
      lastName: payload.family_name || '',
      otherNames: payload.middle_name,
      picture: payload.picture,
    };

    console.log('Google user data extracted:', { email: googleUser.email, name: googleUser.firstName });
    callback(googleUser);
  } catch (error) {
    console.error('Error handling Google response:', error);
    throw error;
  }
};

/**
 * Parse JWT token
 */
const parseJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return {};
  }
};

/**
 * Render Google Sign-In button
 */
export const renderGoogleButton = (elementId: string) => {
  if (typeof window === 'undefined') {
    console.log('Window is undefined, skipping button render');
    return;
  }
  
  if (!window.google) {
    console.error('window.google is not available');
    return;
  }

  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found`);
    return;
  }

  try {
    console.log('Rendering Google Sign-In button into element:', elementId);
    window.google.accounts.id.renderButton(
      element,
      {
        theme: 'outline',
        size: 'large',
        width: '100%',
        text: 'continue_with',
      }
    );
    console.log('Google Sign-In button rendered successfully');
  } catch (error) {
    console.error('Error rendering Google Sign-In button:', error);
  }
};

/**
 * Trigger Google One Tap
 */
export const triggerGoogleOneTap = () => {
  if (typeof window === 'undefined' || !window.google) return;

  window.google.accounts.id.prompt();
};
