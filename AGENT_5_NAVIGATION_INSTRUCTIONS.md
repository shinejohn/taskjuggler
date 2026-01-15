# Agent 5: Navigation & Layout Instructions
## Scanner Platform Integration - Parallel Stream 4

**Priority:** 🟡 MEDIUM - Can run after Agents 2-4  
**Estimated Time:** 2-3 hours  
**Depends On:** Agent 1 (auth store), Agent 2 (subscription store)

---

## OBJECTIVE

Implement cross-app navigation and platform UI components:
- App switcher component
- Notification bell component
- User menu component
- Updated AppLayout with platform navigation
- Upgrade prompt component

---

## PREREQUISITES

✅ Agent 1 must be complete (auth store, types, API client)  
✅ Agent 2 should be complete (subscription store for upgrade prompts)

---

## TASKS

### Task 5.1: Create App Switcher Component

**File:** `scanner-web/src/components/layout/AppSwitcher.vue` (NEW)

**Requirements:**
1. Dropdown showing all platform apps
2. Current app indicator (Scanner)
3. Navigation links to other apps
4. Use design system components (Button, Dropdown)

**Reference:** SCANNER_PLATFORM_INTEGRATION_OVERHAUL.md Phase 7.2

**Key Implementation:**
```vue
<template>
  <Dropdown>
    <template #trigger>
      <Button variant="ghost" class="app-trigger">
        <ScanIcon class="app-icon" />
        <span>Scanner</span>
        <ChevronDownIcon class="chevron" />
      </Button>
    </template>
    
    <template #content>
      <div class="app-list">
        <a href="/dashboard" class="app-item">
          <LayoutDashboardIcon />
          <span>Task Juggler</span>
        </a>
        <a href="/process" class="app-item">
          <WorkflowIcon />
          <span>4process.ai</span>
        </a>
        <a href="/projects" class="app-item">
          <FolderKanbanIcon />
          <span>4projects.ai</span>
        </a>
        <div class="app-item active">
          <ScanIcon />
          <span>Scanner</span>
          <CheckIcon class="check" />
        </div>
      </div>
    </template>
  </Dropdown>
</template>

<script setup lang="ts">
import { Dropdown, Button } from '@taskjuggler/ui'
import { 
  ScanIcon, 
  ChevronDownIcon, 
  CheckIcon,
  LayoutDashboardIcon,
  WorkflowIcon,
  FolderKanbanIcon 
} from 'lucide-vue-next'
</script>

<style scoped>
.app-trigger {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.app-list {
  min-width: 200px;
}

.app-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  cursor: pointer;
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--color-text-primary);
}

.app-item:hover {
  background: var(--color-bg-secondary);
}

.app-item.active {
  background: var(--color-primary-light);
}
</style>
```

---

### Task 5.2: Create NotificationBell Component

**File:** `scanner-web/src/components/layout/NotificationBell.vue` (NEW)

**Requirements:**
1. Bell icon with badge showing unread count
2. Dropdown showing recent notifications
3. Mark as read functionality
4. Click to view notification details
5. Use design system components (Button, Badge, Dropdown)

