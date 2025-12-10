<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Inbox</h1>
      <div class="flex gap-2">
        <select v-model="statusFilter" @change="handleFilterChange" class="input">
          <option value="">All Status</option>
          <option value="unprocessed">Unprocessed</option>
          <option value="processed">Processed</option>
          <option value="dismissed">Dismissed</option>
        </select>
        <select v-model="sourceFilter" @change="handleFilterChange" class="input">
          <option value="">All Sources</option>
          <option value="phone">Phone</option>
          <option value="email">Email</option>
          <option value="sms">SMS</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="text-center py-8">Loading...</div>
    <div v-else-if="inboxItems.length === 0" class="text-center py-8 text-gray-500">
      No inbox items found
    </div>
    <div v-else class="space-y-4">
      <div
        v-for="item in inboxItems"
        :key="item.id"
        class="card cursor-pointer hover:shadow-md transition-shadow"
        @click="selectedItem = item"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <span
                :class="[
                  'px-2 py-1 rounded text-xs font-medium',
                  item.source_type === 'phone' ? 'bg-blue-100 text-blue-800' : '',
                  item.source_type === 'email' ? 'bg-green-100 text-green-800' : '',
                  item.source_type === 'sms' ? 'bg-purple-100 text-purple-800' : '',
                ]"
              >
                {{ item.source_type.toUpperCase() }}
              </span>
              <span
                :class="[
                  'px-2 py-1 rounded text-xs font-medium',
                  item.status === 'unprocessed' ? 'bg-yellow-100 text-yellow-800' : '',
                  item.status === 'processed' ? 'bg-green-100 text-green-800' : '',
                  item.status === 'dismissed' ? 'bg-gray-100 text-gray-800' : '',
                ]"
              >
                {{ item.status }}
              </span>
            </div>
            <h3 class="font-semibold mb-1">{{ item.subject || item.from_identifier }}</h3>
            <p class="text-sm text-gray-600 mb-2">{{ item.from_name || item.from_identifier }}</p>
            <p class="text-sm text-gray-500 line-clamp-2">{{ item.body }}</p>
            <p class="text-xs text-gray-400 mt-2">
              {{ new Date(item.received_at).toLocaleString() }}
            </p>
          </div>
          <div v-if="item.status === 'unprocessed'" class="flex gap-2 ml-4">
            <button
              @click.stop="handleProcess(item.id)"
              class="btn btn-primary btn-sm"
            >
              Process
            </button>
            <button
              @click.stop="handleDismiss(item.id)"
              class="btn btn-secondary btn-sm"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Item Detail Modal -->
    <div
      v-if="selectedItem"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="selectedItem = null"
    >
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <h2 class="text-xl font-bold">Inbox Item Details</h2>
            <button @click="selectedItem = null" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <label class="text-sm font-medium text-gray-700">From</label>
              <p class="text-gray-900">{{ selectedItem.from_name || selectedItem.from_identifier }}</p>
              <p class="text-sm text-gray-500">{{ selectedItem.from_identifier }}</p>
            </div>

            <div v-if="selectedItem.subject">
              <label class="text-sm font-medium text-gray-700">Subject</label>
              <p class="text-gray-900">{{ selectedItem.subject }}</p>
            </div>

            <div>
              <label class="text-sm font-medium text-gray-700">Message</label>
              <div class="mt-1 p-3 bg-gray-50 rounded border whitespace-pre-wrap">{{ selectedItem.body }}</div>
            </div>

            <div>
              <label class="text-sm font-medium text-gray-700">Status</label>
              <p class="text-gray-900 capitalize">{{ selectedItem.status }}</p>
            </div>

            <div>
              <label class="text-sm font-medium text-gray-700">Received</label>
              <p class="text-gray-900">{{ new Date(selectedItem.received_at).toLocaleString() }}</p>
            </div>

            <div v-if="selectedItem.extracted_data">
              <label class="text-sm font-medium text-gray-700">Extracted Data</label>
              <pre class="mt-1 p-3 bg-gray-50 rounded border text-xs overflow-auto">{{ JSON.stringify(selectedItem.extracted_data, null, 2) }}</pre>
            </div>

            <div v-if="selectedItem.status === 'unprocessed'" class="flex gap-2 pt-4 border-t">
              <button
                @click="handleProcess(selectedItem.id)"
                class="btn btn-primary"
              >
                Process Automatically
              </button>
              <button
                @click="showCreateTaskForm = true"
                class="btn btn-secondary"
              >
                Create Task Manually
              </button>
              <button
                @click="handleDismiss(selectedItem.id)"
                class="btn btn-secondary"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Task Form Modal -->
    <div
      v-if="showCreateTaskForm && selectedItem"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="showCreateTaskForm = false"
    >
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <h3 class="text-lg font-bold mb-4">Create Task from Inbox Item</h3>
        <form @submit.prevent="handleCreateTask">
          <div class="space-y-4">
            <div>
              <label class="label">Title *</label>
              <input
                v-model="taskForm.title"
                type="text"
                required
                class="input"
                placeholder="Task title"
              />
            </div>
            <div>
              <label class="label">Description</label>
              <textarea
                v-model="taskForm.description"
                rows="3"
                class="input"
                placeholder="Task description"
              />
            </div>
            <div>
              <label class="label">Priority</label>
              <select v-model="taskForm.priority" class="input">
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div class="flex gap-2">
              <button type="submit" :disabled="loading" class="btn btn-primary flex-1">
                Create Task
              </button>
              <button type="button" @click="showCreateTaskForm = false" class="btn btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useInboxStore } from '@/stores/inbox'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { getEcho } from '@/utils/echo'
