<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Webhooks</h1>
        <p class="text-slate-400">Configure webhooks to receive real-time notifications from URPA</p>
      </div>

      <!-- Add Webhook Button -->
      <div class="mb-6">
        <button
          @click="showAddModal = true"
          class="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Plus class="h-5 w-5" />
          Add Webhook
        </button>
      </div>

      <!-- Webhooks List -->
      <div v-if="loading" class="text-center py-12">
        <LoaderCircle class="h-8 w-8 animate-spin text-teal-500 mx-auto mb-4" />
        <p class="text-slate-400">Loading webhooks...</p>
      </div>

      <div v-else-if="webhooks.length === 0" class="text-center py-12">
        <div class="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-8">
          <p class="text-slate-400 mb-4">No webhooks configured</p>
          <button
            @click="showAddModal = true"
            class="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors"
          >
            Create Your First Webhook
          </button>
        </div>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="webhook in webhooks"
          :key="webhook.id"
          class="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6 hover:border-teal-500/50 transition-colors"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h3 class="text-xl font-semibold text-white mb-1">{{ webhook.name }}</h3>
              <p class="text-slate-400 text-sm font-mono break-all">{{ webhook.webhook_url }}</p>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="editWebhook(webhook)"
                class="p-2 text-slate-400 hover:text-teal-400 transition-colors"
                title="Edit"
              >
                <Pencil class="h-5 w-5" />
              </button>
              <button
                @click="deleteWebhook(webhook.id)"
                class="p-2 text-slate-400 hover:text-red-400 transition-colors"
                title="Delete"
              >
                <Trash2 class="h-5 w-5" />
              </button>
            </div>
          </div>

          <!-- Events -->
          <div class="mb-4">
            <p class="text-sm text-slate-400 mb-2">Subscribed Events:</p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="event in webhook.events"
                :key="event"
                class="px-2 py-1 bg-teal-500/20 text-teal-400 rounded text-xs font-medium"
              >
                {{ event }}
              </span>
            </div>
          </div>

          <!-- Status -->
          <div class="flex items-center gap-4 text-sm">
            <div>
              <span class="text-slate-400">Connected:</span>
              <span class="text-white ml-2">{{ formatDate(webhook.connected_at) }}</span>
            </div>
            <button
              @click="viewEvents(webhook.id)"
              class="text-teal-400 hover:text-teal-300 transition-colors"
            >
              View Events
            </button>
          </div>
        </div>
      </div>

      <!-- Add/Edit Webhook Modal -->
      <Modal :model-value="showAddModal" @update:model-value="showAddModal = $event" @close="closeModal">
        <template #header>
          <h2 class="text-2xl font-bold text-white">
            {{ editingWebhook ? 'Edit Webhook' : 'Add Webhook' }}
          </h2>
        </template>

        <form @submit.prevent="saveWebhook" class="space-y-6">
          <!-- Name -->
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">
              Webhook Name
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="My App Webhook"
            />
          </div>

          <!-- Webhook URL -->
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">
              Webhook URL
            </label>
            <input
              v-model="form.webhook_url"
              type="url"
              required
              class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-sm"
              placeholder="https://myapp.com/webhooks/urpa"
            />
          </div>

          <!-- Secret -->
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">
              Webhook Secret
            </label>
            <input
              v-model="form.webhook_secret"
              type="text"
              required
              minlength="16"
              class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-sm"
              placeholder="Enter a secret key (min 16 characters)"
            />
            <p class="text-xs text-slate-400 mt-1">
              Use this secret to verify webhook signatures
            </p>
          </div>

          <!-- Events -->
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">
              Subscribe to Events
            </label>
            <div class="space-y-2">
              <label
                v-for="event in availableEvents"
                :key="event.value"
                class="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors"
              >
                <input
                  v-model="form.events"
                  type="checkbox"
                  :value="event.value"
                  class="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                />
                <div class="flex-1">
                  <p class="text-white font-medium">{{ event.label }}</p>
                  <p class="text-xs text-slate-400">{{ event.description }}</p>
                </div>
              </label>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3 pt-4 border-t border-slate-700">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="saving || form.events.length === 0"
              class="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="saving">Saving...</span>
            <span v-else>{{ editingWebhook ? 'Update' : 'Create' }} Webhook</span>
            </button>
          </div>
        </form>
      </Modal>

      <!-- Webhook Events Modal -->
      <Modal :model-value="showEventsModal" @update:model-value="showEventsModal = $event" @close="showEventsModal = false">
        <template #header>
          <h2 class="text-2xl font-bold text-white">Webhook Events</h2>
        </template>

        <div v-if="eventsLoading" class="text-center py-8">
          <LoaderCircle class="h-6 w-6 animate-spin text-teal-500 mx-auto mb-2" />
          <p class="text-slate-400">Loading events...</p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="event in webhookEvents"
            :key="event.id"
            class="p-4 bg-slate-800/50 rounded-lg border border-slate-700"
          >
            <div class="flex items-start justify-between mb-2">
              <div>
                <span class="px-2 py-1 bg-teal-500/20 text-teal-400 rounded text-xs font-medium">
                  {{ event.event }}
                </span>
                <span
                  :class="[
                    'ml-2 px-2 py-1 rounded text-xs font-medium',
                    event.delivered_at
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  ]"
                >
                  {{ event.delivered_at ? 'Delivered' : 'Failed' }}
                </span>
              </div>
              <span class="text-xs text-slate-400">{{ formatDate(event.created_at) }}</span>
            </div>
            <div class="text-sm text-slate-300 mt-2">
              <p>Attempts: {{ event.attempts }}</p>
              <p v-if="event.error_message" class="text-red-400 mt-1">
                Error: {{ event.error_message }}
              </p>
            </div>
            <button
              v-if="!event.delivered_at && event.attempts < 5"
              @click="retryEvent(event.id)"
              class="mt-2 text-xs text-teal-400 hover:text-teal-300"
            >
              Retry
            </button>
          </div>

          <div v-if="webhookEvents.length === 0" class="text-center py-8 text-slate-400">
            No events yet
          </div>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Plus, Pencil, Trash2, LoaderCircle } from 'lucide-vue-next';
