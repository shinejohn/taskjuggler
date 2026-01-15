<template>
  <div class="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="flex flex-col items-center justify-center gap-2 mb-6">
          <div class="flex items-center gap-3">
            <div :class="['flex h-12 w-12 items-center justify-center rounded-xl shadow-lg', logoGradient]">
              <component :is="logoIcon" class="h-7 w-7 text-white" />
            </div>
            <span class="text-4xl font-bold text-white">{{ appName }}</span>
          </div>
          <p :class="['text-sm font-semibold tracking-wide', taglineColor]">
            {{ appTagline }}
          </p>
        </div>
        <h1 class="text-4xl font-bold text-white mb-4">
          {{ title }}
        </h1>
        <p class="text-slate-400 text-lg max-w-2xl mx-auto">
          {{ subtitle }}
        </p>

        <!-- Billing Toggle -->
        <div v-if="showBillingToggle" class="flex items-center justify-center gap-4 mt-8">
          <span :class="['text-sm font-semibold', billingPeriod === 'monthly' ? 'text-white' : 'text-slate-500']">
            Monthly
          </span>
          <button
            @click="$emit('update:billingPeriod', billingPeriod === 'monthly' ? 'annual' : 'monthly')"
            :class="['relative w-14 h-7 rounded-full transition-colors', billingPeriod === 'annual' ? toggleActiveColor : 'bg-slate-700']"
          >
            <div
              :class="['absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg transition-transform', billingPeriod === 'annual' ? 'translate-x-7' : 'translate-x-0.5']"
            />
          </button>
          <span :class="['text-sm font-semibold', billingPeriod === 'annual' ? 'text-white' : 'text-slate-500']">
            Annual
          </span>
          <Transition name="fade-scale">
            <span
              v-if="billingPeriod === 'annual' && showSavingsBadge"
              class="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold"
            >
              {{ savingsText }}
            </span>
          </Transition>
        </div>
      </div>

      <!-- Plans Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <slot name="plans" />
      </div>

      <!-- Add-ons -->
      <div v-if="showAddons" class="bg-slate-800/50 backdrop-blur-xl rounded-2xl border-2 border-slate-700/50 p-8 mb-8">
        <h2 class="text-2xl font-bold text-white mb-2">
          {{ addonsTitle }}
        </h2>
        <p class="text-slate-400 mb-6">
          {{ addonsSubtitle }}
        </p>
        <slot name="addons" />
      </div>

      <!-- Order Summary -->
      <Transition name="fade">
        <div
          v-if="showOrderSummary"
          class="bg-slate-800/50 backdrop-blur-xl rounded-2xl border-2 border-slate-700/50 p-6 mb-8"
        >
          <h3 class="text-lg font-bold text-white mb-4">Order Summary</h3>
          <slot name="order-summary" />
        </div>
      </Transition>

      <!-- CTA -->
      <div class="text-center">
        <slot name="checkout-button" />
        <p v-if="guaranteeText" class="mt-4 text-sm text-slate-400">
          <Shield class="inline h-4 w-4 mr-1" />
          {{ guaranteeText }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Shield, Command } from 'lucide-vue-next'

export interface SubscribePageTemplateProps {
  appName?: string
  appTagline?: string
  logoIcon?: any
  logoGradient?: string
  taglineColor?: string
  title?: string
  subtitle?: string
  showBillingToggle?: boolean
  billingPeriod?: 'monthly' | 'annual'
  showSavingsBadge?: boolean
  savingsText?: string
  toggleActiveColor?: string
  showAddons?: boolean
  addonsTitle?: string
  addonsSubtitle?: string
  showOrderSummary?: boolean
  guaranteeText?: string
}

withDefaults(defineProps<SubscribePageTemplateProps>(), {
  appName: 'App',
  appTagline: 'Your Application',
  logoIcon: Command,
  logoGradient: 'bg-gradient-to-br from-teal-500 to-blue-600 shadow-teal-500/20',
  taglineColor: 'text-teal-400',
  title: 'Choose Your Plan',
  subtitle: 'Select the perfect plan for your needs. Upgrade or downgrade anytime.',
  showBillingToggle: true,
  billingPeriod: 'monthly',
  showSavingsBadge: true,
  savingsText: 'Save 17%',
  toggleActiveColor: 'bg-teal-500',
  showAddons: false,
  addonsTitle: 'Power-Up Your Plan',
  addonsSubtitle: 'Add additional features to your plan',
  showOrderSummary: false,
  guaranteeText: '30-day money-back guarantee • Cancel anytime',
})

defineEmits<{
  'update:billingPeriod': [value: 'monthly' | 'annual']
}>()
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.3s;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>

