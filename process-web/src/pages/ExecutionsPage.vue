<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Process Executions</h1>

      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-500">Loading executions...</p>
      </div>

      <div v-else-if="executions.length === 0" class="text-center py-12">
        <p class="text-gray-500">No executions yet.</p>
      </div>

      <div v-else class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Process ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Started</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="execution in executions" :key="execution.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ execution.process_id }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 py-1 text-xs font-medium rounded',
                    execution.status === 'completed' ? 'bg-green-100 text-green-800' : '',
                    execution.status === 'running' ? 'bg-blue-100 text-blue-800' : '',
                    execution.status === 'failed' ? 'bg-red-100 text-red-800' : '',
                    execution.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : '',
                  ]"
                >
                  {{ execution.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ execution.started_at ? new Date(execution.started_at).toLocaleString() : '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ execution.completed_at ? new Date(execution.completed_at).toLocaleString() : '-' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useProcessesStore } from '@/stores/processes'

const processesStore = useProcessesStore()
const { executions, loading } = processesStore

onMounted(() => {
  processesStore.fetchExecutions()
})
</script>
