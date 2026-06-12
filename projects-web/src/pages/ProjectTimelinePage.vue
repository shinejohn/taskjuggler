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

    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-600 mb-4">{{ error }}</div>
      <button
        type="button"
        @click="fetchTimeline"
        class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
      >
        Retry
      </button>
    </div>

    <div v-else-if="timeline" class="space-y-6">
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-lg font-semibold text-gray-900 mb-2">{{ timeline.project.name }}</h2>
        <p class="text-sm text-gray-500">
          {{ formatDate(timeline.project.start_date) || 'No start date' }}
          &rarr;
          {{ formatDate(timeline.project.target_end_date) || 'No target date' }}
        </p>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-base font-semibold text-gray-900 mb-4">Milestones</h3>
        <p v-if="timeline.milestones.length === 0" class="text-sm text-gray-500">
          No milestones yet
        </p>
        <ol v-else class="space-y-3">
          <li
            v-for="milestone in timeline.milestones"
            :key="milestone.id"
            class="flex items-center gap-3"
          >
            <span
              class="inline-block w-2.5 h-2.5 rounded-full shrink-0"
              :class="milestoneDotClass(milestone.status)"
            ></span>
            <span class="flex-1 text-sm text-gray-900">
              {{ milestone.name }}
              <span v-if="milestone.is_critical" class="ml-1 text-xs text-red-600 font-medium">critical</span>
            </span>
            <span class="text-xs text-gray-500">{{ formatDate(milestone.target_date) || 'No date' }}</span>
            <span class="text-xs px-2 py-0.5 rounded-full" :class="statusBadgeClass(milestone.status)">
              {{ formatStatus(milestone.status) }}
            </span>
          </li>
        </ol>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-base font-semibold text-gray-900 mb-4">Tasks</h3>
        <p v-if="timeline.tasks.length === 0" class="text-sm text-gray-500">
          No tasks yet
        </p>
        <ol v-else class="space-y-3">
          <li
            v-for="task in timeline.tasks"
            :key="task.id"
            class="flex items-center gap-3"
          >
            <span class="flex-1 text-sm text-gray-900">{{ task.title }}</span>
            <span v-if="task.owner" class="text-xs text-gray-500">{{ task.owner.name }}</span>
            <span class="text-xs text-gray-500">
              {{ formatDate(task.start_date) || '—' }} &rarr; {{ formatDate(task.due_date) || '—' }}
            </span>
            <span class="text-xs px-2 py-0.5 rounded-full" :class="statusBadgeClass(task.status)">
              {{ formatStatus(task.status) }}
            </span>
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { projectsApi } from '@/api/projects'

interface TimelineTask {
  id: string
  title: string
  status: string
  priority: string
  start_date: string | null
  due_date: string | null
  completed_at: string | null
  owner?: {
    id: string
    name: string
    email: string
  } | null
}

interface TimelineMilestone {
  id: string
  name: string
  status: string
  target_date: string | null
  is_critical: boolean
}

interface TimelineData {
  project: {
    id: string
    name: string
    start_date: string | null
    target_end_date: string | null
  }
  tasks: TimelineTask[]
  milestones: TimelineMilestone[]
}

const route = useRoute()
const loading = ref(false)
const error = ref<string | null>(null)
const timeline = ref<TimelineData | null>(null)

function formatDate(value: string | null | undefined): string | null {
  if (!value) return null
  return new Date(value).toLocaleDateString()
}

function formatStatus(status: string): string {
  return status.replace(/_/g, ' ')
}

function statusBadgeClass(status: string): string {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'in_progress':
    case 'accepted':
      return 'bg-blue-100 text-blue-800'
    case 'missed':
    case 'overdue':
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

function milestoneDotClass(status: string): string {
  switch (status) {
    case 'completed':
      return 'bg-green-500'
    case 'in_progress':
      return 'bg-blue-500'
    case 'missed':
      return 'bg-red-500'
    default:
      return 'bg-gray-300'
  }
}

async function fetchTimeline() {
  loading.value = true
  error.value = null
  try {
    const projectId = route.params.id as string
    const response = await projectsApi.getTimeline(projectId)
    timeline.value = (response?.data ?? response) as TimelineData
  } catch {
    error.value = 'Failed to load timeline'
  } finally {
    loading.value = false
  }
}

onMounted(fetchTimeline)
</script>
