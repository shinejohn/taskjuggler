<template>
  <div class="p-6">
    <div v-if="loading">Loading...</div>
    <div v-else-if="task" class="card">
      <h1 class="text-2xl font-bold mb-4">{{ task.title }}</h1>
      <p class="text-gray-600 mb-4">{{ task.description }}</p>
      <div class="space-y-2">
        <p><strong>Status:</strong> {{ task.status }}</p>
        <p><strong>Priority:</strong> {{ task.priority }}</p>
        <div v-if="task.due_date || task.start_date" class="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 class="font-semibold mb-2">Add to Calendar</h3>
          <div class="flex flex-wrap gap-2">
            <button @click="exportIcal" class="btn btn-secondary text-sm">
              📅 Download iCal (.ics)
            </button>
            <button @click="openGoogleCalendar" class="btn btn-secondary text-sm">
              📅 Add to Google Calendar
            </button>
            <button @click="openOutlookCalendar" class="btn btn-secondary text-sm">
              📅 Add to Outlook
            </button>
          </div>
        </div>
        <button @click="completeTask" class="btn btn-primary mt-4">Mark Complete</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTasksStore } from '@/stores/tasks'
import api from '@/utils/api'

const route = useRoute()
const router = useRouter()
const tasksStore = useTasksStore()

const task = computed(() => tasksStore.currentTask)
const loading = computed(() => tasksStore.loading)

onMounted(() => {
  tasksStore.fetchTask(route.params.id as string)
})

async function completeTask() {
  if (task.value) {
    try {
      await tasksStore.completeTask(task.value.id)
      if ((window as any).$toast) {
        (window as any).$toast.success('Task completed successfully')
      }
      router.push('/tasks')
    } catch (error) {
      // Error handled by API interceptor
    }
  }
}

async function exportIcal() {
  if (!task.value) return
  
  try {
    const response = await api.get(`/tasks/${task.value.id}/export/ical`, {
      responseType: 'blob',
    })
    
    const blob = new Blob([response.data], { type: 'text/calendar' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `task-${task.value.id}.ics`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    if ((window as any).$toast) {
      (window as any).$toast.success('Calendar file downloaded')
    }
  } catch (error) {
    // Error handled by API interceptor
  }
}

async function openGoogleCalendar() {
  if (!task.value) return
  
  try {
    const response = await api.get(`/tasks/${task.value.id}/calendar/google`)
    window.open(response.data.url, '_blank')
    
    if ((window as any).$toast) {
      (window as any).$toast.info('Opening Google Calendar...')
    }
  } catch (error) {
    // Error handled by API interceptor
  }
}

async function openOutlookCalendar() {
  if (!task.value) return
  
  try {
    const response = await api.get(`/tasks/${task.value.id}/calendar/outlook`)
    window.open(response.data.url, '_blank')
    
    if ((window as any).$toast) {
      (window as any).$toast.info('Opening Outlook Calendar...')
    }
  } catch (error) {
    // Error handled by API interceptor
  }
}
</script>
