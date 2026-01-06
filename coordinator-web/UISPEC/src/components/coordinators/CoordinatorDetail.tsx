import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Phone, CheckCircle, Calendar, Clock, TrendingUp, Star, MoreVertical, Copy, ChevronDown, ChevronRight, Edit, Play } from 'lucide-react';
import { cn } from '../../lib/utils';
export function CoordinatorDetail() {
  const {
    id
  } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('week');
  const [isActive, setIsActive] = useState(true);
  const [expandedInstruction, setExpandedInstruction] = useState<string | null>(null);
  // Mock data for Sally
  const coordinator = {
    name: 'Sally',
    role: 'Receptionist',
    avatar: null,
    phone: '(555) 123-4567',
    created: 'Dec 15, 2025',
    personality: 'Friendly & Warm',
    voice: 'Female',
    status: 'active'
  };
  const metrics = [{
    label: 'Total Calls',
    value: '1,247',
    icon: Phone,
    color: 'bg-blue-100 text-[#1B4F72]'
  }, {
    label: 'Answered',
    value: '1,198',
    sub: '96%',
    icon: CheckCircle,
    color: 'bg-green-100 text-green-600'
  }, {
    label: 'Appts Booked',
    value: '342',
    icon: Calendar,
    color: 'bg-purple-100 text-purple-600'
  }, {
    label: 'Avg Duration',
    value: '2:34',
    icon: Clock,
    color: 'bg-amber-100 text-amber-600'
  }, {
    label: 'Success Rate',
    value: '89%',
    icon: TrendingUp,
    color: 'bg-emerald-100 text-emerald-600'
  }, {
    label: 'Satisfaction',
    value: '4.6/5',
    icon: Star,
    color: 'bg-yellow-100 text-yellow-600'
  }];
  const recentActivity = [{
    time: '10:42 AM',
    contact: 'John Smith',
    outcome: 'Appointment Booked',
    duration: '2m 14s',
    status: 'success'
  }, {
    time: '10:15 AM',
    contact: 'Sarah Johnson',
    outcome: 'Left Voicemail',
    duration: '1m 05s',
    status: 'neutral'
  }, {
    time: '09:58 AM',
    contact: 'Mike Brown',
    outcome: 'Inquiry Resolved',
    duration: '4m 32s',
    status: 'success'
  }, {
    time: '09:30 AM',
    contact: 'Emily Davis',
    outcome: 'Call Dropped',
    duration: '0m 45s',
    status: 'error'
  }, {
    time: '09:12 AM',
    contact: 'Unknown',
    outcome: 'Spam Blocked',
    duration: '1m 20s',
    status: 'neutral'
  }, {
    time: 'Yesterday',
    contact: 'Robert Taylor',
    outcome: 'Appointment Booked',
    duration: '3m 10s',
    status: 'success'
  }, {
    time: 'Yesterday',
    contact: 'Jennifer Lee',
    outcome: 'Rescheduled',
    duration: '2m 45s',
    status: 'success'
  }];
  return <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <Link to="/coordinators" className="text-sm font-medium text-slate-500 hover:text-[#1B4F72] flex items-center gap-1">
          <ArrowLeft size={16} />
          Coordinators
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-slate-100 border-2 border-white shadow-md flex items-center justify-center text-3xl font-bold text-[#1B4F72]">
              {coordinator.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-heading font-bold text-[#1B4F72]">
                {coordinator.name}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#1B4F72] text-xs font-medium">
                  {coordinator.role}
                </span>
                <span className={cn('flex items-center gap-1 text-xs font-medium', isActive ? 'text-green-600' : 'text-slate-500')}>
                  <span className={cn('w-1.5 h-1.5 rounded-full', isActive ? 'bg-green-500 animate-pulse' : 'bg-slate-400')} />
                  {isActive ? 'Active' : 'Paused'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1">
              <button onClick={() => setIsActive(true)} className={cn('px-3 py-1.5 rounded-md text-sm font-medium transition-colors', isActive ? 'bg-green-50 text-green-700 shadow-sm' : 'text-slate-500 hover:text-slate-700')}>
                Active
              </button>
              <button onClick={() => setIsActive(false)} className={cn('px-3 py-1.5 rounded-md text-sm font-medium transition-colors', !isActive ? 'bg-slate-100 text-slate-700 shadow-sm' : 'text-slate-500 hover:text-slate-700')}>
                Paused
              </button>
            </div>

            <button className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 hover:text-[#1B4F72] transition-colors flex items-center gap-2">
              <Play size={16} />
              Test Call
            </button>

            <button className="px-4 py-2 rounded-lg bg-[#1B4F72] text-white font-medium hover:bg-[#153e5a] transition-colors flex items-center gap-2">
              <Edit size={16} />
              Edit
            </button>

            <button className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:text-[#1B4F72] hover:bg-slate-50 transition-colors">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8">
          {['Overview', 'Call History', 'Knowledge Base', 'Settings'].map(tab => {
          const id = tab.toLowerCase().replace(' ', '-');
          return <button key={tab} onClick={() => setActiveTab(id)} className={cn('py-4 px-1 border-b-2 font-medium text-sm transition-colors', activeTab === id ? 'border-[#1B4F72] text-[#1B4F72]' : 'border-transparent text-slate-500 hover:text-[#1B4F72] hover:border-slate-300')}>
                  {tab}
                </button>;
        })}
        </nav>
      </div>

      {/* Overview Content */}
      {activeTab === 'overview' && <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Performance Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-[#1B4F72]">
                  Performance
                </h2>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  {['Today', 'Week', 'Month', 'All Time'].map(range => {
                const id = range.toLowerCase().replace(' ', '');
                return <button key={range} onClick={() => setTimeRange(id)} className={cn('px-3 py-1 rounded-md text-xs font-medium transition-all', timeRange === id ? 'bg-white text-[#1B4F72] shadow-sm' : 'text-slate-500 hover:text-slate-700')}>
                        {range}
                      </button>;
              })}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {metrics.map((metric, i) => <div key={i} className="p-4 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-sm transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={cn('p-1.5 rounded-md', metric.color)}>
                        <metric.icon size={16} />
                      </div>
                      <span className="text-xs font-medium text-slate-500">
                        {metric.label}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-slate-900">
                        {metric.value}
                      </span>
                      {metric.sub && <span className="text-xs font-medium text-slate-400">
                          {metric.sub}
                        </span>}
                    </div>
                  </div>)}
              </div>
            </div>

            {/* Recent Activity Timeline */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-[#1B4F72] mb-6">
                Recent Activity
              </h2>
              <div className="space-y-6 relative pl-2">
                {/* Vertical line */}
                <div className="absolute left-[19px] top-2 bottom-4 w-0.5 bg-slate-100"></div>

                {recentActivity.map((activity, i) => <div key={i} className="relative flex items-start gap-4">
                    <div className={cn('relative z-10 w-2.5 h-2.5 rounded-full mt-2 flex-shrink-0 border-2 border-white shadow-sm', activity.status === 'success' ? 'bg-green-500' : activity.status === 'error' ? 'bg-red-500' : 'bg-slate-400')} />
                    <div className="flex-1 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-slate-900">
                            {activity.outcome}
                          </p>
                          <p className="text-sm text-slate-500">
                            with{' '}
                            <span className="text-slate-700">
                              {activity.contact}
                            </span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-medium text-slate-400">
                            {activity.time}
                          </p>
                          <p className="text-xs text-slate-400 font-mono mt-0.5">
                            {activity.duration}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>)}
              </div>
              <button className="w-full mt-4 py-2 text-sm font-medium text-[#1B4F72] hover:bg-blue-50 rounded-lg transition-colors">
                Load more activity
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Coordinator Info */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-center">
              <div className="w-24 h-24 mx-auto rounded-full bg-slate-100 border-4 border-white shadow-md flex items-center justify-center text-3xl font-bold text-[#1B4F72] mb-4">
                {coordinator.name.charAt(0)}
              </div>
              <h2 className="text-2xl font-bold text-[#1B4F72]">
                {coordinator.name}
              </h2>
              <p className="text-slate-500 mb-6">{coordinator.role}</p>

              <div className="space-y-3 text-left bg-slate-50 rounded-lg p-4 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Personality</span>
                  <span className="font-medium text-slate-900">
                    {coordinator.personality}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Voice</span>
                  <span className="font-medium text-slate-900">
                    {coordinator.voice}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Created</span>
                  <span className="font-medium text-slate-900">
                    {coordinator.created}
                  </span>
                </div>
                <div className="flex justify-between text-sm items-center pt-2 border-t border-slate-200 mt-2">
                  <span className="text-slate-500">Phone</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium text-slate-900">
                      {coordinator.phone}
                    </span>
                    <button className="text-slate-400 hover:text-[#1B4F72]">
                      <Copy size={12} />
                    </button>
                  </div>
                </div>
              </div>

              <Link to="#" className="text-sm font-medium text-[#1B4F72] hover:underline">
                Edit Profile
              </Link>
            </div>

            {/* Quick Stats Today */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-[#1B4F72] mb-4">
                Quick Stats Today
              </h3>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <div className="text-xl font-bold text-[#1B4F72]">23</div>
                  <div className="text-xs text-slate-500">Calls</div>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <div className="text-xl font-bold text-green-700">7</div>
                  <div className="text-xs text-slate-500">Booked</div>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg">
                  <div className="text-xl font-bold text-slate-700">3</div>
                  <div className="text-xs text-slate-500">Transferred</div>
                </div>
              </div>
            </div>

            {/* Phone Instructions */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-[#1B4F72] mb-4">
                Phone Instructions
              </h3>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex justify-between items-center mb-4">
                <div>
                  <div className="text-xs text-slate-500 mb-1">
                    Forward calls to:
                  </div>
                  <div className="font-mono font-bold text-lg text-slate-900">
                    {coordinator.phone}
                  </div>
                </div>
                <button className="p-2 text-slate-400 hover:text-[#1B4F72] hover:bg-white rounded-md transition-colors">
                  <Copy size={18} />
                </button>
              </div>

              <div className="space-y-2">
                {['AT&T', 'Verizon', 'T-Mobile'].map(carrier => <div key={carrier} className="border border-slate-100 rounded-lg overflow-hidden">
                    <button onClick={() => setExpandedInstruction(expandedInstruction === carrier ? null : carrier)} className="w-full flex justify-between items-center p-3 bg-white hover:bg-slate-50 text-sm font-medium text-slate-700 transition-colors">
                      {carrier} Instructions
                      {expandedInstruction === carrier ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                    {expandedInstruction === carrier && <div className="p-3 bg-slate-50 text-xs text-slate-600 border-t border-slate-100">
                        Dial *72 followed by your Coordinator number. Wait for
                        confirmation tone.
                      </div>}
                  </div>)}
              </div>
            </div>
          </div>
        </div>}

      {activeTab !== 'overview' && <div className="py-20 text-center bg-white rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-medium text-slate-900">Coming Soon</h3>
          <p className="text-slate-500 mt-2">
            The {activeTab} tab is under construction.
          </p>
        </div>}
    </div>;
}