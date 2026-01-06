import React from 'react';
import { X, Phone, Play, Pause, SkipBack, SkipForward, User, Calendar, Clock, Download, Share2, MoreVertical, MessageSquare } from 'lucide-react';
import { cn } from '../../lib/utils';
interface CallDetailPanelProps {
  call: any;
  isOpen: boolean;
  onClose: () => void;
}
export function CallDetailPanel({
  call,
  isOpen,
  onClose
}: CallDetailPanelProps) {
  if (!call) return null;
  return <>
      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 bg-black/20 z-40 transition-opacity" onClick={onClose} />}

      {/* Panel */}
      <div className={cn('fixed top-0 right-0 h-full w-full sm:w-[500px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto flex flex-col', isOpen ? 'translate-x-0' : 'translate-x-full')}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex justify-between items-start z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Call Details</h2>
            <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
              <Calendar size={14} />
              <span>Dec 15, 2025 at {call.time}</span>
              <span>•</span>
              <Clock size={14} />
              <span>{call.duration}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
              <Download size={20} />
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 p-6 space-y-8 overflow-y-auto">
          {/* Participants */}
          <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                <User size={20} />
              </div>
              <div>
                <div className="font-bold text-slate-900">{call.contact}</div>
                <div className="text-xs text-slate-500">{call.phone}</div>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="flex items-center gap-3 text-right">
              <div>
                <div className="font-bold text-slate-900">
                  {call.coordinator}
                </div>
                <div className="text-xs text-slate-500">Coordinator</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 text-[#1B4F72] flex items-center justify-center font-bold">
                {call.coordinator.charAt(0)}
              </div>
            </div>
          </div>

          {/* Outcome Badge */}
          <div className="flex justify-center">
            <span className={cn('px-4 py-1.5 rounded-full text-sm font-medium border', call.outcome.includes('Booked') || call.outcome.includes('Confirmed') ? 'bg-green-50 text-green-700 border-green-200' : call.outcome.includes('Info') ? 'bg-blue-50 text-blue-700 border-blue-200' : call.outcome.includes('Transferred') ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-50 text-slate-600 border-slate-200')}>
              {call.outcome}
            </span>
          </div>

          {/* Audio Player */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">Recording</h3>
              <div className="flex gap-2 text-xs font-medium text-slate-500">
                <button className="hover:text-[#1B4F72]">1x</button>
                <button className="hover:text-[#1B4F72]">1.5x</button>
                <button className="hover:text-[#1B4F72]">2x</button>
              </div>
            </div>

            {/* Waveform Visualization */}
            <div className="h-12 flex items-center gap-0.5 mb-4 px-2">
              {Array.from({
              length: 40
            }).map((_, i) => <div key={i} className={cn('w-1.5 rounded-full transition-all', i < 15 ? 'bg-[#1B4F72]' : 'bg-slate-200')} style={{
              height: `${Math.max(20, Math.random() * 100)}%`
            }} />)}
            </div>

            <div className="flex items-center gap-4">
              <button className="w-10 h-10 rounded-full bg-[#1B4F72] text-white flex items-center justify-center hover:bg-[#153e5a] transition-colors shadow-sm">
                <Play size={18} fill="currentColor" className="ml-0.5" />
              </button>
              <div className="flex-1">
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#1B4F72] w-[35%]"></div>
                </div>
              </div>
              <div className="text-xs font-mono text-slate-500">
                1:15 / {call.duration}
              </div>
            </div>
          </div>

          {/* AI Summary */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-[10px]">✨</span>
              </div>
              AI Summary
            </h3>
            <div className="bg-purple-50 rounded-xl p-4 text-sm text-slate-700 border border-purple-100">
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Caller inquired about availability for a cleaning appointment.
                </li>
                <li>
                  Coordinator confirmed availability for Wednesday morning.
                </li>
                <li>Appointment booked for 10:30 AM on Dec 15.</li>
                <li>Caller asked about parking validation (confirmed yes).</li>
              </ul>
            </div>
          </div>

          {/* Transcript */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <MessageSquare size={16} className="text-slate-400" />
              Transcript
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex gap-3">
                <div className="font-bold text-slate-900 min-w-[60px]">
                  0:00
                </div>
                <div>
                  <span className="font-bold text-[#1B4F72]">
                    {call.coordinator}:
                  </span>{' '}
                  Thank you for calling Dr. Smith's office, this is{' '}
                  {call.coordinator}. How can I help you today?
                </div>
              </div>
              <div className="flex gap-3">
                <div className="font-bold text-slate-900 min-w-[60px]">
                  0:08
                </div>
                <div>
                  <span className="font-bold text-slate-700">Caller:</span> Hi,
                  I'd like to schedule a cleaning. Do you have anything open
                  this week?
                </div>
              </div>
              <div className="flex gap-3">
                <div className="font-bold text-slate-900 min-w-[60px]">
                  0:15
                </div>
                <div>
                  <span className="font-bold text-[#1B4F72]">
                    {call.coordinator}:
                  </span>{' '}
                  I can certainly check that for you. I have an opening on
                  Wednesday at 10:30 AM. Would that work?
                </div>
              </div>
              <div className="flex gap-3">
                <div className="font-bold text-slate-900 min-w-[60px]">
                  0:22
                </div>
                <div>
                  <span className="font-bold text-slate-700">Caller:</span> Yes,
                  that's perfect.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50">
          <button className="w-full py-2.5 border border-slate-200 bg-white text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
            View Contact Profile
          </button>
        </div>
      </div>
    </>;
}