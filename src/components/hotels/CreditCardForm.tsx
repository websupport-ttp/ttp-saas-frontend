'use client';

import { useState } from 'react';
import { PaymentDetails } from '@/types/hotels';

interface CreditCardFormProps {
  onDataChange: (data: PaymentDetails) => void;
}

export default function CreditCardForm({ onDataChange }: CreditCardFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    expirationDate: '',
    ccv: '',
    createAccount: false,
    email: '',
    password: ''
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    
    // Format card number with spaces
    if (field === 'number') {
      const formatted = (value as string).replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      updatedData.number = formatted;
      setFormData(updatedData);
    }
    
    // Format expiration date
    if (field === 'expirationDate') {
      const formatted = (value as string).replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
      updatedData.expirationDate = formatted;
      setFormData(updatedData);
    }

    // Update parent component
    onDataChange({
      method: 'paystack',
      cardProcessor: 'paystack',
      cardDetails: {
        name: updatedData.name,
        number: updatedData.number.replace(/\s/g, ''),
        expirationDate: updatedData.expirationDate,
        ccv: updatedData.ccv
      },
      createAccount: updatedData.createAccount
    });
  };

  return (
    <div className="flex flex-col gap-6 sm:gap-10 w-full max-w-[480px]">
      {/* Credit Card Details */}
      <div className="flex flex-col gap-6">
        <h3 className="text-gray-600 text-lg font-semibold">
          Paystack payment details
        </h3>

        <div className="flex flex-col gap-6">
          {/* Name on Card */}
          <div className="flex flex-col gap-1 w-full">
            <div className="border border-gray-300 rounded bg-white px-3 py-2 h-12 flex items-end">
              <input
                type="text"
                placeholder="Name on card"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full text-lg text-gray-600 placeholder-gray-600 border-none outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Card Number */}
          <div className="flex flex-col gap-1 w-full">
            <div className="border border-gray-300 rounded bg-white px-3 py-2 h-12 flex items-end">
              <input
                type="text"
                placeholder="Card number"
                value={formData.number}
                onChange={(e) => handleInputChange('number', e.target.value)}
                maxLength={19}
                className="w-full text-lg text-gray-600 placeholder-gray-600 border-none outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Expiration and CCV */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <div className="flex flex-col gap-1 w-full sm:w-[240px]">
              <div className="border border-gray-300 rounded bg-white px-3 py-2 h-12 flex items-end">
                <input
                  type="text"
                  placeholder="Expiration date"
                  value={formData.expirationDate}
                  onChange={(e) => handleInputChange('expirationDate', e.target.value)}
                  maxLength={5}
                  className="w-full text-lg text-gray-600 placeholder-gray-600 border-none outline-none bg-transparent"
                />
              </div>
              <div className="px-1 py-0.5">
                <span className="text-gray-600 text-xs">MM/YY</span>
              </div>
            </div>

            <div className="flex flex-col gap-1 flex-1">
              <div className="border border-gray-300 rounded bg-white px-3 py-2 h-12 flex items-end relative">
                <input
                  type="text"
                  placeholder="CCV"
                  value={formData.ccv}
                  onChange={(e) => handleInputChange('ccv', e.target.value)}
                  maxLength={4}
                  className="w-full text-lg text-gray-600 placeholder-gray-600 border-none outline-none bg-transparent pr-10"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center">
                  <div className="w-[18px] h-[18px] border-2 border-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 text-xs font-bold">i</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Account Section */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h4 className="text-gray-600 text-lg font-semibold">
            Create an account
          </h4>
          <p className="text-gray-600 text-base leading-relaxed">
            The Travelplace is free to use as a guest, but if you create an account today, you can save and view hotels, manage your trips, earn rewards, and more.
          </p>
        </div>
        
        <div className="flex items-center gap-2 py-1">
          <div className="relative">
            <input
              type="checkbox"
              id="createAccount"
              checked={formData.createAccount}
              onChange={(e) => handleInputChange('createAccount', e.target.checked)}
              className="w-4 h-4 border border-gray-600 rounded-sm bg-white checked:bg-red-600 checked:border-red-600"
            />
          </div>
          <label htmlFor="createAccount" className="text-gray-600 text-base">
            Save card and create account for later
          </label>
        </div>

        {formData.createAccount && (
          <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col gap-1 w-full">
              <div className="border border-gray-300 rounded bg-white px-3 py-2 h-12 flex items-end">
                <input
                  type="email"
                  placeholder="Email address or phone number"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full text-lg text-gray-600 placeholder-gray-600 border-none outline-none bg-transparent"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1 w-full">
              <div className="border border-gray-300 rounded bg-white px-3 py-2 h-12 flex items-end">
                <input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full text-lg text-gray-600 placeholder-gray-600 border-none outline-none bg-transparent"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}