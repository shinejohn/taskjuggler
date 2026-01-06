import React from 'react';
import { CheckCircle2, BoxIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
interface IndustryCardProps {
  id: string;
  name: string;
  icon: BoxIcon;
  isSelected: boolean;
  onSelect: (id: string) => void;
}
export function IndustryCard({
  id,
  name,
  icon: Icon,
  isSelected,
  onSelect
}: IndustryCardProps) {
  return <button onClick={() => onSelect(id)} className={cn('relative flex flex-col items-center justify-center p-4 h-32 w-full transition-all duration-200 ease-in-out rounded-xl border-2 group', 'hover:shadow-md hover:-translate-y-1', isSelected ? 'border-[#1B4F72] bg-blue-50/50 shadow-sm' : 'border-transparent bg-slate-50 hover:bg-blue-50 hover:border-[#1B4F72]/30')} aria-pressed={isSelected} role="radio" aria-checked={isSelected}>
      {isSelected && <div className="absolute top-2 right-2 animate-in fade-in zoom-in duration-200">
          <CheckCircle2 className="text-[#1B4F72]" size={18} />
        </div>}

      <div className={cn('mb-3 transition-colors duration-200', isSelected ? 'text-[#1B4F72]' : 'text-slate-500 group-hover:text-[#1B4F72]')}>
        <Icon size={32} strokeWidth={1.5} />
      </div>

      <span className={cn('text-sm font-medium text-center leading-tight transition-colors duration-200', isSelected ? 'text-[#1B4F72] font-semibold' : 'text-slate-700')}>
        {name}
      </span>

      {/* Selection Ring Animation */}
      {isSelected && <div className="absolute inset-0 border-2 border-[#1B4F72] rounded-xl pointer-events-none animate-in fade-in duration-200" />}
    </button>;
}