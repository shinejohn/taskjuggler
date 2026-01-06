import React, { useState } from 'react';
import { CreditCard, Download, CheckCircle, AlertCircle, Phone, MessageSquare, Clock, TrendingUp, Users } from 'lucide-react';
import { cn } from '../../lib/utils';
export function Billing() {
  const [addOns, setAddOns] = useState({
    recording: true,
    analytics: false,
    support: false
  });
  const toggleAddOn = (key: string) => {
    setAddOns(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };
  return <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-[#1B4F72]">
          Billing
        </h1>
        <p className="text-slate-500 mt-1">
          Manage your subscription and payment methods
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Plan Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-[#1B4F72] to-[#2563EB] p-6 text-white">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-sm opacity-90 mb-1">Current Plan</div>
                  <h2 className="text-2xl font-bold">3 Coordinators Active</h2>
                </div>
                <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-medium flex items-center gap-1">
                  <CheckCircle size={12} />
                  Active
                </span>
              </div>
              <div className="text-3xl font-bold mb-1">
                $157
                <span className="text-lg font-normal opacity-90">/month</span>
              </div>
              <div className="text-sm opacity-90">
                Next charge: Jan 15, 2026
              </div>
            </div>

            <div className="p-6">
              <h3 className="font-semibold text-slate-900 mb-4">
                Coordinator Breakdown
              </h3>
              <div className="space-y-3 mb-6">
                {[{
                name: 'Sally',
                role: 'Receptionist',
                price: 49
              }, {
                name: 'Ed',
                role: 'Appointment Scheduler',
                price: 59
              }, {
                name: 'Marcus',
                role: 'Appointment Confirmer',
                price: 49
              }].map((coord, i) => <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-[#1B4F72] flex items-center justify-center font-bold text-xs">
                        {coord.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">
                          {coord.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {coord.role}
                        </div>
                      </div>
                    </div>
                    <div className="font-semibold text-slate-900">
                      ${coord.price}/mo
                    </div>
                  </div>)}
              </div>

              <div className="flex gap-3">
                <button className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors">
                  Manage Coordinators
                </button>
                <button className="flex-1 py-2.5 border border-red-200 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors">
                  Cancel Subscription
                </button>
              </div>
            </div>
          </div>

          {/* Add-ons Section */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-[#1B4F72] mb-4">Add-ons</h3>
            <div className="space-y-4">
              {[{
              key: 'recording',
              name: 'Call Recording + Transcription',
              price: '$0.05/min',
              desc: 'Record and transcribe all calls automatically'
            }, {
              key: 'analytics',
              name: 'Advanced Analytics',
              price: '$19/mo',
              desc: 'Detailed insights and custom reports'
            }, {
              key: 'support',
              name: 'Priority Support',
              price: '$29/mo',
              desc: '24/7 priority support with dedicated account manager'
            }].map(addon => <div key={addon.key} className="flex justify-between items-start p-4 border border-slate-200 rounded-lg hover:border-[#1B4F72]/30 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-slate-900">
                        {addon.name}
                      </h4>
                      <span className="text-sm font-medium text-[#1B4F72]">
                        {addon.price}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">{addon.desc}</p>
                  </div>
                  <button onClick={() => toggleAddOn(addon.key)} className={cn('relative inline-flex h-6 w-11 items-center rounded-full transition-colors ml-4 flex-shrink-0', addOns[addon.key as keyof typeof addOns] ? 'bg-[#1B4F72]' : 'bg-slate-200')}>
                    <span className={cn('inline-block h-4 w-4 transform rounded-full bg-white transition-transform', addOns[addon.key as keyof typeof addOns] ? 'translate-x-6' : 'translate-x-1')} />
                  </button>
                </div>)}
            </div>
          </div>

          {/* Invoice History */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-[#1B4F72]">
                Invoice History
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Description</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[{
                  date: 'Dec 15, 2025',
                  desc: 'Monthly subscription - 3 Coordinators',
                  amount: 157,
                  status: 'paid'
                }, {
                  date: 'Nov 15, 2025',
                  desc: 'Monthly subscription - 2 Coordinators',
                  amount: 108,
                  status: 'paid'
                }, {
                  date: 'Oct 15, 2025',
                  desc: 'Monthly subscription - 2 Coordinators',
                  amount: 108,
                  status: 'paid'
                }, {
                  date: 'Sep 15, 2025',
                  desc: 'Monthly subscription - 1 Coordinator',
                  amount: 49,
                  status: 'paid'
                }].map((invoice, i) => <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-slate-500">
                        {invoice.date}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {invoice.desc}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        ${invoice.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                          <CheckCircle size={12} />
                          Paid
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-[#1B4F72] hover:underline font-medium flex items-center gap-1 ml-auto">
                          <Download size={14} />
                          Download
                        </button>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
            <div className="p-4 text-center border-t border-slate-100">
              <button className="text-sm font-medium text-[#1B4F72] hover:underline">
                Load more invoices
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Payment Method */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-[#1B4F72] mb-4">
              Payment Method
            </h3>
            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100 mb-4">
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <CreditCard size={20} className="text-slate-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-slate-900">
                  Visa ending in 4242
                </div>
                <div className="text-sm text-slate-500">Expires 12/2027</div>
              </div>
            </div>
            <div className="space-y-2">
              <button className="w-full py-2 text-sm font-medium text-[#1B4F72] hover:bg-blue-50 rounded-lg transition-colors">
                Update Payment Method
              </button>
              <button className="w-full py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                Add Backup Method
              </button>
            </div>
          </div>

          {/* Usage This Period */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-[#1B4F72] mb-4">
              Usage This Period
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-slate-400" />
                    <span className="font-medium text-slate-700">Calls</span>
                  </div>
                  <span className="text-slate-500">847 / Unlimited ✓</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={14} className="text-slate-400" />
                    <span className="font-medium text-slate-700">SMS</span>
                  </div>
                  <span className="text-slate-500">234 / 500</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#1B4F72] rounded-full" style={{
                  width: '47%'
                }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-slate-400" />
                    <span className="font-medium text-slate-700">
                      Recordings
                    </span>
                  </div>
                  <span className="text-slate-500">23h / 50h</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{
                  width: '46%'
                }} />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <button className="text-sm font-medium text-[#1B4F72] hover:underline">
                  Upgrade for more →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
}