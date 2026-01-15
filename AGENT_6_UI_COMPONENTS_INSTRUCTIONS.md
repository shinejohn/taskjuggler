# Agent 6: UI Component Updates Instructions
## Scanner Platform Integration - Final UI Layer

**Priority:** 🟡 MEDIUM - Can run after Agent 5  
**Estimated Time:** 2-3 hours  
**Depends On:** Agents 1, 2, 3, 5

---

## OBJECTIVE

Update existing scanner components to integrate platform features:
- IssueCard with task creation
- SiteCard with team context
- AddSiteModal with subscription limits
- DashboardPage with platform features
- SitesPage with team context

---

## PREREQUISITES

✅ Agent 1 complete (types, auth, API)  
✅ Agent 2 complete (subscription, usage stores)  
✅ Agent 3 complete (tasks store, CreateTaskModal)  
✅ Agent 5 complete (navigation components)

---

## TASKS

### Task 6.1: Update IssueCard Component

**File:** `scanner-web/src/components/scanner/IssueCard.vue` (MODIFY)

**Requirements:**
1. Add "Create Task" button
2. Integrate CreateTaskModal
3. Add subscription check for AI fix generation
4. Show upgrade prompt when needed
5. Display task link if issue has task_id

**Reference:** SCANNER_PLATFORM_INTEGRATION_OVERHAUL.md Phase 4.3

**Key Changes:**
```vue
<template>
  <!-- ... existing template ... -->
  
  <div class="issue-card-actions">
    <!-- Existing buttons -->
    <Button
      v-if="!issue.fix_code"
      variant="outline"
      size="sm"
      :disabled="generatingFix || !subscriptionStore.canUseFeature('aiFixGeneration')"
      @click="handleGenerateFix"
    >
      {{ generatingFix ? 'Generating...' : 'Generate Fix' }}
    </Button>
    
    <!-- NEW: Create Task button -->
    <Button
      variant="outline"
      size="sm"
      @click="showCreateTaskModal = true"
    >
      <ClipboardListIcon class="w-4 h-4 mr-1" />
      Create Task
    </Button>
    
    <!-- Show task link if exists -->
    <a
      v-if="issue.task_id"
      :href="`/tasks/${issue.task_id}`"
      class="task-link"
      target="_blank"
    >
      <ExternalLinkIcon class="w-4 h-4" />
      View Task
    </a>
    
    <!-- ... other existing buttons ... -->
  </div>
  
  <!-- NEW: Task Creation Modal -->
  <CreateTaskModal
    :is-open="showCreateTaskModal"
    :issue="issue"
    @close="showCreateTaskModal = false"
    @created="handleTaskCreated"
  />
  
  <!-- Upgrade prompt if needed -->
  <UpgradePrompt
    v-if="showUpgradePrompt"
    :message="subscriptionStore.getUpgradeMessage('aiFixGeneration')"
    feature="aiFixGeneration"
    @close="showUpgradePrompt = false"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import { useIssuesStore } from '@/stores/issues'
import { useSubscriptionStore } from '@/stores/subscription'
import CreateTaskModal from './CreateTaskModal.vue'
import UpgradePrompt from '@/components/common/UpgradePrompt.vue'
import { ClipboardListIcon, ExternalLinkIcon } from 'lucide-vue-next'

// ... existing code ...

const tasksStore = useTasksStore()
const issuesStore = useIssuesStore()
const subscriptionStore = useSubscriptionStore()
const showCreateTaskModal = ref(false)
const showUpgradePrompt = ref(false)

async function handleTaskCreated(task: any) {
  showCreateTaskModal.value = false
  // Update issue with task_id
  await issuesStore.createTaskFromIssue(props.issue.id, { task_id: task.id })
  // Show success toast
}

function handleGenerateFix() {
  if (!subscriptionStore.canUseFeature('aiFixGeneration')) {
    showUpgradePrompt.value = true
    return
  }
  // ... existing generate fix logic ...
}
</script>
```

---

### Task 6.2: Update SiteCard Component

**File:** `scanner-web/src/components/scanner/SiteCard.vue` (MODIFY)

**Requirements:**
1. Add team context display
2. Add subscription limit indicators
3. Update with new Site type (team_id)
4. Show upgrade prompt if at limit

