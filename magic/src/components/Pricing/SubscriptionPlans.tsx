import React, { useState } from 'react';
import { Check, X, ChevronDown, ChevronUp, Star, Zap } from 'lucide-react';
import { PlanComparison } from './PlanComparison';
export function SubscriptionPlans() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [showComparison, setShowComparison] = useState(false);
  // 20% discount for annual billing
  const getDiscountedPrice = (price: number) => {
    if (billingPeriod === 'annual') {
      return Math.round(price * 0.8);
    }
    return price;
  };
  const individualPlans = [{
    name: 'Personal Free',
    price: 0,
    tagline: 'Essential task management with marketplace access',
    features: ['5 open personal tasks maximum', 'Unlimited marketplace task requests', 'Basic task organization', 'Mobile and web apps', 'Email notifications', 'Community support'],
    limitations: ['No AI features', 'No team collaboration', 'Basic reporting only', '5 open task limit', 'No advanced integrations'],
    cta: 'Get Started Free',
    highlighted: false,
    icon: <Star size={24} className="text-blue-500" />
  }, {
    name: 'Personal Pro',
    price: 8,
    tagline: 'Advanced productivity with unlimited marketplace access',
    features: ['Unlimited open personal tasks', 'Full AI task optimization', 'Advanced AI task organization', 'Custom task templates', 'Time tracking and analytics', 'Priority marketplace matching', 'Advanced notifications', 'Calendar integrations', 'Email support', 'Offline access'],
    limitations: [],
    cta: 'Upgrade to Pro',
    highlighted: true,
    icon: <Zap size={24} className="text-purple-500" />
  }];
  const addOns = [{
    name: 'AI Task Optimizer',
    price: 5,
    description: 'Advanced AI task prioritization, intelligent deadline optimization, and predictive completion analysis',
    perUser: true
  }, {
    name: 'AI Marketplace Matcher',
    price: 8,
    description: 'Smart service provider matching, automated quality assessment, and intelligent pricing recommendations',
    perUser: true
  }];
  return <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Pricing Plans
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect plan for your task management needs. All plans
            include access to our powerful marketplace.
          </p>
        </div>
        {/* Billing Period Toggle */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-3">
            <span className={`text-sm font-medium ${billingPeriod === 'monthly' ? 'text-blue-600' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${billingPeriod === 'annual' ? 'bg-blue-600' : 'bg-gray-300'}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${billingPeriod === 'annual' ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <span className={`text-sm font-medium ${billingPeriod === 'annual' ? 'text-blue-600' : 'text-gray-500'}`}>
              Annual{' '}
              <span className="text-green-500 font-semibold">Save 20%</span>
            </span>
          </div>
        </div>
        {/* Individual Plans */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {individualPlans.map((plan, index) => <div key={index} className={`bg-white rounded-xl shadow-lg overflow-hidden ${plan.highlighted ? 'ring-2 ring-blue-500' : ''}`}>
              {plan.highlighted && <div className="bg-blue-500 text-white text-center py-2 text-sm font-semibold">
                  MOST POPULAR
                </div>}
              <div className="p-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    {plan.icon}
                    <span className="ml-2">{plan.name}</span>
                  </h2>
                  <div>
                    <span className="text-3xl font-bold text-gray-900">
                      ${getDiscountedPrice(plan.price)}
                    </span>
                    <span className="text-gray-500 text-sm">/month</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">{plan.tagline}</p>
                <button className={`w-full py-2 px-4 rounded-md font-medium ${plan.highlighted ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}>
                  {plan.cta}
                </button>
                <div className="mt-6">
                  <h3 className="font-medium text-gray-900 mb-3">
                    What's included:
                  </h3>
                  <ul className="space-y-2">
                    {plan.features.map((feature, idx) => <li key={idx} className="flex items-start">
                        <Check size={18} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">{feature}</span>
                      </li>)}
                  </ul>
                </div>
                {plan.limitations.length > 0 && <div className="mt-6">
                    <h3 className="font-medium text-gray-900 mb-3">
                      Limitations:
                    </h3>
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation, idx) => <li key={idx} className="flex items-start">
                          <X size={18} className="text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600">{limitation}</span>
                        </li>)}
                    </ul>
                  </div>}
              </div>
            </div>)}
        </div>
        {/* Compare All Features Button */}
        <div className="text-center mb-16">
          <button onClick={() => setShowComparison(!showComparison)} className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
            {showComparison ? 'Hide' : 'Compare'} all features
            {showComparison ? <ChevronUp size={20} className="ml-1" /> : <ChevronDown size={20} className="ml-1" />}
          </button>
          {showComparison && <div className="mt-8">
              <PlanComparison planType="individual" />
            </div>}
        </div>
        {/* Add-Ons Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-16">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4">
            <h2 className="text-2xl font-bold text-white">
              Premium Add-Ons & Features
            </h2>
            <p className="text-blue-100">
              Enhance your plan with these powerful add-ons
            </p>
          </div>
          <div className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              AI Premium Features
            </h3>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {addOns.map((addon, index) => <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-lg font-medium text-gray-900">
                      {addon.name}
                    </h4>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">
                        ${addon.price}
                      </div>
                      <div className="text-sm text-gray-500">/month</div>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{addon.description}</p>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md">
                    Add to Plan
                  </button>
                </div>)}
            </div>
          </div>
        </div>
        {/* FAQ Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-16">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Can I switch between plans?
                </h3>
                <p className="text-gray-600">
                  Yes, you can upgrade or downgrade your plan at any time. When
                  upgrading, changes take effect immediately. When downgrading,
                  changes take effect at the end of your current billing cycle.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  What happens when I hit my task limit on the free plan?
                </h3>
                <p className="text-gray-600">
                  When you reach your 5 open task limit on the free plan, you'll
                  need to complete existing tasks before creating new ones, or
                  upgrade to the Personal Pro plan for unlimited tasks.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Do marketplace tasks count toward my task limit?
                </h3>
                <p className="text-gray-600">
                  No, marketplace tasks do not count toward your personal task
                  limit. You can create unlimited marketplace task requests even
                  on the free plan.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg overflow-hidden">
          <div className="p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to streamline your tasks?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Start with our free plan today and experience the power of
              TaskJuggler's marketplace and task management.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-white text-blue-600 hover:bg-blue-50 font-bold py-3 px-8 rounded-md text-lg">
                Get Started Free
              </button>
              <button className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold py-3 px-8 rounded-md text-lg">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>;
}