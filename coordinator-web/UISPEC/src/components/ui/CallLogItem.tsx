import React from 'react';
import { ArrowDownLeft, ArrowUpRight, Play, FileText, MoreVertical, Phone } from 'lucide-react';
import { cn } from '../../lib/utils';
interface CallLogItemProps {
  direction: 'inbound' | 'outbound';
  contact: {
    name: string;
    phone: string;
  };
  coordinator: {
    name: string;
    avatar?: string;
  };
  duration: string;
  outcome: 'booked' | 'confirmed' | 'information' | 'transferred' | 'voicemail' | 'no-answer' | 'failed';
  timestamp: string;
  hasRecording?: boolean;
  hasTranscript?: boolean;
  selected?: boolean;
  onPlay?: () => void;
  onViewTranscript?: () => void;
  onClick?: () => void;
  className?: string;
}
const outcomeConfig = {
  booked: {
    label: 'Appointment Booked',
    color: 'bg-green-50 text-green-700 border-green-200'
  },
  confirmed: {
    label: 'Confirmed',
    color: 'bg-green-50 text-green-700 border-green-200'
  },
  information: {
    label: 'Information',
    color: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  transferred: {
    label: 'Transferred',
    color: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  voicemail: {
    label: 'Voicemail',
    color: 'bg-slate-100 text-slate-600 border-slate-200'
  },
  'no-answer': {
    label: 'No Answer',
    color: 'bg-slate-100 text-slate-600 border-slate-200'
  },
  failed: {
    label: 'Failed',
    color: 'bg-red-50 text-red-700 border-red-200'
  }
};
export function CallLogItem({
  direction,
  contact,
  coordinator,
  duration,
  outcome,
  timestamp,
  hasRecording = false,
  hasTranscript = false,
  selected = false,
  onPlay,
  onViewTranscript,
  onClick,
  className
}: CallLogItemProps) {
  const outcomeStyle = outcomeConfig[outcome];
  return <div onClick={onClick} className={cn('flex items-center gap-4 p-4 border-b border-slate-100 transition-all cursor-pointer', selected ? 'bg-blue-50 border-l-4 border-l-[#1B4F72]' : 'hover:bg-slate-50', className)}>
      {/* Direction Icon */}
      <div className={cn('flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center', direction === 'inbound' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600')}>
        {direction === 'inbound' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
      </div>

      {/* Contact Info */}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-slate-900 truncate">
          {contact.name}
        </div>
        <div className="text-xs text-slate-500 font-mono">{contact.phone}</div>
      </div>

      {/* Coordinator */}
      <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
        <div className="w-6 h-6 rounded-full bg-blue-100 text-[#1B4F72] flex items-center justify-center text-[10px] font-bold">
          {coordinator.avatar ? <img src={coordinator.avatar} alt={coordinator.name} className="w-full h-full rounded-full object-cover" /> : coordinator.name.charAt(0)}
        </div>
        <span className="text-sm text-slate-600 hidden md:inline">
          {coordinator.name}
        </span>
      </div>

      {/* Duration */}
      <div className="flex-shrink-0 text-sm font-mono text-slate-500 hidden sm:block">
        {duration}
      </div>

      {/* Outcome Badge */}
      <div className="flex-shrink-0">
        <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border', outcomeStyle.color)}>
          {outcomeStyle.label}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0" onClick={e => e.stopPropagation()}>
        {hasRecording && <button onClick={onPlay} className="p-1.5 text-slate-400 hover:text-[#1B4F72] rounded hover:bg-slate-100 transition-colors" title="Play Recording">
            <Play size={16} />
          </button>}
        {hasTranscript && <button onClick={onViewTranscript} className="p-1.5 text-slate-400 hover:text-[#1B4F72] rounded hover:bg-slate-100 transition-colors" title="View Transcript">
            <FileText size={16} />
          </button>}
        <button className="p-1.5 text-slate-400 hover:text-[#1B4F72] rounded hover:bg-slate-100 transition-colors" title="More Options">
          <MoreVertical size={16} />
        </button>
      </div>

      {/* Timestamp (mobile only) */}
      <div className="sm:hidden absolute top-2 right-2 text-xs text-slate-400">
        {timestamp}
      </div>
    </div>;
}