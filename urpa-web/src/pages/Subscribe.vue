<template>
  <div class="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="flex flex-col items-center justify-center gap-2 mb-6">
          <div class="flex items-center gap-3">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 shadow-lg shadow-teal-500/20">
              <Command class="h-7 w-7 text-white" />
            </div>
            <span class="text-4xl font-bold text-white">Urpa</span>
          </div>
          <p class="text-teal-400 text-sm font-semibold tracking-wide">
            Your Personal Assistant
          </p>
        </div>
        <h1 class="text-4xl font-bold text-white mb-4">
          Choose Your Plan
        </h1>
        <p class="text-slate-400 text-lg max-w-2xl mx-auto">
          Select the perfect plan for your needs. Upgrade or downgrade anytime.
        </p>

        <!-- Billing Toggle -->
        <div class="flex items-center justify-center gap-4 mt-8">
          <span :class="['text-sm font-semibold', billingPeriod === 'monthly' ? 'text-white' : 'text-slate-500']">
            Monthly
          </span>
          <button
            @click="billingPeriod = billingPeriod === 'monthly' ? 'annual' : 'monthly'"
            :class="['relative w-14 h-7 rounded-full transition-colors', billingPeriod === 'annual' ? 'bg-teal-500' : 'bg-slate-700']"
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
              v-if="billingPeriod === 'annual'"
              class="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold"
            >
              Save 17%
            </span>
          </Transition>
        </div>
      </div>

      <!-- Plans Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div
          v-for="(plan, idx) in plans"
          :key="plan.id"
          class="relative"
        >
          <div
            v-if="plan.popular"
            class="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded-full shadow-lg"
          >
            MOST POPULAR
          </div>
          <button
            @click="selectedPlan = plan.id"
            :class="['w-full h-full p-8 rounded-2xl border-2 transition-all text-left', selectedPlan === plan.id ? 'border-teal-500 bg-slate-800/80 shadow-xl shadow-teal-500/20' : 'border-slate-700/50 bg-slate-800/50 hover:border-slate-600']"
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
                <Check class="h-4 w-4 text-teal-400 flex-shrink-0" />
                {{ feature }}
              </li>
            </ul>
            <div
              :class="['w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all', selectedPlan === plan.id ? 'bg-gradient-to-r from-teal-600 to-blue-600 text-white shadow-lg shadow-teal-500/30' : 'bg-slate-700 text-slate-300 hover:bg-slate-600']"
            >
              {{ selectedPlan === plan.id ? 'Selected' : 'Select Plan' }}
              <Check v-if="selectedPlan === plan.id" class="h-5 w-5" />
            </div>
          </button>
        </div>
      </div>

      <!-- Add-ons -->
      <div class="bg-slate-800/50 backdrop-blur-xl rounded-2xl border-2 border-slate-700/50 p-8 mb-8">
        <h2 class="text-2xl font-bold text-white mb-2">
          Power-Up Your Assistant
        </h2>
        <p class="text-slate-400 mb-6">
          Add AI-powered communication features to your plan
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            v-for="(addon, idx) in addons"
            :key="addon.id"
            @click="toggleAddon(addon.id)"
            :class="['p-6 rounded-xl border-2 transition-all text-left', selectedAddons.includes(addon.id) ? 'border-teal-500 bg-slate-800/80 shadow-lg shadow-teal-500/20' : 'border-slate-700 bg-slate-900/50 hover:border-slate-600']"
          >
            <div class="flex items-start justify-between mb-4">
              <div :class="['p-3 rounded-xl bg-gradient-to-r', addon.gradient]">
                <component :is="addon.icon" class="h-6 w-6 text-white" />
              </div>
              <div
                v-if="selectedAddons.includes(addon.id)"
                class="p-2 rounded-full bg-teal-500"
              >
                <Check class="h-4 w-4 text-white" />
              </div>
            </div>
            <h3 class="text-xl font-bold text-white mb-2">
              {{ addon.name }}
            </h3>
            <p class="text-sm text-slate-400 mb-4">
              {{ addon.description }}
            </p>
            <div class="flex items-baseline gap-1 mb-4">
              <span class="text-3xl font-bold text-white">
                ${{ addon.price }}
              </span>
              <span class="text-slate-400 text-sm">/month</span>
            </div>
            <ul v-if="addon.features" class="space-y-2">
              <li
                v-for="(feature, i) in addon.features"
                :key="i"
                class="flex items-center gap-2 text-xs text-slate-400"
              >
                <Check class="h-3 w-3 text-teal-400 flex-shrink-0" />
                {{ feature }}
              </li>
            </ul>
          </button>
        </div>
      </div>

      <!-- Order Summary -->
      <Transition name="fade">
        <div
          v-if="selectedAddons.length > 0"
          class="bg-slate-800/50 backdrop-blur-xl rounded-2xl border-2 border-slate-700/50 p-6 mb-8"
        >
          <h3 class="text-lg font-bold text-white mb-4">Order Summary</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between text-slate-300">
              <span>
                {{ plans.find(p => p.id === selectedPlan)?.name }} Plan
              </span>
              <span class="font-semibold">
                ${{ plans.find(p => p.id === selectedPlan)?.price }}/{{ billingPeriod === 'monthly' ? 'mo' : 'yr' }}
              </span>
            </div>
            <div
              v-for="addonId in selectedAddons"
              :key="addonId"
              class="flex items-center justify-between text-slate-300"
            >
              <span>{{ addons.find(a => a.id === addonId)?.name }}</span>
              <span class="font-semibold">${{ addons.find(a => a.id === addonId)?.price }}/mo</span>
            </div>
            <div class="pt-3 border-t-2 border-slate-700 flex items-center justify-between">
              <span class="text-lg font-bold text-white">Total</span>
              <span class="text-2xl font-bold text-teal-400">
                ${{ calculateTotal().toFixed(2) }}/{{ billingPeriod === 'monthly' ? 'mo' : 'yr' }}
              </span>
            </div>
          </div>
        </div>
      </Transition>

      <!-- CTA -->
      <div class="text-center">
        <button
          @click="handleCheckout"
          :disabled="isProcessing"
          class="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Loader2 v-if="isProcessing" class="h-5 w-5 animate-spin" />
          <template v-else>
            Continue to Checkout
            <ArrowRight class="h-5 w-5" />
          </template>
        </button>
        <p class="mt-4 text-sm text-slate-400">
          <Shield class="inline h-4 w-4 mr-1" />
          30-day money-back guarantee • Cancel anytime
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  Command,
  Check,
  Zap,
  Crown,
  Sparkles,
  Phone,
  Users,
  BarChart3,
  Shield,
  ArrowRight,
  MessageCircle,
  PhoneCall,
  Loader2,
} from 'lucide-vue-next';
import api from '@/utils/api';

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  icon: any;
  gradient: string;
}

