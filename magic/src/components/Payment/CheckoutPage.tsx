import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Lock, CheckCircle } from 'lucide-react';
interface CheckoutPageProps {
  onBack?: () => void;
  onSuccess?: () => void;
  onFailure?: () => void;
  selectedPlan?: {
    name: string;
    price: number;
    billingPeriod: 'monthly' | 'annual';
  };
}
export function CheckoutPage({
  onBack,
  onSuccess,
  onFailure,
  selectedPlan = {
    name: 'Personal Pro',
    price: 8,
    billingPeriod: 'monthly'
  }
}: CheckoutPageProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formatCardNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    // Add a space after every 4 digits
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    // Limit to 19 characters (16 digits + 3 spaces)
    return formatted.slice(0, 19);
  };
  const formatExpiryDate = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    // Format as MM/YY
    if (digits.length > 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
    }
    return digits;
  };
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpiryDate(formatExpiryDate(e.target.value));
  };
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!cardName.trim()) {
      newErrors.cardName = 'Name on card is required';
    }
    if (!cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else if (cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }
    if (!expiryDate.trim()) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (expiryDate.length < 5) {
      newErrors.expiryDate = 'Expiry date must be in MM/YY format';
    }
    if (!cvc.trim()) {
      newErrors.cvc = 'CVC is required';
    } else if (cvc.length < 3) {
      newErrors.cvc = 'CVC must be at least 3 digits';
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
    // Simulate payment processing with Stripe
    setTimeout(() => {
      setIsProcessing(false);
      // Randomly succeed or fail for demo purposes
      if (Math.random() > 0.2) {
        // 80% success rate
        onSuccess && onSuccess();
      } else {
        onFailure && onFailure();
      }
    }, 2000);
  };
  const calculateTotal = () => {
    let price = selectedPlan.price;
    if (selectedPlan.billingPeriod === 'annual') {
      price = Math.round(price * 12 * 0.8); // 20% discount for annual
    }
    return price;
  };
  return <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft size={20} className="mr-2" />
            Back to plans
          </button>
        </div>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">
              Complete Your Purchase
            </h1>
            <p className="text-blue-100">
              You're just one step away from upgrading your experience
            </p>
          </div>
          <div className="p-6">
            <div className="mb-8 border-b border-gray-200 pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Plan</span>
                <span className="font-medium text-gray-900">
                  {selectedPlan.name}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Billing Period</span>
                <span className="font-medium text-gray-900 capitalize">
                  {selectedPlan.billingPeriod}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Price</span>
                <span className="font-medium text-gray-900">
                  ${selectedPlan.price}/month
                  {selectedPlan.billingPeriod === 'annual' && <span className="text-green-600 ml-1">(20% off)</span>}
                </span>
              </div>
              <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
                <span className="text-gray-800 font-semibold">Total</span>
                <span className="font-bold text-gray-900">
                  ${calculateTotal()}
                  {selectedPlan.billingPeriod === 'monthly' ? '/month' : '/year'}
                </span>
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Payment Information
              </h2>
              <div className="mb-6">
                <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                  Name on Card
                </label>
                <input type="text" id="cardName" value={cardName} onChange={e => setCardName(e.target.value)} className={`w-full px-3 py-2 border ${errors.cardName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`} placeholder="John Smith" />
                {errors.cardName && <p className="mt-1 text-sm text-red-600">{errors.cardName}</p>}
              </div>
              <div className="mb-6">
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <div className="relative">
                  <input type="text" id="cardNumber" value={cardNumber} onChange={handleCardNumberChange} className={`w-full px-3 py-2 pl-10 border ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`} placeholder="4242 4242 4242 4242" maxLength={19} />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CreditCard size={16} className="text-gray-400" />
                  </div>
                </div>
                {errors.cardNumber && <p className="mt-1 text-sm text-red-600">
                    {errors.cardNumber}
                  </p>}
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input type="text" id="expiryDate" value={expiryDate} onChange={handleExpiryDateChange} className={`w-full px-3 py-2 border ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`} placeholder="MM/YY" maxLength={5} />
                  {errors.expiryDate && <p className="mt-1 text-sm text-red-600">
                      {errors.expiryDate}
                    </p>}
                </div>
                <div>
                  <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-1">
                    CVC
                  </label>
                  <input type="text" id="cvc" value={cvc} onChange={e => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))} className={`w-full px-3 py-2 border ${errors.cvc ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`} placeholder="123" maxLength={4} />
                  {errors.cvc && <p className="mt-1 text-sm text-red-600">{errors.cvc}</p>}
                </div>
              </div>
              <div className="flex items-center mb-6">
                <Lock size={16} className="text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">
                  Your payment information is secured with SSL encryption
                </span>
              </div>
              <button type="submit" disabled={isProcessing} className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md flex justify-center items-center ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}>
                {isProcessing ? <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </> : `Pay $${calculateTotal()}${selectedPlan.billingPeriod === 'monthly' ? '/month' : '/year'}`}
              </button>
            </form>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            By completing your purchase, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>;
}