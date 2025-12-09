import React, { useState } from 'react';
import { CreditCard, Building, Check } from 'lucide-react';
interface PaymentMethodSelectorProps {
  onSelectMethod: (method: 'stripe' | 'plaid') => void;
}
export function PaymentMethodSelector({
  onSelectMethod
}: PaymentMethodSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<'stripe' | 'plaid'>('stripe');
  const handleMethodSelect = (method: 'stripe' | 'plaid') => {
    setSelectedMethod(method);
    onSelectMethod(method);
  };
  return <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Select Payment Method
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`border rounded-lg p-4 cursor-pointer ${selectedMethod === 'stripe' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`} onClick={() => handleMethodSelect('stripe')}>
          <div className="flex items-center">
            <div className={`w-5 h-5 rounded-full border ${selectedMethod === 'stripe' ? 'border-blue-500' : 'border-gray-300'} flex items-center justify-center mr-3`}>
              {selectedMethod === 'stripe' && <Check size={12} className="text-blue-500" />}
            </div>
            <div className="flex items-center">
              <CreditCard size={20} className="mr-3 text-gray-600" />
              <div>
                <h4 className="font-medium text-gray-900">
                  Credit or Debit Card
                </h4>
                <p className="text-sm text-gray-600">
                  Pay with Visa, Mastercard, Amex, or other cards
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-6" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/1200px-American_Express_logo_%282018%29.svg.png" alt="American Express" className="h-6" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Discover_card_logo.svg/2560px-Discover_card_logo.svg.png" alt="Discover" className="h-6" />
          </div>
        </div>
        <div className={`border rounded-lg p-4 cursor-pointer ${selectedMethod === 'plaid' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`} onClick={() => handleMethodSelect('plaid')}>
          <div className="flex items-center">
            <div className={`w-5 h-5 rounded-full border ${selectedMethod === 'plaid' ? 'border-blue-500' : 'border-gray-300'} flex items-center justify-center mr-3`}>
              {selectedMethod === 'plaid' && <Check size={12} className="text-blue-500" />}
            </div>
            <div className="flex items-center">
              <Building size={20} className="mr-3 text-gray-600" />
              <div>
                <h4 className="font-medium text-gray-900">
                  Bank Transfer (ACH)
                </h4>
                <p className="text-sm text-gray-600">
                  Pay directly from your bank account
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Plaid_logo.svg/1200px-Plaid_logo.svg.png" alt="Plaid" className="h-6" />
            <span className="text-sm text-gray-500 ml-2">Powered by Plaid</span>
          </div>
        </div>
      </div>
    </div>;
}