<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-500">Loading process...</p>
      </div>

      <div v-else-if="currentProcess" class="bg-white rounded-lg shadow p-6">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ currentProcess.name }}</h1>
            <p class="text-gray-600">{{ currentProcess.description || 'No description' }}</p>
          </div>
          <div class="flex gap-2">
            <router-link
              :to="`/processes/${currentProcess.id}/edit`"
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Edit
            </router-link>
            <button
              v-if="currentProcess.status === 'draft'"
              @click="handlePublish"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Publish
            </button>
          </div>
        </div>

        <div class="mb-6">
          <span
            :class="[
              'px-3 py-1 text-sm font-medium rounded',
              currentProcess.status === 'active' ? 'bg-green-100 text-green-800' : '',
              currentProcess.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : '',
              currentProcess.status === 'archived' ? 'bg-gray-100 text-gray-800' : '',
            ]"
          >
            {{ currentProcess.status }}
          </span>
          <span class="ml-4 text-sm text-gray-600">Trigger: {{ currentProcess.trigger_type }}</span>
        </div>

        <div class="border-t pt-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Steps</h2>
          <div v-if="currentSteps.length === 0" class="text-gray-500">
            No steps defined yet.
          </div>
          <div v-else class="space-y-2">
            <div
              v-for="step in currentSteps"
              :key="step.id"
              class="p-4 border border-gray-200 rounded-lg"
            >
              <div class="flex justify-between items-center">
                <div>
                  <h3 class="font-medium text-gray-900">{{ step.name }}</h3>
                  <p class="text-sm text-gray-500">Type: {{ step.step_type }}</p>
                </div>
                <span class="text-sm text-gray-500">Order: {{ step.order }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useProcessesStore } from '@/stores/processes'

const route = useRoute()
const processesStore = useProcessesStore()
const { currentProcess, currentSteps, loading } = storeToRefs(processesStore)

onMounted(async () => {
  const processId = route.params.id as string
  await processesStore.fetchProcess(processId)
  await processesStore.fetchSteps(processId)
})

async function handlePublish() {
  if (!currentProcess.value) return
  try {
    await processesStore.publishProcess(currentProcess.value.id)
    if ((window as any).$toast) {
      (window as any).$toast.success('Process published successfully')
    }
  } catch (error) {
    // Error handled by API interceptor
  }
}
</script>
