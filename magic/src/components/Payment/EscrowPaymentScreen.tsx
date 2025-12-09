import React, { useEffect, useState } from 'react';
import { CreditCard, Building, Wallet, Shield, Info, Calendar, AlertCircle, ChevronDown, ChevronUp, Check } from 'lucide-react';
interface EscrowPaymentScreenProps {
  taskId: string;
  taskTitle: string;
  providerName: string;
  providerImage: string;
  amount: number;
  serviceFee: number;
  estimatedReleaseDate: Date;
  onPaymentComplete: () => void;
  onCancel: () => void;
}
interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'wallet';
  name: string;
  lastFour?: string;
  expiryDate?: string;
  isDefault: boolean;
}
export function EscrowPaymentScreen({
  taskId,
  taskTitle,
  providerName,
  providerImage,
  amount,
  serviceFee,
  estimatedReleaseDate,
  onPaymentComplete,
  onCancel
}: EscrowPaymentScreenProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<{
    [key: string]: string;
  }>({});
  // Mock payment methods
  const paymentMethods: PaymentMethod[] = [{
    id: 'pm1',
    type: 'card',
    name: 'Visa ending in 4242',
    lastFour: '4242',
    expiryDate: '12/24',
    isDefault: true
  }, {
    id: 'pm2',
    type: 'card',
    name: 'Mastercard ending in 5555',
    lastFour: '5555',
    expiryDate: '08/25',
    isDefault: false
  }, {
    id: 'pm3',
    type: 'bank',
    name: 'Bank of America Checking ****6789',
    isDefault: false
  }, {
    id: 'pm4',
    type: 'wallet',
    name: 'PayPal - user@example.com',
    isDefault: false
  }];
  // Set default payment method on component mount
  useEffect(() => {
    const defaultMethod = paymentMethods.find(method => method.isDefault);
    if (defaultMethod) {
      setSelectedPaymentMethod(defaultMethod.id);
    }
  }, []);
  const totalAmount = amount + serviceFee;
  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
    if (errors.paymentMethod) {
      setErrors({
        ...errors,
        paymentMethod: ''
      });
    }
  };
  const validateForm = () => {
    const newErrors: {
      [key: string]: string;
    } = {};
    if (!selectedPaymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method';
    }
    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentComplete();
    }, 2000);
  };
  return <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-blue-600 px-6 py-4 text-white">
        <h2 className="text-xl font-bold">Secure Payment</h2>
        <p className="text-blue-100 mt-1">
          Your payment will be held in escrow until the task is completed
        </p>
      </div>
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Task and Provider Details
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <div className="flex-1">
                <p className="text-sm text-gray-500">Task</p>
                <p className="font-medium text-gray-900">{taskTitle}</p>
                <p className="text-sm text-gray-500 mt-2">Provider</p>
                <div className="flex items-center mt-1">
                  <img src={providerImage} alt={providerName} className="h-8 w-8 rounded-full object-cover mr-2" />
                  <p className="font-medium text-gray-900">{providerName}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Estimated Release Date</p>
                <div className="flex items-center justify-end mt-1">
                  <Calendar size={16} className="text-gray-400 mr-1" />
                  <p className="font-medium text-gray-900">
                    {estimatedReleaseDate.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Payment Details
          </h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50" onClick={() => setShowPaymentDetails(!showPaymentDetails)}>
              <div className="font-medium text-gray-900">Payment Summary</div>
              <button className="text-gray-500">
                {showPaymentDetails ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
            </div>
            {showPaymentDetails && <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Task Amount</span>
                    <span className="text-gray-900">${amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-gray-600">Service Fee</span>
                      <button className="ml-1 text-gray-400 hover:text-gray-600">
                        <Info size={16} />
                      </button>
                    </div>
                    <span className="text-gray-900">
                      ${serviceFee.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between font-medium">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">
                        ${totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>}
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Payment Method
            </h3>
            <div className="space-y-3">
              {paymentMethods.map(method => <div key={method.id} className={`border rounded-lg p-4 cursor-pointer ${selectedPaymentMethod === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`} onClick={() => handlePaymentMethodSelect(method.id)}>
                  <div className="flex items-center">
                    <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${selectedPaymentMethod === method.id ? 'border-blue-500' : 'border-gray-300'}`}>
                      {selectedPaymentMethod === method.id && <div className="h-3 w-3 rounded-full bg-blue-500"></div>}
                    </div>
                    <div className="ml-3 flex items-center">
                      {method.type === 'card' && <CreditCard size={20} className="text-gray-500 mr-2" />}
                      {method.type === 'bank' && <Building size={20} className="text-gray-500 mr-2" />}
                      {method.type === 'wallet' && <Wallet size={20} className="text-gray-500 mr-2" />}
                      <div>
                        <div className="font-medium text-gray-900">
                          {method.name}
                        </div>
                        {method.type === 'card' && method.expiryDate && <div className="text-sm text-gray-500">
                            Expires {method.expiryDate}
                          </div>}
                      </div>
                    </div>
                    {method.isDefault && <span className="ml-auto text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        Default
                      </span>}
                  </div>
                </div>)}
              <button type="button" className="border border-dashed border-gray-300 rounded-lg p-4 text-center w-full hover:bg-gray-50">
                <span className="text-blue-600 font-medium">
                  + Add Payment Method
                </span>
              </button>
            </div>
            {errors.paymentMethod && <p className="mt-2 text-red-600 text-sm flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {errors.paymentMethod}
              </p>}
          </div>
          <div className="mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex">
                <Shield size={20} className="text-blue-600 flex-shrink-0" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Secure Escrow Payment
                  </h3>
                  <p className="mt-1 text-sm text-blue-700">
                    Your payment will be held securely in escrow and only
                    released to the provider when you confirm the task has been
                    completed satisfactorily.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-6">
            <label className="flex items-start">
              <input type="checkbox" checked={agreedToTerms} onChange={() => {
              setAgreedToTerms(!agreedToTerms);
              if (errors.terms) {
                setErrors({
                  ...errors,
                  terms: ''
                });
              }
            }} className="h-4 w-4 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
              <span className="ml-2 text-sm text-gray-700">
                I agree to the{' '}
                <a href="#" className="text-blue-600 hover:text-blue-800">
                  Terms of Service
                </a>
                ,{' '}
                <a href="#" className="text-blue-600 hover:text-blue-800">
                  Privacy Policy
                </a>
                , and{' '}
                <a href="#" className="text-blue-600 hover:text-blue-800">
                  Escrow Agreement
                </a>
                .
              </span>
            </label>
            {errors.terms && <p className="mt-1 text-red-600 text-sm flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {errors.terms}
              </p>}
          </div>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50" disabled={isProcessing}>
              Cancel
            </button>
            <button type="submit" className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center ${isProcessing ? 'opacity-75 cursor-not-allowed' : ''}`} disabled={isProcessing}>
              {isProcessing ? <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </> : <>Confirm and Pay ${totalAmount.toFixed(2)}</>}
            </button>
          </div>
        </form>
      </div>
    </div>;
}