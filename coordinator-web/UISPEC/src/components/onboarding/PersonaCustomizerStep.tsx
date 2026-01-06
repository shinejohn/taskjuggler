import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Play, User, Building2, Mail, Phone, MessageSquareQuote } from 'lucide-react';
import { cn } from '../../lib/utils';
interface PersonaCustomizerStepProps {
  onNext: () => void;
  onBack: () => void;
}
export function PersonaCustomizerStep({
  onNext,
  onBack
}: PersonaCustomizerStepProps) {
  const [formData, setFormData] = useState({
    name: '',
    gender: 'female',
    personality: 'friendly',
    pace: 'moderate',
    businessName: '',
    phone: '',
    email: ''
  });
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const isFormValid = formData.businessName.trim().length > 0;
  return <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-[#1B4F72] mb-2">
          Customize Your Assistant
        </h1>
        <p className="text-lg text-slate-600">
          Give your coordinator a personality and identity
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mb-8">
        {/* Left Side: Form */}
        <div className="flex-1 space-y-8">
          {/* Section 1: Identity */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-[#1B4F72] flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-[#1B4F72] text-xs">
                1
              </span>
              Assistant Identity
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Name
                </label>
                <input type="text" placeholder="e.g., Sally, Ed, Marcus" className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] transition-all" value={formData.name} onChange={e => handleChange('name', e.target.value)} />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Gender
                </label>
                <div className="flex gap-2">
                  <select className="flex-1 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] bg-white" value={formData.gender} onChange={e => handleChange('gender', e.target.value)}>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="neutral">Neutral</option>
                  </select>
                  <button className="p-2 rounded-lg border border-slate-200 text-[#1B4F72] hover:bg-blue-50 transition-colors" title="Preview Voice">
                    <Play size={20} fill="currentColor" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Personality */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-[#1B4F72] flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-[#1B4F72] text-xs">
                2
              </span>
              Personality & Tone
            </h3>

            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {['Friendly & Warm', 'Professional & Formal', 'Efficient & Direct'].map(option => {
                const value = option.split(' ')[0].toLowerCase();
                return <button key={value} onClick={() => handleChange('personality', value)} className={cn('px-4 py-2 rounded-full text-sm font-medium border transition-all', formData.personality === value ? 'bg-[#1B4F72] text-white border-[#1B4F72]' : 'bg-white text-slate-600 border-slate-200 hover:border-[#1B4F72]/50')}>
                      {option}
                    </button>;
              })}
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs font-medium text-slate-500 uppercase tracking-wide">
                  <span>Relaxed</span>
                  <span>Moderate</span>
                  <span>Energetic</span>
                </div>
                <input type="range" min="1" max="3" step="1" className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1B4F72]" value={formData.pace === 'relaxed' ? 1 : formData.pace === 'moderate' ? 2 : 3} onChange={e => {
                const val = parseInt(e.target.value);
                handleChange('pace', val === 1 ? 'relaxed' : val === 2 ? 'moderate' : 'energetic');
              }} />
              </div>
            </div>
          </section>

          {/* Section 3: Business */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-[#1B4F72] flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-[#1B4F72] text-xs">
                3
              </span>
              Your Business
            </h3>

            <div className="space-y-3">
              <div className="relative">
                <Building2 className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <input type="text" placeholder="Business Name (Required)" className={cn('w-full pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 transition-all', !formData.businessName && 'border-slate-200 focus:border-[#1B4F72]')} value={formData.businessName} onChange={e => handleChange('businessName', e.target.value)} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 text-slate-400" size={18} />
                  <input type="tel" placeholder="(555) 555-5555" className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] transition-all" value={formData.phone} onChange={e => handleChange('phone', e.target.value)} />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 text-slate-400" size={18} />
                  <input type="email" placeholder="email@business.com" className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] transition-all" value={formData.email} onChange={e => handleChange('email', e.target.value)} />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Side: Preview */}
        <div className="w-full lg:w-[40%]">
          <div className="sticky top-8">
            <div className="bg-gradient-to-br from-[#1B4F72] to-[#0F2F44] rounded-2xl p-6 text-white shadow-xl overflow-hidden relative">
              {/* Abstract background shapes */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#F59E0B]/10 rounded-full -ml-10 -mb-10 blur-xl"></div>

              <h4 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-6">
                Live Preview
              </h4>

              <div className="flex flex-col items-center text-center space-y-6 relative z-10">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/20 shadow-inner backdrop-blur-sm">
                    {formData.name ? <span className="text-2xl font-bold">
                        {formData.name.charAt(0).toUpperCase()}
                      </span> : <User size={32} className="text-white/70" />}
                  </div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-400 rounded-full border-2 border-[#1B4F72]"></div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 relative">
                  <MessageSquareQuote className="absolute -top-3 -left-2 text-[#F59E0B]" size={24} fill="currentColor" />
                  <p className="text-lg font-medium leading-relaxed">
                    "Hi, I'm{' '}
                    <span className="text-[#F59E0B]">
                      {formData.name || '...'}
                    </span>
                    . I work for{' '}
                    <span className="font-bold">
                      {formData.businessName || '[Your Business]'}
                    </span>
                    . How can I help you today?"
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 w-full text-xs">
                  <div className="bg-white/5 rounded-lg p-2 border border-white/10">
                    <div className="text-white/40 mb-1">Voice</div>
                    <div className="font-medium capitalize">
                      {formData.gender}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2 border border-white/10">
                    <div className="text-white/40 mb-1">Tone</div>
                    <div className="font-medium capitalize">
                      {formData.personality}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2 border border-white/10">
                    <div className="text-white/40 mb-1">Pace</div>
                    <div className="font-medium capitalize">
                      {formData.pace}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-slate-100">
        <button onClick={onBack} className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-[#1B4F72] transition-colors">
          <ArrowLeft size={18} />
          Back
        </button>

        <button onClick={onNext} className={cn('flex items-center gap-2 px-8 py-2.5 rounded-lg font-semibold text-white transition-all duration-200 shadow-md hover:shadow-lg', isFormValid ? 'bg-[#F59E0B] hover:bg-[#D97706] hover:-translate-y-0.5' : 'bg-slate-300 cursor-not-allowed')} disabled={!isFormValid}>
          Continue
          <ArrowRight size={18} />
        </button>
      </div>
    </div>;
}