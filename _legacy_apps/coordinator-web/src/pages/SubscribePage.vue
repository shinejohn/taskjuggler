<template>
  <SubscribePageTemplate
    app-name="Coordinator"
    app-tagline="Client Coordination Platform"
    :logo-icon="Users"
    logo-gradient="bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/20"
    tagline-color="text-emerald-400"
    :show-billing-toggle="false"
    :show-addons="false"
    :show-order-summary="false"
    guarantee-text="Manage billing in your account settings"
  >
    <template #plans>
      <div class="w-full">
        <div class="p-8 rounded-2xl border-2 border-slate-700/50 bg-slate-800/50">
          <h3 class="text-2xl font-bold text-white mb-2">
            Billing & Plans
          </h3>
          <p class="text-slate-400 text-sm mb-6">
            Review and update your subscription in the billing area.
          </p>
          <div class="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold bg-slate-700 text-slate-300">
            Go to Billing
            <CreditCard class="h-5 w-5" />
          </div>
        </div>
      </div>
    </template>

    <template #checkout-button>
      <button
        @click="handleOpenBilling"
        class="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all"
      >
        Open Billing
        <ArrowRight class="h-5 w-5" />
      </button>
    </template>
  </SubscribePageTemplate>
</template>

<script setup lang="ts">
import { ArrowRight, CreditCard, Users } from 'lucide-vue-next'
import SubscribePageTemplate from '../../../shared-ui/src/templates/auth/SubscribePageTemplate.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function handleOpenBilling() {
  router.push('/billing')
}
</script>