**Key Implementation:**
```vue
<template>
  <Dropdown>
    <template #trigger>
      <Button variant="ghost" class="notification-trigger">
        <BellIcon class="bell-icon" />
        <Badge v-if="unreadCount > 0" class="badge">
          {{ unreadCount > 99 ? '99+' : unreadCount }}
        </Badge>
      </Button>
    </template>
    
    <template #content>
      <div class="notifications-list">
        <div class="notifications-header">
          <h4>Notifications</h4>
          <Button variant="ghost" size="sm" @click="markAllRead">
            Mark all read
          </Button>
        </div>
        
        <div v-if="notifications.length === 0" class="empty">
          No notifications
        </div>
        
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="notification-item"
          :class="{ unread: !notification.read_at }"
          @click="handleNotificationClick(notification)"
        >
          <div class="notification-content">
            <h5>{{ notification.title }}</h5>
            <p>{{ notification.message }}</p>
            <span class="time">{{ formatTime(notification.created_at) }}</span>
          </div>
        </div>
        
        <div class="notifications-footer">
          <a href="/notifications">View all</a>
        </div>
      </div>
    </template>
  </Dropdown>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Button, Badge, Dropdown } from '@taskjuggler/ui'
import { BellIcon } from 'lucide-vue-next'
import api from '@/utils/api'

const notifications = ref<any[]>([])
const loading = ref(false)

const unreadCount = computed(() => 
  notifications.value.filter(n => !n.read_at).length
)

async function fetchNotifications() {
  loading.value = true
  try {
    const response = await api.get('/api/notifications?limit=10')
    notifications.value = response.data.data
  } finally {
    loading.value = false
  }
}

async function markAllRead() {
  await api.post('/api/notifications/mark-all-read')
  await fetchNotifications()
}

function handleNotificationClick(notification: any) {
  if (!notification.read_at) {
    api.post(`/api/notifications/${notification.id}/read`)
  }
  // Navigate to notification link if exists
  if (notification.data?.link) {
    window.location.href = notification.data.link
  }
}

function formatTime(date: string) {
  // Format relative time (e.g., "2 hours ago")
  const now = new Date()
  const then = new Date(date)
  const diff = now.getTime() - then.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  if (hours < 1) return 'Just now'
  if (hours < 24) return `${hours} hours ago`
  return `${Math.floor(hours / 24)} days ago`
}

onMounted(() => {
  fetchNotifications()
  // Poll for new notifications every 30 seconds
  setInterval(fetchNotifications, 30000)
})
</script>

<style scoped>
.notification-trigger {
  position: relative;
}

.badge {
  position: absolute;
  top: -4px;
  right: -4px;
}

.notifications-list {
  min-width: 320px;
  max-height: 400px;
  overflow-y: auto;
}

.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-4);
  border-bottom: 1px solid var(--color-border);
}

.notification-item {
  padding: var(--space-4);
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
}

.notification-item:hover {
  background: var(--color-bg-secondary);
}

.notification-item.unread {
  background: var(--color-primary-light);
}

.notification-content h5 {
  margin: 0 0 var(--space-1) 0;
  font-weight: 600;
}

.notification-content p {
  margin: 0 0 var(--space-2) 0;
  color: var(--color-text-secondary);
  font-size: var(--font-body-small);
}

.time {
  font-size: var(--font-caption);
  color: var(--color-text-tertiary);
}

.empty {
  padding: var(--space-8);
  text-align: center;
  color: var(--color-text-secondary);
}

.notifications-footer {
  padding: var(--space-3);
  text-align: center;
  border-top: 1px solid var(--color-border);
}
</style>
```

---

### Task 5.3: Create UserMenu Component

**File:** `scanner-web/src/components/layout/UserMenu.vue` (NEW)

**Requirements:**
1. Avatar dropdown
2. User info display (name, email)
3. Settings link
4. Logout button
5. Use design system components (Button, Avatar, Dropdown)

**Key Implementation:**
```vue
<template>
  <Dropdown>
    <template #trigger>
      <Button variant="ghost" class="user-trigger">
        <Avatar 
          :name="user?.name || 'User'" 
          :src="user?.avatar_url"
          size="sm"
        />
        <ChevronDownIcon class="chevron" />
      </Button>
    </template>
    
    <template #content>
      <div class="user-menu">
        <div class="user-info">
          <Avatar 
            :name="user?.name || 'User'" 
            :src="user?.avatar_url"
            size="md"
          />
          <div>
            <div class="user-name">{{ user?.name }}</div>
            <div class="user-email">{{ user?.email }}</div>
          </div>
        </div>
        
        <div class="menu-divider" />
        
        <a href="/settings" class="menu-item">
          <SettingsIcon />
          <span>Settings</span>
        </a>
        
        <a href="/settings/billing" class="menu-item">
          <CreditCardIcon />
          <span>Billing</span>
        </a>
        
        <div class="menu-divider" />
        
        <button class="menu-item logout" @click="handleLogout">
          <LogOutIcon />
          <span>Logout</span>
        </button>
      </div>
    </template>
  </Dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { Button, Avatar, Dropdown } from '@taskjuggler/ui'
import { 
  ChevronDownIcon, 
  SettingsIcon, 
  CreditCardIcon, 
  LogOutIcon 
} from 'lucide-vue-next'

const authStore = useAuthStore()
const router = useRouter()

const user = computed(() => authStore.user)

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.user-trigger {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.user-menu {
  min-width: 240px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
}

.user-name {
  font-weight: 600;
  margin-bottom: var(--space-1);
}

.user-email {
  font-size: var(--font-body-small);
  color: var(--color-text-secondary);
}

.menu-divider {
  height: 1px;
  background: var(--color-border);
  margin: var(--space-2) 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  width: 100%;
  text-align: left;
  text-decoration: none;
  color: var(--color-text-primary);
  background: none;
  border: none;
  cursor: pointer;
  font-size: var(--font-body-medium);
}

.menu-item:hover {
  background: var(--color-bg-secondary);
}

.menu-item.logout {
  color: var(--color-destructive);
}
</style>
```

---

### Task 5.4: Create UpgradePrompt Component

**File:** `scanner-web/src/components/common/UpgradePrompt.vue` (NEW)

**Requirements:**
1. Upgrade messaging card
2. Feature explanation
3. Upgrade button (links to billing)
4. Use design system components (Card, Button)

