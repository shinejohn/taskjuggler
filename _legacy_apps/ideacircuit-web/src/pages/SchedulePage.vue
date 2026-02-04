<template>
  <div class="flex flex-col h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 class="text-xl font-bold">Schedule Calls</h1>
      <NavigationMenu />
    </div>
    <!-- Main Content -->
    <div class="flex-1 overflow-hidden p-4 max-w-7xl mx-auto w-full">
      <div class="h-[calc(100vh-120px)]">
        <CalendarView />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CalendarView from '@/components/CalendarView.vue';
import NavigationMenu from '@/components/NavigationMenu.vue';
</script>

