<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Tasks</h1>
      <router-link to="/tasks/new" class="btn btn-primary">New Task</router-link>
    </div>
    <div v-if="loading">Loading...</div>
    <div v-else class="space-y-4">
      <div v-for="task in tasks" :key="task.id" class="card">
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
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, computed } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import { useAuthStore } from '@/stores/auth'
import { getEcho } from '@/utils/echo'

const tasksStore = useTasksStore()
const authStore = useAuthStore()

const tasks = computed(() => tasksStore.tasks)
const loading = computed(() => tasksStore.loading)

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
