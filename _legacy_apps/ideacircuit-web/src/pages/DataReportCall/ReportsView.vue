<template>
  <div class="h-full flex flex-col">
    <!-- Reports Header -->
    <div class="bg-blue-50 border-b border-blue-200 p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <BarChart3Icon :size="24" class="text-blue-600" />
          <div>
            <h2 class="text-lg font-semibold text-blue-900">Available Reports</h2>
            <p class="text-sm text-blue-700">Choose a report type or create a custom one</p>
          </div>
        </div>
        <button
          @click="$emit('ai-setup')"
          class="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          <BotIcon :size="16" />
          <span>AI Custom Report</span>
        </button>
      </div>
    </div>

    <!-- Reports Grid -->
    <div class="flex-1 p-6 overflow-y-auto">
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="report in reports"
            :key="report.id"
            class="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow"
          >
            <div class="flex items-start space-x-3 mb-4">
              <div class="p-2 bg-blue-100 rounded-lg">
                <BarChart3Icon :size="20" class="text-blue-600" />
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">{{ report.name }}</h3>
                <p class="text-sm text-gray-600 mt-1">{{ report.description }}</p>
              </div>
            </div>
            
            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-500">Last updated: 2 hours ago</div>
              <div class="flex items-center space-x-2">
                <button class="p-2 text-gray-400 hover:text-gray-600">
                  <ShareIcon :size="16" />
                </button>
                <button class="p-2 text-gray-400 hover:text-gray-600">
                  <DownloadIcon :size="16" />
                </button>
                <button
                  @click="$emit('generate-report', report.id)"
                  class="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                >
                  Generate
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Reports -->
        <div class="mt-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Reports</h3>
          <div class="bg-white rounded-lg border">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Report</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Generated</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">Q4 Sales Analysis</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Sales</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2 hours ago</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Complete</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button class="text-blue-600 hover:text-blue-900">View</button>
                    </td>
                  </tr>
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">Marketing ROI Report</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">Marketing</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1 day ago</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Complete</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button class="text-blue-600 hover:text-blue-900">View</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BarChart3Icon, BotIcon, ShareIcon, DownloadIcon } from 'lucide-vue-next';

defineProps<{
  reports: Array<{ id: string; name: string; description: string }>;
}>();

defineEmits<{
  'generate-report': [reportType: string];
  'ai-setup': [];
}>();
</script>

