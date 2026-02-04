import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

export const useSubscriptionStore = defineStore('subscription', () => {
  const authStore = useAuthStore()

  const plan = computed(() => authStore.user?.subscription?.plan ?? 'free')
  
  const limits = computed(() => {
    return authStore.user?.subscription?.limits ?? {
      sites: 3,
      scans_per_month: 10,
      pages_per_scan: 25,
      team_members: 1,
      ai_fixes: 5,
    }
  })

  type FeatureKey = 'aiFixGeneration' | 'mcpIntegration' | 'apiAccess' | 'scheduledScans' | 'exportReports' | 'customBranding' | 'ssoLogin' | 'dedicatedSupport'

  const features = computed(() => ({
    aiFixGeneration: plan.value !== 'free',
    mcpIntegration: ['business', 'enterprise'].includes(plan.value),
    apiAccess: ['business', 'enterprise'].includes(plan.value),
    scheduledScans: plan.value !== 'free',
    exportReports: plan.value !== 'free',
    customBranding: plan.value === 'enterprise',
    ssoLogin: plan.value === 'enterprise',
    dedicatedSupport: plan.value === 'enterprise',
  }))

  function canUseFeature(feature: FeatureKey): boolean {
    return features.value[feature]
  }

  function getUpgradeMessage(feature: string): string {
    const planName = plan.value === 'free' ? 'Free' : 
                     plan.value === 'pro' ? 'Pro' :
                     plan.value === 'business' ? 'Business' : 'Enterprise'
    
    if (plan.value === 'free') {
      return `Upgrade to Pro to use ${feature}`
    } else if (plan.value === 'pro') {
      return `Upgrade to Business to use ${feature}`
    } else if (plan.value === 'business') {
      return `Upgrade to Enterprise to use ${feature}`
    }
    return `This feature is available on ${planName} plan`
  }

  return { plan, limits, features, canUseFeature, getUpgradeMessage }
})

