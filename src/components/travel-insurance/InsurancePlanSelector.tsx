'use client';

import React, { useState, useEffect } from 'react';
import { InsurancePlan, InsurancePlanSelectorProps } from '@/types/travel-insurance';
import { Button } from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { formatCurrency } from '@/lib/utils';
import { insuranceService } from '@/lib/services/insurance-service';

export function InsurancePlanSelector({
  plans: initialPlans,
  selectedPlan,
  tripDetails,
  onPlanSelect,
  onCompare
}: InsurancePlanSelectorProps) {
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [plans, setPlans] = useState<InsurancePlan[]>(initialPlans || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load coverage types and plans from API if not provided
  useEffect(() => {
    const loadPlansFromAPI = async () => {
      if (!initialPlans || initialPlans.length === 0) {
        setIsLoading(true);
        setError(null);
        
        try {
          const coverageTypes = await insuranceService.getCoverageTypes();
          
          // Transform API coverage types to InsurancePlan format
          const apiPlans: InsurancePlan[] = coverageTypes.map((coverage: any) => ({
            id: coverage.id,
            name: coverage.name,
            type: coverage.type,
            description: coverage.description,
            coverage: coverage.coverage,
            basePrice: coverage.basePrice,
            ageMultipliers: coverage.ageMultipliers || {
              under30: 1.0,
              age30to60: 1.2,
              over60: 1.8
            },
            tripTypeMultipliers: coverage.tripTypeMultipliers || {
              leisure: 1.0,
              business: 1.1,
              adventure: 1.5,
              study: 0.9
            },
            features: coverage.features || [],
            exclusions: coverage.exclusions || [],
            popular: coverage.popular || false
          }));
          
          setPlans(apiPlans);
        } catch (error) {
          console.error('Failed to load insurance plans:', error);
          setError('Failed to load insurance plans. Please try again.');
          // Keep initial plans as fallback
          setPlans(initialPlans || []);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadPlansFromAPI();
  }, [initialPlans]);

  const handleCompareToggle = (planId: string) => {
    if (selectedForComparison.includes(planId)) {
      setSelectedForComparison(prev => prev.filter(id => id !== planId));
    } else if (selectedForComparison.length < 3) {
      setSelectedForComparison(prev => [...prev, planId]);
    }
  };

  const calculatePremium = (plan: InsurancePlan) => {
    if (!tripDetails) return plan.basePrice;
    
    const days = Math.ceil(
      (tripDetails.returnDate.getTime() - tripDetails.departureDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    const baseAmount = plan.basePrice * days * tripDetails.numberOfTravelers;
    const tripMultiplier = plan.tripTypeMultipliers[tripDetails.tripType];
    
    return Math.round(baseAmount * tripMultiplier);
  };

  const getCoverageHighlights = (plan: InsurancePlan) => {
    return [
      `Medical: ${formatCurrency(plan.coverage.medicalExpenses)}`,
      `Trip Cancellation: ${formatCurrency(plan.coverage.tripCancellation)}`,
      `Baggage: ${formatCurrency(plan.coverage.baggage)}`,
      `Emergency Evacuation: ${formatCurrency(plan.coverage.emergencyEvacuation)}`
    ];
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="insurance-plan-selector">
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading insurance plans...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="insurance-plan-selector">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-red-800 mb-1">Unable to Load Plans</h4>
              <p className="text-sm text-red-700 mb-3">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (compareMode && selectedForComparison.length > 0) {
    const comparePlans = plans.filter(plan => selectedForComparison.includes(plan.id));
    
    return (
      <div className="insurance-plan-comparison">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Compare Plans</h2>
          <Button
            variant="outline"
            onClick={() => {
              setCompareMode(false);
              setSelectedForComparison([]);
            }}
            className="text-sm"
          >
            Back to Plans
          </Button>
        </div>

        {/* Mobile-optimized comparison */}
        <div className="space-y-4 md:hidden">
          {comparePlans.map((plan) => (
            <div key={plan.id} className="border rounded-lg p-4 bg-white">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg">{plan.name}</h3>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-600">
                    {formatCurrency(calculatePremium(plan))}
                  </div>
                  <div className="text-sm text-gray-500">total premium</div>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="text-sm">
                  <span className="font-medium">Medical:</span> {formatCurrency(plan.coverage.medicalExpenses)}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Trip Cancellation:</span> {formatCurrency(plan.coverage.tripCancellation)}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Baggage:</span> {formatCurrency(plan.coverage.baggage)}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Emergency Evacuation:</span> {formatCurrency(plan.coverage.emergencyEvacuation)}
                </div>
              </div>

              <Button
                onClick={() => onPlanSelect(plan.id)}
                className="w-full"
                variant={selectedPlan === plan.id ? "primary" : "outline"}
              >
                {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
              </Button>
            </div>
          ))}
        </div>

        {/* Desktop comparison table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium">Coverage</th>
                {comparePlans.map((plan) => (
                  <th key={plan.id} className="text-center p-4 font-medium min-w-[200px]">
                    <div>{plan.name}</div>
                    <div className="text-2xl font-bold text-red-600 mt-2">
                      {formatCurrency(calculatePremium(plan))}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-4 font-medium">Medical Expenses</td>
                {comparePlans.map((plan) => (
                  <td key={plan.id} className="text-center p-4">
                    {formatCurrency(plan.coverage.medicalExpenses)}
                  </td>
                ))}
              </tr>
              <tr className="border-b">
                <td className="p-4 font-medium">Trip Cancellation</td>
                {comparePlans.map((plan) => (
                  <td key={plan.id} className="text-center p-4">
                    {formatCurrency(plan.coverage.tripCancellation)}
                  </td>
                ))}
              </tr>
              <tr className="border-b">
                <td className="p-4 font-medium">Baggage Coverage</td>
                {comparePlans.map((plan) => (
                  <td key={plan.id} className="text-center p-4">
                    {formatCurrency(plan.coverage.baggage)}
                  </td>
                ))}
              </tr>
              <tr className="border-b">
                <td className="p-4 font-medium">Emergency Evacuation</td>
                {comparePlans.map((plan) => (
                  <td key={plan.id} className="text-center p-4">
                    {formatCurrency(plan.coverage.emergencyEvacuation)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4"></td>
                {comparePlans.map((plan) => (
                  <td key={plan.id} className="text-center p-4">
                    <Button
                      onClick={() => onPlanSelect(plan.id)}
                      variant={selectedPlan === plan.id ? "primary" : "outline"}
                      className="w-full"
                    >
                      {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                    </Button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="insurance-plan-selector">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Choose Your Coverage</h2>
        {selectedForComparison.length > 0 && (
          <Button
            variant="outline"
            onClick={() => {
              setCompareMode(true);
              onCompare(selectedForComparison);
            }}
            className="text-sm"
          >
            Compare ({selectedForComparison.length})
          </Button>
        )}
      </div>

      {/* Mobile-optimized plan cards */}
      <div className="space-y-4 md:grid md:grid-cols-3 md:gap-6 md:space-y-0">
        {plans.map((plan) => {
          const premium = calculatePremium(plan);
          const highlights = getCoverageHighlights(plan);
          const isSelected = selectedPlan === plan.id;
          const isInComparison = selectedForComparison.includes(plan.id);

          return (
            <div
              key={plan.id}
              className={`
                relative border rounded-lg p-4 bg-white transition-all duration-200
                ${isSelected ? 'border-red-500 ring-2 ring-red-100' : 'border-gray-200 hover:border-gray-300'}
                ${plan.popular ? 'ring-2 ring-blue-100 border-blue-500' : ''}
              `}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Most Popular
                </div>
              )}

              {/* Plan header - mobile optimized */}
              <div className="mb-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <div className="flex items-center space-x-2">
                    {plans.length > 1 && (
                      <button
                        onClick={() => handleCompareToggle(plan.id)}
                        className={`
                          w-6 h-6 border-2 rounded flex items-center justify-center text-xs
                          ${isInComparison ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300'}
                          ${selectedForComparison.length >= 3 && !isInComparison ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                        disabled={selectedForComparison.length >= 3 && !isInComparison}
                      >
                        {isInComparison ? '✓' : '+'}
                      </button>
                    )}
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{plan.description}</p>
                
                <div className="text-center py-3 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-red-600">
                    {formatCurrency(premium)}
                  </div>
                  <div className="text-sm text-gray-500">
                    total premium
                    {tripDetails && (
                      <span className="block">
                        for {tripDetails.numberOfTravelers} traveler{tripDetails.numberOfTravelers > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Coverage highlights - mobile optimized */}
              <div className="mb-4">
                <h4 className="font-medium text-sm mb-2 text-gray-700">Key Coverage:</h4>
                <div className="space-y-1">
                  {highlights.map((highlight, index) => (
                    <div key={index} className="text-sm text-gray-600 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2 flex-shrink-0"></span>
                      {highlight}
                    </div>
                  ))}
                </div>
              </div>

              {/* Features - collapsible on mobile */}
              <div className="mb-4">
                <details className="md:open">
                  <summary className="font-medium text-sm mb-2 text-gray-700 cursor-pointer md:cursor-default">
                    Additional Benefits {plan.features.length > 0 && `(${plan.features.length})`}
                  </summary>
                  <div className="space-y-1 mt-2">
                    {plan.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="text-xs text-gray-600 flex items-center">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 flex-shrink-0"></span>
                        {feature}
                      </div>
                    ))}
                    {plan.features.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{plan.features.length - 3} more benefits
                      </div>
                    )}
                  </div>
                </details>
              </div>

              {/* Action button */}
              <Button
                onClick={() => onPlanSelect(plan.id)}
                variant={isSelected ? "primary" : "outline"}
                className="w-full touch-target"
              >
                {isSelected ? 'Selected' : 'Select Plan'}
              </Button>
            </div>
          );
        })}
      </div>

      {/* Compare instructions for mobile */}
      {plans.length > 1 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg md:hidden">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Tip:</span> Tap the + button on plans to compare up to 3 options side by side.
          </p>
        </div>
      )}
    </div>
  );
}