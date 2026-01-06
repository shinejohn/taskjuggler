import React from 'react';
import { Users, Contact, Phone, Calendar, Megaphone, Search, Play } from 'lucide-react';
interface EmptyStateProps {
  variant: 'coordinators' | 'contacts' | 'calls' | 'appointments' | 'campaigns' | 'search';
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
}
const emptyStateConfig = {
  coordinators: {
    icon: Users,
    title: 'Hire your first Coordinator',
    subtitle: 'AI assistants that answer calls, book appointments, and grow your business',
    primaryCTA: 'Get Started',
    secondaryCTA: 'Watch demo',
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-50'
  },
  contacts: {
    icon: Contact,
    title: 'Add your first contact',
    subtitle: 'Import your customer list or add contacts manually',
    primaryCTA: 'Import Contacts',
    secondaryCTA: 'Add manually',
    iconColor: 'text-purple-500',
    bgColor: 'bg-purple-50'
  },
  calls: {
    icon: Phone,
    title: 'No calls yet',
    subtitle: 'Once you forward your phone to your Coordinator, calls will appear here',
    primaryCTA: 'View setup instructions',
    iconColor: 'text-green-500',
    bgColor: 'bg-green-50'
  },
  appointments: {
    icon: Calendar,
    title: 'No appointments scheduled',
    subtitle: "When your Coordinators book appointments, they'll show up here",
    tip: 'Tip: Make sure your availability is set up',
    iconColor: 'text-amber-500',
    bgColor: 'bg-amber-50'
  },
  campaigns: {
    icon: Megaphone,
    title: 'Create your first campaign',
    subtitle: 'Reach out to customers automatically with outbound calls',
    primaryCTA: 'Create Campaign',
    iconColor: 'text-indigo-500',
    bgColor: 'bg-indigo-50'
  },
  search: {
    icon: Search,
    title: 'No results found',
    subtitle: 'Try adjusting your search or filters',
    primaryCTA: 'Clear filters',
    iconColor: 'text-slate-400',
    bgColor: 'bg-slate-50'
  }
};
export function EmptyState({
  variant,
  onPrimaryAction,
  onSecondaryAction
}: EmptyStateProps) {
  const config = emptyStateConfig[variant];
  const Icon = config.icon;
  return <div className="flex items-center justify-center min-h-[400px] p-8">
      <div className="text-center max-w-md">
        {/* Illustration */}
        <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${config.bgColor} mb-6 animate-in zoom-in duration-500`}>
          <Icon size={48} className={config.iconColor} strokeWidth={1.5} />
        </div>

        {/* Content */}
        <h3 className="text-2xl font-bold text-slate-900 mb-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          {config.title}
        </h3>
        <p className="text-slate-500 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          {config.subtitle}
        </p>

        {/* Tip */}
        {config.tip && <div className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm mb-6 animate-in fade-in duration-500 delay-300">
            <span className="text-lg">💡</span>
            {config.tip}
          </div>}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
          {config.primaryCTA && <button onClick={onPrimaryAction} className="px-6 py-2.5 bg-[#1B4F72] hover:bg-[#153e5a] text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
              {config.primaryCTA}
            </button>}
          {config.secondaryCTA && <button onClick={onSecondaryAction} className="px-6 py-2.5 text-slate-600 hover:text-[#1B4F72] font-medium transition-colors flex items-center gap-2">
              {variant === 'coordinators' && <Play size={16} />}
              {config.secondaryCTA}
            </button>}
        </div>
      </div>
    </div>;
}