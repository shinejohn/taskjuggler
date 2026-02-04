<template>
  <nav class="bottom-tabs">
    <router-link
      v-for="item in tabItems"
      :key="item.path"
      :to="item.path"
      class="bottom-tabs__item"
      :class="{ 'bottom-tabs__item--active': $route.path.startsWith(item.path) }"
    >
      <component :is="item.icon" class="bottom-tabs__icon" />
      <span class="bottom-tabs__label">{{ item.label }}</span>
    </router-link>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Icon components (simplified)
const HomeIcon = { template: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>' }
const CheckSquareIcon = { template: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>' }
const InboxIcon = { template: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>' }
const StoreIcon = { template: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>' }
const UserIcon = { template: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>' }

const tabItems = computed(() => [
  { path: '/dashboard', label: 'Home', icon: HomeIcon },
  { path: '/tasks', label: 'Tasks', icon: CheckSquareIcon },
  { path: '/inbox', label: 'Inbox', icon: InboxIcon },
  { path: '/marketplace', label: 'Market', icon: StoreIcon },
  { path: '/team', label: 'Team', icon: UserIcon },
])
</script>

<style scoped>
.bottom-tabs {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 83px;
  padding-bottom: env(safe-area-inset-bottom);
  background: var(--color-surface-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  padding-top: var(--space-2);
  z-index: 100;
}

.dark .bottom-tabs {
  background: rgba(44, 44, 46, 0.72);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.bottom-tabs__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-2);
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: all var(--duration-fast) var(--ease-spring);
  flex: 1;
  max-width: 100px;
}

.bottom-tabs__item:hover {
  color: var(--color-text-primary);
}

.bottom-tabs__item--active {
  color: var(--color-primary);
  transform: scale(1.05);
}

.bottom-tabs__icon {
  width: 24px;
  height: 24px;
}

.bottom-tabs__label {
  font-size: 10px;
  font-weight: 500;
  line-height: 1.3;
}

@media (min-width: 1024px) {
  .bottom-tabs {
    display: none;
  }
}
</style>
