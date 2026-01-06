import React, { useState } from 'react';
import { Plus, MoreVertical, Phone, CheckCircle, AlertCircle, Copy } from 'lucide-react';
import { cn } from '../../lib/utils';
export function PhoneNumbers() {
  const [activeCarrier, setActiveCarrier] = useState('verizon');
  const phoneNumbers = [{
    number: '(555) 123-4567',
    assignedTo: 'Sally (Receptionist)',
    status: 'active',
    type: 'Local',
    cost: '$2.00/mo',
    minutes: '234 / unlimited'
  }, {
    number: '(555) 234-5678',
    assignedTo: 'Ed (Scheduler)',
    status: 'active',
    type: 'Local',
    cost: '$2.00/mo',
    minutes: '156 / unlimited'
  }, {
    number: '(555) 345-6789',
    assignedTo: 'Unassigned',
    status: 'available',
    type: 'Toll-Free',
    cost: '$5.00/mo',
    minutes: '0 / unlimited'
  }];
  return <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-heading font-bold text-[#1B4F72]">
            Phone Numbers
          </h1>
          <p className="text-slate-500 mt-1">
            Manage your Coordinator phone lines and call forwarding
          </p>
        </div>
        <button className="px-5 py-2.5 bg-[#F59E0B] hover:bg-[#D97706] text-white font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2">
          <Plus size={18} />
          Add Phone Number
        </button>
      </div>

      {/* Your Phone Numbers */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">
            Your Phone Numbers
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
              <tr>
                <th className="px-6 py-3">Number</th>
                <th className="px-6 py-3">Assigned To</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {phoneNumbers.map((phone, i) => <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-slate-900">
                    {phone.number}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {phone.assignedTo}
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium', phone.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600')}>
                      {phone.status === 'active' ? <>
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                          Active
                        </> : <>
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                          Available
                        </>}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{phone.type}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>

      {/* Call Forwarding Setup */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          Call Forwarding Setup
        </h2>

        {/* Carrier Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-200">
          {['Verizon', 'AT&T', 'T-Mobile', 'Landline', 'VoIP'].map(carrier => <button key={carrier} onClick={() => setActiveCarrier(carrier.toLowerCase().replace('&', ''))} className={cn('px-4 py-2 font-medium text-sm border-b-2 transition-colors', activeCarrier === carrier.toLowerCase().replace('&', '') ? 'border-[#1B4F72] text-[#1B4F72]' : 'border-transparent text-slate-500 hover:text-slate-700')}>
                {carrier}
              </button>)}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-100">
          <div className="flex items-start gap-3">
            <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 mb-2">
                Forwarding Verified
              </h3>
              <p className="text-sm text-slate-600 mb-3">
                Your calls are being forwarded correctly. Last tested: 2 hours
                ago
              </p>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-slate-700">
                    Activation code:
                  </span>
                  <code className="ml-2 px-2 py-1 bg-white rounded border border-slate-200 font-mono">
                    *72 (555) 123-4567
                  </code>
                  <button className="ml-2 text-[#1B4F72] hover:underline">
                    <Copy size={14} className="inline" />
                  </button>
                </div>
                <div>
                  <span className="font-medium text-slate-700">
                    Deactivation code:
                  </span>
                  <code className="ml-2 px-2 py-1 bg-white rounded border border-slate-200 font-mono">
                    *73
                  </code>
                  <button className="ml-2 text-[#1B4F72] hover:underline">
                    <Copy size={14} className="inline" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button className="px-4 py-2 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors">
          Test Forwarding
        </button>
      </div>

      {/* Caller ID Settings */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          Caller ID Settings
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Default Caller ID Name{' '}
              <span className="text-slate-400">(15 characters max)</span>
            </label>
            <input type="text" defaultValue="ABC Plumbing" maxLength={15} className="w-full max-w-md px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" defaultChecked className="rounded border-slate-300 text-[#1B4F72] focus:ring-[#1B4F72]" />
            <span className="text-sm text-slate-600">
              Use for all outbound calls
            </span>
          </label>
          <p className="text-xs text-slate-500">
            ⚠️ Caller ID updates may take 24-48 hours to propagate
          </p>
        </div>
      </div>

      {/* Call Recording */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          Call Recording
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-slate-900">
                Enable call recording
              </h3>
              <p className="text-sm text-slate-500">
                Record all calls for quality and training
              </p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#1B4F72]">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Storage Location
              </label>
              <select className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] bg-white">
                <option>Coordinator Cloud (included)</option>
                <option>Your S3 Bucket (advanced)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Retention Period
              </label>
              <select className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] bg-white">
                <option>30 days</option>
                <option>90 days</option>
                <option>1 year</option>
                <option>Forever</option>
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" defaultChecked className="rounded border-slate-300 text-[#1B4F72] focus:ring-[#1B4F72]" />
            <span className="text-sm text-slate-600">Auto-transcription</span>
          </label>

          <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
            <p className="text-xs text-amber-800">
              ⚠️ Ensure you comply with local recording consent laws
            </p>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-600">Storage used</span>
              <span className="font-medium text-slate-900">
                2.3 GB of 10 GB
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#1B4F72] rounded-full" style={{
              width: '23%'
            }} />
            </div>
          </div>
        </div>
      </div>
    </div>;
}