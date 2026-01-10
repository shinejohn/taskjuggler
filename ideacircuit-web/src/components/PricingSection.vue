<template>
  <section id="pricing" class="py-20 px-6 lg:px-12 bg-white">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900">
          Pricing for Every Team Size
        </h2>
        <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Choose the plan that best fits your collaborative needs
        </p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="(tier, index) in pricingTiers"
          :key="index"
          :class="`bg-white rounded-lg ${tier.popular ? 'ring-2 ring-indigo-600 shadow-lg' : 'border border-gray-200'} p-8 flex flex-col`"
        >
          <div v-if="tier.popular" class="text-center mb-4">
            <span class="bg-indigo-100 text-indigo-800 text-xs font-medium px-3 py-1 rounded-full">
              Most Popular
            </span>
          </div>
          <h3 class="text-2xl font-bold text-gray-900">{{ tier.name }}</h3>
          <div class="mt-4 flex items-baseline">
            <span class="text-4xl font-extrabold text-gray-900">
              {{ tier.price }}
            </span>
            <span class="text-gray-600 ml-1">{{ tier.period }}</span>
          </div>
          <p class="mt-2 text-gray-600">{{ tier.description }}</p>
          <ul class="mt-6 space-y-4 flex-1">
            <li
              v-for="(feature, i) in tier.features"
              :key="i"
              class="flex items-start"
            >
              <CheckIcon :size="20" class="text-indigo-600 mr-2 flex-shrink-0 mt-0.5" />
              <span class="text-gray-600">{{ feature }}</span>
            </li>
          </ul>
          <a
            href="#cta"
            :class="`mt-8 block text-center px-6 py-3 rounded-md font-medium ${tier.popular ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'} transition-colors`"
          >
            {{ tier.cta }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { CheckIcon } from 'lucide-vue-next';

const pricingTiers = [
  {
    name: 'Team',
    price: '$49',
    period: '/month per user',
    description: 'Perfect for small teams getting started with collaboration',
    features: [
      'Up to 30 participants per session',
      'Basic AI collaboration tools',
      'Interactive presentations',
      'Meeting transcripts and summaries',
      '10GB storage per user',
      'Email support'
    ],
    cta: 'Get Started',
    popular: false
  },
  {
    name: 'Business',
    price: '$99',
    period: '/month per user',
    description: 'Advanced features for sales, consulting, and implementation teams',
    features: [
      'Up to 100 participants per session',
      'Advanced AI collaboration suite',
      'Sales and consulting toolkits',
      'Proposal and document generation',
      'Implementation tracking dashboards',
      'Analytics and reporting',
      '100GB storage per user',
      'Priority support',
      'Custom branding'
    ],
    cta: 'Get Started',
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'Tailored solutions for large organizations with complex needs',
    features: [
      'Unlimited participants',
      'Full AI collaboration platform',
      'Custom workflows and integrations',
      'Advanced security and compliance',
      'Dedicated customer success manager',
      'Unlimited storage',
      'SLA guarantee',
      'On-premise deployment options',
      'Enterprise API access'
    ],
    cta: 'Contact Sales',
    popular: false
  }
];
</script>

