import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
export function PricingSection() {
  return <section id="pricing" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-[#1B4F72] mb-4">
            Simple, Role-Based Pricing
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Hire what you need. Add more as you grow.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Individual Roles */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-8 hover:shadow-lg transition-shadow">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Individual Roles
            </h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-[#1B4F72]">
                From $49
              </span>
              <span className="text-slate-500">/mo</span>
              <p className="text-sm text-slate-500 mt-1">per Coordinator</p>
            </div>

            <div className="space-y-3 mb-8">
              {[{
              role: 'Receptionist',
              price: '$49'
            }, {
              role: 'Scheduler',
              price: '$59'
            }, {
              role: 'Confirmer',
              price: '$49'
            }, {
              role: 'Bill Collector',
              price: '$69'
            }, {
              role: 'Inside Sales',
              price: '$79'
            }].map((item, i) => <div key={i} className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">{item.role}</span>
                  <span className="font-semibold text-slate-900">
                    {item.price}
                  </span>
                </div>)}
            </div>

            <button className="w-full py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:border-[#1B4F72] hover:text-[#1B4F72] transition-colors">
              Browse Roles
            </button>
          </div>

          {/* Popular Bundles - Featured */}
          <div className="bg-white rounded-2xl border-2 border-[#1B4F72] p-8 shadow-xl relative transform md:scale-105">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="inline-block px-4 py-1 bg-[#F59E0B] text-white text-xs font-bold rounded-full uppercase tracking-wide">
                Most Popular
              </span>
            </div>

            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Popular Bundles
            </h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-[#1B4F72]">
                From $79
              </span>
              <span className="text-slate-500">/mo</span>
              <p className="text-sm text-green-600 font-medium mt-1">
                Save 15-20%
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {[{
              name: 'Appointment Pro',
              price: '$89',
              desc: 'Scheduler + Confirmer'
            }, {
              name: 'Restaurant Complete',
              price: '$79',
              desc: 'Hostess + Confirmer'
            }, {
              name: 'Full Front Desk',
              price: '$129',
              desc: '3 roles included'
            }].map((bundle, i) => <div key={i} className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-slate-900">
                      {bundle.name}
                    </span>
                    <span className="font-bold text-[#1B4F72]">
                      {bundle.price}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{bundle.desc}</p>
                </div>)}
            </div>

            <Link to="/onboarding" className="w-full py-3 bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center">
              Start Free Trial
            </Link>
          </div>

          {/* Enterprise */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-8 hover:shadow-lg transition-shadow">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Enterprise
            </h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-[#1B4F72]">Custom</span>
              <p className="text-sm text-slate-500 mt-1">Volume pricing</p>
            </div>

            <div className="space-y-3 mb-8">
              {['Unlimited Coordinators', 'Dedicated support', 'Custom integrations', 'SLA guarantees', 'Volume discounts'].map((feature, i) => <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                  <Check size={16} className="text-green-500 flex-shrink-0" />
                  {feature}
                </div>)}
            </div>

            <button className="w-full py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:border-[#1B4F72] hover:text-[#1B4F72] transition-colors">
              Contact Sales
            </button>
          </div>
        </div>

        {/* Included Features */}
        <div className="text-center text-sm text-slate-500">
          <p className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <span className="flex items-center gap-2">
              <Check size={16} className="text-green-500" />
              Built-in CRM & Calendar
            </span>
            <span className="flex items-center gap-2">
              <Check size={16} className="text-green-500" />
              300 interactions/mo
            </span>
            <span className="flex items-center gap-2">
              <Check size={16} className="text-green-500" />
              14-day free trial
            </span>
            <span className="flex items-center gap-2">
              <Check size={16} className="text-green-500" />
              No setup fees
            </span>
          </p>
        </div>
      </div>
    </section>;
}