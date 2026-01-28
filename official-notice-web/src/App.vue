<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-bg-primary text-text-primary font-sans antialiased">
    <header class="border-b border-border bg-white px-6 py-4 flex justify-between items-center bg-opacity-80 backdrop-blur glass-standard">
      <div class="flex items-center gap-2">
        <h1 class="text-xl font-bold text-primary">Official Notice</h1>
        <span class="text-xs px-2 py-0.5 rounded bg-primary-light text-primary font-medium">BETA</span>
      </div>
      <div>
        <!-- User Menu (Shared Component in future) -->
        <button class="w-8 h-8 rounded-full bg-gray-200"></button>
      </div>
    </header>

    <main class="container mx-auto py-8 px-4">
      <RouterView />
    </main>
  </div>
</template>

<style>
/* Glass effect from design system */
.glass-standard {
  background: var(--color-surface-glass, rgba(255,255,255,0.7));
  backdrop-filter: blur(10px);
}
</style>
