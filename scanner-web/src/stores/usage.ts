import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/utils/api'
import { useSubscriptionStore } from '@/stores/subscription'

interface UsageData {
  scans_this_month: number
  ai_fixes_this_month: number
  sites_count: number
}

export const useUsageStore = defineStore('usage', () => {
  const subscriptionStore = useSubscriptionStore()
  
  const usage = ref<UsageData>({
    scans_this_month: 0,
    ai_fixes_this_month: 0,
    sites_count: 0,
  })

  const scansRemaining = computed(() => 
    Math.max(0, subscriptionStore.limits.scans_per_month - usage.value.scans_this_month)
  )
  
  const aiFixesRemaining = computed(() =>
    Math.max(0, subscriptionStore.limits.ai_fixes - usage.value.ai_fixes_this_month)
  )

  const sitesRemaining = computed(() =>
    Math.max(0, subscriptionStore.limits.sites - usage.value.sites_count)
  )
  
  const canScan = computed(() => scansRemaining.value > 0)
  
  const canGenerateFix = computed(() => aiFixesRemaining.value > 0)

  async function fetchUsage() {
    try {
      const response = await api.get<{ data: UsageData }>('/api/scanner/usage')
      usage.value = response.data.data || response.data
    } catch (error: any) {
      // Handle 404 gracefully if API doesn't exist yet
      if (error.response?.status === 404) {
        // Reset to defaults
        usage.value = {
          scans_this_month: 0,
          ai_fixes_this_month: 0,
          sites_count: 0,
        }
      } else {
        throw error
      }
    }
  }

  function incrementScanUsage() {
    usage.value.scans_this_month += 1
  }

  function incrementAiFixUsage() {
    usage.value.ai_fixes_this_month += 1
  }

  function updateSitesCount(count: number) {
    usage.value.sites_count = count
  }

  return { 
    usage, 
    scansRemaining, 
    aiFixesRemaining,
    sitesRemaining,
    canScan, 
    canGenerateFix,
    fetchUsage, 
    incrementScanUsage,
    incrementAiFixUsage,
    updateSitesCount,
  }
})

