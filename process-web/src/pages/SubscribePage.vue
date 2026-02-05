<template>
  <SubscribePageTemplate
    app-name="Process"
    app-tagline="Workflow Automation"
    :logo-icon="Workflow"
    logo-gradient="bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/20"
    tagline-color="text-cyan-400"
    :show-billing-toggle="false"
    :show-addons="false"
    :show-order-summary="false"
    guarantee-text="Contact support to change your plan"
  >
    <template #plans>
      <div class="w-full">
        <div class="p-8 rounded-2xl border-2 border-slate-700/50 bg-slate-800/50">
          <h3 class="text-2xl font-bold text-white mb-2">
            Current Plan
          </h3>
          <p class="text-slate-400 text-sm mb-6">
            {{ currentPlanDescription }}
          </p>
          <div class="flex items-baseline gap-2 mb-6">
            <span class="text-4xl font-bold text-white">
              {{ currentPlanName }}
            </span>
          </div>
          <div class="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold bg-slate-700 text-slate-300">
            Active Plan
            <Check class="h-5 w-5" />
          </div>
        </div>
      </div>
    </template>

    <template #checkout-button>
      <button
        @click="handleContactSupport"
        class="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 transition-all"
      >
        Contact Support
        <ArrowRight class="h-5 w-5" />
      </button>
    </template>
  </SubscribePageTemplate>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ArrowRight, Check, Workflow } from 'lucide-vue-next'
import SubscribePageTemplate from '../../../shared-ui/src/templates/auth/SubscribePageTemplate.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const currentPlanName = computed(() => authStore.user?.plan || 'free')
const currentPlanDescription = computed(() => {
  switch (currentPlanName.value) {
    case 'pro':
      return 'Automation limits and premium workflow features.'
    case 'business':
      return 'Advanced automation and multi-team support.'
    default:
      return 'Core workflow automation capabilities.'
  }
})

function handleContactSupport() {
  window.location.href = 'mailto:support@taskjuggler.com?subject=Process%20Subscription%20Change'
}
</script>
