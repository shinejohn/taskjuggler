import React, { useState } from 'react';
import { Search, CheckCircle, Star, Settings, X } from 'lucide-react';
import { cn } from '../../lib/utils';
export function Integrations() {
  const [activeCategory, setActiveCategory] = useState('all');
  const connectedApps = [{
    name: 'Google Calendar',
    logo: '📅',
    status: 'Connected',
    lastSync: '5 minutes ago',
    syncing: 'Appointments'
  }, {
    name: 'QuickBooks',
    logo: '💰',
    status: 'Connected',
    lastSync: '1 hour ago',
    syncing: 'Invoices'
  }, {
    name: 'Slack',
    logo: '💬',
    status: 'Connected',
    lastSync: '2 minutes ago',
    syncing: 'Notifications'
  }];
  const availableIntegrations = {
    calendars: [{
      name: 'Google Calendar',
      logo: '📅',
      description: 'Sync appointments automatically',
      popular: true
    }, {
      name: 'Microsoft Outlook',
      logo: '📧',
      description: 'Sync with Outlook calendar',
      popular: false
    }, {
      name: 'Calendly',
      logo: '📆',
      description: 'Connect scheduling links',
      popular: false
    }, {
      name: 'Acuity Scheduling',
      logo: '🗓️',
      description: 'Sync appointments',
      popular: false
    }],
    crm: [{
      name: 'Salesforce',
      logo: '☁️',
      description: 'Sync contacts and leads',
      popular: true
    }, {
      name: 'HubSpot',
      logo: '🟠',
      description: 'CRM and marketing automation',
      popular: true
    }, {
      name: 'Zoho CRM',
      logo: '🔷',
      description: 'Customer relationship management',
      popular: false
    }, {
      name: 'Pipedrive',
      logo: '🔵',
      description: 'Sales pipeline management',
      popular: false
    }],
    payments: [{
      name: 'Stripe',
      logo: '💳',
      description: 'Accept online payments',
      popular: true
    }, {
      name: 'Square',
      logo: '⬛',
      description: 'Point of sale and payments',
      popular: false
    }, {
      name: 'QuickBooks',
      logo: '💰',
      description: 'Accounting and invoicing',
      popular: true
    }, {
      name: 'FreshBooks',
      logo: '📊',
      description: 'Invoicing and accounting',
      popular: false
    }],
    communication: [{
      name: 'Slack',
      logo: '💬',
      description: 'Team communication',
      popular: true
    }, {
      name: 'Microsoft Teams',
      logo: '👥',
      description: 'Collaboration platform',
      popular: false
    }, {
      name: 'Twilio',
      logo: '📱',
      description: 'SMS and voice API',
      popular: false
    }, {
      name: 'SendGrid',
      logo: '✉️',
      description: 'Email delivery service',
      popular: false
    }],
    other: [{
      name: 'Zapier',
      logo: '⚡',
      description: 'Connect anything',
      popular: true
    }, {
      name: 'Google Sheets',
      logo: '📊',
      description: 'Spreadsheet integration',
      popular: false
    }, {
      name: 'Airtable',
      logo: '🗂️',
      description: 'Database and spreadsheet',
      popular: false
    }, {
      name: 'Webhooks',
      logo: '🔗',
      description: 'Custom integrations',
      popular: false
    }]
  };
  const categories = [{
    id: 'all',
    label: 'All'
  }, {
    id: 'calendars',
    label: 'Calendars'
  }, {
    id: 'crm',
    label: 'CRM'
  }, {
    id: 'payments',
    label: 'Payments'
  }, {
    id: 'communication',
    label: 'Communication'
  }, {
    id: 'other',
    label: 'Other'
  }];
  const getIntegrations = () => {
    if (activeCategory === 'all') {
      return Object.values(availableIntegrations).flat();
    }
    return availableIntegrations[activeCategory as keyof typeof availableIntegrations] || [];
  };
  return <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-[#1B4F72]">
            Integrations
          </h1>
          <p className="text-slate-500 mt-1">
            Connect Coordinator with your favorite tools
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input type="text" placeholder="Search integrations..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]" />
        </div>
      </div>

      {/* Connected Apps */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          Connected Apps
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {connectedApps.map((app, i) => <div key={i} className="border-2 border-slate-200 rounded-xl p-4 hover:border-[#1B4F72] transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{app.logo}</div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{app.name}</h3>
                    <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
                      <CheckCircle size={12} />
                      {app.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-xs text-slate-500 mb-3">
                <div>Last sync: {app.lastSync}</div>
                <div>Syncing: {app.syncing}</div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-1">
                  <Settings size={12} />
                  Configure
                </button>
                <button className="flex-1 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                  Disconnect
                </button>
              </div>
            </div>)}
        </div>
      </div>

      {/* Available Integrations */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          Available Integrations
        </h2>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-200 overflow-x-auto">
          {categories.map(cat => <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={cn('px-4 py-2 font-medium text-sm border-b-2 transition-colors whitespace-nowrap', activeCategory === cat.id ? 'border-[#1B4F72] text-[#1B4F72]' : 'border-transparent text-slate-500 hover:text-slate-700')}>
              {cat.label}
            </button>)}
        </div>

        {/* Integration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {getIntegrations().map((integration, i) => <div key={i} className="border-2 border-slate-200 rounded-xl p-4 hover:border-[#1B4F72] hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">{integration.logo}</div>
                {integration.popular && <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full text-xs font-medium">
                    <Star size={10} fill="currentColor" />
                    Popular
                  </span>}
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">
                {integration.name}
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                {integration.description}
              </p>
              <button className="w-full py-2 bg-[#1B4F72] hover:bg-[#153e5a] text-white font-medium rounded-lg transition-colors text-sm">
                Connect
              </button>
            </div>)}
        </div>
      </div>

      {/* Custom Webhooks */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          Custom Webhooks
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          For developers who want custom integrations
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Webhook URL
            </label>
            <input type="url" placeholder="https://your-app.com/webhooks/coordinator" className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Events to send
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['call.started', 'call.ended', 'appointment.booked', 'appointment.cancelled'].map(event => <label key={event} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-300 text-[#1B4F72] focus:ring-[#1B4F72]" />
                  <code className="text-xs">{event}</code>
                </label>)}
            </div>
          </div>
          <button className="px-4 py-2 bg-[#1B4F72] hover:bg-[#153e5a] text-white font-medium rounded-lg transition-colors">
            Test Webhook
          </button>
        </div>
      </div>

      {/* Data Sync Settings */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          Data Sync Settings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Sync Frequency
            </label>
            <select className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] bg-white">
              <option>Real-time</option>
              <option>Every 5 minutes</option>
              <option>Every hour</option>
              <option>Manual</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Conflict Resolution
            </label>
            <select className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] bg-white">
              <option>Coordinator wins</option>
              <option>External app wins</option>
              <option>Ask me</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-slate-500">Last synced: 5 minutes ago</p>
          <button className="px-4 py-2 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors">
            Sync Now
          </button>
        </div>
      </div>
    </div>;
}