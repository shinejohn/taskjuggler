<script setup lang="ts">
import { ref } from 'vue'
import { billingApi } from '../../services/api'

const loading = ref(false)
const billingPeriod = ref<'monthly' | 'annual'>('monthly')

const plans = [
    {
        id: 'pro',
        name: 'Pro',
        price: { monthly: 29, annual: 299 },
        features: ['Unlimited Documents', 'Verified Signing', 'AI Analysis', 'Basic Support']
    },
    {
        id: 'business',
        name: 'Business',
        price: { monthly: 99, annual: 999 },
        features: ['Everything in Pro', 'Team Management', 'API Access', 'Priority Support', 'Custom Branding']
    }
]

const subscribe = async (planId: string) => {
    loading.value = true
    try {
        const result = await billingApi.checkout(planId, billingPeriod.value)
        if (result.checkout_url) {
            window.location.href = result.checkout_url
        }
    } catch (e: any) {
        alert("Checkout failed: " + (e.response?.data?.error || e.message))
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="max-w-4xl mx-auto py-12 px-4">
        <div class="text-center mb-12">
            <h1 class="text-3xl font-bold mb-4">Upgrade your Plan</h1>
            <p class="text-gray-600">Choose the best plan for your legal document workflows.</p>
            
            <div class="mt-6 inline-flex bg-gray-100 rounded-lg p-1">
                <button 
                    @click="billingPeriod = 'monthly'"
                    class="px-4 py-2 text-sm font-medium rounded-md transition-all"
                    :class="billingPeriod === 'monthly' ? 'bg-white shadow text-gray-900' : 'text-gray-500'"
                >
                    Monthly
                </button>
                <button 
                    @click="billingPeriod = 'annual'"
                    class="px-4 py-2 text-sm font-medium rounded-md transition-all"
                    :class="billingPeriod === 'annual' ? 'bg-white shadow text-gray-900' : 'text-gray-500'"
                >
                    Annual (Save 15%)
                </button>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div v-for="plan in plans" :key="plan.id" class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden relative">
                <div class="p-8">
                    <h3 class="text-xl font-bold text-gray-900 mb-2">{{ plan.name }}</h3>
                    <div class="flex items-baseline gap-1 mb-6">
                        <span class="text-4xl font-extrabold">${{ plan.price[billingPeriod] }}</span>
                        <span class="text-gray-500">/{{ billingPeriod === 'monthly' ? 'mo' : 'yr' }}</span>
                    </div>
                    
                    <ul class="space-y-3 mb-8">
                        <li v-for="feature in plan.features" :key="feature" class="flex items-start gap-3 text-gray-700">
                             <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                             <span>{{ feature }}</span>
                        </li>
                    </ul>
                    
                    <button 
                        @click="subscribe(plan.id)"
                        :disabled="loading"
                        class="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {{ loading ? 'Processing...' : 'Subscribe Now' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
