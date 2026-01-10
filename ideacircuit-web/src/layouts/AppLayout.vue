<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <header class="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 class="text-xl font-bold">IdeaCircuit</h1>
      <NavigationMenu />
    </header>
    <main class="flex-1">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import NavigationMenu from '@/components/NavigationMenu.vue';
</script>

