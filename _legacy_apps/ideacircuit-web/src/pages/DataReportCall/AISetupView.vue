<template>
  <div class="h-full flex flex-col">
    <!-- AI Setup Header -->
    <div class="bg-purple-50 border-b border-purple-200 p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <BotIcon :size="24" class="text-purple-600" />
          <div>
            <h2 class="text-lg font-semibold text-purple-900">AI Custom Report</h2>
            <p class="text-sm text-purple-700">Create a custom report with AI assistance</p>
          </div>
        </div>
        <button
          @click="$emit('back-to-reports')"
          class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Back to Reports
        </button>
      </div>
    </div>

    <!-- AI Builder -->
    <div class="flex-1 overflow-hidden">
      <AISolutionBuilder
        user-intent="I need to create a custom data report. Help me analyze data sources, generate insights, and create visualizations."
        meeting-id="report-generation"
        user-id="current-user"
        @solution-complete="$emit('solution-complete', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { BotIcon } from 'lucide-vue-next';
import AISolutionBuilder from '@/components/AISolutionBuilder.vue';

defineEmits<{
  'solution-complete': [solution: any];
  'back-to-reports': [];
}>();
</script>

