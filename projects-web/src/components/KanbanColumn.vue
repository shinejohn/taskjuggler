<template>
  <div 
    class="flex-shrink-0 w-80 bg-gray-50 rounded-lg p-3"
    @dragover.prevent
    @drop="handleDrop"
  >
    <!-- Header -->
    <div class="flex items-center justify-between mb-3">
      <h3 class="font-medium text-gray-900">
        {{ title }}
        <span class="ml-2 text-gray-400 text-sm">{{ tasks.length }}</span>
      </h3>
      <div 
        class="w-3 h-3 rounded-full"
        :class="colorClass"
      />
    </div>

    <!-- Tasks -->
    <div class="space-y-2 min-h-[200px]">
      <div
        v-for="task in tasks"
        :key="task.id"
        draggable="true"
        @dragstart="handleDragStart($event, task)"
        @click="$emit('task-click', task)"
      >
        <TaskCard :task="task" />
      </div>

      <!-- Empty state -->
      <div 
        v-if="tasks.length === 0"
        class="text-center py-8 text-gray-400"
      >
        No tasks
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import TaskCard from './TaskCard.vue'
import type { Task } from '@/api/tasks'

const props = defineProps<{
  title: string
  state: string
  tasks: Task[]
  color: string
}>()

const emit = defineEmits<{
  'task-click': [task: Task]
  'drop': [data: { taskId: string; fromState: string; toState: string }]
}>()

const colorClass = computed(() => {
  const classes: Record<string, string> = {
    gray: 'bg-gray-400',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
  }
  return classes[props.color] || 'bg-gray-400'
})

function handleDragStart(event: DragEvent, task: Task) {
  if (event.dataTransfer) {
    event.dataTransfer.setData('taskId', task.id)
    event.dataTransfer.setData('fromState', task.state)
  }
}

function handleDrop(event: DragEvent) {
  const taskId = event.dataTransfer?.getData('taskId')
  const fromState = event.dataTransfer?.getData('fromState')
  
  if (taskId && fromState && fromState !== props.state) {
    emit('drop', { taskId, fromState, toState: props.state })
  }
}
</script>

