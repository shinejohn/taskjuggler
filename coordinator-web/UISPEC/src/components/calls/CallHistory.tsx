import React, { useState } from 'react';
import { Search, Filter, Download, Calendar, Play, FileText, MoreVertical, ArrowDownLeft, ArrowUpRight, Clock, Phone } from 'lucide-react';
import { cn } from '../../lib/utils';
import { CallDetailPanel } from './CallDetailPanel';
export function CallHistory() {
  const [selectedCall, setSelectedCall] = useState<any>(null);
  // Mock data
  const calls = [{
    id: 1,
    time: '2:34 PM',
    date: 'Today',
    contact: 'John Smith',
    phone: '(555) 234-5678',
    coordinator: 'Sally',
    direction: 'inbound',
    duration: '3:42',
    outcome: 'Appointment Booked'
  }, {
    id: 2,
    time: '1:15 PM',
    date: 'Today',
    contact: 'Unknown',
    phone: '(555) 111-2222',
    coordinator: 'Sally',
    direction: 'inbound',
    duration: '1:23',
    outcome: 'Info Only'
  }, {
    id: 3,
    time: '11:30 AM',
    date: 'Today',
    contact: 'Sarah Johnson',
    phone: '(555) 345-6789',
    coordinator: 'Ed',
    direction: 'outbound',
    duration: '2:15',
    outcome: 'Confirmed'
  }, {
    id: 4,
    time: '10:05 AM',
    date: 'Today',
    contact: 'Mike Brown',
    phone: '(555) 456-7890',
    coordinator: 'Sally',
    direction: 'inbound',
    duration: '0:45',
    outcome: 'Transferred'
  }, {
    id: 5,
    time: '9:20 AM',
    date: 'Today',
    contact: 'Emily Davis',
    phone: '(555) 567-8901',
    coordinator: 'Marcus',
    direction: 'inbound',
    duration: '4:12',
    outcome: 'Appointment Booked'
  }, {
    id: 6,
    time: '4:45 PM',
    date: 'Yesterday',
    contact: 'Robert Taylor',
    phone: '(555) 678-9012',
    coordinator: 'Ed',
    direction: 'outbound',
    duration: '1:10',
    outcome: 'Voicemail'
  }, {
    id: 7,
    time: '2:30 PM',
    date: 'Yesterday',
    contact: 'Jennifer Lee',
    phone: '(555) 789-0123',
    coordinator: 'Sally',
    direction: 'inbound',
    duration: '2:55',
    outcome: 'Rescheduled'
  }, {
    id: 8,
    time: '11:15 AM',
    date: 'Yesterday',
    contact: 'David Miller',
    phone: '(555) 890-1234',
    coordinator: 'Ed',
    direction: 'inbound',
    duration: '0:30',
    outcome: 'Spam Blocked'
  }];
  return <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-[#1B4F72]">
            Call History
          </h1>
          <p className="text-slate-500 mt-1">2,847 total calls</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
            <Calendar size={18} />
            Last 30 Days
          </button>
          <button className="px-4 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-[#1B4F72] rounded-lg">
            <Phone size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">47</div>
            <div className="text-sm text-slate-500">Calls Today</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <Clock size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">2:34</div>
            <div className="text-sm text-slate-500">Avg Duration</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <Calendar size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">32%</div>
            <div className="text-sm text-slate-500">Booking Rate</div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-slate-400" size={20} />
          <input type="text" placeholder="Search by contact name or phone..." className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]" />
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          {['Coordinator', 'Direction', 'Outcome', 'Duration'].map(filter => <div key={filter} className="relative">
              <select className="appearance-none pl-3 pr-8 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] cursor-pointer hover:bg-slate-50">
                <option>{filter}: All</option>
                <option>Option 1</option>
                <option>Option 2</option>
              </select>
              <Filter className="absolute right-2.5 top-2 text-slate-400 pointer-events-none" size={12} />
            </div>)}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Date/Time</th>
                <th className="px-6 py-3">Contact</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Coordinator</th>
                <th className="px-6 py-3">Direction</th>
                <th className="px-6 py-3">Duration</th>
                <th className="px-6 py-3">Outcome</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {calls.map(call => <tr key={call.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setSelectedCall(call)}>
                  <td className="px-6 py-4 text-slate-500">
                    <div className="font-medium text-slate-900">
                      {call.time}
                    </div>
                    <div className="text-xs">{call.date}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                        {call.contact.charAt(0)}
                      </div>
                      {call.contact}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                    {call.phone}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-50 text-[#1B4F72] flex items-center justify-center text-[10px] font-bold">
                        {call.coordinator.charAt(0)}
                      </div>
                      <span className="text-sm text-slate-600">
                        {call.coordinator}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium', call.direction === 'inbound' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700')}>
                      {call.direction === 'inbound' ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                      {call.direction === 'inbound' ? 'Inbound' : 'Outbound'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                    {call.duration}
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', call.outcome.includes('Booked') || call.outcome.includes('Confirmed') ? 'bg-green-50 text-green-700' : call.outcome.includes('Info') ? 'bg-blue-50 text-blue-700' : call.outcome.includes('Transferred') ? 'bg-amber-50 text-amber-700' : call.outcome.includes('Spam') ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-600')}>
                      {call.outcome}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-[#1B4F72] rounded hover:bg-slate-100" title="Play Recording">
                        <Play size={16} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-[#1B4F72] rounded hover:bg-slate-100" title="View Transcript">
                        <FileText size={16} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-[#1B4F72] rounded hover:bg-slate-100">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>

      <CallDetailPanel call={selectedCall} isOpen={!!selectedCall} onClose={() => setSelectedCall(null)} />
    </div>;
}