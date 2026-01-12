<template>
  <div v-if="generationProgress !== 'completed'" class="h-96 flex items-center justify-center">
    <div class="text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
      <p class="text-lg font-medium text-gray-700">Analyzing marketing campaign data...</p>
      <p class="text-sm text-gray-500 mt-2">This may take a few moments</p>
    </div>
  </div>
  <div v-else class="text-center p-8 text-gray-500">
    Marketing analysis content would appear here
  </div>
</template>

<script setup lang="ts">
interface Props {
  generationProgress: string;
}

defineProps<Props>();
</script>

