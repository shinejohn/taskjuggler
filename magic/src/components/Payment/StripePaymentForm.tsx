import React, { useState } from 'react';
import { CreditCardIcon, LockIcon, CheckCircleIcon } from 'lucide-react';
interface StripePaymentFormProps {
  amount: number;
  invoiceId: string;
  onPaymentComplete: (paymentInfo: any) => void;
  onCancel: () => void;
}
export function StripePaymentForm({
  amount,
  invoiceId,
  onPaymentComplete,
  onCancel
}: StripePaymentFormProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const formatCardNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    // Add space after every 4 digits
    let formatted = '';
    for (let i = 0; i < digits.length; i += 4) {
      formatted += digits.slice(i, i + 4) + ' ';
    }
    return formatted.trim();
  };
  const formatExpiryDate = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    // Format as MM/YY
    if (digits.length > 2) {
      return digits.slice(0, 2) + '/' + digits.slice(2, 4);
    } else {
      return digits;
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setPaymentError(null);
    try {
      // In a real app, this would be a call to your payment processing API
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      // For demo purposes, we'll simulate a successful payment
      // In a real app, you would handle actual payment processing here
      setPaymentSuccess(true);
      // After a short delay, notify the parent component
      setTimeout(() => {
        onPaymentComplete({
          paymentMethod: 'Credit Card',
          amount,
          invoiceId,
          transactionId: 'txn_' + Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString()
        });
      }, 1500);
    } catch (error) {
      setPaymentError('Payment processing failed. Please try again.');
      setIsProcessing(false);
    }
  };
  if (paymentSuccess) {
    return <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircleIcon size={48} className="text-green-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Successful!
        </h2>
        <p className="text-gray-600 mb-6">
          Your payment of ${amount.toFixed(2)} for invoice #{invoiceId} has been
          processed successfully.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          A receipt has been sent to your email address.
        </p>
      </div>;
  }
  return <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Payment Details</h2>
        <div className="flex items-center text-sm text-gray-600">
          <LockIcon size={16} className="mr-1" />
          Secure Payment
        </div>
      </div>
      <div className="mb-6 p-4 bg-gray-50 rounded-md">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Invoice #{invoiceId}</p>
            <p className="text-lg font-bold text-gray-900">
              ${amount.toFixed(2)}
            </p>
          </div>
          <div className="flex space-x-2">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-8" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-8" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/1200px-American_Express_logo_%282018%29.svg.png" alt="American Express" className="h-8" />
          </div>
        </div>
      </div>
      {paymentError && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {paymentError}
        </div>}
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="card-name" className="block text-sm font-medium text-gray-700 mb-1">
              Name on Card
            </label>
            <input id="card-name" type="text" value={nameOnCard} onChange={e => setNameOnCard(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="John Smith" required />
          </div>
          <div>
            <label htmlFor="card-number" className="block text-sm font-medium text-gray-700 mb-1">
              Card Number
            </label>
            <div className="relative">
              <input id="card-number" type="text" value={cardNumber} onChange={e => setCardNumber(formatCardNumber(e.target.value))} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="4242 4242 4242 4242" maxLength={19} required />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CreditCardIcon size={16} className="text-gray-400" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiry-date" className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <input id="expiry-date" type="text" value={expiryDate} onChange={e => setExpiryDate(formatExpiryDate(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="MM/YY" maxLength={5} required />
            </div>
            <div>
              <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-1">
                CVC
              </label>
              <input id="cvc" type="text" value={cvc} onChange={e => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="123" maxLength={3} required />
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-end space-x-3">
          <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none" disabled={isProcessing}>
            Cancel
          </button>
          <button type="submit" className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none flex items-center ${isProcessing ? 'opacity-75 cursor-not-allowed' : ''}`} disabled={isProcessing}>
            {isProcessing ? <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </> : <>Pay ${amount.toFixed(2)}</>}
          </button>
        </div>
      </form>
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500 flex items-center justify-center">
          <LockIcon size={12} className="mr-1" />
          Your payment information is secured with SSL encryption
        </p>
      </div>
    </div>;
}