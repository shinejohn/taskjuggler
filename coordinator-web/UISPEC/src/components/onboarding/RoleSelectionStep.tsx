import React, { useState } from 'react';
import { Phone, Calendar, Truck, Utensils, Headset, Shield, CheckCircle, TrendingUp, DollarSign, Megaphone, ClipboardList, ArrowRight } from 'lucide-react';
import { RoleCard } from './RoleCard';
import { cn } from '../../lib/utils';
const INBOUND_ROLES = [{
  id: 'receptionist',
  title: 'Receptionist',
  price: '$49/mo',
  description: 'Answer calls, route inquiries',
  icon: Phone
}, {
  id: 'scheduler',
  title: 'Appointment Scheduler',
  price: '$59/mo',
  description: 'Book new appointments',
  icon: Calendar
}, {
  id: 'dispatcher',
  title: 'Dispatcher',
  price: '$59/mo',
  description: 'Schedule service calls',
  icon: Truck
}, {
  id: 'hostess',
  title: 'Hostess',
  price: '$49/mo',
  description: 'Take reservations',
  icon: Utensils
}, {
  id: 'support',
  title: 'Support Agent',
  price: '$59/mo',
  description: 'Resolve customer issues',
  icon: Headset
}, {
  id: 'tipline',
  title: 'Tip Line Operator',
  price: '$69/mo',
  description: 'Collect confidential tips',
  icon: Shield
}];
const OUTBOUND_ROLES = [{
  id: 'confirmer',
  title: 'Appointment Confirmer',
  price: '$49/mo',
  description: 'Confirm upcoming appointments',
  icon: CheckCircle
}, {
  id: 'sales',
  title: 'Inside Sales Rep',
  price: '$79/mo',
  description: 'Book sales appointments',
  icon: TrendingUp
}, {
  id: 'collector',
  title: 'Bill Collector',
  price: '$69/mo',
  description: 'Secure payment commitments',
  icon: DollarSign
}, {
  id: 'introducer',
  title: 'Product Introducer',
  price: '$59/mo',
  description: 'Announce new offerings',
  icon: Megaphone
}, {
  id: 'survey',
  title: 'Survey Conductor',
  price: '$49/mo',
  description: 'Gather customer feedback',
  icon: ClipboardList
}];
interface RoleSelectionStepProps {
  onNext: () => void;
}
export function RoleSelectionStep({
  onNext
}: RoleSelectionStepProps) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  return <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-[#1B4F72] mb-2">
          Choose Your Coordinator
        </h1>
        <p className="text-lg text-slate-600">
          What role do you need help with?
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Inbound Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4 px-1">
            <div className="h-px flex-1 bg-slate-200"></div>
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
              Inbound Roles
            </h2>
            <div className="h-px flex-1 bg-slate-200"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
            {INBOUND_ROLES.map(role => <RoleCard key={role.id} {...role} isSelected={selectedRole === role.id} onSelect={setSelectedRole} />)}
          </div>
        </div>

        {/* Outbound Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4 px-1">
            <div className="h-px flex-1 bg-slate-200"></div>
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
              Outbound Roles
            </h2>
            <div className="h-px flex-1 bg-slate-200"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
            {OUTBOUND_ROLES.map(role => <RoleCard key={role.id} {...role} isSelected={selectedRole === role.id} onSelect={setSelectedRole} />)}
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <button onClick={onNext} className={cn('flex items-center justify-center gap-2 mx-auto px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-xl', selectedRole ? 'bg-[#F59E0B] hover:bg-[#D97706] hover:-translate-y-0.5' : 'bg-slate-300 cursor-not-allowed')} disabled={!selectedRole}>
          Continue to Next Step
          <ArrowRight size={18} />
        </button>
        <p className="mt-4 text-sm text-slate-400 flex items-center justify-center gap-1.5">
          <span className="text-[#F59E0B]">⚡</span> Setup takes less than 60
          seconds
        </p>
      </div>
    </div>;
}