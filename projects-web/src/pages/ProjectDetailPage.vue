<template>
  <div>
    <div v-if="projectsStore.loading" class="text-center py-12">
      <div class="text-gray-500">Loading project...</div>
    </div>

    <div v-else-if="projectsStore.currentProject" class="space-y-6">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ projectsStore.currentProject.name }}</h1>
          <p v-if="projectsStore.currentProject.code" class="text-sm text-gray-500 mt-1">
            {{ projectsStore.currentProject.code }}
          </p>
        </div>
        <button
          @click="$router.push({ name: 'project-edit', params: { id: projectsStore.currentProject!.id } })"
          class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Edit Project
        </button>
      </div>

      <div v-if="projectsStore.currentProject.description" class="bg-white p-4 rounded-lg shadow">
        <p class="text-gray-700">{{ projectsStore.currentProject.description }}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white p-4 rounded-lg shadow">
          <div class="text-sm text-gray-500">Status</div>
          <div class="text-lg font-semibold mt-1">{{ projectsStore.currentProject.status }}</div>
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
          <div class="text-sm text-gray-500">Progress</div>
          <div class="text-lg font-semibold mt-1">{{ projectsStore.currentProject.progress_percentage }}%</div>
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
          <div class="text-sm text-gray-500">Health</div>
          <div class="text-lg font-semibold mt-1">{{ projectsStore.currentProject.health_status }}</div>
        </div>
      </div>

      <div class="flex space-x-4">
        <router-link
          :to="{ name: 'project-timeline', params: { id: projectsStore.currentProject.id } }"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          Timeline
        </router-link>
        <router-link
          :to="{ name: 'project-board', params: { id: projectsStore.currentProject.id } }"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          Board
        </router-link>
      </div>

      <!-- Milestones section -->
      <div v-if="milestones.length > 0" class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Milestones</h2>
        <div class="space-y-3">
          <div
            v-for="milestone in milestones"
            :key="milestone.id"
            class="border-l-4 border-primary-500 pl-4 py-2"
          >
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-medium text-gray-900">{{ milestone.name }}</h3>
                <p v-if="milestone.description" class="text-sm text-gray-500 mt-1">
                  {{ milestone.description }}
                </p>
                <p class="text-xs text-gray-400 mt-1">
                  Due: {{ new Date(milestone.target_date).toLocaleDateString() }}
                </p>
              </div>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="{
                      'bg-yellow-100 text-yellow-800': milestone.status === 'pending',
                      'bg-blue-100 text-blue-800': milestone.status === 'in_progress',
                      'bg-green-100 text-green-800': milestone.status === 'completed',
                      'bg-red-100 text-red-800': milestone.status === 'missed',
                    }">
                {{ milestone.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12">
      <div class="text-gray-500">Project not found</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProjectsStore } from '@/stores/projects'
import type { Milestone } from '@/api/projects'

const route = useRoute()
const projectsStore = useProjectsStore()
const milestones = ref<Milestone[]>([])

onMounted(async () => {
  const projectId = route.params.id as string
  await projectsStore.fetchProject(projectId)
  
  // Try to fetch milestones (may fail if endpoint doesn't exist yet)
  try {
    const milestoneData = await projectsStore.fetchMilestones(projectId)
    milestones.value = Array.isArray(milestoneData) ? milestoneData : milestoneData.data || []
  } catch (error) {
    console.warn('Milestones endpoint not available yet')
  }
})
</script>

