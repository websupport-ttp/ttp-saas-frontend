'use client';

import { useState } from 'react';
import DiscountsTab from './DiscountsTab';
import TaxesTab from './TaxesTab';
import ServiceChargesTab from './ServiceChargesTab';

export default function PricingManagement() {
  const [activeTab, setActiveTab] = useState<'discounts' | 'taxes' | 'charges'>('discounts');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900">Pricing Management</h2>
        <p className="mt-1 text-sm text-gray-600">
          Manage discounts, taxes, and service charges across all services
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-4 sm:space-x-8 px-4 sm:px-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('discounts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'discounts'
                  ? 'border-brand-red text-brand-red'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Discounts
            </button>
            <button
              onClick={() => setActiveTab('taxes')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'taxes'
                  ? 'border-brand-red text-brand-red'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Taxes
            </button>
            <button
              onClick={() => setActiveTab('charges')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'charges'
                  ? 'border-brand-red text-brand-red'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Service Charges
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'discounts' && <DiscountsTab />}
          {activeTab === 'taxes' && <TaxesTab />}
          {activeTab === 'charges' && <ServiceChargesTab />}
        </div>
      </div>
    </div>
  );
}
