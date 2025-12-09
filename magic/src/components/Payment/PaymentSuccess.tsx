import React from 'react';
import { CheckCircle, Download, Calendar, Home } from 'lucide-react';
interface PaymentSuccessProps {
  onViewDashboard?: () => void;
  onViewInvoice?: () => void;
  purchaseDetails?: {
    planName: string;
    amount: number;
    billingPeriod: 'monthly' | 'annual';
    nextBillingDate: string;
    transactionId: string;
  };
}
export function PaymentSuccess({
  onViewDashboard,
  onViewInvoice,
  purchaseDetails = {
    planName: 'Personal Pro',
    amount: 8,
    billingPeriod: 'monthly',
    nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    transactionId: 'TXN' + Math.floor(Math.random() * 1000000)
  }
}: PaymentSuccessProps) {
  return <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-green-500 px-6 py-12 text-center">
            <CheckCircle size={64} className="text-white mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white">
              Payment Successful!
            </h1>
            <p className="text-green-100 mt-2">Thank you for your purchase</p>
          </div>
          <div className="p-8">
            <div className="mb-8 text-center">
              <p className="text-gray-600">
                Your subscription to{' '}
                <span className="font-semibold text-gray-900">
                  {purchaseDetails.planName}
                </span>{' '}
                has been activated successfully.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Purchase Details
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan</span>
                  <span className="font-medium text-gray-900">
                    {purchaseDetails.planName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-medium text-gray-900">
                    ${purchaseDetails.amount}/
                    {purchaseDetails.billingPeriod === 'monthly' ? 'month' : 'year'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Billing Period</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {purchaseDetails.billingPeriod}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Next Billing Date</span>
                  <span className="font-medium text-gray-900">
                    {purchaseDetails.nextBillingDate}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-gray-600">Transaction ID</span>
                  <span className="font-medium text-gray-900">
                    {purchaseDetails.transactionId}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={onViewDashboard} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md flex justify-center items-center">
                <Home size={18} className="mr-2" />
                Go to Dashboard
              </button>
              <button onClick={onViewInvoice} className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-md flex justify-center items-center">
                <Download size={18} className="mr-2" />
                Download Invoice
              </button>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Calendar size={18} className="text-gray-500 mr-2" />
            <span className="text-gray-600">
              Your subscription will automatically renew on{' '}
              {purchaseDetails.nextBillingDate}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            You can manage your subscription anytime from your account settings.
          </p>
        </div>
      </div>
    </div>;
}