<template>
  <div class="flex gap-4 overflow-x-auto pb-4 min-h-[600px]">
    <KanbanColumn
      v-for="column in columns"
      :key="column.state"
      :title="column.title"
      :state="column.state"
      :tasks="tasksByState[column.state] || []"
      :color="column.color"
      @task-click="$emit('task-click', $event)"
      @task-move="handleTaskMove"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import KanbanColumn from './KanbanColumn.vue'
import type { Task } from '@/api/tasks'

const props = defineProps<{
  tasks: Task[]
}>()

const emit = defineEmits<{
  'task-click': [task: Task]
  'task-move': [data: { taskId: string; action: string }]
}>()

const columns = [
  { state: 'pending', title: 'Pending', color: 'gray' },
  { state: 'accepted', title: 'Accepted', color: 'blue' },
  { state: 'in_progress', title: 'In Progress', color: 'yellow' },
  { state: 'completed', title: 'Completed', color: 'green' },
]

const tasksByState = computed(() => {
  const grouped: Record<string, Task[]> = {}
  for (const task of props.tasks) {
    const state = task.state || 'pending'
    if (!grouped[state]) {
      grouped[state] = []
    }
    grouped[state].push(task)
  }
  return grouped
})

function handleTaskMove(data: { taskId: string; fromState: string; toState: string }) {
  const actionMap: Record<string, string> = {
    accepted: 'accept',
    in_progress: 'start',
    completed: 'complete',
  }

  const action = actionMap[data.toState]
  if (action) {
    emit('task-move', { taskId: data.taskId, action })
  }
}
</script>

