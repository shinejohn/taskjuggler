import React, { useState } from 'react';
import { Stethoscope, PawPrint, Droplet, Wind, Zap, UtensilsCrossed, Wine, PartyPopper, Scale, Calculator, Home, Scissors, Dumbbell, Wrench, Briefcase, MoreHorizontal, ArrowLeft, ArrowRight } from 'lucide-react';
import { IndustryCard } from './IndustryCard';
import { cn } from '../../lib/utils';
// Custom Tooth icon since it's not in standard lucide set or might be named differently
// Using a generic placeholder or closest match if needed, but let's try to map to available icons
// For dental, we can use a custom SVG or just a generic medical icon if needed, but let's use Smile for now as proxy or just standard icons
// Actually, let's use Activity for Medical and something else for Dental if needed.
// For this implementation, I'll use available Lucide icons that map closely.
const INDUSTRIES = [{
  id: 'dental',
  name: 'Dental Practice',
  icon: Stethoscope
}, {
  id: 'medical',
  name: 'Medical Office',
  icon: Stethoscope
}, {
  id: 'veterinary',
  name: 'Veterinary Clinic',
  icon: PawPrint
}, {
  id: 'plumbing',
  name: 'Plumbing',
  icon: Droplet
}, {
  id: 'hvac',
  name: 'HVAC',
  icon: Wind
}, {
  id: 'electrical',
  name: 'Electrical',
  icon: Zap
}, {
  id: 'restaurant',
  name: 'Restaurant',
  icon: UtensilsCrossed
}, {
  id: 'bar',
  name: 'Bar/Nightclub',
  icon: Wine
}, {
  id: 'event',
  name: 'Event Venue',
  icon: PartyPopper
}, {
  id: 'law',
  name: 'Law Firm',
  icon: Scale
}, {
  id: 'accounting',
  name: 'Accounting',
  icon: Calculator
}, {
  id: 'realestate',
  name: 'Real Estate',
  icon: Home
}, {
  id: 'salon',
  name: 'Salon/Spa',
  icon: Scissors
}, {
  id: 'fitness',
  name: 'Fitness/Gym',
  icon: Dumbbell
}, {
  id: 'auto',
  name: 'Auto Shop',
  icon: Wrench
}, {
  id: 'professional',
  name: 'Professional Svcs',
  icon: Briefcase
}, {
  id: 'other',
  name: 'Other',
  icon: MoreHorizontal
}];
interface IndustrySelectionStepProps {
  onNext: () => void;
  onBack: () => void;
}
export function IndustrySelectionStep({
  onNext,
  onBack
}: IndustrySelectionStepProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  return <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-[#1B4F72] mb-2">
          Select Your Industry
        </h1>
        <p className="text-lg text-slate-600">
          We'll customize your Coordinator for your business type
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {INDUSTRIES.map(industry => <IndustryCard key={industry.id} {...industry} isSelected={selectedIndustry === industry.id} onSelect={setSelectedIndustry} />)}
      </div>

      <div className="text-center mb-8">
        <p className="text-sm text-slate-500">
          Don't see your industry? Choose 'Other' and we'll set you up.
        </p>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-slate-100">
        <button onClick={onBack} className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-[#1B4F72] transition-colors">
          <ArrowLeft size={18} />
          Back
        </button>

        <button onClick={onNext} className={cn('flex items-center gap-2 px-8 py-2.5 rounded-lg font-semibold text-white transition-all duration-200 shadow-md hover:shadow-lg', selectedIndustry ? 'bg-[#F59E0B] hover:bg-[#D97706] hover:-translate-y-0.5' : 'bg-slate-300 cursor-not-allowed')} disabled={!selectedIndustry}>
          Continue
          <ArrowRight size={18} />
        </button>
      </div>
    </div>;
}