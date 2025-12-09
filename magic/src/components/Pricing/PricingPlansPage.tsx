import React from 'react';
import { Header } from '../Header';
import { SubscriptionPlans } from './SubscriptionPlans';
import { Footer } from '../Footer';
export function PricingPlansPage() {
  return <div className="w-full min-h-screen bg-gray-50">
      <Header />
      <div className="pt-16">
        <SubscriptionPlans />
      </div>
      <Footer />
    </div>;
}