<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Tasks</h1>
      <div class="flex gap-2">
        <button
          v-if="selectedTasks.size > 0"
          @click="showBulkActions = true"
          class="btn btn-secondary"
        >
          {{ selectedTasks.size }} selected
        </button>
        <div v-if="selectedTasks.size > 0" class="relative">
          <button
            @click="showExportMenu = !showExportMenu"
            class="btn btn-secondary"
          >
            📥 Export
          </button>
          <div
            v-if="showExportMenu"
            class="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg z-10 min-w-[150px]"
            @click.stop
          >
            <button
              @click="exportSelected('csv')"
              class="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Export as CSV
            </button>
            <button
              @click="exportSelected('pdf')"
              class="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Export as PDF
            </button>
            <button
              @click="exportSelected('ical')"
              class="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Export as iCal
            </button>
          </div>
        </div>
        <router-link to="/tasks/new" class="btn btn-primary">New Task</router-link>
      </div>
    </div>

    <!-- Filters -->
    <div class="mb-4 flex gap-4 items-center flex-wrap">
      <div class="flex items-center gap-2">
        <label class="text-sm font-medium">Status:</label>
        <select v-model="statusFilter" class="px-3 py-1 border border-gray-300 rounded">
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div class="flex items-center gap-2">
        <label class="text-sm font-medium">Priority:</label>
        <select v-model="priorityFilter" class="px-3 py-1 border border-gray-300 rounded">
          <option value="">All</option>
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>
      <div class="flex items-center gap-2 flex-1">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search tasks..."
          class="px-3 py-1 border border-gray-300 rounded flex-1 max-w-xs"
        />
      </div>
    </div>

    <div v-if="loading">Loading...</div>
    <div v-else-if="filteredTasks.length === 0" class="text-center py-8 text-gray-500">
      <p>No tasks found</p>
    </div>
    <div v-else class="space-y-4">
      <div
        v-for="task in filteredTasks"
        :key="task.id"
        class="card"
        :class="{ 'ring-2 ring-blue-500': selectedTasks.has(task.id) }"
      >
        <div class="flex items-start gap-3">
          <input
            type="checkbox"
            :checked="selectedTasks.has(task.id)"
            @change="toggleTaskSelection(task.id)"
            class="mt-1"
          />
          <div class="flex-1">
            <router-link :to="`/tasks/${task.id}`" class="text-primary-600 hover:underline">
              <h3 class="text-lg font-semibold">{{ task.title }}</h3>
            </router-link>
            <p class="text-gray-600 mt-1">{{ task.description }}</p>
            <div class="mt-2 flex gap-2">
              <span class="px-2 py-1 bg-gray-100 rounded text-sm">{{ task.status }}</span>
              <span class="px-2 py-1 bg-gray-100 rounded text-sm">{{ task.priority }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bulk Actions Modal -->
    <div
      v-if="showBulkActions"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showBulkActions = false"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md" @click.stop>
        <h2 class="text-xl font-bold mb-4">Bulk Actions</h2>
        <p class="text-gray-600 mb-4">{{ selectedTasks.size }} task(s) selected</p>
        <div class="space-y-2">
          <button
            @click="bulkComplete"
            class="btn btn-primary w-full"
          >
            Mark as Complete
          </button>
          <button
            @click="bulkDelete"
            class="btn btn-danger w-full"
          >
            Delete Selected
          </button>
          <button
            @click="showBulkActions = false"
            class="btn btn-secondary w-full"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, computed, ref } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import { useAuthStore } from '@/stores/auth'
import { getEcho } from '@/utils/echo'
import api from '@/utils/api'
import type { Task } from '@/types'

const tasksStore = useTasksStore()
const authStore = useAuthStore()

const tasks = computed(() => tasksStore.tasks)
const loading = computed(() => tasksStore.loading)

const statusFilter = ref('')
const priorityFilter = ref('')
const searchQuery = ref('')
const selectedTasks = ref(new Set<string>())
const showBulkActions = ref(false)
const showExportMenu = ref(false)

const filteredTasks = computed(() => {
  return tasks.value.filter((task: Task) => {
    const matchesStatus = !statusFilter.value || task.status === statusFilter.value
    const matchesPriority = !priorityFilter.value || task.priority === priorityFilter.value
    const matchesSearch = !searchQuery.value ||
      task.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.value.toLowerCase()))
    return matchesStatus && matchesPriority && matchesSearch
  })
})

function toggleTaskSelection(taskId: string) {
  if (selectedTasks.value.has(taskId)) {
    selectedTasks.value.delete(taskId)
  } else {
    selectedTasks.value.add(taskId)
  }
}

async function bulkComplete() {
  const taskIds = Array.from(selectedTasks.value)
  try {
    await Promise.all(taskIds.map(id => tasksStore.completeTask(id)))
    if ((window as any).$toast) {
      (window as any).$toast.success(`Completed ${taskIds.length} task(s)`)
    }
    selectedTasks.value.clear()
    showBulkActions.value = false
  } catch (error) {
    // Error handled by API interceptor
  }
}

async function bulkDelete() {
  if (!confirm(`Delete ${selectedTasks.value.size} task(s)?`)) return
  
  const taskIds = Array.from(selectedTasks.value)
  try {
    await Promise.all(taskIds.map(id => tasksStore.deleteTask(id)))
    if ((window as any).$toast) {
      (window as any).$toast.success(`Deleted ${taskIds.length} task(s)`)
    }
    selectedTasks.value.clear()
    showBulkActions.value = false
  } catch (error) {
    // Error handled by API interceptor
  }
}

async function exportSelected(format: 'csv' | 'pdf' | 'ical' = 'ical') {
  if (selectedTasks.value.size === 0) return
  
  const taskIds = Array.from(selectedTasks.value)
  showExportMenu.value = false
  
  try {
    let endpoint = '/tasks/export/ical'
    let mimeType = 'text/calendar'
    let extension = 'ics'
    
    if (format === 'csv') {
      endpoint = '/tasks/export/csv'
      mimeType = 'text/csv'
      extension = 'csv'
    } else if (format === 'pdf') {
      endpoint = '/tasks/export/pdf'
      mimeType = 'text/html'
      extension = 'html'
    }
    
    const response = await api.post(endpoint, { task_ids: taskIds }, {
      responseType: 'blob',
    })
    
    const blob = new Blob([response.data], { type: mimeType })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `tasks-${new Date().toISOString().split('T')[0]}.${extension}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    if ((window as any).$toast) {
      (window as any).$toast.success(`Tasks exported as ${format.toUpperCase()}`)
    }
  } catch (error) {
    // Error handled by API interceptor
  }
}

let echoChannel: any = null

onMounted(() => {
  tasksStore.fetchTasks()
  
  // Listen for real-time updates
  if (authStore.user) {
    try {
      const echo = getEcho()
      if (echo) {
        echoChannel = echo.private(`user.${authStore.user.id}`)
          .listen('.TaskCreated', () => {
            tasksStore.fetchTasks()
          })
          .listen('.TaskAssigned', () => {
            tasksStore.fetchTasks()
          })
          .listen('.TaskCompleted', () => {
            tasksStore.fetchTasks()
          })
      }
    } catch (error) {
      console.error('Echo not initialized:', error)
    }
  }
})

onUnmounted(() => {
  if (echoChannel) {
    echoChannel.stopListening('.TaskCreated')
    echoChannel.stopListening('.TaskAssigned')
    echoChannel.stopListening('.TaskCompleted')
  }
})
</script>
