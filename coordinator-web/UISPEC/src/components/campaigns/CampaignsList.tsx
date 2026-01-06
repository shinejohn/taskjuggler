import React, { useState } from 'react';
import { Plus, Play, Pause, Edit, Trash2, MoreVertical, Calendar, Users, TrendingUp, CheckCircle, Clock, FileText, Megaphone } from 'lucide-react';
import { cn } from '../../lib/utils';
export function CampaignsList() {
  const [activeTab, setActiveTab] = useState('all');
  const campaigns = [{
    id: 1,
    name: 'Appointment Confirmations - January',
    type: 'Confirmation Calls',
    status: 'running',
    coordinator: 'Ed',
    progress: {
      current: 234,
      total: 500
    },
    stats: {
      answerRate: 89,
      confirmed: 94,
      rescheduled: 6
    }
  }, {
    id: 2,
    name: 'December Follow-ups',
    type: 'Follow-up Calls',
    status: 'completed',
    coordinator: 'Sally',
    finalStats: {
      contacted: 500,
      answered: 340,
      appointments: 89
    }
  }, {
    id: 3,
    name: 'New Patient Outreach',
    type: 'Sales Calls',
    status: 'scheduled',
    coordinator: 'Marcus',
    startsAt: 'Jan 15, 2026 at 9:00 AM',
    target: 250
  }, {
    id: 4,
    name: 'Untitled Campaign',
    type: 'Draft',
    status: 'draft',
    lastEdited: '2 days ago'
  }];
  const tabs = [{
    id: 'all',
    label: 'All',
    count: 4
  }, {
    id: 'active',
    label: 'Active',
    count: 1
  }, {
    id: 'scheduled',
    label: 'Scheduled',
    count: 1
  }, {
    id: 'completed',
    label: 'Completed',
    count: 1
  }, {
    id: 'drafts',
    label: 'Drafts',
    count: 1
  }];
  return <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-[#1B4F72]">
            Campaigns
          </h1>
          <p className="text-slate-500 mt-1">
            Automated outreach powered by your Coordinators
          </p>
        </div>
        <button className="px-5 py-2.5 bg-[#F59E0B] hover:bg-[#D97706] text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2">
          <Plus size={18} />
          Create Campaign
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8">
          {tabs.map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn('py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2', activeTab === tab.id ? 'border-[#1B4F72] text-[#1B4F72]' : 'border-transparent text-slate-500 hover:text-[#1B4F72] hover:border-slate-300')}>
              {tab.label}
              <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', activeTab === tab.id ? 'bg-blue-100 text-[#1B4F72]' : 'bg-slate-100 text-slate-500')}>
                {tab.count}
              </span>
            </button>)}
        </nav>
      </div>

      {/* Campaign Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {campaigns.map(campaign => <div key={campaign.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            {/* Card Header */}
            <div className="p-6 border-b border-slate-100">
              <div className="flex justify-between items-start mb-3">
                <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium', campaign.status === 'running' ? 'bg-green-50 text-green-700 border border-green-200' : campaign.status === 'completed' ? 'bg-blue-50 text-blue-700 border border-blue-200' : campaign.status === 'scheduled' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-50 text-slate-600 border border-slate-200')}>
                  {campaign.status === 'running' && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}
                  {campaign.status === 'running' && 'Running'}
                  {campaign.status === 'completed' && <CheckCircle size={12} />}
                  {campaign.status === 'completed' && 'Completed'}
                  {campaign.status === 'scheduled' && <Clock size={12} />}
                  {campaign.status === 'scheduled' && 'Scheduled'}
                  {campaign.status === 'draft' && <FileText size={12} />}
                  {campaign.status === 'draft' && 'Draft'}
                </span>
                <button className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100">
                  <MoreVertical size={16} />
                </button>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-1">
                {campaign.name}
              </h3>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Megaphone size={14} />
                {campaign.type}
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6 space-y-4">
              {campaign.status === 'running' && <>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-[#1B4F72] flex items-center justify-center font-bold text-xs">
                      {campaign.coordinator.charAt(0)}
                    </div>
                    <div className="text-sm">
                      <div className="text-slate-500">Coordinator</div>
                      <div className="font-medium text-slate-900">
                        {campaign.coordinator}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-slate-700">
                        Progress
                      </span>
                      <span className="text-slate-500">
                        {campaign.progress.current} / {campaign.progress.total}{' '}
                        contacts
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#1B4F72] rounded-full transition-all duration-500" style={{
                  width: `${campaign.progress.current / campaign.progress.total * 100}%`
                }} />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                    <div className="text-center">
                      <div className="text-xs text-slate-500 mb-1">Answer</div>
                      <div className="font-bold text-slate-900">
                        {campaign.stats.answerRate}%
                      </div>
                    </div>
                    <div className="text-center border-l border-slate-100">
                      <div className="text-xs text-slate-500 mb-1">
                        Confirmed
                      </div>
                      <div className="font-bold text-green-600">
                        {campaign.stats.confirmed}%
                      </div>
                    </div>
                    <div className="text-center border-l border-slate-100">
                      <div className="text-xs text-slate-500 mb-1">
                        Rescheduled
                      </div>
                      <div className="font-bold text-amber-600">
                        {campaign.stats.rescheduled}%
                      </div>
                    </div>
                  </div>
                </>}

              {campaign.status === 'completed' && <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-[#1B4F72] flex items-center justify-center font-bold text-xs">
                      {campaign.coordinator.charAt(0)}
                    </div>
                    <div className="text-sm">
                      <div className="text-slate-500">Coordinator</div>
                      <div className="font-medium text-slate-900">
                        {campaign.coordinator}
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Contacted</span>
                      <span className="font-medium text-slate-900">
                        {campaign.finalStats.contacted}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Answered</span>
                      <span className="font-medium text-slate-900">
                        {campaign.finalStats.answered}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Appointments</span>
                      <span className="font-medium text-green-600">
                        {campaign.finalStats.appointments}
                      </span>
                    </div>
                  </div>
                </div>}

              {campaign.status === 'scheduled' && <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-[#1B4F72] flex items-center justify-center font-bold text-xs">
                      {campaign.coordinator.charAt(0)}
                    </div>
                    <div className="text-sm">
                      <div className="text-slate-500">Coordinator</div>
                      <div className="font-medium text-slate-900">
                        {campaign.coordinator}
                      </div>
                    </div>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
                    <div className="flex items-center gap-2 text-amber-700 text-sm mb-1">
                      <Calendar size={14} />
                      <span className="font-medium">Starts</span>
                    </div>
                    <div className="font-bold text-amber-900">
                      {campaign.startsAt}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Users size={14} />
                    Target: {campaign.target} contacts
                  </div>
                </div>}

              {campaign.status === 'draft' && <div className="text-center py-4">
                  <div className="text-slate-400 mb-2">
                    <FileText size={32} className="mx-auto opacity-50" />
                  </div>
                  <p className="text-sm text-slate-500">
                    Last edited {campaign.lastEdited}
                  </p>
                </div>}
            </div>

            {/* Card Actions */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3">
              {campaign.status === 'running' && <>
                  <button className="flex-1 py-2 px-3 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                    <Pause size={14} />
                    Pause
                  </button>
                  <button className="flex-1 py-2 px-3 rounded-lg bg-[#1B4F72] text-white text-sm font-medium hover:bg-[#153e5a] transition-colors">
                    View Details
                  </button>
                </>}
              {campaign.status === 'completed' && <button className="w-full py-2 px-3 rounded-lg border border-slate-200 bg-white text-sm font-medium text-[#1B4F72] hover:bg-blue-50 transition-colors">
                  View Report
                </button>}
              {campaign.status === 'scheduled' && <>
                  <button className="flex-1 py-2 px-3 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                    <Edit size={14} />
                    Edit
                  </button>
                  <button className="flex-1 py-2 px-3 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                    <Play size={14} />
                    Start Now
                  </button>
                  <button className="py-2 px-3 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </>}
              {campaign.status === 'draft' && <>
                  <button className="flex-1 py-2 px-3 rounded-lg bg-[#1B4F72] text-white text-sm font-medium hover:bg-[#153e5a] transition-colors">
                    Continue Editing
                  </button>
                  <button className="py-2 px-3 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </>}
            </div>
          </div>)}
      </div>

      {/* Empty State (shown when no campaigns) */}
      {campaigns.length === 0 && <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
            <Megaphone size={32} className="text-[#1B4F72]" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Create your first campaign
          </h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">
            Reach out to customers automatically with AI-powered call and SMS
            campaigns
          </p>
          <button className="px-6 py-2.5 bg-[#F59E0B] hover:bg-[#D97706] text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 inline-flex items-center gap-2">
            <Plus size={18} />
            Create Campaign
          </button>
        </div>}
    </div>;
}