**Key Changes:**
```vue
<template>
  <Card class="site-card" :interactive="true" @click="handleClick">
    <div class="site-header">
      <div class="site-info">
        <h3>{{ site.name }}</h3>
        <p class="site-url">{{ site.url }}</p>
        <!-- NEW: Team badge -->
        <Badge v-if="team" variant="outline" size="sm">
          {{ team.name }}
        </Badge>
      </div>
      
      <!-- Health score -->
      <HealthScore :score="site.health_score || 0" />
    </div>
    
    <div class="site-stats">
      <div class="stat">
        <span class="stat-label">Issues</span>
        <span class="stat-value">{{ site.issue_count || 0 }}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Last Scan</span>
        <span class="stat-value">{{ formatDate(site.last_scan_at) }}</span>
      </div>
    </div>
    
    <!-- NEW: Limit warning -->
    <div v-if="showLimitWarning" class="limit-warning">
      <AlertTriangleIcon class="w-4 h-4" />
      <span>Site limit reached</span>
      <Button variant="ghost" size="sm" @click.stop="handleUpgrade">
        Upgrade
      </Button>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useSubscriptionStore } from '@/stores/subscription'
import { Card, Badge, Button } from '@taskjuggler/ui'
import { AlertTriangleIcon } from 'lucide-vue-next'
import type { Site } from '@/types'

interface Props {
  site: Site
}

const props = defineProps<Props>()

const authStore = useAuthStore()
const subscriptionStore = useSubscriptionStore()

const team = computed(() => 
  authStore.user?.teams?.find(t => t.id === props.site.team_id)
)

const showLimitWarning = computed(() => {
  // Show if this is the last site and at limit
  return false // Implement based on your logic
})

function handleUpgrade() {
  window.location.href = '/settings/billing?upgrade_reason=sites'
}
</script>
```

---

### Task 6.3: Update AddSiteModal Component

**File:** `scanner-web/src/components/scanner/AddSiteModal.vue` (MODIFY)

**Requirements:**
1. Add subscription limit check
2. Show upgrade prompt if at limit
3. Add team context (auto-filled)
4. Disable submit if at limit

**Key Changes:**
```vue
<template>
  <Modal :is-open="isOpen" title="Add New Site" @close="handleClose">
    <!-- Upgrade prompt if at limit -->
    <UpgradePrompt
      v-if="!sitesStore.canAddSite"
      :message="`You've reached your site limit of ${subscriptionStore.limits.sites} sites. Upgrade to add more.`"
      feature="sites"
      class="mb-4"
    />
    
    <form @submit.prevent="handleSubmit" :disabled="!sitesStore.canAddSite">
      <!-- ... existing form fields ... -->
      
      <div class="form-actions">
        <Button variant="ghost" @click="handleClose">Cancel</Button>
        <Button 
          type="submit" 
          :disabled="loading || !sitesStore.canAddSite"
          :loading="loading"
        >
          Add Site
        </Button>
      </div>
    </form>
  </Modal>
</template>

<script setup lang="ts">
import { useSitesStore } from '@/stores/sites'
import { useSubscriptionStore } from '@/stores/subscription'
import UpgradePrompt from '@/components/common/UpgradePrompt.vue'

const sitesStore = useSitesStore()
const subscriptionStore = useSubscriptionStore()

async function handleSubmit() {
  if (!sitesStore.canAddSite) {
    return
  }
  // ... existing submit logic ...
}
</script>
```

---

### Task 6.4: Update DashboardPage

**File:** `scanner-web/src/pages/DashboardPage.vue` (MODIFY)

**Requirements:**
1. Add team switcher (already in AppLayout)
2. Add usage stats display
3. Add subscription tier display
4. Update with team-scoped data
5. Show upgrade prompts where needed

**Key Changes:**
```vue
<template>
  <AppLayout>
    <div class="dashboard-page">
      <!-- Subscription info banner -->
      <Card v-if="subscriptionStore.plan === 'free'" class="subscription-banner">
        <div class="banner-content">
          <div>
            <h4>Upgrade to Pro</h4>
            <p>Unlock unlimited scans, AI fixes, and more</p>
          </div>
          <Button variant="primary" @click="handleUpgrade">
            Upgrade Now
          </Button>
        </div>
      </Card>
      
      <!-- Usage stats -->
      <div class="usage-stats">
        <Card>
          <h4>Usage This Month</h4>
          <div class="stat-row">
            <div class="stat">
              <span class="stat-label">Scans</span>
              <span class="stat-value">
                {{ usageStore.usage.scans_this_month }} / {{ subscriptionStore.limits.scans_per_month }}
              </span>
            </div>
            <div class="stat">
              <span class="stat-label">AI Fixes</span>
              <span class="stat-value">
                {{ usageStore.usage.ai_fixes_this_month }} / {{ subscriptionStore.limits.ai_fixes }}
              </span>
            </div>
          </div>
        </Card>
      </div>
      
      <!-- Existing dashboard content -->
      <!-- ... -->
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import { useUsageStore } from '@/stores/usage'
import { useSubscriptionStore } from '@/stores/subscription'
import AppLayout from '@/layouts/AppLayout.vue'
import { Card, Button } from '@taskjuggler/ui'

