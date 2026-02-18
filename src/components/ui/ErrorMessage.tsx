'use client';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  variant?: 'inline' | 'card' | 'banner';
  className?: string;
}

export default function ErrorMessage({
  title = 'Error',
  message,
  onRetry,
  onDismiss,
  variant = 'inline',
  className = '',
}: ErrorMessageProps) {
  const baseClasses = 'flex items-start space-x-3';
  
  const variantClasses = {
    inline: 'text-red-600 bg-red-50 border border-red-200 rounded-lg p-4',
    card: 'bg-white border border-red-200 rounded-2xl shadow-lg p-6',
    banner: 'bg-red-50 border-l-4 border-red-400 p-4',
  };

  const iconClasses = {
    inline: 'w-5 h-5 text-red-500 mt-0.5 flex-shrink-0',
    card: 'w-6 h-6 text-red-500 mt-0.5 flex-shrink-0',
    banner: 'w-5 h-5 text-red-400 mt-0.5 flex-shrink-0',
  };

  const textClasses = {
    inline: 'text-red-800',
    card: 'text-gray-900',
    banner: 'text-red-800',
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} role="alert">
      {/* Error Icon */}
      <svg
        className={iconClasses[variant]}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {variant === 'card' && (
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        )}
        
        <p className={`text-sm ${textClasses[variant]} leading-relaxed`}>
          {message}
        </p>

        {/* Actions */}
        {(onRetry || onDismiss) && (
          <div className="flex items-center space-x-3 mt-4">
            {onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-500 transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Try Again
              </button>
            )}
            
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-sm font-medium text-gray-500 hover:text-gray-400 transition-colors duration-200"
              >
                Dismiss
              </button>
            )}
          </div>
        )}
      </div>

      {/* Dismiss button for banner variant */}
      {variant === 'banner' && onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 text-red-400 hover:text-red-500 transition-colors duration-200"
          aria-label="Dismiss error"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}