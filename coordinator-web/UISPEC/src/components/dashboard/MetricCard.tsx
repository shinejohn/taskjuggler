import React from 'react';
import { ArrowUp, ArrowDown, Minus, BoxIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
interface MetricCardProps {
  title: string;
  value: string | number;
  icon: BoxIcon;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
    label?: string;
  };
  subStat?: string;
}
export function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  subStat
}: MetricCardProps) {
  return <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 bg-blue-50 text-[#1B4F72] rounded-lg">
          <Icon size={20} />
        </div>
        {trend && <div className={cn('flex items-center text-xs font-medium px-2 py-1 rounded-full', trend.direction === 'up' ? 'text-green-700 bg-green-50' : trend.direction === 'down' ? 'text-red-700 bg-red-50' : 'text-slate-600 bg-slate-100')}>
            {trend.direction === 'up' && <ArrowUp size={12} className="mr-1" />}
            {trend.direction === 'down' && <ArrowDown size={12} className="mr-1" />}
            {trend.direction === 'neutral' && <Minus size={12} className="mr-1" />}
            {trend.value}
          </div>}
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-medium text-slate-500">{title}</h3>
        <div className="text-3xl font-bold text-slate-900">{value}</div>
        {subStat && <p className="text-xs text-slate-400 mt-1">{subStat}</p>}
        {trend?.label && <p className="text-xs text-slate-400 mt-1">{trend.label}</p>}
      </div>
    </div>;
}