<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Project Timeline</h1>
      <router-link
        :to="{ name: 'project-detail', params: { id: route.params.id } }"
        class="text-sm text-primary-600 hover:text-primary-500"
      >
        Back to Project
      </router-link>
    </div>

    <div v-if="loading" class="text-center py-12">
      <div class="text-gray-500">Loading timeline...</div>
    </div>

    <div v-else class="bg-white p-6 rounded-lg shadow">
      <p class="text-gray-500">Timeline view coming soon</p>
      <p class="text-sm text-gray-400 mt-2">This will display a Gantt chart view of the project timeline</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProjectsStore } from '@/stores/projects'

const route = useRoute()
const projectsStore = useProjectsStore()
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const projectId = route.params.id as string
    await projectsStore.fetchProject(projectId)
    // TODO: Fetch timeline data when endpoint is available
  } finally {
    loading.value = false
  }
})
</script>

