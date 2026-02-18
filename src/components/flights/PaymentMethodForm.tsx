'use client'

import { useState, useEffect } from 'react'

interface PaymentData {
  paymentMethod: 'paystack' | 'google' | 'apple' | 'paypal'
  nameOnCard: string
  cardNumber: string
  expirationDate: string
  ccv: string
  saveCard: boolean
  email: string
  password: string
}

interface PaymentMethodFormProps {
  onDataChange?: (data: PaymentData) => void
}

export default function PaymentMethodForm({
  onDataChange
}: PaymentMethodFormProps) {
  const [formData, setFormData] = useState<PaymentData>({
    paymentMethod: 'paystack',
    nameOnCard: '',
    cardNumber: '',
    expirationDate: '',
    ccv: '',
    saveCard: false,
    email: '',
    password: ''
  })

  // Trigger onDataChange with initial data when component mounts
  useEffect(() => {
    if (onDataChange) {
      onDataChange(formData)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleInputChange = (field: keyof PaymentData, value: string | boolean) => {
    const updatedData = { ...formData, [field]: value }
    setFormData(updatedData)
    onDataChange?.(updatedData)
  }

  const getPaymentIcon = (methodId: string, isSelected: boolean) => {
    const color = isSelected ? '#ffffff' : '#27273F';
    
    switch (methodId) {
      case 'paystack':
        return (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="4" width="14" height="10" rx="2" stroke={color} strokeWidth="1.2" fill="none"/>
            <path d="M2 7h14" stroke={color} strokeWidth="1.2"/>
            <circle cx="13" cy="10" r="1" fill={color}/>
            <path d="M4 10h6" stroke={color} strokeWidth="0.8"/>
            <path d="M4 12h4" stroke={color} strokeWidth="0.8"/>
          </svg>
        );
      case 'google':
        return (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            {isSelected ? (
              // White version for selected state
              <>
                <path d="M16.1171 9.13643C16.1171 8.53899 16.0687 8.10302 15.9638 7.65091H9.1416V10.3474H13.146C13.0653 11.0176 12.6294 12.0268 11.6605 12.7049L13.9534 14.4811C15.3259 13.2136 16.1171 11.3486 16.1171 9.13643Z" fill="#ffffff"/>
                <path d="M9.14154 16.2412C11.1034 16.2412 12.7504 15.5953 13.9534 14.4811L11.6605 12.7049C11.0469 13.1328 10.2234 13.4315 9.14154 13.4315C7.22005 13.4315 5.58921 12.164 5.00785 10.4121L2.65039 12.2367C3.84526 14.6103 6.29963 16.2412 9.14154 16.2412Z" fill="#ffffff"/>
                <path d="M5.00848 10.4121C4.85509 9.95996 4.76631 9.47551 4.76631 8.97498C4.76631 8.47438 4.85509 7.98999 5.00041 7.53788L2.65102 5.71323C2.15855 6.69822 1.87598 7.80431 1.87598 8.97498C1.87598 10.1456 2.15855 11.2517 2.65102 12.2367L5.00848 10.4121Z" fill="#ffffff"/>
                <path d="M9.14154 4.51835C10.506 4.51835 11.4263 5.10771 11.9511 5.60023L14.0018 3.59798C12.7424 2.42732 11.1034 1.70877 9.14154 1.70877C6.29963 1.70877 3.84526 3.33962 2.65039 5.71322L4.99978 7.53787C5.58921 5.78591 7.22005 4.51835 9.14154 4.51835Z" fill="#ffffff"/>
              </>
            ) : (
              // Colored version for unselected state
              <>
                <path d="M16.1171 9.13643C16.1171 8.53899 16.0687 8.10302 15.9638 7.65091H9.1416V10.3474H13.146C13.0653 11.0176 12.6294 12.0268 11.6605 12.7049L13.9534 14.4811C15.3259 13.2136 16.1171 11.3486 16.1171 9.13643Z" fill="#4285F4"/>
                <path d="M9.14154 16.2412C11.1034 16.2412 12.7504 15.5953 13.9534 14.4811L11.6605 12.7049C11.0469 13.1328 10.2234 13.4315 9.14154 13.4315C7.22005 13.4315 5.58921 12.164 5.00785 10.4121L2.65039 12.2367C3.84526 14.6103 6.29963 16.2412 9.14154 16.2412Z" fill="#34A853"/>
                <path d="M5.00848 10.4121C4.85509 9.95996 4.76631 9.47551 4.76631 8.97498C4.76631 8.47438 4.85509 7.98999 5.00041 7.53788L2.65102 5.71323C2.15855 6.69822 1.87598 7.80431 1.87598 8.97498C1.87598 10.1456 2.15855 11.2517 2.65102 12.2367L5.00848 10.4121Z" fill="#FBBC05"/>
                <path d="M9.14154 4.51835C10.506 4.51835 11.4263 5.10771 11.9511 5.60023L14.0018 3.59798C12.7424 2.42732 11.1034 1.70877 9.14154 1.70877C6.29963 1.70877 3.84526 3.33962 2.65039 5.71322L4.99978 7.53787C5.58921 5.78591 7.22005 4.51835 9.14154 4.51835Z" fill="#EB4335"/>
              </>
            )}
          </svg>
        );
      case 'apple':
        return (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.99463 16.0305C5.70717 15.8381 5.45191 15.6024 5.23859 15.3302C5.00582 15.0482 4.79007 14.7516 4.59195 14.4446C4.12641 13.7625 3.76237 13.0165 3.51015 12.2302C3.20628 11.3155 3.05859 10.4397 3.05859 9.58283C3.05859 8.62667 3.26523 7.79231 3.66756 7.09194C3.96536 6.54382 4.40901 6.08523 4.94383 5.76306C5.46042 5.44028 6.06209 5.26366 6.66984 5.25148C6.88255 5.25148 7.1135 5.28193 7.3566 5.34284C7.53284 5.39156 7.74556 5.47073 8.00689 5.56817C8.34115 5.69607 8.52348 5.77524 8.58425 5.79351C8.77873 5.86659 8.94282 5.89704 9.07045 5.89704C9.16769 5.89704 9.30747 5.86659 9.46245 5.81787C9.55057 5.78742 9.7177 5.73261 9.95472 5.62908C10.1893 5.54381 10.3753 5.47073 10.523 5.41592C10.7478 5.34893 10.9654 5.28802 11.1611 5.25757C11.3981 5.22103 11.6333 5.20885 11.8588 5.22712C12.2903 5.25757 12.6853 5.34893 13.0378 5.48291C13.6577 5.73261 14.1579 6.12238 14.5311 6.67659C14.3731 6.77403 14.2272 6.88731 14.0905 7.01155C13.7945 7.27343 13.5435 7.58403 13.3429 7.92813C13.0816 8.39707 12.9479 8.92692 12.9515 9.46286C12.9607 10.1224 13.1278 10.7022 13.462 11.2047C13.6972 11.5701 14.0115 11.8831 14.3943 12.1401C14.5827 12.268 14.748 12.3563 14.9048 12.4142C14.8319 12.6425 14.7517 12.8648 14.6587 13.0841C14.4478 13.5756 14.1968 14.0463 13.899 14.4909C13.6365 14.8746 13.4298 15.1608 13.273 15.3496C13.0287 15.642 12.7929 15.8612 12.5559 16.0177C12.2946 16.1913 11.9876 16.2833 11.6734 16.2833C11.4607 16.2924 11.248 16.265 11.045 16.2059C10.8688 16.1481 10.695 16.0829 10.5248 16.0092C10.3467 15.9276 10.1626 15.8582 9.97478 15.8021C9.74384 15.7412 9.50681 15.712 9.26736 15.7126C9.02426 15.7126 8.78724 15.7431 8.56237 15.8009C8.37397 15.8545 8.19164 15.9203 8.01114 15.9989C7.75589 16.1054 7.58876 16.1755 7.49152 16.2059C7.29461 16.2644 7.09283 16.2997 6.88984 16.3125C6.57382 16.3125 6.27966 16.2211 5.98673 16.0384L5.99463 16.0305ZM10.1601 4.78802C9.74687 4.99509 9.35427 5.08278 8.96105 5.05355C8.90028 4.66013 8.96105 4.25574 9.12515 3.81298C9.27101 3.43539 9.46549 3.09434 9.7329 2.78983C10.0125 2.47314 10.3467 2.21126 10.7235 2.02246C11.1246 1.81539 11.5075 1.70577 11.8722 1.6875C11.9208 2.10163 11.8722 2.50968 11.7202 2.94817C11.5817 3.33794 11.375 3.69727 11.1125 4.02005C10.8481 4.33674 10.5199 4.59861 10.1486 4.78741L10.1601 4.78802Z" fill={color}/>
          </svg>
        );
      case 'paypal':
        return (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            {isSelected ? (
              <path d="M9.78613 2C11.1613 2.00005 12.2078 2.28949 12.9248 2.86816C13.5501 3.36305 13.9025 4.05228 13.9824 4.93555C14.2454 5.05851 14.4858 5.20858 14.7012 5.38867H14.7002C15.4534 6.00777 15.8037 6.89441 15.8037 7.96777C15.8037 9.23905 15.4065 10.2924 14.5664 11.0615C13.7262 11.8307 12.5475 12.1767 11.1104 12.1768H8.8418L8.33984 15.3311C8.26261 15.8165 7.84411 16.1738 7.35254 16.1738H5.58594C4.97118 16.1738 4.5014 15.6247 4.59766 15.0176L4.75977 14H2.58887C2.28041 13.9999 2.04569 13.7233 2.0957 13.4189L3.90625 2.41895C3.946 2.17739 4.15461 2 4.39941 2H9.78613ZM13.9502 6.0752C13.818 7.03288 13.418 7.80831 12.748 8.40039C11.9135 9.13779 10.7028 9.50676 9.11621 9.50684H6.48633L5.58594 15.1738H7.35254L7.85449 12.0195C7.93192 11.5342 8.35033 11.1768 8.8418 11.1768H11.1104C12.3983 11.1767 13.2986 10.8671 13.8916 10.3242C14.4847 9.78121 14.8037 9.01788 14.8037 7.96777C14.8037 7.12488 14.5394 6.54934 14.0635 6.15918L14.0596 6.15625C14.0252 6.12747 13.9873 6.10232 13.9502 6.0752Z" fill="#ffffff"/>
            ) : (
              <path d="M9.78613 2C11.1613 2.00005 12.2078 2.28949 12.9248 2.86816C13.5501 3.36305 13.9025 4.05228 13.9824 4.93555C14.2454 5.05851 14.4858 5.20858 14.7012 5.38867H14.7002C15.4534 6.00777 15.8037 6.89441 15.8037 7.96777C15.8037 9.23905 15.4065 10.2924 14.5664 11.0615C13.7262 11.8307 12.5475 12.1767 11.1104 12.1768H8.8418L8.33984 15.3311C8.26261 15.8165 7.84411 16.1738 7.35254 16.1738H5.58594C4.97118 16.1738 4.5014 15.6247 4.59766 15.0176L4.75977 14H2.58887C2.28041 13.9999 2.04569 13.7233 2.0957 13.4189L3.90625 2.41895C3.946 2.17739 4.15461 2 4.39941 2H9.78613ZM13.9502 6.0752C13.818 7.03288 13.418 7.80831 12.748 8.40039C11.9135 9.13779 10.7028 9.50676 9.11621 9.50684H6.48633L5.58594 15.1738H7.35254L7.85449 12.0195C7.93192 11.5342 8.35033 11.1768 8.8418 11.1768H11.1104C12.3983 11.1767 13.2986 10.8671 13.8916 10.3242C14.4847 9.78121 14.8037 9.01788 14.8037 7.96777C14.8037 7.12488 14.5394 6.54934 14.0635 6.15918L14.0596 6.15625C14.0252 6.12747 13.9873 6.10232 13.9502 6.0752Z" fill="#0070ba"/>
            )}
          </svg>
        );
      default:
        return null;
    }
  };

  const paymentMethods = [
    { id: 'paystack', label: 'Paystack', active: true },
    { id: 'google', label: 'Google Pay', active: false },
    { id: 'apple', label: 'Apple pay', active: false },
    { id: 'paypal', label: 'Paypal', active: false }
  ]

  return (
    <div className="flex flex-col gap-8 w-full max-w-[686px]">
      {/* Payment Method Buttons */}
      <div className="flex flex-col gap-10">
        <div className="flex border border-gray-800 rounded overflow-hidden">
          {paymentMethods.map((method, index) => (
            <button
              key={method.id}
              onClick={() => handleInputChange('paymentMethod', method.id as any)}
              className={`flex items-center gap-1 px-3 py-3 h-12 whitespace-nowrap ${
                formData.paymentMethod === method.id
                  ? 'bg-gray-800 text-white'
                  : 'bg-white text-gray-800 hover:bg-gray-50'
              } ${index === 0 ? 'rounded-l' : ''} ${
                index === paymentMethods.length - 1 ? 'rounded-r' : ''
              } transition-colors`}
            >
              <div className="w-[18px] h-[18px] flex items-center justify-center flex-shrink-0">
                {getPaymentIcon(method.id, formData.paymentMethod === method.id)}
              </div>
              <span className="text-lg font-normal">{method.label}</span>
            </button>
          ))}
        </div>

        {/* Payment Method Forms */}
        {formData.paymentMethod === 'paystack' && (
          <div className="flex justify-center">
            <div className="max-w-2xl">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Secure Payment with Paystack
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      You will be redirected to Paystack's secure payment gateway where you can choose from multiple payment options including card payments, bank transfers, and mobile money. Your payment information is encrypted and secure.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Google Pay Form */}
        {formData.paymentMethod === 'google' && (
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-6 w-[480px]">
              <div className="flex flex-col gap-6 w-[303px]">
                <h3 className="text-gray-600 text-lg font-semibold">
                  Google Pay details
                </h3>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1 w-full">
                  <div className="border border-gray-300 rounded bg-white px-3 py-2 h-12 flex items-end">
                    <input
                      type="email"
                      placeholder="Google account email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full text-lg text-gray-600 placeholder-gray-600 border-none outline-none bg-transparent"
                    />
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    You will be redirected to Google Pay to complete your payment securely.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Apple Pay Form */}
        {formData.paymentMethod === 'apple' && (
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-6 w-[480px]">
              <div className="flex flex-col gap-6 w-[303px]">
                <h3 className="text-gray-600 text-lg font-semibold">
                  Apple Pay details
                </h3>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1 w-full">
                  <div className="border border-gray-300 rounded bg-white px-3 py-2 h-12 flex items-end">
                    <input
                      type="email"
                      placeholder="Apple ID email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full text-lg text-gray-600 placeholder-gray-600 border-none outline-none bg-transparent"
                    />
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-gray-800 text-sm">
                    Use Touch ID or Face ID to complete your payment with Apple Pay.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PayPal Form */}
        {formData.paymentMethod === 'paypal' && (
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-6 w-[480px]">
              <div className="flex flex-col gap-6 w-[303px]">
                <h3 className="text-gray-600 text-lg font-semibold">
                  PayPal details
                </h3>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1 w-full">
                  <div className="border border-gray-300 rounded bg-white px-3 py-2 h-12 flex items-end">
                    <input
                      type="email"
                      placeholder="PayPal email address"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full text-lg text-gray-600 placeholder-gray-600 border-none outline-none bg-transparent"
                    />
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    You will be redirected to PayPal to log in and complete your payment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}