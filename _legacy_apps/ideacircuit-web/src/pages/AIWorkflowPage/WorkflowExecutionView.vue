<template>
  <div class="h-full flex flex-col">
    <!-- Workflow Header -->
    <div class="bg-green-50 border-b border-green-200 p-4">
      <div class="flex items-start space-x-3">
        <BarChart3Icon :size="24" class="text-green-600 mt-0.5" />
        <div>
          <h2 class="text-lg font-semibold text-green-900">Workflow Active</h2>
          <p class="text-sm text-green-700 mt-1">
            {{ solution ? 'AI-powered workflow running' : 'Basic workflow mode' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Workflow Content -->
    <div class="flex-1 p-6">
      <div class="max-w-6xl mx-auto">
        <div v-if="solution" class="bg-white rounded-lg border p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">AI Workflow Solution Active</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="text-center">
              <div class="text-2xl font-bold text-purple-600">{{ solution.selected_bots?.length || 0 }}</div>
              <div class="text-sm text-gray-600">AI Bots</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-600">{{ solution.workflow_steps?.length || 0 }}</div>
              <div class="text-sm text-gray-600">Workflow Steps</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-green-600">{{ Math.round((solution.estimated_completion_time || 0) / 60) }}</div>
              <div class="text-sm text-gray-600">Minutes</div>
            </div>
          </div>
          <div class="text-center">
            <div class="text-lg text-gray-700 mb-4">AI workflow is running with automated processing</div>
            <button
              @click="$emit('back-to-setup')"
              class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Back to Setup
            </button>
          </div>
        </div>
        <div v-else class="bg-white rounded-lg border p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Basic Workflow Mode</h3>
          <div class="text-center">
            <div class="text-lg text-gray-700 mb-4">Standard workflow without AI assistance</div>
            <button
              @click="$emit('back-to-setup')"
              class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Back to Setup
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BarChart3Icon } from 'lucide-vue-next';

defineProps<{
  solution?: any;
}>();

defineEmits<{
  'back-to-setup': [];
}>();
</script>

