import React, { useState } from 'react';
import { Building, LockIcon, CheckCircleIcon, AlertCircle } from 'lucide-react';
interface PlaidPaymentFormProps {
  amount: number;
  invoiceId: string;
  onPaymentComplete: (paymentInfo: any) => void;
  onCancel: () => void;
}
export function PlaidPaymentForm({
  amount,
  invoiceId,
  onPaymentComplete,
  onCancel
}: PlaidPaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  // Mock bank list
  const banks = [{
    id: 'chase',
    name: 'Chase',
    logo: 'https://logo.clearbit.com/chase.com'
  }, {
    id: 'bofa',
    name: 'Bank of America',
    logo: 'https://logo.clearbit.com/bankofamerica.com'
  }, {
    id: 'wells',
    name: 'Wells Fargo',
    logo: 'https://logo.clearbit.com/wellsfargo.com'
  }, {
    id: 'citi',
    name: 'Citibank',
    logo: 'https://logo.clearbit.com/citi.com'
  }, {
    id: 'usbank',
    name: 'US Bank',
    logo: 'https://logo.clearbit.com/usbank.com'
  }, {
    id: 'other',
    name: 'Other Banks',
    logo: ''
  }];
  const handleLaunchPlaid = () => {
    setIsProcessing(true);
    setPaymentError(null);
    // In a real app, this would launch the Plaid Link
    // For this demo, we'll simulate the process with a timeout
    setTimeout(() => {
      // Simulate successful connection
      setIsProcessing(false);
      setPaymentSuccess(true);
      // After a short delay, notify the parent component
      setTimeout(() => {
        onPaymentComplete({
          paymentMethod: 'Bank Transfer (ACH)',
          amount,
          invoiceId,
          transactionId: 'ach_' + Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString()
        });
      }, 1500);
    }, 2000);
  };
  if (paymentSuccess) {
    return <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircleIcon size={48} className="text-green-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Initiated!
        </h2>
        <p className="text-gray-600 mb-6">
          Your bank transfer of ${amount.toFixed(2)} for invoice #{invoiceId}{' '}
          has been initiated successfully.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Bank transfers typically take 1-3 business days to process. You'll
          receive a confirmation email when the payment is complete.
        </p>
      </div>;
  }
  return <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Bank Payment</h2>
        <div className="flex items-center text-sm text-gray-600">
          <LockIcon size={16} className="mr-1" />
          Secure Connection
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
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Plaid_logo.svg/1200px-Plaid_logo.svg.png" alt="Plaid" className="h-8" />
          </div>
        </div>
      </div>
      {paymentError && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-center">
          <AlertCircle size={20} className="text-red-600 mr-2 flex-shrink-0" />
          <span className="text-red-700">{paymentError}</span>
        </div>}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Select your bank
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {banks.map(bank => <div key={bank.id} className={`border rounded-md p-3 cursor-pointer flex items-center ${selectedBank === bank.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`} onClick={() => setSelectedBank(bank.id)}>
              {bank.logo ? <img src={bank.logo} alt={bank.name} className="h-6 w-6 mr-2 object-contain" /> : <Building size={20} className="text-gray-400 mr-2" />}
              <span className="text-sm font-medium text-gray-900">
                {bank.name}
              </span>
            </div>)}
        </div>
      </div>
      <div className="mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Building size={20} className="text-blue-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                How bank payments work
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>You'll be securely connected to your bank</li>
                  <li>No account or routing numbers are stored</li>
                  <li>Payments typically take 1-3 business days to process</li>
                  <li>Your information is encrypted and secure</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-end space-x-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none" disabled={isProcessing}>
          Cancel
        </button>
        <button onClick={handleLaunchPlaid} className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none flex items-center ${isProcessing ? 'opacity-75 cursor-not-allowed' : ''}`} disabled={isProcessing || !selectedBank}>
          {isProcessing ? <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Connecting...
            </> : <>Connect Bank Account</>}
        </button>
      </div>
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500 flex items-center justify-center">
          <LockIcon size={12} className="mr-1" />
          Your bank information is secured with bank-level encryption
        </p>
      </div>
    </div>;
}