import Modal from '@/components/ui/Modal.vue';
import api from '@/utils/api';

interface Webhook {
  id: string;
  name: string;
  webhook_url: string;
  events: string[];
  connected_at: string;
}

interface WebhookEvent {
  id: string;
  event: string;
  attempts: number;
  delivered_at: string | null;
  error_message: string | null;
  created_at: string;
}

const webhooks = ref<Webhook[]>([]);
const webhookEvents = ref<WebhookEvent[]>([]);
const loading = ref(false);
const eventsLoading = ref(false);
const saving = ref(false);
const showAddModal = ref(false);
const showEventsModal = ref(false);
const editingWebhook = ref<Webhook | null>(null);
const selectedWebhookId = ref<string | null>(null);

const form = ref({
  name: '',
  webhook_url: '',
  webhook_secret: '',
  events: [] as string[],
});

const availableEvents = [
  {
    value: 'activity.created',
    label: 'Activity Created',
    description: 'Triggered when a new activity is created',
  },
  {
    value: 'activity.updated',
    label: 'Activity Updated',
    description: 'Triggered when an activity is updated',
  },
  {
    value: 'activity.completed',
    label: 'Activity Completed',
    description: 'Triggered when an activity is marked as completed',
  },
  {
    value: 'contact.created',
    label: 'Contact Created',
    description: 'Triggered when a new contact is created',
  },
  {
    value: 'contact.updated',
    label: 'Contact Updated',
    description: 'Triggered when a contact is updated',
  },
  {
    value: 'ai_task.created',
    label: 'AI Task Created',
    description: 'Triggered when a new AI task is created',
  },
  {
    value: 'ai_task.completed',
    label: 'AI Task Completed',
    description: 'Triggered when an AI task is completed',
  },
  {
    value: 'taskjuggler.synced',
    label: 'TaskJuggler Synced',
    description: 'Triggered when tasks are synced to TaskJuggler',
  },
];

async function fetchWebhooks() {
  loading.value = true;
  try {
    const response = await api.get('/urpa/integrations/webhooks');
    webhooks.value = response.data.data || [];
  } catch (error: any) {
    console.error('Failed to fetch webhooks:', error);
  } finally {
    loading.value = false;
  }
}

async function saveWebhook() {
  if (form.value.events.length === 0) {
    return;
  }

  saving.value = true;
  try {
    if (editingWebhook.value) {
      await api.put(`/urpa/integrations/webhooks/${editingWebhook.value.id}`, form.value);
    } else {
      await api.post('/urpa/integrations/webhooks', form.value);
    }
    await fetchWebhooks();
    closeModal();
  } catch (error: any) {
    console.error('Failed to save webhook:', error);
    alert(error.response?.data?.error || 'Failed to save webhook');
  } finally {
    saving.value = false;
  }
}

async function deleteWebhook(id: string) {
  if (!confirm('Are you sure you want to delete this webhook?')) {
    return;
  }

  try {
    await api.delete(`/urpa/integrations/webhooks/${id}`);
    await fetchWebhooks();
  } catch (error: any) {
    console.error('Failed to delete webhook:', error);
    alert(error.response?.data?.error || 'Failed to delete webhook');
  }
}

function editWebhook(webhook: Webhook) {
  editingWebhook.value = webhook;
  form.value = {
    name: webhook.name,
    webhook_url: webhook.webhook_url,
    webhook_secret: '', // Don't show secret
    events: [...webhook.events],
  };
  showAddModal.value = true;
}

function closeModal() {
  showAddModal.value = false;
  editingWebhook.value = null;
  form.value = {
    name: '',
    webhook_url: '',
    webhook_secret: '',
    events: [],
  };
}

async function viewEvents(webhookId: string) {
  selectedWebhookId.value = webhookId;
  showEventsModal.value = true;
  eventsLoading.value = true;
  try {
    const response = await api.get('/urpa/webhooks/events', {
      params: { integration_id: webhookId },
    });
    webhookEvents.value = response.data.data || [];
  } catch (error: any) {
    console.error('Failed to fetch events:', error);
  } finally {
    eventsLoading.value = false;
  }
}

async function retryEvent(eventId: string) {
  try {
    await api.post(`/urpa/webhooks/events/${eventId}/retry`);
    await viewEvents(selectedWebhookId.value!);
  } catch (error: any) {
    console.error('Failed to retry event:', error);
    alert(error.response?.data?.error || 'Failed to retry event');
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleString();
}

onMounted(() => {
  fetchWebhooks();
});
</script>

