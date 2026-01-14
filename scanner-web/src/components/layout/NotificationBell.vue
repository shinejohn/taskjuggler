<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="notification-trigger">
        <BellIcon class="bell-icon" />
        <Badge v-if="unreadCount > 0" variant="destructive" size="sm" class="badge">
          {{ unreadCount > 99 ? '99+' : unreadCount }}
        </Badge>
      </Button>
    </DropdownMenuTrigger>
    
    <DropdownMenuContent class="notifications-list">
      <div class="notifications-header">
        <h4>Notifications</h4>
        <Button v-if="unreadCount > 0" variant="ghost" size="sm" @click="markAllRead">
          Mark all read
        </Button>
      </div>
      
      <div v-if="loading && notifications.length === 0" class="empty">
        Loading...
      </div>
      
      <div v-else-if="notifications.length === 0" class="empty">
        No notifications
      </div>
      
      <div v-else>
        <DropdownMenuItem
          v-for="notification in notifications"
          :key="notification.id"
          class="notification-item"
          :class="{ unread: !notification.read_at }"
          @click="handleNotificationClick(notification)"
        >
          <div class="notification-content">
            <h5>{{ notification.title }}</h5>
            <p>{{ notification.body || notification.message }}</p>
            <span class="time">{{ formatTime(notification.created_at) }}</span>
          </div>
        </DropdownMenuItem>
      </div>
      
      <DropdownMenuSeparator />
      <DropdownMenuItem as-child>
        <a href="/notifications" class="notifications-footer">
          View all
        </a>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Button, Badge, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@taskjuggler/ui'
import { BellIcon } from 'lucide-vue-next'
import api from '@/utils/api'

interface Notification {
  id: string
  title: string
  body?: string
  message?: string
  read_at: string | null
  created_at: string
  data?: {
    link?: string
  }
}

const notifications = ref<Notification[]>([])
const loading = ref(false)
let pollInterval: number | null = null

const unreadCount = computed(() => 
  notifications.value.filter(n => !n.read_at).length
)

async function fetchNotifications() {
  loading.value = true
  try {
    const response = await api.get('/api/notifications?limit=10')
    notifications.value = response.data.data || response.data || []
  } catch (error: any) {
    // Handle 404 gracefully if notification API doesn't exist yet
    if (error.response?.status === 404) {
      console.warn('Notification API endpoint not available yet')
      notifications.value = []
    } else {
      console.error('Failed to fetch notifications:', error)
    }
  } finally {
    loading.value = false
  }
}

async function markAllRead() {
  try {
    await api.post('/api/notifications/mark-all-read')
    await fetchNotifications()
  } catch (error: any) {
    if (error.response?.status !== 404) {
      console.error('Failed to mark all as read:', error)
    }
  }
}

async function handleNotificationClick(notification: Notification) {
  if (!notification.read_at) {
    try {
      await api.post(`/api/notifications/${notification.id}/read`)
      await fetchNotifications()
    } catch (error: any) {
      if (error.response?.status !== 404) {
        console.error('Failed to mark notification as read:', error)
      }
    }
  }
  // Navigate to notification link if exists
  if (notification.data?.link) {
    window.location.href = notification.data.link
  }
}

function formatTime(date: string) {
  // Format relative time (e.g., "2 hours ago")
  const now = new Date()
  const then = new Date(date)
  const diff = now.getTime() - then.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor(diff / (1000 * 60))
  
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days > 1 ? 's' : ''} ago`
}

onMounted(() => {
  fetchNotifications()
  // Poll for new notifications every 30 seconds
  pollInterval = window.setInterval(fetchNotifications, 30000)
})

onUnmounted(() => {
  if (pollInterval !== null) {
    clearInterval(pollInterval)
  }
})
</script>

<style scoped>
.notification-trigger {
  position: relative;
}

.bell-icon {
  width: 20px;
  height: 20px;
}

.badge {
  position: absolute;
  top: -4px;
  right: -4px;
}

.notifications-list {
  min-width: 320px;
  max-height: 400px;
  overflow-y: auto;
}

.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-4);
  border-bottom: 1px solid var(--color-border);
}

.notifications-header h4 {
  margin: 0;
  font-size: var(--font-title-small);
  font-weight: 600;
}

.notification-item {
  padding: var(--space-4);
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
}

.notification-item:hover {
  background: var(--color-bg-secondary);
}

.notification-item.unread {
  background: var(--color-primary-light);
}

.notification-content {
  width: 100%;
}

.notification-content h5 {
  margin: 0 0 var(--space-1) 0;
  font-weight: 600;
  font-size: var(--font-body-medium);
}

.notification-content p {
  margin: 0 0 var(--space-2) 0;
  color: var(--color-text-secondary);
  font-size: var(--font-body-small);
}

.time {
  font-size: var(--font-caption);
  color: var(--color-text-tertiary);
}

.empty {
  padding: var(--space-8);
  text-align: center;
  color: var(--color-text-secondary);
}

.notifications-footer {
  padding: var(--space-3);
  text-align: center;
  text-decoration: none;
  color: var(--color-primary);
  display: block;
  width: 100%;
}
</style>

