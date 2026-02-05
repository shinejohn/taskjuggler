import React from 'react';
import { Button } from '../ui/Button';
export function HeroSection() {
  return <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto w-full text-center">
        <div className="space-y-16">
          <div className="space-y-8">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-semibold text-slate-900 leading-[1.08] tracking-[-0.015em]">
              One orchestrated project
            </h1>

            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-semibold text-slate-600 leading-[1.08] tracking-[-0.015em]">
              Executed globally by experts
            </h2>

            <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-semibold text-slate-400 leading-[1.08] tracking-[-0.015em]">
              Delivered on time, on budget, with quality
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg">Get started</Button>
            <Button size="lg" variant="ghost" className="text-blue-600 hover:text-blue-700">
              Learn more →
            </Button>
          </div>
        </div>
      </div>
    </section>;
}