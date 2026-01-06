<template>
  <section id="pricing" class="py-24 bg-slate-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-heading font-bold text-[#1B4F72] mb-4">
          Simple, Role-Based Pricing
        </h2>
        <p class="text-xl text-slate-600 max-w-2xl mx-auto">
          Hire what you need. Add more as you grow.
        </p>
      </div>

      <!-- Pricing Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <!-- Individual Roles -->
        <div class="bg-white rounded-2xl border-2 border-slate-200 p-8 hover:shadow-lg transition-shadow">
          <h3 class="text-2xl font-bold text-slate-900 mb-2">
            Individual Roles
          </h3>
          <div class="mb-6">
            <span class="text-4xl font-bold text-[#1B4F72]">
              From $49
            </span>
            <span class="text-slate-500">/mo</span>
            <p class="text-sm text-slate-500 mt-1">per Coordinator</p>
          </div>

          <div class="space-y-3 mb-8">
            <div
              v-for="(role, i) in individualRoles"
              :key="i"
              class="flex justify-between items-center text-sm"
            >
              <span class="text-slate-600">{{ role.role }}</span>
              <span class="font-semibold text-slate-900">
                {{ role.price }}
              </span>
            </div>
          </div>

          <button class="w-full py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:border-[#1B4F72] hover:text-[#1B4F72] transition-colors">
            Browse Roles
          </button>
        </div>

        <!-- Popular Bundles - Featured -->
        <div class="bg-white rounded-2xl border-2 border-[#1B4F72] p-8 shadow-xl relative transform md:scale-105">
          <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <span class="inline-block px-4 py-1 bg-[#F59E0B] text-white text-xs font-bold rounded-full uppercase tracking-wide">
              Most Popular
            </span>
          </div>

          <h3 class="text-2xl font-bold text-slate-900 mb-2">
            Popular Bundles
          </h3>
          <div class="mb-6">
            <span class="text-4xl font-bold text-[#1B4F72]">
              From $79
            </span>
            <span class="text-slate-500">/mo</span>
            <p class="text-sm text-green-600 font-medium mt-1">
              Save 15-20%
            </p>
          </div>

          <div class="space-y-4 mb-8">
            <div
              v-for="(bundle, i) in bundles"
              :key="i"
              class="p-3 bg-blue-50 rounded-lg border border-blue-100"
            >
              <div class="flex justify-between items-center mb-1">
                <span class="font-semibold text-slate-900">
                  {{ bundle.name }}
                </span>
                <span class="font-bold text-[#1B4F72]">
                  {{ bundle.price }}
                </span>
              </div>
              <p class="text-xs text-slate-600">{{ bundle.desc }}</p>
            </div>
          </div>

          <router-link
            to="/register"
            class="w-full py-3 bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
          >
            Start Free Trial
          </router-link>
        </div>

        <!-- Enterprise -->
        <div class="bg-white rounded-2xl border-2 border-slate-200 p-8 hover:shadow-lg transition-shadow">
          <h3 class="text-2xl font-bold text-slate-900 mb-2">
            Enterprise
          </h3>
          <div class="mb-6">
            <span class="text-4xl font-bold text-[#1B4F72]">Custom</span>
            <p class="text-sm text-slate-500 mt-1">Volume pricing</p>
          </div>

          <div class="space-y-3 mb-8">
            <div
              v-for="(feature, i) in enterpriseFeatures"
              :key="i"
              class="flex items-center gap-2 text-sm text-slate-600"
            >
              <Check :size="16" class="text-green-500 flex-shrink-0" />
              {{ feature }}
            </div>
          </div>

          <button class="w-full py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:border-[#1B4F72] hover:text-[#1B4F72] transition-colors">
            Contact Sales
          </button>
        </div>
      </div>

      <!-- Included Features -->
      <div class="text-center text-sm text-slate-500">
        <p class="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <span
            v-for="(feature, i) in includedFeatures"
            :key="i"
            class="flex items-center gap-2"
          >
            <Check :size="16" class="text-green-500" />
            {{ feature }}
          </span>
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Check } from 'lucide-vue-next';

const individualRoles = [
  { role: 'Receptionist', price: '$49' },
  { role: 'Scheduler', price: '$59' },
  { role: 'Confirmer', price: '$49' },
  { role: 'Bill Collector', price: '$69' },
  { role: 'Inside Sales', price: '$79' },
];

const bundles = [
  {
    name: 'Appointment Pro',
    price: '$89',
    desc: 'Scheduler + Confirmer',
  },
  {
    name: 'Restaurant Complete',
    price: '$79',
    desc: 'Hostess + Confirmer',
  },
  {
    name: 'Full Front Desk',
    price: '$129',
    desc: '3 roles included',
  },
];

const enterpriseFeatures = [
  'Unlimited Coordinators',
  'Dedicated support',
  'Custom integrations',
  'SLA guarantees',
  'Volume discounts',
];

const includedFeatures = [
  'Built-in CRM & Calendar',
  '300 interactions/mo',
  '14-day free trial',
  'No setup fees',
];
</script>

