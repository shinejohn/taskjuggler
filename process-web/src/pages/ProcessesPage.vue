<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Processes</h1>
        <router-link
          to="/processes/new"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          Create Process
        </router-link>
      </div>

      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-500">Loading processes...</p>
      </div>

      <div v-else-if="processes.length === 0" class="text-center py-12">
        <p class="text-gray-500 mb-4">No processes yet.</p>
        <router-link
          to="/processes/new"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          Create your first process
        </router-link>
      </div>

      <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="process in processes"
          :key="process.id"
          class="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer"
          @click="$router.push(`/processes/${process.id}`)"
        >
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ process.name }}</h3>
          <p class="text-sm text-gray-500 mb-4">{{ process.description || 'No description' }}</p>
          <div class="flex items-center justify-between">
            <span
              :class="[
                'px-2 py-1 text-xs font-medium rounded',
                process.status === 'active' ? 'bg-green-100 text-green-800' : '',
                process.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : '',
                process.status === 'archived' ? 'bg-gray-100 text-gray-800' : '',
              ]"
            >
              {{ process.status }}
            </span>
            <span class="text-xs text-gray-500">{{ process.trigger_type }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useProcessesStore } from '@/stores/processes'

const processesStore = useProcessesStore()
const { processes, loading } = processesStore

onMounted(() => {
  processesStore.fetchProcesses()
})
</script>
