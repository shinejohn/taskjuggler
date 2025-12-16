<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Channels</h1>
      <div class="flex gap-2">
        <button @click="showPhoneModal = true" class="btn btn-primary">
          Add Phone Number
        </button>
        <button @click="showEmailModal = true" class="btn btn-secondary">
          Add Email Address
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-8">Loading...</div>
    <div v-else-if="channels.length === 0" class="text-center py-8 text-gray-500">
      No channels configured yet. Add a phone number or email address to start receiving messages.
    </div>
    <div v-else class="space-y-4">
      <div
        v-for="channel in channels"
        :key="channel.id"
        class="card"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <h3 class="font-semibold">
                {{ channel.channel_type === 'phone' ? '📞 Phone' : '📧 Email' }}
              </h3>
              <span
                :class="[
                  'px-2 py-1 rounded text-xs font-medium',
                  channel.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800',
                ]"
              >
                {{ channel.is_active ? 'Active' : 'Inactive' }}
              </span>
            </div>
            <div class="text-sm text-gray-600 space-y-1">
              <p v-if="channel.phone_number">
                <strong>Phone:</strong> {{ channel.phone_number }}
              </p>
              <p v-if="channel.email_address">
                <strong>Email:</strong> {{ channel.email_address }}
              </p>
              <p v-if="channel.greeting_message">
                <strong>Greeting:</strong> {{ channel.greeting_message }}
              </p>
            </div>
          </div>
          <div class="flex gap-2 ml-4">
            <button
              @click="editChannel(channel)"
              class="btn btn-secondary btn-sm"
            >
              Edit
            </button>
            <button
              @click="deleteChannel(channel.id)"
              class="btn btn-danger btn-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Phone Modal -->
    <div
      v-if="showPhoneModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="showPhoneModal = false"
    >
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <div class="flex justify-between items-start mb-4">
          <h2 class="text-xl font-bold">Add Phone Number</h2>
          <button @click="showPhoneModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleProvisionPhone" class="space-y-4">
          <div>
            <label class="label">Phone Number</label>
            <input
              v-model="phoneForm.phone_number"
              type="tel"
              class="input"
              placeholder="+1234567890 (optional - will be provisioned)"
            />
            <p class="text-xs text-gray-500 mt-1">Leave empty to provision a new number</p>
          </div>

          <div>
            <label class="label">Greeting Message</label>
            <textarea
              v-model="phoneForm.greeting_message"
              rows="2"
              class="input"
              placeholder="Message to play when call is answered"
            />
          </div>

          <div>
            <label class="label">Voicemail Greeting</label>
            <textarea
              v-model="phoneForm.voicemail_greeting"
              rows="2"
              class="input"
              placeholder="Message to play for voicemail"
            />
          </div>

          <div class="flex gap-2 pt-4 border-t">
            <button type="submit" :disabled="loading" class="btn btn-primary flex-1">
              {{ loading ? 'Provisioning...' : 'Provision Phone' }}
            </button>
            <button type="button" @click="showPhoneModal = false" class="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Email Modal -->
    <div
      v-if="showEmailModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="showEmailModal = false"
    >
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <div class="flex justify-between items-start mb-4">
          <h2 class="text-xl font-bold">Add Email Address</h2>
          <button @click="showEmailModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleCreateEmail" class="space-y-4">
          <div>
            <label class="label">Email Address *</label>
            <input
              v-model="emailForm.email_address"
              type="email"
              required
              class="input"
              placeholder="inbox@yourdomain.com"
            />
          </div>

          <div>
            <label class="label">Greeting Message</label>
            <textarea
              v-model="emailForm.greeting_message"
              rows="2"
              class="input"
              placeholder="Auto-reply message (optional)"
            />
          </div>

          <div class="flex gap-2 pt-4 border-t">
            <button type="submit" :disabled="loading" class="btn btn-primary flex-1">
              {{ loading ? 'Creating...' : 'Create Email Channel' }}
            </button>
            <button type="button" @click="showEmailModal = false" class="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Modal -->
    <div
      v-if="editingChannel"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="editingChannel = null"
    >
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <div class="flex justify-between items-start mb-4">
          <h2 class="text-xl font-bold">Edit Channel</h2>
          <button @click="editingChannel = null" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleUpdateChannel" class="space-y-4">
          <div v-if="editingChannel.channel_type === 'phone'">
            <label class="label">Greeting Message</label>
            <textarea
              v-model="channelForm.greeting_message"
              rows="2"
              class="input"
            />
          </div>

          <div v-if="editingChannel.channel_type === 'phone'">
            <label class="label">Voicemail Greeting</label>
            <textarea
              v-model="channelForm.voicemail_greeting"
              rows="2"
              class="input"
            />
          </div>

          <div v-if="editingChannel.channel_type === 'email'">
            <label class="label">Greeting Message</label>
            <textarea
              v-model="channelForm.greeting_message"
              rows="2"
              class="input"
            />
          </div>

          <div class="flex items-center">
            <input
              id="is_active"
              v-model="channelForm.is_active"
              type="checkbox"
              class="mr-2"
            />
            <label for="is_active" class="text-sm text-gray-700">Channel is active</label>
          </div>

          <div class="flex gap-2 pt-4 border-t">
            <button type="submit" :disabled="loading" class="btn btn-primary flex-1">
              {{ loading ? 'Updating...' : 'Update Channel' }}
            </button>
            <button type="button" @click="editingChannel = null" class="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useChannelsStore } from '@/stores/channels'
