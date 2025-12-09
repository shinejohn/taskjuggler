import React, { useState } from 'react';
import { CreditCard, Calendar, Clock, CheckCircle, AlertCircle, Download, Edit, RefreshCw, XCircle } from 'lucide-react';
interface SubscriptionData {
  plan: string;
  status: 'active' | 'canceled' | 'past_due';
  billingPeriod: 'monthly' | 'annual';
  price: number;
  nextBillingDate: string;
  paymentMethod: {
    type: string;
    last4: string;
    brand: string;
    expiryDate: string;
  };
  invoices: {
    id: string;
    date: string;
    amount: number;
    status: 'paid' | 'pending' | 'failed';
  }[];
}
interface SubscriptionSectionProps {
  subscriptionData: SubscriptionData;
}
export function SubscriptionSection({
  subscriptionData
}: SubscriptionSectionProps) {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showUpdatePaymentModal, setShowUpdatePaymentModal] = useState(false);
  const [showChangePlanModal, setShowChangePlanModal] = useState(false);
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle size={12} className="mr-1" />
            Active
          </span>;
      case 'canceled':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <XCircle size={12} className="mr-1" />
            Canceled
          </span>;
      case 'past_due':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertCircle size={12} className="mr-1" />
            Past Due
          </span>;
      default:
        return null;
    }
  };
  const getInvoiceStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Paid
          </span>;
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pending
          </span>;
      case 'failed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Failed
          </span>;
      default:
        return null;
    }
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  return <div className="p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Subscription & Billing
      </h2>
      <div className="space-y-8">
        {/* Current Plan */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Current Plan
              </h3>
              <div className="flex items-center mt-1">
                {getStatusBadge(subscriptionData.status)}
                <span className="ml-2 text-gray-600">
                  {subscriptionData.status === 'active' ? `Renews on ${subscriptionData.nextBillingDate}` : subscriptionData.status === 'canceled' ? 'Your subscription will end on the next billing date' : 'Please update your payment method'}
                </span>
              </div>
            </div>
            <button onClick={() => setShowChangePlanModal(true)} className="text-blue-600 hover:text-blue-800 font-medium">
              Change Plan
            </button>
          </div>
          <div className="bg-white rounded-md p-4 border border-gray-200 mb-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-gray-900">
                  {subscriptionData.plan}
                </h4>
                <p className="text-gray-600 capitalize">
                  {subscriptionData.billingPeriod} billing
                </p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-gray-900">
                  ${subscriptionData.price}
                  <span className="text-sm font-normal text-gray-600">
                    /
                    {subscriptionData.billingPeriod === 'monthly' ? 'mo' : 'yr'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            {subscriptionData.status === 'active' ? <button onClick={() => setShowCancelModal(true)} className="flex-1 border border-red-300 text-red-600 hover:bg-red-50 font-medium py-2 px-4 rounded-md flex justify-center items-center">
                Cancel Subscription
              </button> : subscriptionData.status === 'canceled' ? <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md flex justify-center items-center">
                <RefreshCw size={18} className="mr-2" />
                Reactivate Subscription
              </button> : null}
          </div>
        </div>
        {/* Payment Method */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Payment Method
            </h3>
            <button onClick={() => setShowUpdatePaymentModal(true)} className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
              <Edit size={16} className="mr-1" />
              Update
            </button>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-gray-100 rounded-md p-2 mr-4">
                <CreditCard size={24} className="text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {subscriptionData.paymentMethod.brand} ••••{' '}
                  {subscriptionData.paymentMethod.last4}
                </p>
                <p className="text-sm text-gray-600">
                  Expires {subscriptionData.paymentMethod.expiryDate}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Billing History */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Billing History
          </h3>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Download
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {subscriptionData.invoices.map(invoice => <tr key={invoice.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {invoice.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(invoice.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${invoice.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getInvoiceStatusBadge(invoice.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Download size={18} />
                        </button>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* Cancel Subscription Modal */}
      {showCancelModal && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Cancel Subscription
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel your subscription? You'll lose
              access to all premium features at the end of your current billing
              period on{' '}
              <span className="font-medium text-gray-900">
                {subscriptionData.nextBillingDate}
              </span>
              .
            </p>
            <div className="space-y-3">
              <button className="w-full border border-red-300 bg-red-50 text-red-600 hover:bg-red-100 font-medium py-2 px-4 rounded-md" onClick={() => setShowCancelModal(false)}>
                Yes, Cancel My Subscription
              </button>
              <button className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium py-2 px-4 rounded-md" onClick={() => setShowCancelModal(false)}>
                No, Keep My Subscription
              </button>
            </div>
          </div>
        </div>}
      {/* Update Payment Modal */}
      {showUpdatePaymentModal && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Update Payment Method
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input type="text" id="expiryDate" placeholder="MM/YY" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-1">
                    CVC
                  </label>
                  <input type="text" id="cvc" placeholder="123" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                  Name on Card
                </label>
                <input type="text" id="cardName" placeholder="John Smith" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md" onClick={() => setShowUpdatePaymentModal(false)}>
                Update Payment Method
              </button>
              <button className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium py-2 px-4 rounded-md" onClick={() => setShowUpdatePaymentModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>}
      {/* Change Plan Modal */}
      {showChangePlanModal && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Change Subscription Plan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className={`border rounded-lg p-4 ${subscriptionData.plan === 'Personal Free' ? 'bg-blue-50 border-blue-300' : 'border-gray-200 hover:border-blue-300 cursor-pointer'}`}>
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-semibold text-gray-900">Personal Free</h4>
                  {subscriptionData.plan === 'Personal Free' && <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      Current
                    </span>}
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-4">$0</p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start">
                    <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">
                      5 open personal tasks maximum
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">
                      Unlimited marketplace task requests
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">
                      Basic task organization
                    </span>
                  </li>
                </ul>
              </div>
              <div className={`border rounded-lg p-4 ${subscriptionData.plan === 'Personal Pro' ? 'bg-blue-50 border-blue-300' : 'border-gray-200 hover:border-blue-300 cursor-pointer'}`}>
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-semibold text-gray-900">Personal Pro</h4>
                  {subscriptionData.plan === 'Personal Pro' && <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      Current
                    </span>}
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-4">
                  $8
                  <span className="text-sm font-normal text-gray-600">
                    /
                    {subscriptionData.billingPeriod === 'monthly' ? 'mo' : 'yr'}
                  </span>
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start">
                    <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">
                      Unlimited open personal tasks
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">
                      Full AI task optimization
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">
                      Priority marketplace matching
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-medium text-gray-900">Billing Period</h4>
              <div className="flex items-center space-x-3">
                <span className={`text-sm font-medium ${subscriptionData.billingPeriod === 'monthly' ? 'text-blue-600' : 'text-gray-500'}`}>
                  Monthly
                </span>
                <button className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${subscriptionData.billingPeriod === 'annual' ? 'bg-blue-600' : 'bg-gray-300'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${subscriptionData.billingPeriod === 'annual' ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
                <span className={`text-sm font-medium ${subscriptionData.billingPeriod === 'annual' ? 'text-blue-600' : 'text-gray-500'}`}>
                  Annual{' '}
                  <span className="text-green-500 font-semibold">Save 20%</span>
                </span>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium text-gray-900">
                  Prorated amount for current billing period
                </span>
                <span className="font-bold text-gray-900">$4.50</span>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Your plan change will take effect immediately. You'll be charged
                or credited the prorated amount for the remainder of your
                current billing period.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md" onClick={() => setShowChangePlanModal(false)}>
                Confirm Plan Change
              </button>
              <button className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium py-2 px-4 rounded-md" onClick={() => setShowChangePlanModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>}
    </div>;
}