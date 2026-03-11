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
  if (!clientId) {
    console.error('Google Client ID not configured');
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

  // Load Google Sign-In script
  const script = document.createElement('script');
  script.src = 'https://accounts.google.com/gsi/client';
  script.async = true;
  script.defer = true;
  
  script.onload = () => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response: any) => handleGoogleResponse(response, callback),
      });
      
      // Render button after initialization
      setTimeout(() => {
        renderGoogleButton('google-signin-button');
      }, 100);
    }
  };

  script.onerror = () => {
    console.error('Failed to load Google Sign-In script');
    const buttonContainer = document.getElementById('google-signin-button');
    if (buttonContainer) {
      buttonContainer.innerHTML = `
        <div class="text-center text-sm text-red-500 py-3">
          Failed to load Google Sign-In. Please try again later.
        </div>
      `;
    }
  };

  document.body.appendChild(script);
};

/**
 * Handle Google Sign-In response
 */
const handleGoogleResponse = (response: any, callback: (user: GoogleUser) => void) => {
  try {
    // Decode JWT token from Google
    const credential = response.credential;
    const payload = parseJwt(credential);

    const googleUser: GoogleUser = {
      googleId: payload.sub,
      email: payload.email,
      firstName: payload.given_name || '',
      lastName: payload.family_name || '',
      otherNames: payload.middle_name,
      picture: payload.picture,
    };

    callback(googleUser);
  } catch (error) {
    console.error('Error handling Google response:', error);
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
  if (typeof window === 'undefined' || !window.google) return;

  window.google.accounts.id.renderButton(
    document.getElementById(elementId),
    {
      theme: 'outline',
      size: 'large',
      width: '100%',
      text: 'continue_with',
    }
  );
};

/**
 * Trigger Google One Tap
 */
export const triggerGoogleOneTap = () => {
  if (typeof window === 'undefined' || !window.google) return;

  window.google.accounts.id.prompt();
};
