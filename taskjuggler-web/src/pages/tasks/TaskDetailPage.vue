<template>
  <div class="p-6">
    <div v-if="loading">Loading...</div>
    <div v-else-if="task" class="card">
      <h1 class="text-2xl font-bold mb-4">{{ task.title }}</h1>
      <p class="text-gray-600 mb-4">{{ task.description }}</p>
      <div class="space-y-2">
        <p><strong>Status:</strong> {{ task.status }}</p>
        <p><strong>Priority:</strong> {{ task.priority }}</p>
        <button @click="completeTask" class="btn btn-primary mt-4">Mark Complete</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTasksStore } from '@/stores/tasks'

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
    await tasksStore.completeTask(task.value.id)
    router.push('/tasks')
  }
}
</script>
