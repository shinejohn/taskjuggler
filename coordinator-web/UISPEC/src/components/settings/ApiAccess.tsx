import React, { useState } from 'react';
import { Copy, Plus, MoreVertical, Eye, EyeOff, Check, X, ExternalLink, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
export function ApiAccess() {
  const [showKeys, setShowKeys] = useState(false);
  const [showCreateKey, setShowCreateKey] = useState(false);
  const [showWebhookForm, setShowWebhookForm] = useState(false);
  const [copiedText, setCopiedText] = useState('');
  const apiKeys = [{
    name: 'Production',
    key: 'sk_live_****4f2a',
    created: 'Dec 1, 2025',
    lastUsed: '5 min ago',
    permissions: 'Full Access'
  }, {
    name: 'Development',
    key: 'sk_test_****8b3c',
    created: 'Dec 15, 2025',
    lastUsed: 'Never',
    permissions: 'Read Only'
  }, {
    name: 'Mobile App',
    key: 'sk_live_****2d1e',
    created: 'Jan 2, 2026',
    lastUsed: '2 hours ago',
    permissions: 'Limited'
  }];
  const webhooks = [{
    url: 'https://myapp.com/webhooks/4calls',
    events: 5,
    status: 'active',
    lastDelivery: '2 min ago'
  }, {
    url: 'https://staging.myapp.com/hooks',
    events: 3,
    status: 'failing',
    lastDelivery: '1 hour ago'
  }];
  const webhookLogs = [{
    event: 'call.ended',
    endpoint: 'myapp.com/webhooks',
    status: 200,
    time: '2 min ago',
    responseTime: '45ms'
  }, {
    event: 'appointment.booked',
    endpoint: 'myapp.com/webhooks',
    status: 200,
    time: '15 min ago',
    responseTime: '52ms'
  }, {
    event: 'call.ended',
    endpoint: 'staging.myapp.com',
    status: 500,
    time: '1 hour ago',
    responseTime: 'Error'
  }, {
    event: 'call.started',
    endpoint: 'myapp.com/webhooks',
    status: 200,
    time: '1 hour ago',
    responseTime: '38ms'
  }];
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(''), 2000);
  };
  return <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-heading font-bold text-[#1B4F72]">
            API Access
          </h1>
          <p className="text-slate-500 mt-1">
            Integrate 4calls.ai with your applications
          </p>
        </div>
        <a href="#" target="_blank" className="px-5 py-2.5 border-2 border-[#1B4F72] text-[#1B4F72] hover:bg-[#1B4F72] hover:text-white font-semibold rounded-lg transition-colors flex items-center gap-2">
          <ExternalLink size={18} />
          View API Documentation
        </a>
      </div>

      {/* Quick Start */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Start</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Base URL
            </label>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-4 py-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-sm text-slate-900">
                https://api.4calls.ai/v1
              </code>
              <button onClick={() => handleCopy('https://api.4calls.ai/v1', 'url')} className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                {copiedText === 'url' ? <Check size={18} className="text-green-600" /> : <Copy size={18} className="text-slate-600" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Example Request
            </label>
            <div className="relative">
              <pre className="p-4 bg-slate-900 rounded-lg overflow-x-auto text-sm">
                <code className="text-slate-100">
                  {`curl -X GET "https://api.4calls.ai/v1/coordinators" \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
                </code>
              </pre>
              <button onClick={() => handleCopy('curl -X GET "https://api.4calls.ai/v1/coordinators" \\\n  -H "Authorization: Bearer YOUR_API_KEY"', 'example')} className="absolute top-3 right-3 p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                {copiedText === 'example' ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-slate-400" />}
              </button>
            </div>
          </div>

          <div className="flex gap-3 text-sm">
            <a href="#" className="text-[#1B4F72] hover:underline font-medium">
              Full Documentation
            </a>
            <span className="text-slate-300">•</span>
            <a href="#" className="text-[#1B4F72] hover:underline font-medium">
              API Reference
            </a>
            <span className="text-slate-300">•</span>
            <a href="#" className="text-[#1B4F72] hover:underline font-medium">
              SDKs
            </a>
          </div>
        </div>
      </div>

      {/* API Keys */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-slate-900">API Keys</h2>
            <button onClick={() => setShowKeys(!showKeys)} className="text-sm text-[#1B4F72] hover:underline font-medium flex items-center gap-1">
              {showKeys ? <EyeOff size={14} /> : <Eye size={14} />}
              {showKeys ? 'Hide' : 'Show'} keys
            </button>
          </div>
          <button onClick={() => setShowCreateKey(true)} className="px-4 py-2 bg-[#1B4F72] hover:bg-[#153e5a] text-white font-medium rounded-lg transition-colors flex items-center gap-2">
            <Plus size={18} />
            Create New Key
          </button>
        </div>

        <div className="space-y-3">
          {apiKeys.map((key, i) => <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-slate-900">{key.name}</h3>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                    {key.permissions}
                  </span>
                </div>
                <div className="text-sm text-slate-600">
                  {showKeys ? <code className="font-mono bg-white px-2 py-1 rounded border border-slate-200">
                      {key.key}
                    </code> : <code className="font-mono">••••••••••••</code>}
                  {' • '}Created {key.created} • Last used: {key.lastUsed}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-slate-400 hover:text-[#1B4F72] rounded hover:bg-white transition-colors">
                  <Copy size={16} />
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-600 rounded hover:bg-white transition-colors">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>)}
        </div>
      </div>

      {/* Webhooks */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-900">Webhooks</h2>
          <button onClick={() => setShowWebhookForm(true)} className="px-4 py-2 bg-[#1B4F72] hover:bg-[#153e5a] text-white font-medium rounded-lg transition-colors flex items-center gap-2">
            <Plus size={18} />
            Add Webhook Endpoint
          </button>
        </div>

        <div className="space-y-3 mb-6">
          {webhooks.map((webhook, i) => <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <code className="font-mono text-sm text-slate-900">
                    {webhook.url}
                  </code>
                  <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium', webhook.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700')}>
                    {webhook.status === 'active' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                    {webhook.status === 'active' ? 'Active' : 'Failing'}
                  </span>
                </div>
                <div className="text-sm text-slate-600">
                  {webhook.events} events subscribed • Last delivery:{' '}
                  {webhook.lastDelivery}
                </div>
              </div>
              <button className="p-2 text-slate-400 hover:text-slate-600 rounded hover:bg-white transition-colors">
                <MoreVertical size={16} />
              </button>
            </div>)}
        </div>

        {showWebhookForm && <div className="border-t border-slate-200 pt-6">
            <h3 className="font-semibold text-slate-900 mb-4">
              Add Webhook Endpoint
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Endpoint URL
                </label>
                <input type="url" placeholder="https://your-app.com/webhooks/4calls" className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Events to subscribe
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['call.started', 'call.ended', 'call.transferred', 'call.recording.ready', 'appointment.booked', 'appointment.confirmed', 'appointment.cancelled', 'contact.created'].map(event => <label key={event} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" className="rounded border-slate-300 text-[#1B4F72] focus:ring-[#1B4F72]" />
                      <code className="text-xs">{event}</code>
                    </label>)}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowWebhookForm(false)} className="px-4 py-2 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button className="px-4 py-2 bg-[#1B4F72] hover:bg-[#153e5a] text-white font-medium rounded-lg transition-colors">
                  Create Webhook
                </button>
              </div>
            </div>
          </div>}
      </div>

      {/* Webhook Logs */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-900">Webhook Logs</h2>
          <a href="#" className="text-sm text-[#1B4F72] hover:underline font-medium">
            View all logs →
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200">
              <tr className="text-left">
                <th className="pb-3 font-medium text-slate-700">Event</th>
                <th className="pb-3 font-medium text-slate-700">Endpoint</th>
                <th className="pb-3 font-medium text-slate-700">Status</th>
                <th className="pb-3 font-medium text-slate-700">Time</th>
                <th className="pb-3 font-medium text-slate-700">Response</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {webhookLogs.map((log, i) => <tr key={i} className="hover:bg-slate-50">
                  <td className="py-3">
                    <code className="text-xs bg-slate-100 px-2 py-1 rounded">
                      {log.event}
                    </code>
                  </td>
                  <td className="py-3 text-slate-600">{log.endpoint}</td>
                  <td className="py-3">
                    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium', log.status === 200 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700')}>
                      {log.status === 200 ? <CheckCircle size={12} /> : <XCircle size={12} />}
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3 text-slate-500">{log.time}</td>
                  <td className="py-3 text-slate-600">{log.responseTime}</td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rate Limits */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Rate Limits</h2>
        <div className="space-y-4">
          {[{
          category: 'Read Operations',
          limit: '1000/min',
          current: 234,
          status: 'ok'
        }, {
          category: 'Write Operations',
          limit: '100/min',
          current: 12,
          status: 'ok'
        }, {
          category: 'Bulk Operations',
          limit: '10/min',
          current: 0,
          status: 'ok'
        }, {
          category: 'Webhooks Sent',
          limit: '10000/hour',
          current: 1234,
          status: 'ok'
        }].map((rate, i) => <div key={i}>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-slate-700">
                  {rate.category}
                </span>
                <span className="text-slate-500">
                  {rate.current} / {rate.limit}
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{
              width: `${rate.current / parseInt(rate.limit) * 100}%`
            }} />
              </div>
            </div>)}
        </div>
        <p className="text-sm text-slate-500 mt-4">
          Need higher limits?{' '}
          <a href="#" className="text-[#1B4F72] hover:underline font-medium">
            Contact sales for Enterprise tier
          </a>
        </p>
      </div>

      {/* SDKs & Libraries */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          SDKs & Libraries
        </h2>

        <div className="space-y-3 mb-6">
          <h3 className="text-sm font-semibold text-slate-700">
            Official SDKs
          </h3>
          {[{
          name: 'JavaScript/Node.js',
          install: 'npm install @4calls/sdk',
          repo: 'github.com/4calls/sdk-js'
        }, {
          name: 'Python',
          install: 'pip install 4calls-sdk',
          repo: 'github.com/4calls/sdk-python'
        }, {
          name: 'PHP',
          install: 'composer require 4calls/sdk',
          repo: 'github.com/4calls/sdk-php'
        }, {
          name: 'Ruby',
          install: 'gem install 4calls',
          repo: 'github.com/4calls/sdk-ruby'
        }].map((sdk, i) => <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div>
                <div className="font-medium text-slate-900 mb-1">
                  {sdk.name}
                </div>
                <code className="text-xs bg-white px-2 py-1 rounded border border-slate-200">
                  {sdk.install}
                </code>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleCopy(sdk.install, sdk.name)} className="p-2 text-slate-400 hover:text-[#1B4F72] rounded hover:bg-white transition-colors">
                  {copiedText === sdk.name ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                </button>
                <a href={`https://${sdk.repo}`} target="_blank" className="p-2 text-slate-400 hover:text-[#1B4F72] rounded hover:bg-white transition-colors">
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>)}
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-700">
            Community SDKs
          </h3>
          <div className="flex flex-wrap gap-2">
            {['Go', 'Java', 'C#', '.NET'].map(lang => <span key={lang} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                {lang} (community)
              </span>)}
          </div>
        </div>
      </div>

      {/* API Changelog */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-900">API Changelog</h2>
          <div className="flex items-center gap-2">
            <input type="email" placeholder="your@email.com" className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]" />
            <button className="px-3 py-1.5 bg-[#1B4F72] hover:bg-[#153e5a] text-white text-sm font-medium rounded-lg transition-colors">
              Subscribe
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {[{
          version: 'v1.3.0',
          date: 'Jan 2, 2026',
          changes: 'Added bulk contact import endpoint'
        }, {
          version: 'v1.2.0',
          date: 'Dec 15, 2025',
          changes: 'Added campaign webhooks'
        }, {
          version: 'v1.1.0',
          date: 'Dec 1, 2025',
          changes: 'Added call recording endpoints'
        }].map((change, i) => <div key={i} className="flex gap-4 p-3 bg-slate-50 rounded-lg">
              <div className="flex-shrink-0">
                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-mono font-semibold">
                  {change.version}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-900 font-medium">
                  {change.changes}
                </p>
                <p className="text-xs text-slate-500 mt-1">{change.date}</p>
              </div>
            </div>)}
        </div>
      </div>

      {/* Create Key Modal */}
      {showCreateKey && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Create New API Key
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Generate a new API key for your application
                </p>
              </div>
              <button onClick={() => setShowCreateKey(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Key Name
                </label>
                <input type="text" placeholder="Production API Key" className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Environment
                </label>
                <div className="flex gap-3">
                  <label className="flex-1 flex items-center justify-center gap-2 p-3 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-[#1B4F72] transition-colors">
                    <input type="radio" name="env" value="production" className="text-[#1B4F72]" />
                    <span className="font-medium">Production</span>
                  </label>
                  <label className="flex-1 flex items-center justify-center gap-2 p-3 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-[#1B4F72] transition-colors">
                    <input type="radio" name="env" value="sandbox" className="text-[#1B4F72]" />
                    <span className="font-medium">Sandbox</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Permissions
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {['Read Coordinators', 'Manage Coordinators', 'Read Contacts', 'Manage Contacts', 'Read Calls', 'Initiate Calls', 'Read Appointments', 'Manage Appointments'].map(perm => <label key={perm} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" className="rounded border-slate-300 text-[#1B4F72] focus:ring-[#1B4F72]" />
                      {perm}
                    </label>)}
                </div>
              </div>

              <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                <div className="flex gap-2">
                  <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800">
                    <strong>Important:</strong> Your API key will only be shown
                    once. Make sure to copy it and store it securely.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowCreateKey(false)} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button className="flex-1 px-4 py-2.5 bg-[#1B4F72] hover:bg-[#153e5a] text-white font-semibold rounded-lg shadow-sm transition-colors">
                Create Key
              </button>
            </div>
          </div>
        </div>}
    </div>;
}