import type { Channel } from '@/types'

const channelsStore = useChannelsStore()

const loading = computed(() => channelsStore.loading)
const channels = computed(() => channelsStore.channels)

const showPhoneModal = ref(false)
const showEmailModal = ref(false)
const editingChannel = ref<Channel | null>(null)

const phoneForm = ref({
  phone_number: '',
  greeting_message: '',
  voicemail_greeting: '',
})

const emailForm = ref({
  email_address: '',
  greeting_message: '',
})

const channelForm = ref({
  greeting_message: '',
  voicemail_greeting: '',
  is_active: true,
})

onMounted(() => {
  channelsStore.fetchChannels()
})

function editChannel(channel: Channel) {
  editingChannel.value = channel
  channelForm.value = {
    greeting_message: channel.greeting_message || '',
    voicemail_greeting: channel.voicemail_greeting || '',
    is_active: channel.is_active,
  }
}

async function handleProvisionPhone() {
  try {
    await channelsStore.provisionPhone(phoneForm.value)
    if ((window as any).$toast) {
      (window as any).$toast.success('Phone number provisioned successfully')
    }
    showPhoneModal.value = false
    phoneForm.value = { phone_number: '', greeting_message: '', voicemail_greeting: '' }
  } catch (error) {
    // Error handled by API interceptor
  }
}

async function handleCreateEmail() {
  try {
    await channelsStore.createEmail(emailForm.value)
    if ((window as any).$toast) {
      (window as any).$toast.success('Email channel created successfully')
    }
    showEmailModal.value = false
    emailForm.value = { email_address: '', greeting_message: '' }
  } catch (error) {
    // Error handled by API interceptor
  }
}

async function handleUpdateChannel() {
  if (!editingChannel.value) return
  
  try {
    await channelsStore.updateChannel(editingChannel.value.id, channelForm.value)
    if ((window as any).$toast) {
      (window as any).$toast.success('Channel updated successfully')
    }
    editingChannel.value = null
  } catch (error) {
    // Error handled by API interceptor
  }
}

async function deleteChannel(id: string) {
  if (!confirm('Are you sure you want to delete this channel?')) return
  
  try {
    await channelsStore.deleteChannel(id)
    if ((window as any).$toast) {
      (window as any).$toast.success('Channel deleted successfully')
    }
  } catch (error) {
    // Error handled by API interceptor
  }
}
</script>
