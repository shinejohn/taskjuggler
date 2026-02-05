<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-6">
      {{ isEdit ? 'Edit Project' : 'Create New Project' }}
    </h1>

    <form @submit.prevent="handleSubmit" class="bg-white p-6 rounded-lg shadow space-y-4">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">Project Name</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <div>
        <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          v-model="form.description"
          rows="4"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
          <select
            id="status"
            v-model="form.status"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="on_hold">On Hold</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label for="start_date" class="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            id="start_date"
            v-model="form.start_date"
            type="date"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      <div>
        <label for="target_end_date" class="block text-sm font-medium text-gray-700">Target End Date</label>
        <input
          id="target_end_date"
          v-model="form.target_end_date"
          type="date"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <div v-if="error" class="text-red-600 text-sm">{{ error }}</div>

      <div class="flex justify-end space-x-4">
        <button
          type="button"
          @click="$router.back()"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="loading"
          class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
        >
          {{ loading ? 'Saving...' : isEdit ? 'Update' : 'Create' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectsStore } from '@/stores/projects'
import type { Project } from '@/api/projects'

const route = useRoute()
const router = useRouter()
const projectsStore = useProjectsStore()

const isEdit = computed(() => !!route.params.id && route.name === 'project-edit')

const form = ref<Partial<Project>>({
  name: '',
  description: '',
  status: 'planning',
  start_date: null,
  target_end_date: null,
})

const loading = ref(false)
const error = ref('')

onMounted(async () => {
  if (isEdit.value) {
    const projectId = route.params.id as string
    await projectsStore.fetchProject(projectId)
    if (projectsStore.currentProject) {
      form.value = {
        name: projectsStore.currentProject.name,
        description: projectsStore.currentProject.description || '',
        status: projectsStore.currentProject.status,
        start_date: projectsStore.currentProject.start_date || null,
        target_end_date: projectsStore.currentProject.target_end_date || null,
      }
    }
  }
})

async function handleSubmit() {
  loading.value = true
  error.value = ''

  try {
    if (isEdit.value) {
      await projectsStore.updateProject(route.params.id as string, form.value)
    } else {
      await projectsStore.createProject(form.value)
    }
    router.push({ name: 'projects' })
  } catch (err: any) {
    error.value = err.message || 'Failed to save project'
  } finally {
    loading.value = false
  }
}
</script>

