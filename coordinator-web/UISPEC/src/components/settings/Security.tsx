import React, { useState } from 'react';
import { Shield, CheckCircle, AlertTriangle, Key, Smartphone, Monitor, Download, Trash2, Lock, Eye, EyeOff } from 'lucide-react';
import { cn } from '../../lib/utils';
export function Security() {
  const [show2FARecovery, setShow2FARecovery] = useState(false);
  const [showAPIKeys, setShowAPIKeys] = useState(false);
  const activeSessions = [{
    device: 'Chrome on Mac',
    location: 'Tampa, FL',
    lastActive: 'Now',
    current: true
  }, {
    device: 'Safari on iPhone',
    location: 'Tampa, FL',
    lastActive: '3 hours ago',
    current: false
  }, {
    device: 'Edge on Windows',
    location: 'Miami, FL',
    lastActive: '2 days ago',
    current: false
  }];
  const apiKeys = [{
    name: 'Production',
    created: 'Dec 1, 2025',
    lastUsed: '5 min ago'
  }, {
    name: 'Development',
    created: 'Dec 15, 2025',
    lastUsed: 'Never'
  }];
  const securityLog = [{
    event: 'Password changed',
    user: 'Jane Doe',
    time: '45 days ago',
    type: 'password'
  }, {
    event: '2FA enabled',
    user: 'Jane Doe',
    time: '60 days ago',
    type: '2fa'
  }, {
    event: 'New login from Chrome on Mac',
    user: 'Jane Doe',
    time: 'Today',
    type: 'login'
  }, {
    event: 'API key "Production" created',
    user: 'Jane Doe',
    time: 'Dec 1, 2025',
    type: 'api'
  }, {
    event: 'Failed login attempt',
    user: 'Unknown',
    time: '3 days ago (blocked)',
    type: 'login'
  }];
  const recommendations = [{
    text: 'Strong password set',
    status: 'complete'
  }, {
    text: 'Two-factor authentication enabled',
    status: 'complete'
  }, {
    text: 'Review active sessions (2 unused)',
    status: 'warning'
  }, {
    text: 'API keys rotated recently',
    status: 'complete'
  }, {
    text: 'Consider IP whitelisting for API',
    status: 'warning'
  }];
  return <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-heading font-bold text-[#1B4F72]">
            Security
          </h1>
          <p className="text-slate-500 mt-1">
            Protect your account and customer data
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
          <Shield className="text-green-600" size={20} />
          <div>
            <div className="text-xs text-green-600 font-medium">
              Security Score
            </div>
            <div className="text-lg font-bold text-green-700">85/100</div>
          </div>
        </div>
      </div>

      {/* Account Security */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-6">
          Account Security
        </h2>

        {/* Password */}
        <div className="pb-6 border-b border-slate-100">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Password</h3>
              <p className="text-sm text-slate-500">
                Last changed: 45 days ago
              </p>
            </div>
            <button className="px-4 py-2 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors">
              Change Password
            </button>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="py-6 border-b border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  Two-Factor Authentication
                </h3>
                <p className="text-sm text-slate-500 mb-2">
                  Using Authenticator App
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600">
                    Recovery codes: 3 of 10 remaining
                  </span>
                  <button onClick={() => setShow2FARecovery(!show2FARecovery)} className="text-xs text-[#1B4F72] hover:underline font-medium">
                    {show2FARecovery ? 'Hide' : 'View/Regenerate'}
                  </button>
                </div>
              </div>
            </div>
            <button className="px-4 py-2 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors">
              Manage 2FA
            </button>
          </div>

          {show2FARecovery && <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <p className="text-xs text-amber-800 font-medium mb-2">
                ⚠️ Keep these codes safe. Each can only be used once.
              </p>
              <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                <code className="bg-white px-2 py-1 rounded">ABCD-1234</code>
                <code className="bg-white px-2 py-1 rounded">EFGH-5678</code>
                <code className="bg-white px-2 py-1 rounded">IJKL-9012</code>
              </div>
            </div>}
        </div>

        {/* Login Sessions */}
        <div className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-slate-900">Active Sessions</h3>
            <button className="text-sm text-red-600 hover:underline font-medium">
              Sign out all other sessions
            </button>
          </div>
          <div className="space-y-3">
            {activeSessions.map((session, i) => <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-3">
                  <Monitor className="text-slate-400" size={20} />
                  <div>
                    <div className="font-medium text-slate-900">
                      {session.device}{' '}
                      {session.current && <span className="text-green-600 text-xs">
                          (current)
                        </span>}
                    </div>
                    <div className="text-xs text-slate-500">
                      {session.location} • {session.lastActive}
                    </div>
                  </div>
                </div>
                {!session.current && <button className="text-sm text-red-600 hover:underline font-medium">
                    Revoke
                  </button>}
              </div>)}
          </div>
        </div>
      </div>

      {/* Single Sign-On */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          Single Sign-On (SSO)
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          Configure SSO for your organization
        </p>
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-4">
          <p className="text-sm text-blue-800">
            SSO is available on Business and Enterprise plans
          </p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Identity Provider
            </label>
            <select className="w-full max-w-md px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] bg-white">
              <option>Okta</option>
              <option>Azure AD</option>
              <option>Google Workspace</option>
              <option>Custom SAML 2.0</option>
            </select>
          </div>
          <button className="px-4 py-2 bg-[#1B4F72] hover:bg-[#153e5a] text-white font-medium rounded-lg transition-colors">
            Configure SSO
          </button>
        </div>
      </div>

      {/* API Security */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">API Security</h2>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-medium text-slate-900">Enable API Access</h3>
            <p className="text-sm text-slate-500">
              Allow programmatic access to your account
            </p>
          </div>
          <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#1B4F72]">
            <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-slate-900">API Keys</h3>
              <button onClick={() => setShowAPIKeys(!showAPIKeys)} className="text-sm text-[#1B4F72] hover:underline font-medium flex items-center gap-1">
                {showAPIKeys ? <EyeOff size={14} /> : <Eye size={14} />}
                {showAPIKeys ? 'Hide' : 'Show'} keys
              </button>
            </div>
            <div className="space-y-2">
              {apiKeys.map((key, i) => <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div>
                    <div className="font-medium text-slate-900">{key.name}</div>
                    <div className="text-xs text-slate-500">
                      {showAPIKeys ? <code className="font-mono">sk_live_****4f2a</code> : <span>••••••••••••</span>}
                      {' • '}Created {key.created} • Last used: {key.lastUsed}
                    </div>
                  </div>
                  <button className="text-sm text-red-600 hover:underline font-medium">
                    Revoke
                  </button>
                </div>)}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-slate-900 mb-3">IP Whitelist</h3>
            <label className="flex items-center gap-2 mb-3 cursor-pointer">
              <input type="checkbox" className="rounded border-slate-300 text-[#1B4F72] focus:ring-[#1B4F72]" />
              <span className="text-sm text-slate-600">
                Restrict API to specific IPs
              </span>
            </label>
          </div>

          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
            <p className="text-xs text-slate-600">
              <strong>Rate limiting:</strong> 1000 requests/minute
            </p>
          </div>
        </div>
      </div>

      {/* Data Protection */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          Data Protection
        </h2>

        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle size={16} />
            Data encrypted at rest (AES-256)
          </div>
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle size={16} />
            Data encrypted in transit (TLS 1.3)
          </div>
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle size={16} />
            Call recordings encrypted
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 pb-6 border-b border-slate-100">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Call Recordings
            </label>
            <select className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] bg-white text-sm">
              <option>30 days</option>
              <option>90 days</option>
              <option>1 year</option>
              <option>Forever</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Contact Data
            </label>
            <select className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] bg-white text-sm">
              <option>Forever</option>
              <option>1 year</option>
              <option>90 days</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Transcriptions
            </label>
            <select className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] bg-white text-sm">
              <option>90 days</option>
              <option>30 days</option>
              <option>1 year</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-medium text-slate-900">GDPR/Compliance</h3>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
              <Download size={16} />
              Download my data
            </button>
            <button className="px-4 py-2 border border-red-200 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2">
              <Trash2 size={16} />
              Delete my account
            </button>
          </div>
          <p className="text-xs text-slate-500">Last data export: Never</p>
        </div>
      </div>

      {/* Compliance & Certifications */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          Compliance & Certifications
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {['SOC 2 Type II', 'GDPR', 'HIPAA Ready', 'PCI DSS'].map((cert, i) => <div key={i} className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
                <span className="text-sm font-medium text-green-700">
                  {cert}
                </span>
              </div>)}
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <a href="#" className="text-[#1B4F72] hover:underline">
            View Security Whitepaper
          </a>
          <span className="text-slate-300">•</span>
          <a href="#" className="text-[#1B4F72] hover:underline">
            Download BAA
          </a>
          <span className="text-slate-300">•</span>
          <a href="#" className="text-[#1B4F72] hover:underline">
            Request Compliance Documentation
          </a>
        </div>
      </div>

      {/* Security Log */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-900">Security Log</h2>
          <button className="text-sm text-[#1B4F72] hover:underline font-medium">
            Export security log
          </button>
        </div>
        <div className="space-y-2">
          {securityLog.map((log, i) => <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg text-sm">
              <div className="flex items-center gap-3">
                <Lock size={16} className="text-slate-400" />
                <div>
                  <span className="font-medium text-slate-900">
                    {log.event}
                  </span>
                  <span className="text-slate-500"> • {log.user}</span>
                </div>
              </div>
              <span className="text-slate-500">{log.time}</span>
            </div>)}
        </div>
      </div>

      {/* Security Recommendations */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          Security Recommendations
        </h2>
        <div className="space-y-3">
          {recommendations.map((rec, i) => <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                {rec.status === 'complete' ? <CheckCircle size={18} className="text-green-600" /> : <AlertTriangle size={18} className="text-amber-600" />}
                <span className="text-sm text-slate-700">{rec.text}</span>
              </div>
              {rec.status === 'warning' && <button className="text-sm text-[#1B4F72] hover:underline font-medium">
                  Fix now
                </button>}
            </div>)}
        </div>
      </div>
    </div>;
}