import type { InboxItem } from '@/types'

const inboxStore = useInboxStore()
const router = useRouter()

const loading = computed(() => inboxStore.loading)
const inboxItems = computed(() => inboxStore.inboxItems)

const statusFilter = ref('')
const sourceFilter = ref('')
const selectedItem = ref<InboxItem | null>(null)
const showCreateTaskForm = ref(false)
const taskForm = ref({
  title: '',
  description: '',
  priority: 'normal' as 'low' | 'normal' | 'high' | 'urgent',
})

onMounted(() => {
  fetchItems()
  
  // Listen for real-time inbox updates
  const authStore = useAuthStore()
  if (authStore.user) {
    try {
      const echo = getEcho()
      if (echo) {
        echo.private(`user.${authStore.user.id}`)
          .listen('.InboxItemReceived', () => {
            fetchItems()
            if ((window as any).$toast) {
              (window as any).$toast.info('New inbox item received')
            }
          })
      }
    } catch (error) {
      console.error('Echo not initialized:', error)
    }
  }
})

function fetchItems() {
  const params: Record<string, any> = {}
  if (statusFilter.value) params.status = statusFilter.value
  if (sourceFilter.value) params.source_type = sourceFilter.value
  inboxStore.fetchInboxItems(params)
}

function handleFilterChange() {
  fetchItems()
}

async function handleProcess(id: string) {
  try {
    await inboxStore.processItem(id)
    if ((window as any).$toast) {
      (window as any).$toast.success('Inbox item processed successfully')
    }
    selectedItem.value = null
    fetchItems()
  } catch (error) {
    // Error handled by API interceptor
  }
}

async function handleDismiss(id: string) {
  try {
    await inboxStore.dismissItem(id)
    if ((window as any).$toast) {
      (window as any).$toast.success('Inbox item dismissed')
    }
    if (selectedItem.value?.id === id) {
      selectedItem.value = null
    }
    fetchItems()
  } catch (error) {
    // Error handled by API interceptor
  }
}

async function handleCreateTask() {
  if (!selectedItem.value) return
  
  try {
    await inboxStore.createTaskFromItem(selectedItem.value.id, taskForm.value)
    if ((window as any).$toast) {
      (window as any).$toast.success('Task created successfully')
    }
    showCreateTaskForm.value = false
    selectedItem.value = null
    taskForm.value = { title: '', description: '', priority: 'normal' }
    fetchItems()
    router.push('/tasks')
  } catch (error) {
    // Error handled by API interceptor
  }
}
</script>

