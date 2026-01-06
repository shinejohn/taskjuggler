import React, { useState } from 'react';
import { MoreVertical, Play, Eye, Edit, Pause, Trash2, Phone, Calendar, TrendingUp } from 'lucide-react';
import { cn } from '../../lib/utils';
interface PersonaCardProps {
  name: string;
  role: string;
  status: 'active' | 'paused';
  avatar?: string;
  price?: string;
  stats?: {
    calls?: number;
    appointments?: number;
    successRate?: string;
  };
  size?: 'small' | 'medium' | 'large';
  selected?: boolean;
  onAction?: (action: 'edit' | 'pause' | 'delete' | 'test' | 'view') => void;
  className?: string;
}
export function PersonaCard({
  name,
  role,
  status,
  avatar,
  price,
  stats,
  size = 'medium',
  selected = false,
  onAction,
  className
}: PersonaCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const sizeClasses = {
    small: 'p-3',
    medium: 'p-5',
    large: 'p-6'
  };
  const avatarSizes = {
    small: 'w-10 h-10 text-sm',
    medium: 'w-16 h-16 text-xl',
    large: 'w-20 h-20 text-2xl'
  };
  const nameSizes = {
    small: 'text-sm',
    medium: 'text-lg',
    large: 'text-2xl'
  };
  return <div className={cn('bg-white rounded-xl border shadow-sm transition-all duration-200', selected ? 'border-[#1B4F72] ring-2 ring-[#1B4F72]/20' : 'border-slate-200 hover:shadow-md hover:-translate-y-0.5', sizeClasses[size], className)}>
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium', status === 'active' ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600')}>
          <span className={cn('w-1.5 h-1.5 rounded-full', status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-slate-400')} />
          {status === 'active' ? 'Active' : 'Paused'}
        </div>

        {size !== 'small' && <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100 transition-colors">
              <MoreVertical size={16} />
            </button>

            {showMenu && <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10">
                <button onClick={() => {
            onAction?.('edit');
            setShowMenu(false);
          }} className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                  <Edit size={14} />
                  Edit
                </button>
                <button onClick={() => {
            onAction?.('pause');
            setShowMenu(false);
          }} className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                  <Pause size={14} />
                  {status === 'active' ? 'Pause' : 'Resume'}
                </button>
                <button onClick={() => {
            onAction?.('delete');
            setShowMenu(false);
          }} className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>}
          </div>}
      </div>

      {/* Avatar & Info */}
      <div className="flex flex-col items-center text-center mb-4">
        <div className={cn('rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center font-bold text-[#1B4F72] mb-3 overflow-hidden', avatarSizes[size])}>
          {avatar ? <img src={avatar} alt={name} className="w-full h-full object-cover" /> : name.charAt(0)}
        </div>
        <h3 className={cn('font-bold text-slate-900', nameSizes[size])}>
          {name}
        </h3>
        <div className="text-sm text-slate-500 flex items-center gap-1.5">
          {role}
          {price && <>
              <span className="text-slate-300">•</span>
              <span>{price}</span>
            </>}
        </div>
      </div>

      {/* Stats */}
      {stats && size !== 'small' && <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 mb-4">
          {stats.calls !== undefined && <div className="text-center">
              <div className="text-xs text-slate-400 mb-1 flex items-center justify-center gap-1">
                <Phone size={10} />
                Calls
              </div>
              <div className="font-semibold text-slate-700">{stats.calls}</div>
            </div>}
          {stats.appointments !== undefined && <div className="text-center border-l border-slate-100">
              <div className="text-xs text-slate-400 mb-1 flex items-center justify-center gap-1">
                <Calendar size={10} />
                Appts
              </div>
              <div className="font-semibold text-slate-700">
                {stats.appointments}
              </div>
            </div>}
          {stats.successRate && <div className="text-center border-l border-slate-100">
              <div className="text-xs text-slate-400 mb-1 flex items-center justify-center gap-1">
                <TrendingUp size={10} />
                Success
              </div>
              <div className="font-semibold text-green-600">
                {stats.successRate}
              </div>
            </div>}
        </div>}

      {/* Actions */}
      {size !== 'small' && <div className="flex gap-2">
          <button onClick={() => onAction?.('view')} className="flex-1 py-2 px-3 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-[#1B4F72] transition-colors flex items-center justify-center gap-2">
            <Eye size={14} />
            View
          </button>
          <button onClick={() => onAction?.('test')} className="flex-1 py-2 px-3 rounded-lg bg-blue-50 text-sm font-medium text-[#1B4F72] hover:bg-blue-100 transition-colors flex items-center justify-center gap-2">
            <Play size={14} />
            Test
          </button>
        </div>}
    </div>;
}