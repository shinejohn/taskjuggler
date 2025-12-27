<template>
  <AppLayout>
    <div class="dashboard">
      <h1 class="dashboard__title">Dashboard</h1>
      
      <!-- Key Metrics -->
      <div class="dashboard__metrics">
        <Card class="dashboard__metric-card">
          <h3 class="dashboard__metric-label">Pending Tasks</h3>
          <p class="dashboard__metric-value">{{ pendingCount }}</p>
        </Card>
        <Card class="dashboard__metric-card">
          <h3 class="dashboard__metric-label">Active Tasks</h3>
          <p class="dashboard__metric-value dashboard__metric-value--active">{{ activeCount }}</p>
        </Card>
        <Card class="dashboard__metric-card">
          <h3 class="dashboard__metric-label">Completed Tasks</h3>
          <p class="dashboard__metric-value dashboard__metric-value--completed">{{ completedCount }}</p>
        </Card>
        <Card class="dashboard__metric-card">
          <h3 class="dashboard__metric-label">Inbox Items</h3>
          <p class="dashboard__metric-value dashboard__metric-value--info">{{ inboxCount }}</p>
        </Card>
      </div>

      <!-- Recent Tasks -->
      <Card class="dashboard__section">
        <h2 class="dashboard__section-title">Recent Tasks</h2>
        <div v-if="loading" class="dashboard__loading">
          <LoadingSpinner />
          <span>Loading tasks...</span>
        </div>
        <div v-else-if="tasks.length === 0" class="dashboard__empty">
          <p class="dashboard__empty-text">No tasks yet</p>
          <Button variant="primary" @click="$router.push('/tasks/new')">
            Create Your First Task
          </Button>
        </div>
        <div v-else class="dashboard__tasks">
          <router-link
            v-for="task in tasks.slice(0, 5)"
            :key="task.id"
            :to="`/tasks/${task.id}`"
            class="dashboard__task-item"
          >
            <span class="dashboard__task-title">{{ task.title }}</span>
            <Badge :variant="getStatusVariant(task.status)" size="sm">
              {{ task.status }}
            </Badge>
          </router-link>
        </div>
      </Card>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, computed } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import { useAuthStore } from '@/stores/auth'
import { useInboxStore } from '@/stores/inbox'
import { getEcho } from '@/utils/echo'
import AppLayout from '@/components/layout/AppLayout.vue'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const tasksStore = useTasksStore()
const authStore = useAuthStore()
const inboxStore = useInboxStore()

const tasks = computed(() => tasksStore.tasks)
const loading = computed(() => tasksStore.loading)
const pendingCount = computed(() => tasksStore.pendingTasks.length)
const activeCount = computed(() => tasksStore.activeTasks.length)
const completedCount = computed(() => tasksStore.completedTasks.length)
const inboxCount = computed(() => inboxStore.items.length)

const getStatusVariant = (status: string) => {
  const statusMap: Record<string, 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled'> = {
    pending: 'pending',
    accepted: 'accepted',
    in_progress: 'in-progress',
    completed: 'completed',
    cancelled: 'cancelled',
  }
  return statusMap[status] || 'pending'
}

let echoChannel: any = null

onMounted(() => {
  tasksStore.fetchTasks()
  inboxStore.fetchInbox()
  
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

<style scoped>
.dashboard {
  width: 100%;
}

.dashboard__title {
  font-size: var(--font-display-medium);
  font-weight: 700;
  line-height: var(--line-height-tight);
  color: var(--color-text-primary);
  margin-bottom: var(--space-8);
}

.dashboard__metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-6);
  margin-bottom: var(--space-8);
}

.dashboard__metric-card {
  padding: var(--space-6);
}

.dashboard__metric-label {
  font-size: var(--font-title-medium);
  font-weight: 500;
  color: var(--color-text-secondary);
  margin-bottom: var(--space-2);
}

.dashboard__metric-value {
  font-size: var(--font-display-medium);
  font-weight: 700;
  line-height: var(--line-height-tight);
  color: var(--color-primary);
}

.dashboard__metric-value--active {
  color: var(--color-status-in-progress);
}

.dashboard__metric-value--completed {
  color: var(--color-status-completed);
}

.dashboard__metric-value--info {
  color: var(--color-info);
}

.dashboard__section {
  padding: var(--space-6);
}

.dashboard__section-title {
  font-size: var(--font-headline);
  font-weight: 600;
  line-height: var(--line-height-normal);
  color: var(--color-text-primary);
  margin-bottom: var(--space-6);
}

.dashboard__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  padding: var(--space-12);
  color: var(--color-text-secondary);
}

.dashboard__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  padding: var(--space-12);
  text-align: center;
}

.dashboard__empty-text {
  font-size: var(--font-body-large);
  color: var(--color-text-secondary);
}

.dashboard__tasks {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.dashboard__task-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--color-text-primary);
  transition: all var(--duration-fast) var(--ease-out);
  border-bottom: 1px solid var(--color-border-subtle);
}

.dashboard__task-item:hover {
  background: var(--color-bg-secondary);
}

.dashboard__task-item:last-child {
  border-bottom: none;
}

.dashboard__task-title {
  font-size: var(--font-body-large);
  font-weight: 500;
  color: var(--color-text-primary);
  flex: 1;
}
</style>
