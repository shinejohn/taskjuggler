import React from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
export function PricingSection() {
  const tiers = [{
    name: 'Free',
    price: '$0',
    emoji: '🎉',
    description: 'For individuals getting started',
    features: ['Up to 5 users', '3 projects', 'Web + Mobile', 'Basic reporting'],
    cta: 'Get Started',
    gradient: 'from-blue-400 to-cyan-400'
  }, {
    name: 'Team',
    price: '$12',
    period: '/user/mo',
    emoji: '🚀',
    description: 'For growing teams',
    features: ['Unlimited projects', 'Email + Slack channels', 'Question Forum', 'Basic AI features'],
    cta: 'Start Free Trial',
    highlighted: true,
    gradient: 'from-purple-500 to-pink-500'
  }, {
    name: 'Business',
    price: '$25',
    period: '/user/mo',
    emoji: '💼',
    description: 'For scaling organizations',
    features: ['All 6 channels (SMS + Voice)', 'TEF export', 'Advanced AI & analytics', 'SSO integration', 'Known Problems module'],
    cta: 'Start Free Trial',
    gradient: 'from-orange-400 to-red-400'
  }, {
    name: 'Enterprise',
    price: 'Custom',
    emoji: '👑',
    description: 'For large scale deployments',
    features: ['Dedicated support', 'Custom integrations', 'SLA guarantees', 'On-prem option available', 'SOC 2 Type II certified'],
    cta: 'Contact Sales',
    gradient: 'from-green-400 to-teal-400'
  }];
  return <section className="py-24 bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Simple, Transparent Pricing 💰
          </h2>
          <p className="text-xl text-slate-600">
            Start free. Scale as you grow.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tiers.map((tier, index) => <Card key={index} className={`p-8 relative bg-white ${tier.highlighted ? 'ring-4 ring-purple-400 shadow-2xl scale-105 transform' : 'shadow-lg'}`}>
              {tier.highlighted && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                  ⭐ Most Popular
                </div>}

              <div className="mb-8">
                <div className={`inline-block p-3 rounded-2xl bg-gradient-to-br ${tier.gradient} text-white text-3xl mb-4 shadow-lg`}>
                  {tier.emoji}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {tier.name}
                </h3>
                <div className="flex items-baseline mb-2">
                  <span className="text-4xl font-bold text-slate-900">
                    {tier.price}
                  </span>
                  {tier.period && <span className="text-slate-500 text-sm ml-1">
                      {tier.period}
                    </span>}
                </div>
                <p className="text-slate-500 text-sm">{tier.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, i) => <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="text-green-500 text-lg">✓</span>
                    <span>{feature}</span>
                  </li>)}
              </ul>

              <Button variant={tier.highlighted ? 'primary' : 'secondary'} className={`w-full ${tier.highlighted ? 'shadow-xl' : ''}`}>
                {tier.cta}
              </Button>
            </Card>)}
        </div>

        <div className="text-center mt-12 text-slate-600 text-sm font-medium">
          ✨ All plans include a 14-day free trial. No credit card required.
        </div>
      </div>
    </section>;
}