import React from 'react';
import { MoreVertical, Phone, Calendar, Activity } from 'lucide-react';
import { cn } from '../../lib/utils';
interface CoordinatorCardProps {
  name: string;
  role: string;
  status: 'active' | 'paused';
  avatar?: string;
  stats?: {
    calls?: number;
    appointments?: number;
    successRate?: string;
  };
  phone?: string;
  price?: string;
  compact?: boolean;
}
export function CoordinatorCard({
  name,
  role,
  status,
  avatar,
  stats,
  phone,
  price,
  compact = false
}: CoordinatorCardProps) {
  return <div className={cn('bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group', status === 'active' && !compact ? 'border-l-4 border-l-[#1B4F72]' : '')}>
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium', status === 'active' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700')}>
            <span className={cn('w-1.5 h-1.5 rounded-full', status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-amber-500')} />
            {status === 'active' ? 'Active' : 'Paused'}
          </div>
          <button className="text-slate-400 hover:text-[#1B4F72]">
            <MoreVertical size={16} />
          </button>
        </div>

        <div className="flex flex-col items-center text-center mb-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center text-xl font-bold text-[#1B4F72] mb-3 overflow-hidden">
            {avatar ? <img src={avatar} alt={name} className="w-full h-full object-cover" /> : name.charAt(0)}
          </div>
          <h3 className="text-lg font-bold text-slate-900">{name}</h3>
          <div className="text-sm text-slate-500 flex items-center gap-1.5">
            {role}
            {price && <span className="text-slate-300">•</span>}
            {price && <span>{price}</span>}
          </div>
          {phone && <div className="mt-2 text-xs font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100">
              {phone}
            </div>}
        </div>

        {!compact && stats && <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 mt-2">
            <div className="text-center">
              <div className="text-xs text-slate-400 mb-1">Calls</div>
              <div className="font-semibold text-slate-700">{stats.calls}</div>
            </div>
            <div className="text-center border-l border-slate-100">
              <div className="text-xs text-slate-400 mb-1">Appts</div>
              <div className="font-semibold text-slate-700">
                {stats.appointments}
              </div>
            </div>
            <div className="text-center border-l border-slate-100">
              <div className="text-xs text-slate-400 mb-1">Success</div>
              <div className="font-semibold text-green-600">
                {stats.successRate}
              </div>
            </div>
          </div>}

        {compact && <div className="text-sm text-slate-500 text-center border-t border-slate-100 pt-3 mt-1">
            <span className="font-medium text-slate-900">15 calls</span> today
          </div>}

        {!compact && <div className="flex gap-3 mt-5">
            <button className="flex-1 py-2 px-3 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-[#1B4F72] transition-colors">
              View Details
            </button>
            <button className="flex-1 py-2 px-3 rounded-lg border border-transparent bg-blue-50 text-sm font-medium text-[#1B4F72] hover:bg-blue-100 transition-colors">
              Test Call
            </button>
          </div>}
      </div>
    </div>;
}