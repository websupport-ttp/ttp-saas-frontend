'use client';

import { ServiceFeature } from '@/types';

interface FeatureCardProps {
  feature: ServiceFeature;
  className?: string;
  showBenefits?: boolean;
  onClick?: (feature: ServiceFeature) => void;
}

// Icon mapping for service features
const iconMap: Record<string, React.ReactNode> = {
  'flight-ticket': (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  ),
  'hotel-services': (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  'services-tag': (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  ),
  'flight': (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  ),
  'hotel': (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  'car': (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 6H4L2 4m0 0h2m0 0V2m13 14V9a1 1 0 00-1-1H9.5l3.5-2 4 4.5V9a1 1 0 011-1h2a1 1 0 011 1v8a1 1 0 01-1 1h-1m-6 0a1 1 0 001 1h2a1 1 0 001-1m-6 0V9" />
    </svg>
  ),
  'visa': (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  'insurance': (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  'tour': (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

export default function FeatureCard({
  feature,
  className = '',
  showBenefits = false,
  onClick,
}: FeatureCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(feature);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && onClick) {
      e.preventDefault();
      onClick(feature);
    }
  };

  const getIcon = () => {
    return iconMap[feature.icon] || iconMap['services-tag'];
  };

  return (
    <div
      className={`group relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : -1}
      role={onClick ? 'button' : undefined}
      aria-label={onClick ? `Learn more about ${feature.title}` : undefined}
    >
      {/* Icon */}
      <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-brand-red/10 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 group-hover:bg-brand-red/20 transition-colors duration-300">
        <div className="text-brand-red group-hover:text-brand-red-dark transition-colors duration-300 scale-75 sm:scale-90 lg:scale-100">
          {getIcon()}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-brand-red transition-colors duration-200 line-clamp-2">
          {feature.title}
        </h3>

        <p className="text-sm sm:text-base text-gray-600 leading-relaxed line-clamp-3 sm:line-clamp-none">
          {feature.description}
        </p>

        {/* Benefits */}
        {showBenefits && feature.benefits.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Key Benefits
            </h4>
            <ul className="space-y-1">
              {feature.benefits.slice(0, 3).map((benefit, index) => (
                <li key={index} className="flex items-start text-sm text-gray-600">
                  <svg 
                    className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                  <span>{benefit}</span>
                </li>
              ))}
              {feature.benefits.length > 3 && (
                <li className="text-sm text-gray-500 ml-6">
                  +{feature.benefits.length - 3} more benefits
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Call to action */}
        {onClick && (
          <div className="flex items-center text-brand-red group-hover:text-brand-red-dark transition-colors duration-200 pt-2">
            <span className="text-sm font-medium mr-2">Learn More</span>
            <svg 
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 5l7 7-7 7" 
              />
            </svg>
          </div>
        )}
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}