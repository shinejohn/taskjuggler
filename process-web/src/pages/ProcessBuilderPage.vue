<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">
        {{ isEdit ? 'Edit Process' : 'Create Process' }}
      </h1>

      <div class="bg-white rounded-lg shadow p-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Process Name</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Process Name"
            />
          </div>

          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              id="description"
              v-model="form.description"
              rows="3"
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Process description"
            />
          </div>

          <div>
            <label for="trigger_type" class="block text-sm font-medium text-gray-700 mb-1">Trigger Type</label>
            <select
              id="trigger_type"
              v-model="form.trigger_type"
              required
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              <option value="">Select trigger type</option>
              <option value="manual">Manual</option>
              <option value="task_created">Task Created</option>
              <option value="task_updated">Task Updated</option>
              <option value="schedule">Schedule</option>
            </select>
          </div>

          <div class="flex justify-end gap-2">
            <button
              type="button"
              @click="$router.back()"
              class="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
            >
              {{ loading ? 'Saving...' : 'Save Process' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProcessesStore } from '@/stores/processes'

const route = useRoute()
const router = useRouter()
const processesStore = useProcessesStore()
const { loading } = processesStore

const isEdit = ref(false)
const form = ref({
  name: '',
  description: '',
  trigger_type: '',
})

onMounted(async () => {
  const processId = route.params.id as string
  if (processId && route.name === 'process-edit') {
    isEdit.value = true
    await processesStore.fetchProcess(processId)
    if (processesStore.currentProcess) {
      form.value = {
        name: processesStore.currentProcess.name,
        description: processesStore.currentProcess.description || '',
        trigger_type: processesStore.currentProcess.trigger_type,
      }
    }
  }
})

async function handleSubmit() {
  try {
    const processId = route.params.id as string
    if (isEdit.value && processId) {
      await processesStore.updateProcess(processId, form.value)
      if ((window as any).$toast) {
        (window as any).$toast.success('Process updated successfully')
      }
    } else {
      const newProcess = await processesStore.createProcess(form.value)
      if ((window as any).$toast) {
        (window as any).$toast.success('Process created successfully')
      }
      router.push(`/processes/${newProcess.id}`)
      return
    }
    router.push(`/processes/${processId}`)
  } catch (error) {
    // Error handled by API interceptor
  }
}
</script>
