<template>
  <div class="h-full flex flex-col">
    <!-- Generating Header -->
    <div class="bg-green-50 border-b border-green-200 p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <BarChart3Icon :size="24" class="text-green-600" />
          <div>
            <h2 class="text-lg font-semibold text-green-900">Generating Report</h2>
            <p class="text-sm text-green-700">{{ reportName }}</p>
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

    <!-- Generating Content -->
    <div class="flex-1 p-6">
      <div class="max-w-4xl mx-auto">
        <div v-if="config" class="bg-white rounded-lg border p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">AI-Powered Report Generation</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="text-center">
              <div class="text-2xl font-bold text-purple-600">{{ config.selected_bots?.length || 0 }}</div>
              <div class="text-sm text-gray-600">AI Bots</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-600">{{ config.workflow_steps?.length || 0 }}</div>
              <div class="text-sm text-gray-600">Processing Steps</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-green-600">Active</div>
              <div class="text-sm text-gray-600">Status</div>
            </div>
          </div>
          <div class="text-center">
            <div class="text-lg text-gray-700 mb-4">
              AI is analyzing data sources and generating insights
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-blue-600 h-2 rounded-full w-3/4"></div>
            </div>
            <p class="text-sm text-gray-600 mt-2">75% complete</p>
          </div>
        </div>
        <div v-else class="bg-white rounded-lg border p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Standard Report Generation</h3>
          <div class="text-center">
            <div class="text-lg text-gray-700 mb-4">
              Generating {{ reportName }} using standard templates
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-blue-600 h-2 rounded-full w-1/2"></div>
            </div>
            <p class="text-sm text-gray-600 mt-2">50% complete</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BarChart3Icon } from 'lucide-vue-next';

defineProps<{
  reportType: string | null;
  reportName: string;
  config?: any;
}>();

defineEmits<{
  'back-to-reports': [];
}>();
</script>

