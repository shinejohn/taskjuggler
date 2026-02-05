<template>
  <div 
    class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
    @click="$emit('click', task)"
  >
    <!-- Header -->
    <div class="flex items-start justify-between gap-2 mb-2">
      <h3 class="font-medium text-gray-900 line-clamp-2 flex-1">
        {{ task.title }}
      </h3>
      <span 
        class="text-xs px-2 py-1 rounded"
        :class="channelClasses"
      >
        {{ task.source_channel }}
      </span>
    </div>

    <!-- Description -->
    <p v-if="task.description" class="text-sm text-gray-600 line-clamp-2 mb-3">
      {{ task.description }}
    </p>

    <!-- Meta row -->
    <div class="flex items-center gap-2 flex-wrap mb-3">
      <span 
        class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
        :class="stateClasses"
      >
        {{ task.state }}
      </span>
      <span 
        class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
        :class="priorityClasses"
      >
        {{ task.priority }}
      </span>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between text-sm">
      <!-- Owner -->
      <div class="flex items-center gap-2">
        <span v-if="task.owner" class="text-gray-600">
          {{ task.owner.name }}
        </span>
        <span v-else class="text-gray-400 italic">Unassigned</span>
      </div>

      <!-- Due date -->
      <div 
        v-if="task.due_date" 
        class="flex items-center gap-1"
        :class="task.is_overdue ? 'text-red-600' : 'text-gray-500'"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>{{ formatDate(task.due_date) }}</span>
      </div>
    </div>

    <!-- AI Suggestion -->
    <div 
      v-if="task.ai_suggestions?.suggested_owner"
      class="mt-3 p-2 bg-blue-50 rounded text-sm text-blue-700"
    >
      <span class="font-medium">AI suggests:</span> {{ task.ai_suggestions.suggested_owner.user_name }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Task } from '@/api/tasks'

const props = defineProps<{
  task: Task
}>()

defineEmits<{
  click: [task: Task]
}>()

const stateClasses = computed(() => {
  const classes: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-700',
    accepted: 'bg-blue-100 text-blue-700',
    declined: 'bg-red-100 text-red-700',
    in_progress: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-gray-100 text-gray-500',
    overdue: 'bg-red-100 text-red-700',
  }
  return classes[props.task.state] || 'bg-gray-100 text-gray-700'
})

const priorityClasses = computed(() => {
  const classes: Record<string, string> = {
    low: 'bg-gray-100 text-gray-700',
    medium: 'bg-blue-100 text-blue-700',
    high: 'bg-orange-100 text-orange-700',
    critical: 'bg-red-100 text-red-700',
  }
  return classes[props.task.priority] || 'bg-gray-100 text-gray-700'
})

const channelClasses = computed(() => {
  const classes: Record<string, string> = {
    web: 'bg-blue-100 text-blue-700',
    mobile: 'bg-purple-100 text-purple-700',
    email: 'bg-green-100 text-green-700',
    sms: 'bg-yellow-100 text-yellow-700',
    voice: 'bg-pink-100 text-pink-700',
    slack: 'bg-indigo-100 text-indigo-700',
  }
  return classes[props.task.source_channel] || 'bg-gray-100 text-gray-700'
})

function formatDate(dateString: string | null): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

