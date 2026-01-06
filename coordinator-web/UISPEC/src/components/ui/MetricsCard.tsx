import React from 'react';
import { TrendingUp, TrendingDown, Minus, BoxIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
interface MetricsCardProps {
  label: string;
  value: string | number;
  icon: BoxIcon;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
    label?: string;
  };
  progress?: {
    current: number;
    total: number;
    label?: string;
  };
  sparkline?: number[];
  variant?: 'default' | 'success' | 'warning' | 'danger';
  size?: 'standard' | 'compact';
  className?: string;
}
export function MetricsCard({
  label,
  value,
  icon: Icon,
  trend,
  progress,
  sparkline,
  variant = 'default',
  size = 'standard',
  className
}: MetricsCardProps) {
  const variantClasses = {
    default: 'bg-blue-50 text-[#1B4F72]',
    success: 'bg-green-50 text-green-600',
    warning: 'bg-amber-50 text-amber-600',
    danger: 'bg-red-50 text-red-600'
  };
  const trendColors = {
    up: 'text-green-600 bg-green-50',
    down: 'text-red-600 bg-red-50',
    neutral: 'text-slate-600 bg-slate-100'
  };
  const progressColors = {
    default: 'bg-[#1B4F72]',
    success: 'bg-green-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500'
  };
  return <div className={cn('bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow', size === 'standard' ? 'p-6' : 'p-4', className)}>
      <div className="flex justify-between items-start mb-4">
        <div className={cn('p-2.5 rounded-lg', variantClasses[variant])}>
          <Icon size={size === 'standard' ? 20 : 16} />
        </div>
        {trend && <div className={cn('flex items-center text-xs font-medium px-2 py-1 rounded-full', trendColors[trend.direction])}>
            {trend.direction === 'up' && <TrendingUp size={12} className="mr-1" />}
            {trend.direction === 'down' && <TrendingDown size={12} className="mr-1" />}
            {trend.direction === 'neutral' && <Minus size={12} className="mr-1" />}
            {trend.value}
          </div>}
      </div>

      <div className="space-y-1">
        <h3 className={cn('font-medium text-slate-500', size === 'standard' ? 'text-sm' : 'text-xs')}>
          {label}
        </h3>
        <div className={cn('font-bold text-slate-900', size === 'standard' ? 'text-3xl' : 'text-2xl')}>
          {value}
        </div>
        {trend?.label && <p className="text-xs text-slate-400 mt-1">{trend.label}</p>}
      </div>

      {/* Progress Bar */}
      {progress && <div className="mt-4">
          <div className="flex justify-between text-xs text-slate-500 mb-2">
            <span>{progress.label || 'Progress'}</span>
            <span>
              {progress.current} / {progress.total}
            </span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className={cn('h-full rounded-full transition-all duration-500', progressColors[variant])} style={{
          width: `${progress.current / progress.total * 100}%`
        }} />
          </div>
        </div>}

      {/* Sparkline */}
      {sparkline && sparkline.length > 0 && <div className="mt-4 h-12 flex items-end gap-0.5">
          {sparkline.map((value, i) => {
        const maxValue = Math.max(...sparkline);
        const height = value / maxValue * 100;
        return <div key={i} className={cn('flex-1 rounded-t transition-all duration-300', variant === 'default' ? 'bg-blue-200' : variant === 'success' ? 'bg-green-200' : variant === 'warning' ? 'bg-amber-200' : 'bg-red-200')} style={{
          height: `${height}%`
        }} />;
      })}
        </div>}
    </div>;
}