const dashboardStore = useDashboardStore()
const usageStore = useUsageStore()
const subscriptionStore = useSubscriptionStore()

onMounted(async () => {
  await Promise.all([
    dashboardStore.fetchDashboard(),
    usageStore.fetchUsage(),
  ])
})

function handleUpgrade() {
  window.location.href = '/settings/billing'
}
</script>
```

---

### Task 6.5: Update SitesPage

**File:** `scanner-web/src/pages/SitesPage.vue` (MODIFY)

**Requirements:**
1. Add team context display
2. Add subscription limit warnings
3. Update with new stores
4. Show upgrade prompts

**Key Changes:**
```vue
<template>
  <AppLayout>
    <div class="sites-page">
      <div class="page-header">
        <div>
          <h1>Sites</h1>
          <p>Manage your accessibility scanning sites</p>
        </div>
        <Button 
          variant="primary" 
          @click="showAddModal = true"
          :disabled="!sitesStore.canAddSite"
        >
          Add Site
          <span v-if="sitesStore.sitesRemaining > 0" class="remaining">
            ({{ sitesStore.sitesRemaining }} remaining)
          </span>
        </Button>
      </div>
      
      <!-- Limit warning -->
      <UpgradePrompt
        v-if="!sitesStore.canAddSite"
        :message="`You've reached your site limit. Upgrade to add more sites.`"
        feature="sites"
        class="mb-4"
      />
      
      <!-- Sites grid -->
      <div class="sites-grid">
        <SiteCard
          v-for="site in sitesStore.sites"
          :key="site.id"
          :site="site"
        />
      </div>
      
      <!-- Add site modal -->
      <AddSiteModal
        :is-open="showAddModal"
        @close="showAddModal = false"
        @created="handleSiteCreated"
      />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSitesStore } from '@/stores/sites'
import AppLayout from '@/layouts/AppLayout.vue'
import SiteCard from '@/components/scanner/SiteCard.vue'
import AddSiteModal from '@/components/scanner/AddSiteModal.vue'
import UpgradePrompt from '@/components/common/UpgradePrompt.vue'
import { Button } from '@taskjuggler/ui'

const sitesStore = useSitesStore()
const showAddModal = ref(false)

onMounted(() => {
  sitesStore.fetchSites()
})

function handleSiteCreated() {
  showAddModal.value = false
  sitesStore.fetchSites()
}
</script>
```

---

## DELIVERABLES

1. ✅ `src/components/scanner/IssueCard.vue` - Updated with task creation
2. ✅ `src/components/scanner/SiteCard.vue` - Updated with team context
3. ✅ `src/components/scanner/AddSiteModal.vue` - Updated with limits
4. ✅ `src/pages/DashboardPage.vue` - Updated with platform features
5. ✅ `src/pages/SitesPage.vue` - Updated with team context

---

## TESTING CHECKLIST

- [ ] IssueCard shows Create Task button
- [ ] Create Task modal opens from IssueCard
- [ ] Task created successfully from issue
- [ ] IssueCard shows task link if task exists
- [ ] SiteCard displays team badge
- [ ] AddSiteModal checks subscription limits
- [ ] AddSiteModal shows upgrade prompt at limit
- [ ] DashboardPage shows usage stats
- [ ] DashboardPage shows subscription banner
- [ ] SitesPage shows limit warnings
- [ ] SitesPage disables add button at limit

---

## COMMON PITFALLS

1. **Modal event handlers** - Make sure to stop propagation on buttons
2. **Subscription checks** - Always check before enabling features
3. **Team context** - Sites are auto-filtered by API, but show team badge
4. **Loading states** - Show loading during API calls

---

## DEPENDENCIES

- Agent 1: types, auth store
- Agent 2: subscription store, usage store
- Agent 3: tasks store, CreateTaskModal
- Agent 5: UpgradePrompt, AppLayout

---

## COMPLETION CRITERIA

✅ All components updated with platform features  
✅ Task creation works from IssueCard  
✅ Subscription limits enforced in UI  
✅ Team context displayed correctly  
✅ Upgrade prompts shown appropriately  

**Once complete, integration is functionally complete. Final testing and backend integration needed.**

