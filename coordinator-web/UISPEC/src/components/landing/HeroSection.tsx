import React from 'react';
import { Play, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
export function HeroSection() {
  return <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-slate-50 pt-20 pb-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#1B4F72] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#F59E0B] rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="animate-in fade-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#1B4F72] text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-[#1B4F72] animate-pulse"></span>
              AI Virtual Assistants for Small Business
            </div>

            <h1 className="text-5xl md:text-6xl font-heading font-bold text-[#1B4F72] mb-6 leading-tight">
              Hire a Role,
              <br />
              Not a Platform
            </h1>

            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Meet Sally, Ed, and Marcus — AI assistants who answer your phones,
              book appointments, and follow up on invoices.{' '}
              <span className="font-semibold text-slate-900">
                Set up in 60 seconds.
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link to="/onboarding" className="px-8 py-4 bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-center text-lg">
                Start Free Trial
              </Link>
              <button className="px-8 py-4 border-2 border-slate-300 text-slate-700 font-bold rounded-lg hover:border-[#1B4F72] hover:text-[#1B4F72] transition-all duration-200 flex items-center justify-center gap-2">
                <Play size={20} fill="currentColor" />
                Watch Demo
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                14-day free trial
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                Cancel anytime
              </div>
            </div>
          </div>

          {/* Right Side - Persona Cards */}
          <div className="relative animate-in fade-in slide-in-from-right duration-700 delay-200">
            <div className="relative w-full max-w-md mx-auto">
              {/* Card 1 - Sally */}
              <div className="absolute top-0 left-0 w-64 bg-white rounded-2xl shadow-2xl p-6 border-2 border-slate-100 transform rotate-[-8deg] hover:rotate-[-4deg] transition-transform duration-300">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center text-3xl mb-3">
                  👩‍💼
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Sally</h3>
                <p className="text-sm text-slate-500 mb-2">
                  Receptionist · $49/mo
                </p>
                <p className="text-xs text-slate-600">
                  Answers calls 24/7 and routes inquiries
                </p>
              </div>

              {/* Card 2 - Ed */}
              <div className="absolute top-12 right-0 w-64 bg-white rounded-2xl shadow-2xl p-6 border-2 border-slate-100 transform rotate-[4deg] hover:rotate-[2deg] transition-transform duration-300">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center text-3xl mb-3">
                  👨‍💼
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Ed</h3>
                <p className="text-sm text-slate-500 mb-2">
                  Scheduler · $59/mo
                </p>
                <p className="text-xs text-slate-600">
                  Books appointments and manages calendar
                </p>
              </div>

              {/* Card 3 - Marcus */}
              <div className="absolute bottom-0 left-8 w-64 bg-white rounded-2xl shadow-2xl p-6 border-2 border-slate-100 transform rotate-[0deg] hover:rotate-[2deg] transition-transform duration-300">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center text-3xl mb-3">
                  👨‍💼
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">
                  Marcus
                </h3>
                <p className="text-sm text-slate-500 mb-2">
                  Collector · $69/mo
                </p>
                <p className="text-xs text-slate-600">
                  Follows up on overdue invoices
                </p>
              </div>

              {/* Spacer for absolute positioning */}
              <div className="h-96"></div>
            </div>
          </div>
        </div>
      </div>
    </section>;
}