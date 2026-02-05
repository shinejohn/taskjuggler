<template>
  <div class="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-extrabold text-slate-900 sm:text-4xl">
          Choose the right plan for your practice
        </h2>
        <p class="mt-4 text-xl text-slate-500">
          Transparent pricing. No contracts. Cancel anytime.
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <!-- Solo Plan -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 hover:border-blue-300 transition-colors cursor-pointer" :class="{'ring-2 ring-blue-600': selectedPlan === 'solo'}" @click="selectPlan('solo')">
          <div class="flex items-center justify-between mb-4">
             <h3 class="text-lg font-bold text-slate-900">Solo Practice</h3>
             <div v-if="selectedPlan === 'solo'" class="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center">
                <Check class="h-4 w-4 text-white" />
             </div>
          </div>
          <div class="flex items-baseline mb-6">
            <span class="text-4xl font-extrabold text-slate-900">$59</span>
            <span class="text-slate-500 ml-1">/mo</span>
          </div>
          <ul class="space-y-4 mb-8">
            <li class="flex items-start">
              <Check class="flex-shrink-0 h-5 w-5 text-green-500" />
              <span class="ml-3 text-sm text-slate-500">1 Doctor Profile</span>
            </li>
            <li class="flex items-start">
              <Check class="flex-shrink-0 h-5 w-5 text-green-500" />
              <span class="ml-3 text-sm text-slate-500">Basic AI Receptionist</span>
            </li>
          </ul>
        </div>

        <!-- Clinic Plan -->
        <div class="bg-white rounded-2xl shadow-lg border border-blue-200 p-8 transform scale-105 relative cursor-pointer" :class="{'ring-2 ring-blue-600': selectedPlan === 'clinic'}" @click="selectPlan('clinic')">
          <div class="absolute top-0 right-0 -mt-2 -mr-2">
             <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 uppercase tracking-wide">
               Popular
             </span>
          </div>
          <div class="flex items-center justify-between mb-4">
             <h3 class="text-lg font-bold text-slate-900">Clinic</h3>
             <div v-if="selectedPlan === 'clinic'" class="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center">
                <Check class="h-4 w-4 text-white" />
             </div>
          </div>
          <div class="flex items-baseline mb-6">
            <span class="text-4xl font-extrabold text-slate-900">$179</span>
            <span class="text-slate-500 ml-1">/mo</span>
          </div>
          <ul class="space-y-4 mb-8">
            <li class="flex items-start">
              <Check class="flex-shrink-0 h-5 w-5 text-green-500" />
              <span class="ml-3 text-sm text-slate-500">Up to 5 Doctors</span>
            </li>
            <li class="flex items-start">
              <Check class="flex-shrink-0 h-5 w-5 text-green-500" />
              <span class="ml-3 text-sm text-slate-500">Advanced AI Receptionist</span>
            </li>
             <li class="flex items-start">
              <Check class="flex-shrink-0 h-5 w-5 text-green-500" />
              <span class="ml-3 text-sm text-slate-500">URPa Assistant Access</span>
            </li>
          </ul>
        </div>

         <!-- Hospital Plan -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 hover:border-blue-300 transition-colors cursor-pointer" :class="{'ring-2 ring-blue-600': selectedPlan === 'hospital'}" @click="selectPlan('hospital')">
           <div class="flex items-center justify-between mb-4">
             <h3 class="text-lg font-bold text-slate-900">Hospital</h3>
             <div v-if="selectedPlan === 'hospital'" class="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center">
                <Check class="h-4 w-4 text-white" />
             </div>
          </div>
          <div class="flex items-baseline mb-6">
            <span class="text-4xl font-extrabold text-slate-900">Custom</span>
          </div>
          <ul class="space-y-4 mb-8">
            <li class="flex items-start">
              <Check class="flex-shrink-0 h-5 w-5 text-green-500" />
              <span class="ml-3 text-sm text-slate-500">Unlimited Profiles</span>
            </li>
            <li class="flex items-start">
              <Check class="flex-shrink-0 h-5 w-5 text-green-500" />
              <span class="ml-3 text-sm text-slate-500">24/7 Priority Support</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-12 text-center">
        <button 
            @click="handleSubscribe"
            :disabled="!selectedPlan"
            :class="[
                'px-8 py-4 text-lg font-bold rounded-full shadow-lg transition-all',
                selectedPlan 
                    ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1' 
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            ]"
        >
            {{ selectedPlan === 'hospital' ? 'Contact Sales' : 'Complete Setup' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Check } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const selectedPlan = ref<string | null>(null);

onMounted(() => {
    if (route.query.plan) {
        selectedPlan.value = route.query.plan as string;
    }
});

function selectPlan(plan: string) {
    selectedPlan.value = plan;
}

function handleSubscribe() {
    if (selectedPlan.value === 'hospital') {
        // Redirect to contact form
        console.log('Contact sales');
    } else {
        // Proceed to payment/dashboard
        console.log('Subscribing to', selectedPlan.value);
        router.push('/dashboard');
    }
}
</script>
