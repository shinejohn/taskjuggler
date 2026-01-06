import React, { useState } from 'react';
import { User, Building2, Phone, Bell, Plug, Users, Shield, Code } from 'lucide-react';
import { cn } from '../../lib/utils';
import { BusinessProfile } from './BusinessProfile';
import { PhoneNumbers } from './PhoneNumbers';
import { Integrations } from './Integrations';
import { TeamMembers } from './TeamMembers';
import { Security } from './Security';
import { ApiAccess } from './ApiAccess';
export function Settings() {
  const [activeSection, setActiveSection] = useState('business');
  const [notifications, setNotifications] = useState({
    dailySummary: true,
    callTransferred: true,
    missedCalls: false,
    weeklyReport: true
  });
  const sections = [{
    id: 'general',
    label: 'General',
    icon: User
  }, {
    id: 'business',
    label: 'Business Profile',
    icon: Building2
  }, {
    id: 'phone',
    label: 'Phone Numbers',
    icon: Phone
  }, {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell
  }, {
    id: 'integrations',
    label: 'Integrations',
    icon: Plug
  }, {
    id: 'team',
    label: 'Team Members',
    icon: Users
  }, {
    id: 'security',
    label: 'Security',
    icon: Shield
  }, {
    id: 'api',
    label: 'API Access',
    icon: Code
  }];
  return <div className="flex gap-6 min-h-[calc(100vh-200px)]">
      {/* Left Sidebar */}
      <div className="w-64 flex-shrink-0">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-2 sticky top-6">
          <nav className="space-y-1">
            {sections.map(section => <button key={section.id} onClick={() => setActiveSection(section.id)} className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left', activeSection === section.id ? 'bg-blue-50 text-[#1B4F72]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900')}>
                <section.icon size={18} />
                {section.label}
              </button>)}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Business Profile */}
        {activeSection === 'business' && <BusinessProfile />}

        {/* Phone Numbers */}
        {activeSection === 'phone' && <PhoneNumbers />}

        {/* Integrations */}
        {activeSection === 'integrations' && <Integrations />}

        {/* Team Members */}
        {activeSection === 'team' && <TeamMembers />}

        {/* Security */}
        {activeSection === 'security' && <Security />}

        {/* API Access */}
        {activeSection === 'api' && <ApiAccess />}

        {/* General Settings */}
        {activeSection === 'general' && <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-[#1B4F72] mb-1">
                General Settings
              </h2>
              <p className="text-slate-500">
                Manage your account and default settings
              </p>
            </div>

            {/* Account Information */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 pb-2 border-b border-slate-100">
                Account Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Organization Name
                  </label>
                  <input type="text" defaultValue="Acme Dental Practice" className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Account Email
                  </label>
                  <input type="email" defaultValue="admin@acmedental.com" className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Timezone
                  </label>
                  <select className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] bg-white">
                    <option>Pacific Time (PT)</option>
                    <option>Mountain Time (MT)</option>
                    <option>Central Time (CT)</option>
                    <option>Eastern Time (ET)</option>
                  </select>
                </div>
              </div>
              <button className="px-4 py-2 bg-[#1B4F72] text-white font-medium rounded-lg hover:bg-[#153e5a] transition-colors flex items-center gap-2">
                Save Changes
              </button>
            </section>
          </div>}

        {/* Notifications Settings */}
        {activeSection === 'notifications' && <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-[#1B4F72] mb-1">
                Notifications
              </h2>
              <p className="text-slate-500">Manage how you receive updates</p>
            </div>

            <section className="space-y-4">
              {[{
            key: 'dailySummary',
            label: 'Email me daily summary',
            desc: 'Receive a daily digest of activity'
          }, {
            key: 'callTransferred',
            label: 'Email me when call transferred',
            desc: 'Get notified when a call is transferred to you'
          }, {
            key: 'missedCalls',
            label: 'SMS me for missed calls',
            desc: "Text notification for calls that weren't answered"
          }, {
            key: 'weeklyReport',
            label: 'Weekly performance report',
            desc: 'Comprehensive weekly analytics report'
          }].map(notif => <div key={notif.key} className="flex justify-between items-start p-4 border border-slate-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900 mb-1">
                      {notif.label}
                    </h4>
                    <p className="text-sm text-slate-500">{notif.desc}</p>
                  </div>
                  <button onClick={() => setNotifications(prev => ({
              ...prev,
              [notif.key]: !prev[notif.key as keyof typeof prev]
            }))} className={cn('relative inline-flex h-6 w-11 items-center rounded-full transition-colors ml-4 flex-shrink-0', notifications[notif.key as keyof typeof notifications] ? 'bg-[#1B4F72]' : 'bg-slate-200')}>
                    <span className={cn('inline-block h-4 w-4 transform rounded-full bg-white transition-transform', notifications[notif.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1')} />
                  </button>
                </div>)}
            </section>
          </div>}

        {/* Placeholder for other sections */}
        {!['general', 'business', 'phone', 'notifications', 'integrations', 'team', 'security', 'api'].includes(activeSection) && <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center py-20">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              {sections.find(s => s.id === activeSection)?.label}
            </h2>
            <p className="text-slate-500">
              This section is under construction.
            </p>
          </div>}
      </div>
    </div>;
}