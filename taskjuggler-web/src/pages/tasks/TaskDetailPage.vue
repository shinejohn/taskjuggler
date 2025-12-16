<template>
  <div class="p-6">
    <div v-if="loading">Loading...</div>
    <div v-else-if="task" class="space-y-6">
      <!-- Task Header -->
      <div class="card">
        <h1 class="text-2xl font-bold mb-4">{{ task.title }}</h1>
        <p class="text-gray-600 mb-4">{{ task.description }}</p>
        <div class="space-y-2">
          <p><strong>Status:</strong> {{ task.status }}</p>
          <p><strong>Priority:</strong> {{ task.priority }}</p>
          <div v-if="task.due_date" class="mt-4 p-4 bg-gray-50 rounded-lg">
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
              <button @click="exportTef" class="btn btn-secondary text-sm">
                📋 Export TEF
              </button>
            </div>
          </div>
          <div class="flex gap-2 mt-4">
            <button @click="completeTask" class="btn btn-primary">Mark Complete</button>
            <button @click="showInviteModal = true" class="btn btn-secondary">Invite</button>
          </div>
        </div>
      </div>

      <!-- Task Messages -->
      <div class="card">
        <h2 class="text-lg font-semibold mb-4">Messages</h2>
        <div class="border rounded-lg p-4 max-h-96 overflow-y-auto mb-4 space-y-3">
          <div
            v-for="message in messages"
            :key="message.id"
            :class="[
              'p-3 rounded-lg',
              message.sender_type === 'system' ? 'bg-gray-100 text-gray-600 italic' : 'bg-blue-50'
            ]"
          >
            <div v-if="message.sender" class="flex items-center gap-2 mb-1">
              <span class="font-medium">{{ message.sender.name }}</span>
              <span class="text-xs text-gray-500">{{ formatTime(message.created_at) }}</span>
            </div>
            <p class="text-sm">{{ message.content }}</p>
          </div>
          <div v-if="messages.length === 0" class="text-center text-gray-500 py-4">
            No messages yet. Start the conversation!
          </div>
        </div>
        <form @submit.prevent="sendMessage" class="flex gap-2">
          <input
            v-model="messageInput"
            type="text"
            placeholder="Type a message..."
            class="input flex-1"
            required
          />
          <button type="submit" class="btn btn-primary">Send</button>
        </form>
      </div>

      <!-- Invite Modal -->
      <div
        v-if="showInviteModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click.self="closeInviteModal"
      >
        <div class="bg-white rounded-lg max-w-md w-full p-6">
          <div class="flex justify-between items-start mb-4">
            <h2 class="text-xl font-bold">Invite to Task</h2>
            <button @click="closeInviteModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="handleInvite" class="space-y-4">
            <div>
              <label class="label">Email or Phone *</label>
              <input
                v-model="inviteForm.email"
                type="text"
                class="input"
                placeholder="email@example.com or +1234567890"
                required
              />
            </div>

            <div>
              <label class="label">Name (optional)</label>
              <input
                v-model="inviteForm.name"
                type="text"
                class="input"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label class="label">Role</label>
              <select v-model="inviteForm.role" class="input">
                <option value="owner">Owner</option>
                <option value="watcher">Watcher</option>
                <option value="collaborator">Collaborator</option>
              </select>
            </div>

            <div v-if="inviteUrl" class="p-3 bg-blue-50 rounded-lg">
              <p class="text-sm font-medium mb-2">Invitation Link:</p>
              <div class="flex gap-2">
                <input
                  :value="inviteUrl"
                  readonly
                  class="input flex-1 text-sm"
                />
                <button
                  type="button"
                  @click="copyInviteUrl"
                  class="btn btn-secondary text-sm"
                >
                  Copy
                </button>
              </div>
            </div>

            <div class="flex gap-2 pt-4 border-t">
              <button type="submit" :disabled="loading" class="btn btn-primary flex-1">
                {{ loading ? 'Sending...' : 'Send Invitation' }}
              </button>
              <button type="button" @click="closeInviteModal" class="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTasksStore } from '@/stores/tasks'
import { useMessagesStore } from '@/stores/messages'
import api from '@/utils/api'

const route = useRoute()
const router = useRouter()
const tasksStore = useTasksStore()
const messagesStore = useMessagesStore()

const task = computed(() => tasksStore.currentTask)
const loading = computed(() => tasksStore.loading)
const messages = computed(() => messagesStore.taskMessages[route.params.id as string] || [])
const messageInput = ref('')
const showInviteModal = ref(false)
const inviteForm = ref({
  email: '',
  name: '',
  role: 'owner',
})
const inviteUrl = ref('')

onMounted(async () => {
  const taskId = route.params.id as string
  await tasksStore.fetchTask(taskId)
  await messagesStore.fetchTaskMessages(taskId)
  await messagesStore.markTaskMessagesRead(taskId)
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

async function exportTef() {
  if (!task.value) return
  
  try {
    const response = await api.get(`/tasks/${task.value.id}/export/tef`, {
      responseType: 'blob',
    })
    
    const blob = new Blob([response.data], { type: 'application/vnd.taskjuggler.tef+json' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `task-${task.value.id}.tef`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    if ((window as any).$toast) {
      (window as any).$toast.success('TEF file downloaded')
    }
  } catch (error) {
    // Error handled by API interceptor
  }
}

async function sendMessage() {
  if (!task.value || !messageInput.value.trim()) return
  
  try {
    await messagesStore.sendTaskMessage(task.value.id, messageInput.value)
    messageInput.value = ''
  } catch (error) {
    // Error handled by API interceptor
  }
}

function formatTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
  return date.toLocaleDateString()
}

function closeInviteModal() {
  showInviteModal.value = false
  inviteForm.value = { email: '', name: '', role: 'owner' }
  inviteUrl.value = ''
}

async function handleInvite() {
  if (!task.value) return
  
  try {
    const response = await api.post(`/tasks/${task.value.id}/invite`, {
      email: inviteForm.value.email.includes('@') ? inviteForm.value.email : undefined,
      phone: !inviteForm.value.email.includes('@') ? inviteForm.value.email : undefined,
      name: inviteForm.value.name || undefined,
      role: inviteForm.value.role,
    })
    inviteUrl.value = response.data.invite_url
    if ((window as any).$toast) {
      (window as any).$toast.success('Invitation created successfully')
    }
  } catch (error) {
    // Error handled by API interceptor
  }
}

function copyInviteUrl() {
  navigator.clipboard.writeText(inviteUrl.value)
  if ((window as any).$toast) {
    (window as any).$toast.success('Invitation link copied to clipboard')
  }
}
</script>
