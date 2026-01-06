import React from 'react';
import { CheckCircle2, BoxIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
interface RoleCardProps {
  id: string;
  title: string;
  price: string;
  description: string;
  icon: BoxIcon;
  isSelected: boolean;
  onSelect: (id: string) => void;
}
export function RoleCard({
  id,
  title,
  price,
  description,
  icon: Icon,
  isSelected,
  onSelect
}: RoleCardProps) {
  return <button onClick={() => onSelect(id)} className={cn('relative flex flex-col items-start p-4 w-full text-left transition-all duration-200 ease-in-out rounded-xl border-2 group', 'hover:shadow-md hover:-translate-y-1', isSelected ? 'border-[#1B4F72] bg-blue-50/50 shadow-sm' : 'border-slate-200 bg-white hover:border-[#1B4F72]/50')} aria-pressed={isSelected} role="radio" aria-checked={isSelected}>
      <div className="flex justify-between w-full mb-3">
        <div className={cn('p-2 rounded-lg transition-colors', isSelected ? 'bg-[#1B4F72] text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-[#1B4F72]')}>
          <Icon size={20} />
        </div>
        {isSelected && <CheckCircle2 className="text-[#1B4F72] animate-in fade-in zoom-in duration-200" size={20} />}
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between w-full gap-2">
          <h3 className="font-heading font-semibold text-slate-900 leading-tight">
            {title}
          </h3>
          <span className="text-sm font-medium text-[#1B4F72] bg-blue-50 px-2 py-0.5 rounded-full whitespace-nowrap">
            {price}
          </span>
        </div>
        <p className="text-sm text-slate-500 leading-snug">{description}</p>
      </div>

      {/* Selection Ring Animation */}
      {isSelected && <div className="absolute inset-0 border-2 border-[#1B4F72] rounded-xl pointer-events-none animate-in fade-in duration-200" />}
    </button>;
}