<template>
  <div class="p-6">
    <div v-if="loading && !otherUser" class="text-center py-8">Loading...</div>
    <div v-else-if="otherUser" class="flex flex-col h-[calc(100vh-8rem)]">
      <!-- Header -->
      <div class="card mb-4">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
            {{ otherUser.name.charAt(0).toUpperCase() }}
          </div>
          <div>
            <h1 class="text-xl font-bold">{{ otherUser.name }}</h1>
            <p class="text-sm text-gray-500">{{ otherUser.email }}</p>
          </div>
        </div>
      </div>

      <!-- Messages -->
      <div class="card flex-1 flex flex-col">
        <div class="flex-1 overflow-y-auto p-4 space-y-3 mb-4">
          <div
            v-for="message in messages"
            :key="message.id"
            :class="[
              'p-3 rounded-lg max-w-md',
              message.sender_id === currentUserId
                ? 'bg-blue-600 text-white ml-auto'
                : 'bg-gray-100 text-gray-900'
            ]"
          >
            <p class="text-sm">{{ message.content }}</p>
            <p :class="['text-xs mt-1', message.sender_id === currentUserId ? 'text-blue-100' : 'text-gray-500']">
              {{ formatTime(message.created_at) }}
            </p>
          </div>
          <div v-if="messages.length === 0" class="text-center text-gray-500 py-8">
            No messages yet. Start the conversation!
          </div>
        </div>

        <!-- Input -->
        <form @submit.prevent="sendMessage" class="flex gap-2 border-t pt-4">
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useMessagesStore } from '@/stores/messages';
import { useAuthStore } from '@/stores/auth';
import api from '@/utils/api';

const route = useRoute();
const messagesStore = useMessagesStore();
const authStore = useAuthStore();

const otherUser = ref<any>(null);
const messages = computed(() => messagesStore.directMessages[route.params.userId as string] || []);
const currentUserId = computed(() => authStore.user?.id);
const messageInput = ref('');
const loading = computed(() => messagesStore.loading);

onMounted(async () => {
  const userId = route.params.userId as string;
  await loadUser(userId);
  await messagesStore.fetchDirectMessages(userId);
});

async function loadUser(userId: string) {
  try {
    const response = await api.get(`/users/${userId}`);
    otherUser.value = response.data;
  } catch (error) {
    // Error handled
  }
}

async function sendMessage() {
  if (!messageInput.value.trim()) return;
  
  try {
    await messagesStore.sendDirectMessage(route.params.userId as string, messageInput.value);
    messageInput.value = '';
  } catch (error) {
    // Error handled by API interceptor
  }
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
  return date.toLocaleDateString();
}
</script>

<script lang="ts">
export default {
  name: 'DirectMessagePage'
}
</script>
