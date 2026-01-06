import React from 'react';
import { ArrowRight } from 'lucide-react';
export function PersonaShowcase() {
  const personas = [{
    name: 'Sally',
    role: 'Receptionist',
    price: '$49/mo',
    emoji: '👩‍💼',
    greeting: "Hi, I'm Sally!",
    description: 'I answer your calls 24/7, take messages, and route inquiries to the right person.',
    stat: 'Never miss a call again',
    gradient: 'from-pink-100 to-purple-100'
  }, {
    name: 'Ed',
    role: 'Appointment Scheduler',
    price: '$59/mo',
    emoji: '👨‍💼',
    greeting: "Hello, I'm Ed!",
    description: 'I book appointments, manage your calendar, and send confirmations automatically.',
    stat: 'Reduce no-shows by 40%',
    gradient: 'from-blue-100 to-cyan-100'
  }, {
    name: 'Marcus',
    role: 'Bill Collector',
    price: '$69/mo',
    emoji: '👨‍💼',
    greeting: 'This is Marcus.',
    description: 'I follow up on overdue invoices professionally, so you get paid faster.',
    stat: 'Recover 25% more AR',
    gradient: 'from-green-100 to-emerald-100'
  }, {
    name: 'Jody',
    role: 'Hostess',
    price: '$49/mo',
    emoji: '👩‍💼',
    greeting: "Welcome! I'm Jody!",
    description: 'I take reservations, confirm bookings, and keep your tables full.',
    stat: 'Fill more tables',
    gradient: 'from-amber-100 to-orange-100'
  }];
  return <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-[#1B4F72] mb-4">
            Meet Your New Team Members
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            AI assistants with real personalities and specific jobs
          </p>
        </div>

        {/* Persona Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {personas.map((persona, i) => <div key={i} className="bg-white rounded-2xl border-2 border-slate-100 p-6 hover:border-[#1B4F72] hover:shadow-xl transition-all duration-300 group animate-in fade-in slide-in-from-bottom duration-500" style={{
          animationDelay: `${i * 100}ms`
        }}>
              {/* Avatar */}
              <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${persona.gradient} flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {persona.emoji}
              </div>

              {/* Greeting */}
              <div className="bg-slate-50 rounded-lg px-3 py-2 mb-4 inline-block">
                <p className="text-sm font-medium text-slate-700">
                  {persona.greeting}
                </p>
              </div>

              {/* Name & Role */}
              <h3 className="text-xl font-bold text-slate-900 mb-1">
                {persona.name}
              </h3>
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                <span>{persona.role}</span>
                <span className="text-slate-300">•</span>
                <span className="font-semibold text-[#1B4F72]">
                  {persona.price}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                {persona.description}
              </p>

              {/* Stat Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-200">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                {persona.stat}
              </div>
            </div>)}
        </div>

        {/* View All Link */}
        <div className="text-center">
          <a href="#roles" className="inline-flex items-center gap-2 text-[#1B4F72] font-semibold hover:gap-3 transition-all">
            View all 10+ roles
            <ArrowRight size={20} />
          </a>
        </div>
      </div>
    </section>;
}