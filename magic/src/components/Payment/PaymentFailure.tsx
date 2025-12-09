import React from 'react';
import { AlertCircle, RefreshCw, ArrowLeft, HelpCircle } from 'lucide-react';
interface PaymentFailureProps {
  onRetry?: () => void;
  onBack?: () => void;
  onContactSupport?: () => void;
  errorDetails?: {
    errorCode: string;
    errorMessage: string;
  };
}
export function PaymentFailure({
  onRetry,
  onBack,
  onContactSupport,
  errorDetails = {
    errorCode: 'ERR_PAYMENT_DECLINED',
    errorMessage: 'Your payment was declined. Please check your card details and try again.'
  }
}: PaymentFailureProps) {
  return <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-red-500 px-6 py-12 text-center">
            <AlertCircle size={64} className="text-white mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white">Payment Failed</h1>
            <p className="text-red-100 mt-2">
              We were unable to process your payment
            </p>
          </div>
          <div className="p-8">
            <div className="mb-8 text-center">
              <p className="text-gray-600">
                We encountered an issue while processing your payment. This
                could be due to insufficient funds, incorrect card details, or a
                temporary issue with your payment provider.
              </p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Error Details
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Error Code</span>
                  <span className="font-medium text-gray-900">
                    {errorDetails.errorCode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Message</span>
                  <span className="font-medium text-gray-900">
                    {errorDetails.errorMessage}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <button onClick={onRetry} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md flex justify-center items-center">
                <RefreshCw size={18} className="mr-2" />
                Try Again
              </button>
              <button onClick={onBack} className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-md flex justify-center items-center">
                <ArrowLeft size={18} className="mr-2" />
                Back to Payment
              </button>
              <button onClick={onContactSupport} className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-md flex justify-center items-center">
                <HelpCircle size={18} className="mr-2" />
                Contact Support
              </button>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <h3 className="font-medium text-gray-900 mb-2">
            Common Reasons for Payment Failure
          </h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Insufficient funds in your account</li>
            <li>• Incorrect card details (number, expiry date, or CVC)</li>
            <li>• Card expired or blocked for online transactions</li>
            <li>• Transaction flagged by your bank's security system</li>
            <li>• Temporary issue with the payment gateway</li>
          </ul>
        </div>
      </div>
    </div>;
}