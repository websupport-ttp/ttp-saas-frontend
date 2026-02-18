'use client';

import React from 'react';

interface Step {
  id: number;
  name: string;
  description: string;
}

interface VisaApplicationStepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export const VisaApplicationStepIndicator: React.FC<VisaApplicationStepIndicatorProps> = ({
  steps,
  currentStep
}) => {
  return (
    <nav aria-label="Progress">
      <ol className="flex items-center justify-between">
        {steps.map((step, stepIdx) => (
          <li key={step.id} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
            {/* Connector line */}
            {stepIdx !== steps.length - 1 && (
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="h-0.5 w-full bg-gray-200" />
              </div>
            )}
            
            <div className="relative flex items-center justify-center">
              {/* Step circle */}
              <div
                className={`
                  flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors
                  ${step.id < currentStep
                    ? 'bg-blue-600 border-blue-600'
                    : step.id === currentStep
                    ? 'border-blue-600 bg-white'
                    : 'border-gray-300 bg-white'
                  }
                `}
              >
                {step.id < currentStep ? (
                  <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span
                    className={`
                      text-sm font-medium
                      ${step.id === currentStep ? 'text-blue-600' : 'text-gray-500'}
                    `}
                  >
                    {step.id}
                  </span>
                )}
              </div>
              
              {/* Step info */}
              <div className="absolute top-12 left-1/2 transform -translate-x-1/2 text-center min-w-max">
                <div
                  className={`
                    text-sm font-medium
                    ${step.id <= currentStep ? 'text-blue-600' : 'text-gray-500'}
                  `}
                >
                  {step.name}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {step.description}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default VisaApplicationStepIndicator;