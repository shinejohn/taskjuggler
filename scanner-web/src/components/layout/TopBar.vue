<template>
  <header class="top-bar">
    <div class="top-bar-content">
      <div class="top-bar-left">
        <h1 class="top-bar-title">{{ pageTitle }}</h1>
      </div>
      <div class="top-bar-right">
        <AvatarWrapper
          v-if="authStore.user"
          :name="authStore.user.name"
          size="md"
        />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AvatarWrapper from '@/components/ui/AvatarWrapper.vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    dashboard: 'Dashboard',
    sites: 'Sites',
    'site-detail': 'Site Details',
    'scan-detail': 'Scan Details',
    settings: 'Settings',
  }
  return titles[route.name as string] || 'SiteHealth'
})
</script>

<style scoped>
.top-bar {
  background: var(--color-surface-glass);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--color-border);
  padding: var(--space-4) var(--space-6);
}

.top-bar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.top-bar-title {
  font-size: var(--font-headline);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.top-bar-right {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}
</style>
