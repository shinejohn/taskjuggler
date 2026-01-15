<template>
  <SubscribePageTemplate
    app-name="Scanner"
    app-tagline="Website Health Monitoring"
    :logo-icon="ScanSearch"
    logo-gradient="bg-gradient-to-br from-green-500 to-teal-600 shadow-green-500/20"
    tagline-color="text-green-400"
    toggle-active-color="bg-green-500"
    :billing-period="billingPeriod"
    :show-addons="false"
    :show-order-summary="false"
    @update:billing-period="billingPeriod = $event"
  >
    <template #plans>
      <div
        v-for="plan in plans"
        :key="plan.id"
        class="relative"
      >
        <div
          v-if="plan.popular"
          class="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-green-600 to-teal-600 text-white text-xs font-bold rounded-full shadow-lg"
        >
          MOST POPULAR
        </div>
        <button
          @click="selectedPlan = plan.id"
          :class="['w-full h-full p-8 rounded-2xl border-2 transition-all text-left', selectedPlan === plan.id ? 'border-green-500 bg-slate-800/80 shadow-xl shadow-green-500/20' : 'border-slate-700/50 bg-slate-800/50 hover:border-slate-600']"
        >
          <div :class="['inline-flex p-3 rounded-xl bg-gradient-to-r', plan.gradient]">
            <component :is="plan.icon" class="h-6 w-6 text-white" />
          </div>
          <h3 class="text-2xl font-bold text-white mb-2">
            {{ plan.name }}
          </h3>
          <p class="text-slate-400 text-sm mb-6">
            {{ plan.description }}
          </p>
          <div class="flex items-baseline gap-2 mb-6">
            <span class="text-4xl font-bold text-white">
              ${{ plan.price }}
            </span>
            <span class="text-slate-400">/{{ plan.period }}</span>
          </div>
          <ul class="space-y-3 mb-6">
            <li
              v-for="(feature, i) in plan.features"
              :key="i"
              class="flex items-center gap-2 text-sm text-slate-300"
            >
              <Check class="h-4 w-4 text-green-400 flex-shrink-0" />
              {{ feature }}
            </li>
          </ul>
          <div
            :class="['w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all', selectedPlan === plan.id ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-lg shadow-green-500/30' : 'bg-slate-700 text-slate-300 hover:bg-slate-600']"
          >
            {{ selectedPlan === plan.id ? 'Selected' : 'Select Plan' }}
            <Check v-if="selectedPlan === plan.id" class="h-5 w-5" />
          </div>
        </button>
      </div>
    </template>

    <template #checkout-button>
      <button
        @click="handleCheckout"
        :disabled="isProcessing"
        class="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Loader2 v-if="isProcessing" class="h-5 w-5 animate-spin" />
        <template v-else>
          Continue to Checkout
          <ArrowRight class="h-5 w-5" />
        </template>
      </button>
    </template>
  </SubscribePageTemplate>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  ScanSearch,
  Check,
  Zap,
  Crown,
  Sparkles,
  ArrowRight,
  Loader2,
} from 'lucide-vue-next'
// @ts-ignore
import SubscribePageTemplate from '@taskjuggler/ui/templates/auth/SubscribePageTemplate.vue'
import api from '@/utils/api'

interface Plan {
  id: string
  name: string
  price: number
  period: string
  description: string
  features: string[]
  popular?: boolean
  icon: any
  gradient: string
}

const router = useRouter()

const billingPeriod = ref<'monthly' | 'annual'>('monthly')
const selectedPlan = ref<string>('pro')
const isProcessing = ref(false)

const plans = computed<Plan[]>(() => [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: billingPeriod.value === 'monthly' ? 'month' : 'year',
    description: 'Perfect for getting started',
    icon: Zap,
    gradient: 'from-blue-600 to-cyan-600',
    features: ['3 sites', '10 scans/month', 'Basic reports', 'Email support'],
  },
  {
    id: 'pro',
    name: 'Professional',
    price: billingPeriod.value === 'monthly' ? 29 : 290,
    period: billingPeriod.value === 'monthly' ? 'month' : 'year',
    description: 'For professionals monitoring multiple sites',
    icon: Crown,
    gradient: 'from-green-600 to-teal-600',
    popular: true,
    features: ['25 sites', '100 scans/month', 'AI-powered fixes', 'Priority support', 'Scheduled scans', 'Export reports'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: billingPeriod.value === 'monthly' ? 99 : 990,
    period: billingPeriod.value === 'monthly' ? 'month' : 'year',
    description: 'For teams and organizations',
    icon: Sparkles,
    gradient: 'from-emerald-600 to-teal-600',
    features: ['Unlimited sites', 'Unlimited scans', 'All AI features', 'API access', 'Custom integrations', 'Dedicated support', 'SLA guarantee'],
  },
])

async function handleCheckout() {
  isProcessing.value = true
  try {
    // Create subscription via API
    const response = await api.post('/subscriptions/checkout', {
      plan_id: selectedPlan.value,
      billing_period: billingPeriod.value,
      addons: [],
    })

    // Redirect to Stripe checkout or dashboard
    const checkoutUrl = response.data.data?.checkout_url || response.data.checkout_url
    if (checkoutUrl) {
      window.location.href = checkoutUrl
    } else {
      router.push('/dashboard')
    }
  } catch (error: any) {
    console.error('Checkout error:', error)
    alert(error.response?.data?.message || 'Failed to process checkout. Please try again.')
  } finally {
    isProcessing.value = false
  }
}
</script>