**Reference:** SCANNER_PLATFORM_INTEGRATION_OVERHAUL.md Phase 3.3

**Key Implementation:**
```vue
<template>
  <Card class="upgrade-prompt">
    <div class="upgrade-content">
      <div class="upgrade-icon">
        <SparklesIcon />
      </div>
      <div class="upgrade-text">
        <h4>{{ title }}</h4>
        <p>{{ message }}</p>
      </div>
      <Button variant="primary" @click="handleUpgrade">
        Upgrade Now
      </Button>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { Card, Button } from '@taskjuggler/ui'
import { SparklesIcon } from 'lucide-vue-next'

interface Props {
  title?: string
  message: string
  feature?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Upgrade Required',
})

function handleUpgrade() {
  const reason = props.feature ? `?upgrade_reason=${props.feature}` : ''
  window.location.href = `/settings/billing${reason}`
}
</script>

<style scoped>
.upgrade-prompt {
  background: linear-gradient(135deg, var(--color-primary-light), transparent);
  border: 1px solid var(--color-primary);
}

.upgrade-content {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
}

.upgrade-icon {
  color: var(--color-primary);
}

.upgrade-text {
  flex: 1;
}

.upgrade-text h4 {
  margin: 0 0 var(--space-2) 0;
  font-size: var(--font-title-medium);
}

.upgrade-text p {
  margin: 0;
  color: var(--color-text-secondary);
}
</style>
```

---

### Task 5.5: Update AppLayout

**File:** `scanner-web/src/layouts/AppLayout.vue` (MODIFY)

**Requirements:**
1. Add platform header
2. Integrate AppSwitcher
3. Integrate TeamSwitcher
4. Integrate NotificationBell
5. Integrate UserMenu
6. Update navigation structure

**Reference:** SCANNER_PLATFORM_INTEGRATION_OVERHAUL.md Phase 7.1

**Key Changes:**
```vue
<template>
  <div class="app-layout">
    <!-- Platform Header -->
    <header class="platform-header">
      <div class="header-left">
        <RouterLink to="/" class="logo">
          <img src="/logo.svg" alt="TaskJuggler" />
        </RouterLink>
        
        <!-- App Switcher -->
        <AppSwitcher />
        
        <TeamSwitcher />
      </div>
      
      <div class="header-center">
        <!-- Scanner-specific nav -->
        <nav class="scanner-nav">
          <RouterLink to="/scanner" class="nav-link">Dashboard</RouterLink>
          <RouterLink to="/scanner/sites" class="nav-link">Sites</RouterLink>
        </nav>
      </div>
      
      <div class="header-right">
        <NotificationBell />
        <UserMenu />
      </div>
    </header>
    
    <!-- Main Content -->
    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import AppSwitcher from '@/components/layout/AppSwitcher.vue'
import TeamSwitcher from '@/components/layout/TeamSwitcher.vue'
import NotificationBell from '@/components/layout/NotificationBell.vue'
import UserMenu from '@/components/layout/UserMenu.vue'
</script>

<style scoped>
.platform-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4);
  background: var(--color-surface-glass);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 50;
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.scanner-nav {
  display: flex;
  gap: var(--space-2);
}

.nav-link {
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--color-primary);
  background: var(--color-primary-light);
}

.main-content {
  padding: var(--space-6);
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}
</style>
```

---

## DELIVERABLES

1. ✅ `src/components/layout/AppSwitcher.vue` - New file
2. ✅ `src/components/layout/NotificationBell.vue` - New file
3. ✅ `src/components/layout/UserMenu.vue` - New file
4. ✅ `src/components/common/UpgradePrompt.vue` - New file
5. ✅ `src/layouts/AppLayout.vue` - Updated with platform nav

---

## TESTING CHECKLIST

- [ ] App switcher shows all platform apps
- [ ] App switcher navigates correctly
- [ ] Notification bell shows unread count
- [ ] Notifications dropdown works
- [ ] User menu shows user info
- [ ] User menu logout works
- [ ] Upgrade prompt displays correctly
- [ ] Upgrade prompt links to billing
- [ ] AppLayout renders correctly
- [ ] Navigation links work

---

## COMMON PITFALLS

1. **Notification API might not exist** - Handle gracefully
2. **Icons might not be available** - Use lucide-vue-next
3. **Router links** - Use RouterLink for internal, <a> for external
4. **Styling** - Use design system tokens

---

## DEPENDENCIES

- Agent 1: auth store (for UserMenu)
- Agent 2: subscription store (for UpgradePrompt)

---

## COMPLETION CRITERIA

✅ All navigation components created  
✅ AppLayout updated with platform nav  
✅ Cross-app navigation works  
✅ User menu functional  
✅ Notification bell functional  

**Once complete, Agent 6 can use these components in UI updates.**

