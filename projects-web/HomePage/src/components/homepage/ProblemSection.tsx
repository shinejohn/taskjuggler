import React from 'react';
export function ProblemSection() {
  return <section className="py-24 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-slate-900 leading-[1.08] tracking-[-0.015em] mb-8">
          The Hidden Cost of Scattered Work
        </h2>
        <p className="text-xl sm:text-2xl md:text-3xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
          Tasks slip through cracks when work happens across email, Slack,
          texts, and calls—but your project management tool only sees what's
          manually entered. It's time for a better way.
        </p>
      </div>
    </section>;
}