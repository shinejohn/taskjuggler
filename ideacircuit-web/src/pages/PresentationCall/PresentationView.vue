<template>
  <div class="h-full flex flex-col">
    <!-- Presentation Header -->
    <div class="bg-green-50 border-b border-green-200 p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <PresentationIcon :size="24" class="text-green-600" />
          <div>
            <h2 class="text-lg font-semibold text-green-900">AI-Powered Presentation</h2>
            <p class="text-sm text-green-700">
              {{ config ? 'AI assistance active' : 'Presentation mode' }}
            </p>
          </div>
        </div>
        <button
          @click="$emit('back-to-meeting')"
          class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Back to Meeting
        </button>
      </div>
    </div>

    <!-- Presentation Content -->
    <div class="flex-1 p-6">
      <div class="max-w-6xl mx-auto">
        <div v-if="config" class="bg-white rounded-lg border p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">AI Presentation Active</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="text-center">
              <div class="text-2xl font-bold text-purple-600">{{ config.selected_bots?.length || 0 }}</div>
              <div class="text-sm text-gray-600">AI Bots</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-600">{{ config.workflow_steps?.length || 0 }}</div>
              <div class="text-sm text-gray-600">Workflow Steps</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-green-600">Active</div>
              <div class="text-sm text-gray-600">Status</div>
            </div>
          </div>
          <div class="text-center">
            <div class="text-lg text-gray-700 mb-4">
              AI is assisting with note-taking, analytics, and facilitation
            </div>
          </div>
        </div>
        <div v-else class="bg-white rounded-lg border p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Standard Presentation Mode</h3>
          <div class="text-center">
            <div class="text-lg text-gray-700 mb-4">
              Presentation running without AI assistance
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PresentationIcon } from 'lucide-vue-next';

defineProps<{
  config?: any;
}>();

defineEmits<{
  'back-to-meeting': [];
}>();
</script>

