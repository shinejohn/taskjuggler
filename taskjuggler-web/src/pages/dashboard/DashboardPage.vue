<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Dashboard</h1>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="card">
        <h3 class="text-lg font-semibold mb-2">Pending Tasks</h3>
        <p class="text-3xl font-bold text-primary-600">{{ pendingCount }}</p>
      </div>
      <div class="card">
        <h3 class="text-lg font-semibold mb-2">Active Tasks</h3>
        <p class="text-3xl font-bold text-blue-600">{{ activeCount }}</p>
      </div>
      <div class="card">
        <h3 class="text-lg font-semibold mb-2">Completed Tasks</h3>
        <p class="text-3xl font-bold text-green-600">{{ completedCount }}</p>
      </div>
    </div>
    <div class="card">
      <h2 class="text-xl font-bold mb-4">Recent Tasks</h2>
      <div v-if="loading">Loading...</div>
      <div v-else-if="tasks.length === 0" class="text-gray-500">No tasks yet</div>
      <div v-else class="space-y-2">
        <div v-for="task in tasks.slice(0, 5)" :key="task.id" class="border-b pb-2">
          <router-link :to="`/tasks/${task.id}`" class="text-primary-600 hover:underline">
            {{ task.title }}
          </router-link>
          <span class="ml-2 text-sm text-gray-500">{{ task.status }}</span>
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
const pendingCount = computed(() => tasksStore.pendingTasks.length)
const activeCount = computed(() => tasksStore.activeTasks.length)
const completedCount = computed(() => tasksStore.completedTasks.length)

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
            if ((window as any).$toast) {
              (window as any).$toast.info('New task created')
            }
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
