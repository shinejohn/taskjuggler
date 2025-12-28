<template>
  <div class="app-layout">
    <SideNav />
    <div class="app-layout-main">
      <TopBar />
      <main class="app-layout-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import SideNav from '@/components/layout/SideNav.vue'
import TopBar from '@/components/layout/TopBar.vue'
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
}

.app-layout-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 240px;
}

.app-layout-content {
  flex: 1;
  overflow-y: auto;
}
</style>
