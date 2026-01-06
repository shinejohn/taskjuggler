import React, { useState } from 'react';
import { ArrowLeft, Check, Clock, Shield, Calendar, AlertCircle, MapPin, Activity, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
interface BusinessPollStepProps {
  onNext: () => void;
  onBack: () => void;
}
export function BusinessPollStep({
  onNext,
  onBack
}: BusinessPollStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answers, setAnswers] = useState<Record<string, any>>({
    services: [],
    hours: {},
    insurance: '',
    waitTime: '1-3 days',
    emergency: false,
    parking: '',
    safety: ''
  });
  const handleComplete = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onNext();
    }, 2000);
  };
  const toggleService = (service: string) => {
    setAnswers(prev => {
      const services = prev.services.includes(service) ? prev.services.filter((s: string) => s !== service) : [...prev.services, service];
      return {
        ...prev,
        services
      };
    });
  };
  return <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {isSubmitting ? <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
            <div className="relative bg-white p-4 rounded-full shadow-lg border border-slate-100">
              <Loader2 className="h-10 w-10 text-[#1B4F72] animate-spin" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-[#1B4F72] mb-2">
            Setting up your Coordinator...
          </h2>
          <p className="text-slate-500">
            Analyzing your answers and training your assistant.
          </p>
        </div> : <>
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-[#1B4F72] mb-2">
              Tell Us About Your Business
            </h1>
            <p className="text-lg text-slate-600">
              Answer a few quick questions so your Coordinator can help
              customers accurately
            </p>
          </div>

          <div className="space-y-6 max-w-3xl mx-auto mb-10">
            {/* Question 1: Services */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-[#1B4F72] flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">
                    What services do you offer?
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['Cleanings', 'Fillings', 'Root Canals', 'Crowns', 'Whitening', 'Orthodontics', 'Implants', 'Emergency Care'].map(service => <button key={service} onClick={() => toggleService(service)} className={cn('px-3 py-2 rounded-lg text-sm font-medium border text-left transition-all', answers.services.includes(service) ? 'bg-[#1B4F72] text-white border-[#1B4F72]' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100')}>
                        {service}
                      </button>)}
                  </div>
                </div>
              </div>
            </div>

            {/* Question 2: Hours */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-[#1B4F72] flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">
                    What are your business hours?
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="font-medium text-slate-700">
                        Weekdays
                      </span>
                      <span className="text-sm text-slate-500">
                        9:00 AM - 5:00 PM
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="font-medium text-slate-700">
                        Weekends
                      </span>
                      <span className="text-sm text-slate-500">Closed</span>
                    </div>
                  </div>
                  <button className="text-sm text-[#1B4F72] font-medium mt-3 hover:underline">
                    + Add custom hours
                  </button>
                </div>
              </div>
            </div>

            {/* Question 3: Insurance */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-[#1B4F72] flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">
                    What insurance do you accept?
                  </h3>
                  <textarea className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] min-h-[80px]" placeholder="e.g. Delta Dental, Cigna, Aetna, MetLife..." value={answers.insurance} onChange={e => setAnswers({
                ...answers,
                insurance: e.target.value
              })} />
                </div>
              </div>
            </div>

            {/* Question 4: Wait Time */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-[#1B4F72] flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">
                    Typical wait time for new patients?
                  </h3>
                  <select className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] bg-white" value={answers.waitTime} onChange={e => setAnswers({
                ...answers,
                waitTime: e.target.value
              })}>
                    <option>Same day</option>
                    <option>1-3 days</option>
                    <option>1 week</option>
                    <option>2+ weeks</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Question 5: Emergency */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-[#1B4F72] flex items-center justify-center font-bold text-sm">
                  5
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">
                      Do you offer emergency appointments?
                    </h3>
                    <p className="text-sm text-slate-500">
                      We'll prioritize these callers
                    </p>
                  </div>
                  <button onClick={() => setAnswers({
                ...answers,
                emergency: !answers.emergency
              })} className={cn('relative inline-flex h-6 w-11 items-center rounded-full transition-colors', answers.emergency ? 'bg-[#10B981]' : 'bg-slate-200')}>
                    <span className={cn('inline-block h-4 w-4 transform rounded-full bg-white transition-transform', answers.emergency ? 'translate-x-6' : 'translate-x-1')} />
                  </button>
                </div>
              </div>
            </div>

            {/* Question 6: Parking */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-[#1B4F72] flex items-center justify-center font-bold text-sm">
                  6
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-3">
                    <h3 className="text-lg font-semibold text-slate-800">
                      Parking information
                    </h3>
                    <button className="text-xs text-slate-400 hover:text-[#1B4F72]">
                      Skip
                    </button>
                  </div>
                  <textarea className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] min-h-[80px]" placeholder="e.g. Free parking in rear lot, street parking available..." value={answers.parking} onChange={e => setAnswers({
                ...answers,
                parking: e.target.value
              })} />
                </div>
              </div>
            </div>

            {/* Question 7: Safety */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-[#1B4F72] flex items-center justify-center font-bold text-sm">
                  7
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-3">
                    <h3 className="text-lg font-semibold text-slate-800">
                      Special COVID/safety protocols?
                    </h3>
                    <button className="text-xs text-slate-400 hover:text-[#1B4F72]">
                      Skip
                    </button>
                  </div>
                  <textarea className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] min-h-[80px]" placeholder="e.g. Masks required in waiting room..." value={answers.safety} onChange={e => setAnswers({
                ...answers,
                safety: e.target.value
              })} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            <button onClick={onBack} className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-[#1B4F72] transition-colors">
              <ArrowLeft size={18} />
              Back
            </button>

            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-400 hidden sm:inline-block">
                These answers help your Coordinator respond accurately.
              </span>
              <button onClick={handleComplete} className="flex items-center gap-2 px-8 py-2.5 rounded-lg font-semibold text-white bg-[#F59E0B] hover:bg-[#D97706] hover:-translate-y-0.5 transition-all duration-200 shadow-md hover:shadow-lg">
                Complete Setup
                <Check size={18} />
              </button>
            </div>
          </div>
        </>}
    </div>;
}