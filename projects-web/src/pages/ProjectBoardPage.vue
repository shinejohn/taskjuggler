<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Project Board</h1>
      <div class="flex gap-2">
        <button
          @click="showCreateTaskModal = true"
          class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          New Task
        </button>
        <router-link
          :to="{ name: 'project-detail', params: { id: route.params.id } }"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          Back to Project
        </router-link>
      </div>
    </div>

    <div v-if="tasksStore.loading" class="text-center py-12">
      <div class="text-gray-500">Loading board...</div>
    </div>

    <div v-else>
      <KanbanBoard
        :tasks="tasksStore.tasks"
        @task-click="handleTaskClick"
        @task-move="handleTaskMove"
      />
    </div>

    <!-- Create Task Modal (simplified) -->
    <div
      v-if="showCreateTaskModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="showCreateTaskModal = false"
    >
      <div
        class="bg-white rounded-lg p-6 max-w-md w-full mx-4"
        @click.stop
      >
        <h2 class="text-xl font-bold mb-4">Create New Task</h2>
        <form @submit.prevent="handleCreateTask">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              v-model="newTask.title"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Task title"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              v-model="newTask.description"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows="3"
              placeholder="Task description"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select v-model="newTask.priority" class="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div class="flex justify-end gap-2">
            <button
              type="button"
              @click="showCreateTaskModal = false"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="tasksStore.loading"
              class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTasksStore } from '@/stores/tasks'
import { useProjectsStore } from '@/stores/projects'
import KanbanBoard from '@/components/KanbanBoard.vue'
import type { Task } from '@/api/tasks'

const route = useRoute()
const tasksStore = useTasksStore()
const projectsStore = useProjectsStore()

const showCreateTaskModal = ref(false)
const newTask = ref({
  title: '',
  description: '',
  priority: 'medium' as Task['priority'],
})

onMounted(async () => {
  const projectId = route.params.id as string
  await projectsStore.fetchProject(projectId)
  await tasksStore.fetchTasks(projectId)
})

async function handleCreateTask() {
  try {
    const projectId = route.params.id as string
    await tasksStore.createTask(projectId, newTask.value)
    showCreateTaskModal.value = false
    newTask.value = { title: '', description: '', priority: 'medium' }
  } catch (error) {
    console.error('Failed to create task:', error)
  }
}

function handleTaskClick(task: Task) {
  // Navigate to task detail or show modal
  console.log('Task clicked:', task)
}

async function handleTaskMove(data: { taskId: string; action: string }) {
  try {
    const projectId = route.params.id as string
    await tasksStore.transitionTask(projectId, data.taskId, data.action as any)
  } catch (error) {
    console.error('Failed to move task:', error)
  }
}
</script>

