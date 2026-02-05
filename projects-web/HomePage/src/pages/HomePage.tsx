import React from 'react';
import { Navigation } from '../components/homepage/Navigation';
import { HeroSection } from '../components/homepage/HeroSection';
import { ProblemSection } from '../components/homepage/ProblemSection';
import { SolutionSection } from '../components/homepage/SolutionSection';
import { DifferentiatorsSection } from '../components/homepage/DifferentiatorsSection';
import { AIFeaturesSection } from '../components/homepage/AIFeaturesSection';
import { ProductViewsSection } from '../components/homepage/ProductViewsSection';
import { ComparisonSection } from '../components/homepage/ComparisonSection';
import { PricingSection } from '../components/homepage/PricingSection';
import { TestimonialsSection } from '../components/homepage/TestimonialsSection';
import { IntegrationsSection } from '../components/homepage/IntegrationsSection';
import { FinalCTASection } from '../components/homepage/FinalCTASection';
import { Footer } from '../components/homepage/Footer';
export function HomePage() {
  return <div className="min-h-screen bg-white font-sans text-slate-900">
      <Navigation />
      <main>
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <DifferentiatorsSection />
        <AIFeaturesSection />
        <ProductViewsSection />
        <ComparisonSection />
        <PricingSection />
        <TestimonialsSection />
        <IntegrationsSection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>;
}