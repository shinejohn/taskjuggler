import React from 'react';
import { CheckCircle2, Phone, Copy, Check, ArrowRight, LayoutDashboard, User } from 'lucide-react';
import { cn } from '../../lib/utils';
export function SetupCompleteStep() {
  return <div className="w-full animate-in fade-in zoom-in duration-500 py-4">
      {/* Top Section */}
      <div className="text-center mb-10 relative">
        {/* Simple CSS particle effects */}
        <div className="absolute top-0 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-bounce delay-100"></div>
        <div className="absolute top-4 right-1/4 w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-300"></div>
        <div className="absolute -top-2 left-1/2 w-2 h-2 bg-green-400 rounded-full animate-bounce delay-500"></div>

        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-[#10B981] mb-6 animate-in zoom-in duration-700">
          <CheckCircle2 size={48} strokeWidth={3} />
        </div>

        <h1 className="text-4xl md:text-5xl font-heading font-bold text-[#1B4F72] mb-3">
          You're All Set!
        </h1>
        <p className="text-xl text-slate-600">Meet your new Coordinator</p>
      </div>

      {/* Center Section - Persona Card */}
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden mb-10 transform transition-all hover:-translate-y-1 duration-300">
        <div className="bg-[#1B4F72] p-6 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-white/5 opacity-30">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-10 -mt-10 blur-2xl"></div>
          </div>

          <div className="relative z-10">
            <div className="w-24 h-24 mx-auto bg-white rounded-full border-4 border-white/20 shadow-xl flex items-center justify-center mb-4">
              <User size={40} className="text-[#1B4F72]" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">
              Hi, I'm Sally!
            </h2>
            <p className="text-blue-100 mb-3">
              Your new Receptionist for [Business Name]
            </p>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10B981] text-white text-xs font-bold uppercase tracking-wide shadow-sm">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Info Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Card 1: Phone Number */}
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 text-[#1B4F72] rounded-lg">
              <Phone size={20} />
            </div>
            <h3 className="font-semibold text-slate-800">Your Phone Number</h3>
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-200 flex justify-between items-center mb-2">
            <span className="font-mono font-medium text-lg text-slate-700">
              (555) 123-4567
            </span>
            <button className="text-slate-400 hover:text-[#1B4F72] transition-colors" title="Copy number">
              <Copy size={16} />
            </button>
          </div>
          <p className="text-xs text-slate-500">
            Forward your business line to this number
          </p>
        </div>

        {/* Card 2: First Steps */}
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 text-[#F59E0B] rounded-lg">
              <CheckCircle2 size={20} />
            </div>
            <h3 className="font-semibold text-slate-800">First Steps</h3>
          </div>
          <ul className="space-y-3">
            {[{
            text: 'Forward your phone',
            done: false
          }, {
            text: 'Make a test call',
            done: false
          }, {
            text: 'Review your FAQ',
            done: true
          }].map((step, i) => <li key={i} className="flex items-center gap-3 text-sm">
                <div className={cn('w-5 h-5 rounded-full flex items-center justify-center text-[10px]', step.done ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500')}>
                  {step.done ? <Check size={12} /> : i + 1}
                </div>
                <span className={step.done ? 'text-slate-500 line-through' : 'text-slate-700'}>
                  {step.text}
                </span>
              </li>)}
          </ul>
        </div>

        {/* Card 3: Trial */}
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
              <LayoutDashboard size={20} />
            </div>
            <h3 className="font-semibold text-slate-800">Your Trial</h3>
          </div>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-slate-700">14 days free</span>
              <span className="text-slate-500">14 days left</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 w-full"></div>
            </div>
          </div>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <Shield size={12} />
            No credit card required
          </p>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button className="w-full sm:w-auto px-8 py-3.5 rounded-lg font-semibold text-white bg-[#1B4F72] hover:bg-[#153e5a] hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
          Go to Dashboard
          <ArrowRight size={18} />
        </button>
        <button className="text-slate-500 hover:text-[#1B4F72] font-medium text-sm transition-colors">
          Make a test call first
        </button>
      </div>
    </div>;
}