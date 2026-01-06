import React from 'react';
import { Phone, Calendar, Users, Target, Plus, ArrowRight, Download, Megaphone, BarChart3, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MetricCard } from './MetricCard';
import { CoordinatorCard } from './CoordinatorCard';
import { cn } from '../../lib/utils';
export function Dashboard() {
  return <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-[#1B4F72]">
            Dashboard
          </h1>
          <p className="text-slate-500 mt-1">
            Welcome back! Here's what's happening with your Coordinators.
          </p>
        </div>
        <Link to="/coordinators" className="px-5 py-2.5 bg-[#F59E0B] hover:bg-[#D97706] text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2">
          Manage Coordinators
          <ArrowRight size={18} />
        </Link>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Calls Today" value="23" icon={Phone} trend={{
        value: '12%',
        direction: 'up',
        label: 'from yesterday'
      }} />
        <MetricCard title="Appointments This Week" value="47" icon={Calendar} trend={{
        value: '8%',
        direction: 'up',
        label: 'from last week'
      }} />
        <MetricCard title="Total Contacts" value="1,284" icon={Users} subStat="+23 new this week" />
        <MetricCard title="No-Show Rate" value="8%" icon={Target} trend={{
        value: '3%',
        direction: 'down',
        label: 'improvement'
      }} // Down is good for no-show rate
      />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Active Coordinators + Recent Calls) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Active Coordinators Section */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#1B4F72]">
                Active Coordinators
              </h2>
              <Link to="/coordinators" className="text-sm font-medium text-[#1B4F72] hover:underline">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CoordinatorCard name="Sally" role="Receptionist" status="active" compact={true} />
              <CoordinatorCard name="Ed" role="Appointment Scheduler" status="active" compact={true} />
              <CoordinatorCard name="Marcus" role="Support Agent" status="paused" compact={true} />

              {/* Add Coordinator Card */}
              <Link to="/coordinators" className="bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 hover:border-[#1B4F72] hover:bg-blue-50/50 transition-all duration-200 flex flex-col items-center justify-center p-6 group cursor-pointer h-full min-h-[200px]">
                <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-[#1B4F72] group-hover:border-[#1B4F72] mb-3 transition-colors shadow-sm">
                  <Plus size={24} />
                </div>
                <span className="font-medium text-slate-600 group-hover:text-[#1B4F72]">
                  Add Coordinator
                </span>
              </Link>
            </div>
          </section>

          {/* Recent Calls Section */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#1B4F72]">Recent Calls</h2>
              <Link to="/calls" className="text-sm font-medium text-[#1B4F72] hover:underline">
                View All
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3">Time</th>
                    <th className="px-6 py-3">Contact</th>
                    <th className="px-6 py-3">Coordinator</th>
                    <th className="px-6 py-3">Duration</th>
                    <th className="px-6 py-3">Outcome</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[{
                  time: '10:42 AM',
                  contact: 'John Smith',
                  coord: 'Sally',
                  dur: '2m 14s',
                  outcome: 'Appointment Booked',
                  status: 'success'
                }, {
                  time: '10:15 AM',
                  contact: 'Sarah Johnson',
                  coord: 'Ed',
                  dur: '1m 05s',
                  outcome: 'Left Voicemail',
                  status: 'neutral'
                }, {
                  time: '09:58 AM',
                  contact: 'Mike Brown',
                  coord: 'Sally',
                  dur: '4m 32s',
                  outcome: 'Inquiry Resolved',
                  status: 'success'
                }, {
                  time: '09:30 AM',
                  contact: 'Emily Davis',
                  coord: 'Marcus',
                  dur: '0m 45s',
                  outcome: 'Call Dropped',
                  status: 'error'
                }, {
                  time: '09:12 AM',
                  contact: 'Unknown',
                  coord: 'Sally',
                  dur: '1m 20s',
                  outcome: 'Spam Blocked',
                  status: 'neutral'
                }].map((call, i) => <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-slate-500">{call.time}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {call.contact}
                      </td>
                      <td className="px-6 py-4 text-slate-600">{call.coord}</td>
                      <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                        {call.dur}
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', call.status === 'success' ? 'bg-green-50 text-green-700' : call.status === 'error' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-600')}>
                          {call.outcome}
                        </span>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right Column (Appointments + Quick Actions) */}
        <div className="space-y-8">
          {/* Today's Appointments */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#1B4F72]">
                Today's Appointments
              </h2>
              <Link to="/calendar" className="text-sm font-medium text-[#1B4F72] hover:underline">
                View Calendar
              </Link>
            </div>

            <div className="relative pl-4 border-l-2 border-slate-100 space-y-8">
              {[{
              time: '10:30 AM',
              name: 'John Smith',
              type: 'Cleaning',
              coord: 'Ed',
              status: 'confirmed'
            }, {
              time: '11:15 AM',
              name: 'Lisa Wong',
              type: 'Consultation',
              coord: 'Sally',
              status: 'pending'
            }, {
              time: '01:00 PM',
              name: 'Robert Taylor',
              type: 'Root Canal',
              coord: 'Ed',
              status: 'confirmed'
            }, {
              time: '02:30 PM',
              name: 'Jennifer Lee',
              type: 'Checkup',
              coord: 'Sally',
              status: 'cancelled'
            }, {
              time: '04:00 PM',
              name: 'David Miller',
              type: 'Cleaning',
              coord: 'Ed',
              status: 'confirmed'
            }].map((appt, i) => <div key={i} className="relative">
                  <div className={cn('absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white shadow-sm', appt.status === 'confirmed' ? 'bg-green-500' : appt.status === 'pending' ? 'bg-amber-500' : 'bg-red-500')} />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-400 mb-1">
                      {appt.time}
                    </span>
                    <h4 className="font-semibold text-slate-900">
                      {appt.name}
                    </h4>
                    <p className="text-sm text-slate-500">{appt.type}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                      <span>via {appt.coord}</span>
                      {appt.status === 'confirmed' && <CheckCircle2 size={12} className="text-green-500 ml-1" />}
                      {appt.status === 'cancelled' && <XCircle size={12} className="text-red-500 ml-1" />}
                    </div>
                  </div>
                </div>)}
            </div>
          </section>

          {/* Quick Actions */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-xl font-bold text-[#1B4F72] mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-[#1B4F72] hover:bg-blue-50 transition-all text-left group">
                <div className="p-2 bg-slate-100 text-slate-600 rounded-lg group-hover:bg-white group-hover:text-[#1B4F72]">
                  <Download size={18} />
                </div>
                <span className="font-medium text-slate-700 group-hover:text-[#1B4F72]">
                  Import Contacts
                </span>
              </button>

              <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-[#1B4F72] hover:bg-blue-50 transition-all text-left group">
                <div className="p-2 bg-slate-100 text-slate-600 rounded-lg group-hover:bg-white group-hover:text-[#1B4F72]">
                  <Megaphone size={18} />
                </div>
                <span className="font-medium text-slate-700 group-hover:text-[#1B4F72]">
                  Create Campaign
                </span>
              </button>

              <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-[#1B4F72] hover:bg-blue-50 transition-all text-left group">
                <div className="p-2 bg-slate-100 text-slate-600 rounded-lg group-hover:bg-white group-hover:text-[#1B4F72]">
                  <BarChart3 size={18} />
                </div>
                <span className="font-medium text-slate-700 group-hover:text-[#1B4F72]">
                  View Analytics
                </span>
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>;
}