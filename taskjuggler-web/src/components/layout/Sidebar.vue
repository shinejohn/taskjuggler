<template>
  <aside :class="['sidebar', collapsed && 'sidebar--collapsed']">
    <nav class="sidebar__nav">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="sidebar__item"
        :class="{ 'sidebar__item--active': $route.path.startsWith(item.path) }"
        :title="item.label"
      >
        <component :is="item.icon" class="sidebar__icon" />
        <span class="sidebar__label">{{ item.label }}</span>
        <span v-if="item.badge" class="sidebar__badge">{{ item.badge }}</span>
      </router-link>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

interface Props {
  collapsed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  collapsed: false
})

const _route = useRoute() // Keep for potential future use

// Icon components (simplified - in real app, import from lucide-vue-next)
const HomeIcon = { template: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>' }
const CheckSquareIcon = { template: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>' }
const InboxIcon = { template: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>' }
const RouteIcon = { template: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>' }
const StoreIcon = { template: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>' }
const UsersIcon = { template: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>' }

interface NavItem {
  path: string;
  label: string;
  icon: any;
  badge?: string | number | null;
}

const navItems = computed<NavItem[]>(() => [
  { path: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { path: '/tasks', label: 'Tasks', icon: CheckSquareIcon },
  { path: '/inbox', label: 'Inbox', icon: InboxIcon, badge: null },
  { path: '/routing', label: 'Routing', icon: RouteIcon },
  { path: '/marketplace', label: 'Marketplace', icon: StoreIcon },
  { path: '/team', label: 'Team', icon: UsersIcon },
])
</script>

<style scoped>
.sidebar {
  width: 240px;
  height: calc(100vh - 64px);
  position: fixed;
  left: 0;
  top: 64px;
  background: var(--color-surface-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-right: 1px solid var(--color-border);
  padding: var(--space-4);
  transition: width var(--duration-normal) var(--ease-out);
  overflow-y: auto;
  z-index: 50;
}

.sidebar--collapsed {
  width: 64px;
}

.sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.sidebar__item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--color-text-secondary);
  font-size: var(--font-body-medium);
  font-weight: 500;
  transition: all var(--duration-fast) var(--ease-out);
  position: relative;
}

.sidebar__item:hover {
  color: var(--color-text-primary);
  background: var(--color-bg-secondary);
}

.sidebar__item--active {
  color: var(--color-primary);
  background: var(--color-primary-light);
}

.sidebar__icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.sidebar__label {
  flex: 1;
  white-space: nowrap;
  transition: opacity var(--duration-fast) var(--ease-out);
}

.sidebar--collapsed .sidebar__label {
  opacity: 0;
  width: 0;
  overflow: hidden;
}

.sidebar__badge {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: var(--radius-full);
  background: var(--color-destructive);
  color: white;
  font-size: 10px;
  font-weight: 600;
}

.sidebar--collapsed .sidebar__badge {
  position: absolute;
  top: 4px;
  right: 4px;
}

@media (max-width: 1023px) {
  .sidebar {
    display: none;
  }
}
</style>
