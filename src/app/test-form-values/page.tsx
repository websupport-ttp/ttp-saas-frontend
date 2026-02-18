'use client';

import { useState } from 'react';
import SearchForm from '@/components/ui/SearchForm';
import { ServiceType, SearchFormData } from '@/types';

export default function TestFormValues() {
    const [searchResults, setSearchResults] = useState<SearchFormData | null>(null);
    const [selectedService, setSelectedService] = useState<ServiceType>('flights');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitCount, setSubmitCount] = useState(0);

    const handleSearch = (data: SearchFormData) => {
        console.log('🚀 Form submitted with data:', data);
        setIsSubmitting(true);
        setSubmitCount(prev => prev + 1);
        
        // Add a small delay to show the loading state
        setTimeout(() => {
            setSearchResults(data);
            setIsSubmitting(false);
            
            // Scroll to results
            setTimeout(() => {
                const resultsElement = document.getElementById('results-section');
                if (resultsElement) {
                    resultsElement.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }, 500);
    };

    const services: { key: ServiceType; label: string }[] = [
        { key: 'flights', label: 'Flights' },
        { key: 'hotels', label: 'Hotels' },
        { key: 'car-hire', label: 'Car Hire' },
        { key: 'travel-insurance', label: 'Travel Insurance' },
        { key: 'visa-application', label: 'Visa Application' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                        Form Values Test - Autocomplete Fix Verification
                    </h1>

                    {/* Service Selector */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Select Service Type</h2>
                        <div className="flex flex-wrap gap-2">
                            {services.map((service) => (
                                <button
                                    key={service.key}
                                    onClick={() => setSelectedService(service.key)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedService === service.key
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    {service.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Search Form */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">
                            Test Form: {services.find(s => s.key === selectedService)?.label}
                        </h2>
                        <div className={`bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg transition-all duration-300 ${isSubmitting ? 'opacity-75 scale-[0.98]' : ''}`}>
                            {isSubmitting && (
                                <div className="mb-4 bg-white/20 backdrop-blur-sm rounded-lg p-3 text-white text-center">
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Processing form submission...</span>
                                    </div>
                                </div>
                            )}
                            <SearchForm
                                serviceType={selectedService}
                                onSearch={handleSearch}
                                className="w-full"
                                loading={isSubmitting}
                            />
                        </div>
                        
                        {/* Submission Counter */}
                        {submitCount > 0 && (
                            <div className="mt-4 text-center">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                    ✅ Form submitted {submitCount} time{submitCount !== 1 ? 's' : ''}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Results Display */}
                    {searchResults && (
                        <div id="results-section" className="mb-8 animate-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">Form Submission Results</h2>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                                <h3 className="text-lg font-medium text-green-800 mb-3">✅ Form Data Captured:</h3>
                                <pre className="bg-white p-4 rounded border text-sm overflow-x-auto">
                                    {JSON.stringify(searchResults, null, 2)}
                                </pre>

                                {/* Highlight autocomplete values */}
                                <div className="mt-4 space-y-2">
                                    <h4 className="font-medium text-green-800">Autocomplete Values:</h4>
                                    {Object.entries(searchResults).map(([key, value]) => {
                                        if (typeof value === 'string' && value.includes('(') && value.includes(')')) {
                                            return (
                                                <div key={key} className="bg-yellow-100 p-2 rounded">
                                                    <span className="font-medium">{key}:</span> {value}
                                                    <span className="text-green-600 ml-2">✓ Autocomplete selection detected</span>
                                                </div>
                                            );
                                        }
                                        return null;
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Instructions */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-blue-800 mb-3">Testing Instructions</h3>
                        <div className="space-y-2 text-blue-700">
                            <p><strong>1. Select a service type</strong> from the buttons above</p>
                            <p><strong>2. Fill out the form fields:</strong></p>
                            <ul className="ml-4 space-y-1">
                                <li>• For autocomplete fields: Type a few characters (e.g., "lon" for London)</li>
                                <li>• Click on an option from the dropdown</li>
                                <li>• Verify the selected value appears in the input field</li>
                            </ul>
                            <p><strong>3. Submit the form</strong> by clicking the search button</p>
                            <p><strong>4. Check the results</strong> to verify autocomplete values were captured</p>
                            <p><strong>5. Look for the green checkmarks</strong> next to autocomplete selections</p>
                        </div>
                    </div>

                    {/* Debug Console */}
                    <div className="mt-8 bg-gray-100 border border-gray-300 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Debug Console</h3>
                        <p className="text-gray-600 text-sm">
                            Open your browser's developer console (F12) to see detailed logs of:
                        </p>
                        <ul className="text-gray-600 text-sm mt-2 ml-4 space-y-1">
                            <li>• AutocompleteInput option selections</li>
                            <li>• SearchForm value changes</li>
                            <li>• Form submission data</li>
                        </ul>
                    </div>
                </div>
                
                {/* Floating Status Indicator */}
                {(isSubmitting || submitCount > 0) && (
                    <div className="fixed bottom-4 right-4 z-50">
                        {isSubmitting ? (
                            <div className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Submitting...</span>
                            </div>
                        ) : (
                            <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 animate-bounce">
                                <span>✅</span>
                                <span>Form Submitted!</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}