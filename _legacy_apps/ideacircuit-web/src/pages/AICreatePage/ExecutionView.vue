<template>
  <div class="h-full flex flex-col">
    <!-- Execution Header -->
    <div class="bg-green-50 border-b border-green-200 p-4">
      <div class="flex items-start space-x-3">
        <PlayIcon :size="24" class="text-green-600 mt-0.5" />
        <div>
          <h2 class="text-lg font-semibold text-green-900">Solution Ready for Execution</h2>
          <p class="text-sm text-green-700 mt-1">
            Your solution has been mapped to AI bots and workflows. Ready to execute.
          </p>
        </div>
      </div>
    </div>

    <!-- Execution Content -->
    <div class="flex-1 p-6">
      <div class="max-w-4xl mx-auto">
        <!-- Solution Summary -->
        <div class="bg-white rounded-lg border p-4 mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Solution Summary</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-600">{{ solution.selected_bots?.length || 0 }}</div>
              <div class="text-sm text-gray-600">AI Bots</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-purple-600">{{ solution.workflow_steps?.length || 0 }}</div>
              <div class="text-sm text-gray-600">Workflow Steps</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-green-600">{{ Math.round((solution.estimated_completion_time || 0) / 60) }}</div>
              <div class="text-sm text-gray-600">Minutes</div>
            </div>
          </div>
        </div>

        <!-- Execution Controls -->
        <div class="text-center">
          <button
            @click="handleStartExecution"
            :disabled="executionStatus !== 'ready'"
            :class="`px-8 py-4 rounded-lg text-white font-medium text-lg ${
              executionStatus === 'ready'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`"
          >
            <PlayIcon v-if="executionStatus === 'ready'" :size="20" class="inline mr-2" />
            <div v-else-if="executionStatus === 'executing'" class="animate-spin rounded-full h-5 w-5 border-b-2 border-white inline mr-2"></div>
            <CheckCircleIcon v-else-if="executionStatus === 'completed'" :size="20" class="inline mr-2" />
            <span>{{ getButtonText() }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { PlayIcon, CheckCircleIcon } from 'lucide-vue-next';

const props = defineProps<{
  solution: any;
  userId: string;
  meetingId?: string;
}>();

const executionStatus = ref<'ready' | 'executing' | 'completed'>('ready');

const handleStartExecution = () => {
  executionStatus.value = 'executing';
  // Execution logic would be handled by AISolutionBuilder
  setTimeout(() => {
    executionStatus.value = 'completed';
  }, 5000);
};

const getButtonText = () => {
  switch (executionStatus.value) {
    case 'ready':
      return 'Execute Solution';
    case 'executing':
      return 'Executing...';
    case 'completed':
      return 'Solution Completed';
    default:
      return 'Execute Solution';
  }
};
</script>

