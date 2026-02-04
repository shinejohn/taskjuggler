<template>
  <div class="app-layout">
    <TopNav />
    <div class="app-layout__container">
      <Sidebar :collapsed="sidebarCollapsed" />
      <main class="app-layout__main">
        <slot />
      </main>
    </div>
    <BottomTabs />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TopNav from './TopNav.vue'
import Sidebar from './Sidebar.vue'
import BottomTabs from './BottomTabs.vue'

const sidebarCollapsed = ref(false)
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg-primary);
}

.app-layout__container {
  display: flex;
  flex: 1;
  margin-top: 64px;
  min-height: calc(100vh - 64px);
}

.app-layout__main {
  flex: 1;
  margin-left: 240px;
  padding: var(--space-6);
  padding-bottom: calc(var(--space-6) + 83px); /* Account for bottom tabs */
  max-width: 1400px;
  width: 100%;
  margin-right: auto;
}

@media (max-width: 1023px) {
  .app-layout__main {
    margin-left: 0;
    padding-bottom: calc(var(--space-6) + 83px);
  }
}

@media (min-width: 1024px) {
  .app-layout__main {
    padding-bottom: var(--space-6);
  }
}
</style>
