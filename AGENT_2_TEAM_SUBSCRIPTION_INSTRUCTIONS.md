# Agent 2: Team & Subscription Integration Instructions
## Scanner Platform Integration - Parallel Stream 1

**Priority:** 🟢 HIGH - Can run parallel after Agent 1  
**Estimated Time:** 2-3 hours  
**Depends On:** Agent 1 (auth store, types)

---

## OBJECTIVE

Implement team context and subscription limit enforcement:
- Subscription store for plan/limits/features
- Usage tracking store
- Team-aware sites store
- Team switcher component

---

## PREREQUISITES

✅ Agent 1 must be complete (types, auth store, API client)

---

## TASKS

### Task 2.1: Create Subscription Store

**File:** `scanner-web/src/stores/subscription.ts` (NEW)

**Requirements:**
1. Create Pinia store that reads from auth store
2. Compute plan from `authStore.user?.subscription?.plan`
3. Compute limits from subscription (with defaults for free tier)
4. Create feature flags (canUseFeature)
5. Create upgrade messages (getUpgradeMessage)

**Reference:** SCANNER_PLATFORM_INTEGRATION_OVERHAUL.md Phase 3.1

**Key Implementation:**
```typescript
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
      mcp_access: false,
      api_access: false,
      priority_support: false,
    }
  })

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

  function canUseFeature(feature: keyof typeof features.value): boolean {
    return features.value[feature]
  }

  function getUpgradeMessage(feature: string): string {
    // Return appropriate upgrade message
  }

  return { plan, limits, features, canUseFeature, getUpgradeMessage }
})
```

---

### Task 2.2: Create Usage Store

**File:** `scanner-web/src/stores/usage.ts` (NEW)

**Requirements:**
1. Track scans_this_month, ai_fixes_this_month, sites_count
2. Compute remaining quotas (scansRemaining, aiFixesRemaining)
3. Check if actions allowed (canScan, canGenerateFix)
4. Fetch usage from API (`/api/scanner/usage`)
5. Increment usage counters locally

**Reference:** SCANNER_PLATFORM_INTEGRATION_OVERHAUL.md Phase 3.2

**Key Implementation:**
```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/utils/api'
import { useSubscriptionStore } from '@/stores/subscription'

export const useUsageStore = defineStore('usage', () => {
  const subscriptionStore = useSubscriptionStore()
  
  const usage = ref({
    scans_this_month: 0,
    ai_fixes_this_month: 0,
    sites_count: 0,
  })

  const scansRemaining = computed(() => 
    Math.max(0, subscriptionStore.limits.scans_per_month - usage.value.scans_this_month)
  )
  
  const canScan = computed(() => scansRemaining.value > 0)

  async function fetchUsage() {
    const response = await api.get('/api/scanner/usage')
    usage.value = response.data.data
  }

  return { usage, scansRemaining, canScan, fetchUsage, incrementScanUsage }
})
```

---

### Task 2.3: Update Sites Store

**File:** `scanner-web/src/stores/sites.ts` (MODIFY)

**Requirements:**
1. Import authStore and subscriptionStore
2. Add team context filtering (sites automatically filtered by API via X-Team-ID)
3. Add canAddSite computed (checks subscription limit)
4. Add sitesRemaining computed
5. Update createSite to include team_id
6. Update fetchSites to work with team context

**Reference:** SCANNER_PLATFORM_INTEGRATION_OVERHAUL.md Phase 2.1

**Key Changes:**
```typescript
import { useAuthStore } from '@/stores/auth'
import { useSubscriptionStore } from '@/stores/subscription'

export const useSitesStore = defineStore('sites', () => {
  const authStore = useAuthStore()
  const subscriptionStore = useSubscriptionStore()
  
  const canAddSite = computed(() => {
    const limit = subscriptionStore.limits.sites
    return sites.value.length < limit
  })
  
  async function createSite(data: CreateSiteRequest) {
    if (!canAddSite.value) {
      throw new Error(`Site limit reached. Upgrade to add more sites.`)
    }
    
    const response = await sitesApi.create({
      ...data,
      team_id: authStore.currentTeam?.id, // Explicit team association
    })
    // ...
  }
})
```

---

### Task 2.4: Create Team Switcher Component

**File:** `scanner-web/src/components/layout/TeamSwitcher.vue` (NEW)

**Requirements:**
1. Display current team with avatar
2. Dropdown showing all user teams
3. Active team indicator
4. Click handler to switch teams
5. Refresh sites store after team switch
6. Use design system components (Button, Avatar, Dropdown)

**Reference:** SCANNER_PLATFORM_INTEGRATION_OVERHAUL.md Phase 2.2

**Key Implementation:**
```vue
<template>
  <div class="team-switcher">
    <Dropdown>
      <template #trigger>
        <Button variant="ghost" class="team-trigger">
          <Avatar :name="currentTeam?.name" size="sm" />
          <span class="team-name">{{ currentTeam?.name }}</span>
          <ChevronDownIcon class="chevron" />
        </Button>
      </template>
      
      <template #content>
        <div class="team-list">
          <div
            v-for="team in teams"
            :key="team.id"
            class="team-item"
            :class="{ active: team.id === currentTeam?.id }"
            @click="switchTeam(team)"
          >
            <Avatar :name="team.name" size="sm" />
            <span>{{ team.name }}</span>
            <CheckIcon v-if="team.id === currentTeam?.id" />
          </div>
        </div>
      </template>
    </Dropdown>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useSitesStore } from '@/stores/sites'

const authStore = useAuthStore()
const sitesStore = useSitesStore()

const teams = computed(() => authStore.user?.teams ?? [])
const currentTeam = computed(() => authStore.currentTeam)

async function switchTeam(team: any) {
  authStore.setCurrentTeam(team)
  await sitesStore.fetchSites()
}
</script>
```

---

## DELIVERABLES

1. ✅ `src/stores/subscription.ts` - New file
2. ✅ `src/stores/usage.ts` - New file
3. ✅ `src/stores/sites.ts` - Updated with team context
4. ✅ `src/components/layout/TeamSwitcher.vue` - New file

---

## TESTING CHECKLIST

- [ ] Subscription store reads from auth store correctly
- [ ] Limits computed correctly for each plan
- [ ] Feature flags work correctly
- [ ] Usage store fetches from API
- [ ] Usage store computes remaining quotas
- [ ] Sites store checks subscription limits
- [ ] Sites store filters by team
- [ ] Team switcher displays teams correctly
- [ ] Team switching updates sites list
- [ ] Can't create site when at limit

---

## COMMON PITFALLS

1. **Subscription might be null** - Always provide defaults
2. **Team might be null initially** - Check before accessing
3. **Usage API might not exist yet** - Handle 404 gracefully
4. **Team switching needs to refresh data** - Call fetchSites after switch

---

## DEPENDENCIES

- Agent 1: auth store, types, API client
- Agent 7: Backend API endpoints (can mock for now)

---

## COMPLETION CRITERIA

✅ All stores created and working  
✅ Team switcher component functional  
✅ Subscription limits enforced  
✅ Team context working in sites store  

**Once complete, Agent 5 can use subscription store for UI components.**