interface Addon {
  id: string;
  name: string;
  price: number;
  icon: any;
  description: string;
  gradient: string;
  features?: string[];
}

const router = useRouter();

const billingPeriod = ref<'monthly' | 'annual'>('monthly');
const selectedPlan = ref<string>('pro');
const selectedAddons = ref<string[]>([]);
const isProcessing = ref(false);

const plans = computed<Plan[]>(() => [
  {
    id: 'starter',
    name: 'Starter',
    price: billingPeriod.value === 'monthly' ? 29 : 290,
    period: billingPeriod.value === 'monthly' ? 'month' : 'year',
    description: 'Perfect for individuals getting started',
    icon: Zap,
    gradient: 'from-blue-600 to-cyan-600',
    features: ['AI Assistant access', 'Basic task management', 'Email integration', '5 GB storage', 'Email support'],
  },
  {
    id: 'pro',
    name: 'Professional',
    price: billingPeriod.value === 'monthly' ? 79 : 790,
    period: billingPeriod.value === 'monthly' ? 'month' : 'year',
    description: 'For professionals who need more power',
    icon: Crown,
    gradient: 'from-purple-600 to-pink-600',
    popular: true,
    features: ['Everything in Starter', 'Advanced AI features', 'All integrations', 'Priority support', '50 GB storage', 'Team collaboration', 'Custom integrations'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: billingPeriod.value === 'monthly' ? 199 : 1990,
    period: billingPeriod.value === 'monthly' ? 'month' : 'year',
    description: 'For teams and organizations',
    icon: Sparkles,
    gradient: 'from-amber-600 to-orange-600',
    features: ['Everything in Professional', 'Unlimited AI requests', 'Dedicated account manager', 'Custom AI training', 'Unlimited storage', 'Advanced analytics', 'SLA guarantee', 'White-label options'],
  },
]);

const addons = ref<Addon[]>([
  {
    id: 'texting',
    name: 'AI Text Assistant',
    price: 19.99,
    icon: MessageCircle,
    gradient: 'from-indigo-600 to-purple-600',
    description: 'AI-powered text messaging with dedicated number',
    features: ['Dedicated phone number', 'Unlimited text messages', 'AI auto-reply', 'Message forwarding', 'Smart filtering'],
  },
  {
    id: 'phone',
    name: 'AI Phone Assistant',
    price: 99,
    icon: PhoneCall,
    gradient: 'from-red-600 to-rose-600',
    description: 'AI-powered phone calls with dedicated number',
    features: ['Dedicated phone number', 'Unlimited incoming calls', 'Call forwarding from cell', 'AI call screening', 'Voicemail transcription', 'Call recording & summaries'],
  },
  {
    id: 'team',
    name: 'Team Seats',
    price: 15,
    icon: Users,
    gradient: 'from-green-600 to-emerald-600',
    description: 'Additional team member (per seat)',
    features: ['Full platform access', 'Shared workspace', 'Team collaboration'],
  },
  {
    id: 'analytics',
    name: 'Advanced Analytics',
    price: 49,
    icon: BarChart3,
    gradient: 'from-blue-600 to-cyan-600',
    description: 'Deep insights and custom reports',
    features: ['Custom dashboards', 'Export reports', 'API access'],
  },
]);

function toggleAddon(addonId: string) {
  if (selectedAddons.value.includes(addonId)) {
    selectedAddons.value = selectedAddons.value.filter(id => id !== addonId);
  } else {
    selectedAddons.value.push(addonId);
  }
}

function calculateTotal(): number {
  const planPrice = plans.value.find(p => p.id === selectedPlan.value)?.price || 0;
  const addonsPrice = addons.value
    .filter(a => selectedAddons.value.includes(a.id))
    .reduce((sum, addon) => sum + addon.price, 0);
  return planPrice + addonsPrice;
}

async function handleCheckout() {
  isProcessing.value = true;
  try {
    // Create subscription via API
    const response = await api.post('/urpa/subscriptions/create', {
      plan_id: selectedPlan.value,
      billing_period: billingPeriod.value,
      addons: selectedAddons.value,
    });

    // Redirect to Stripe checkout
    if (response.data.checkout_url) {
      window.location.href = response.data.checkout_url;
    } else {
      // If no checkout URL, redirect to dashboard
      router.push('/');
    }
  } catch (error: any) {
    console.error('Checkout error:', error);
    alert(error.response?.data?.message || 'Failed to process checkout. Please try again.');
  } finally {
    isProcessing.value = false;
  }
}
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
