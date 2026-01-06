import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Filter } from 'lucide-react';
import { cn } from '../../lib/utils';
import { AppointmentModal } from './AppointmentModal';
export function CalendarView() {
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  // Mock appointments
  const appointments = [{
    id: 1,
    day: 1,
    start: 10.5,
    duration: 1,
    name: 'John Smith',
    type: 'Cleaning',
    coordinator: 'Ed',
    status: 'confirmed',
    color: 'bg-blue-100 border-blue-200 text-blue-800'
  }, {
    id: 2,
    day: 1,
    start: 14,
    duration: 1.5,
    name: 'Sarah Johnson',
    type: 'Consultation',
    coordinator: 'Sally',
    status: 'pending',
    color: 'bg-purple-100 border-purple-200 text-purple-800'
  }, {
    id: 3,
    day: 2,
    start: 9,
    duration: 2,
    name: 'Mike Brown',
    type: 'Service Call',
    coordinator: 'Marcus',
    status: 'confirmed',
    color: 'bg-amber-100 border-amber-200 text-amber-800'
  }, {
    id: 4,
    day: 3,
    start: 11,
    duration: 1,
    name: 'Emily Davis',
    type: 'Cleaning',
    coordinator: 'Ed',
    status: 'confirmed',
    color: 'bg-blue-100 border-blue-200 text-blue-800'
  }, {
    id: 5,
    day: 4,
    start: 15.5,
    duration: 1,
    name: 'Robert Taylor',
    type: 'Consultation',
    coordinator: 'Sally',
    status: 'cancelled',
    color: 'bg-slate-100 border-slate-200 text-slate-600'
  }];
  const weekDays = ['Mon 15', 'Tue 16', 'Wed 17', 'Thu 18', 'Fri 19', 'Sat 20', 'Sun 21'];
  const hours = Array.from({
    length: 11
  }, (_, i) => i + 8); // 8am to 6pm
  return <div className="h-[calc(100vh-100px)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-heading font-bold text-[#1B4F72]">
          Calendar
        </h1>

        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 p-1 rounded-lg">
            {['Day', 'Week', 'Month'].map(v => <button key={v} onClick={() => setView(v.toLowerCase() as any)} className={cn('px-4 py-1.5 rounded-md text-sm font-medium transition-all', view === v.toLowerCase() ? 'bg-white text-[#1B4F72] shadow-sm' : 'text-slate-500 hover:text-slate-700')}>
                {v}
              </button>)}
          </div>

          <button className="px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2">
            <Plus size={18} />
            Manual Appointment
          </button>
        </div>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 flex-shrink-0 flex flex-col gap-6 overflow-y-auto pr-2">
          {/* Mini Calendar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-slate-900">December 2025</span>
              <div className="flex gap-1">
                <button className="p-1 hover:bg-slate-100 rounded">
                  <ChevronLeft size={16} />
                </button>
                <button className="p-1 hover:bg-slate-100 rounded">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className="text-slate-400 font-medium">
                  {d}
                </div>)}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {Array.from({
              length: 31
            }, (_, i) => i + 1).map(d => <button key={d} className={cn('w-7 h-7 rounded-full flex items-center justify-center hover:bg-slate-50 relative', d === 15 ? 'bg-[#1B4F72] text-white hover:bg-[#1B4F72]' : 'text-slate-700')}>
                  {d}
                  {[15, 16, 17, 18].includes(d) && <div className={cn('absolute bottom-1 w-1 h-1 rounded-full', d === 15 ? 'bg-white' : 'bg-[#1B4F72]')} />}
                </button>)}
            </div>
          </div>

          {/* Upcoming Today */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex-1">
            <h3 className="font-bold text-[#1B4F72] mb-4">Upcoming Today</h3>
            <div className="space-y-3">
              {[{
              time: '10:30 AM',
              name: 'John Smith',
              type: 'Cleaning'
            }, {
              time: '2:00 PM',
              name: 'Sarah Johnson',
              type: 'Consultation'
            }].map((appt, i) => <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-[#1B4F72] transition-colors cursor-pointer">
                  <div className="text-xs font-bold text-[#1B4F72] mb-1">
                    {appt.time}
                  </div>
                  <div className="font-medium text-slate-900 text-sm">
                    {appt.name}
                  </div>
                  <div className="text-xs text-slate-500">{appt.type}</div>
                </div>)}
            </div>
          </div>

          {/* Filters */}
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                By Coordinator
              </h4>
              <div className="space-y-2">
                {['Sally', 'Ed', 'Marcus'].map(name => <label key={name} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-[#1B4F72] focus:ring-[#1B4F72]" />
                    {name}
                  </label>)}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                By Type
              </h4>
              <div className="space-y-2">
                {['Cleaning', 'Consultation', 'Service Call'].map(type => <label key={type} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-[#1B4F72] focus:ring-[#1B4F72]" />
                    {type}
                  </label>)}
              </div>
            </div>
          </div>
        </div>

        {/* Main Calendar */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          {/* Week Header */}
          <div className="flex border-b border-slate-200">
            <div className="w-16 flex-shrink-0 border-r border-slate-200 bg-slate-50"></div>
            <div className="flex-1 grid grid-cols-7">
              {weekDays.map((day, i) => <div key={day} className={cn('py-3 text-center border-r border-slate-100 last:border-0', i === 0 ? 'bg-blue-50/30' : '')}>
                  <div className={cn('text-sm font-medium', i === 0 ? 'text-[#1B4F72] font-bold' : 'text-slate-600')}>
                    {day}
                  </div>
                </div>)}
            </div>
          </div>

          {/* Time Grid */}
          <div className="flex-1 overflow-y-auto relative">
            <div className="flex min-h-[600px]">
              {/* Time Column */}
              <div className="w-16 flex-shrink-0 border-r border-slate-200 bg-slate-50 text-xs text-slate-500 font-medium text-right pr-2 pt-2">
                {hours.map(h => <div key={h} className="h-16 -mt-2.5">
                    {h > 12 ? h - 12 : h} {h >= 12 ? 'PM' : 'AM'}
                  </div>)}
              </div>

              {/* Days Grid */}
              <div className="flex-1 grid grid-cols-7 relative">
                {/* Horizontal Lines */}
                {hours.map(h => <div key={h} className="absolute w-full border-b border-slate-100 h-16" style={{
                top: (h - 8) * 64
              }} />)}

                {/* Vertical Lines */}
                {Array.from({
                length: 7
              }).map((_, i) => <div key={i} className="border-r border-slate-100 h-full relative">
                    {/* Current Time Indicator (only on first day for demo) */}
                    {i === 0 && <div className="absolute top-[160px] w-full border-t-2 border-red-500 z-10">
                        <div className="absolute -left-1.5 -top-1.5 w-3 h-3 rounded-full bg-red-500" />
                      </div>}
                  </div>)}

                {/* Appointments */}
                {appointments.map(appt => <div key={appt.id} onClick={() => setSelectedAppointment({
                ...appt,
                time: `${appt.start > 12 ? appt.start - 12 : appt.start}:00 ${appt.start >= 12 ? 'PM' : 'AM'}`,
                endTime: `${appt.start + appt.duration > 12 ? appt.start + appt.duration - 12 : appt.start + appt.duration}:00 ${appt.start + appt.duration >= 12 ? 'PM' : 'AM'}`
              })} className={cn('absolute left-1 right-1 rounded-md border p-2 text-xs cursor-pointer hover:shadow-md transition-shadow overflow-hidden', appt.color)} style={{
                top: (appt.start - 8) * 64,
                height: appt.duration * 64,
                gridColumnStart: appt.day,
                gridColumnEnd: appt.day + 1
              }}>
                    <div className="font-bold truncate">
                      {appt.start > 12 ? appt.start - 12 : appt.start}:00 -{' '}
                      {appt.name}
                    </div>
                    <div className="truncate opacity-80">{appt.type}</div>
                    <div className="flex items-center gap-1 mt-1 opacity-70">
                      <CalendarIcon size={10} />
                      {appt.coordinator}
                    </div>
                  </div>)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AppointmentModal appointment={selectedAppointment} isOpen={!!selectedAppointment} onClose={() => setSelectedAppointment(null)} />
    </div>;
}