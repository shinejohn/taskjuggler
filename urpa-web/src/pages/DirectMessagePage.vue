<template>
  <div class="flex flex-col h-[calc(100vh-5rem)] max-w-3xl mx-auto p-4">
    <div v-if="matrixLoading" class="text-center py-8 text-slate-500">Connecting...</div>

    <template v-else-if="otherUser">
      <header class="flex items-center gap-3 mb-4 pb-4 border-b border-slate-200">
        <router-link to="/messages" class="text-sm text-cyan-600 hover:underline" aria-label="Back to messages">
          ← Back
        </router-link>
        <div
          class="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center text-white font-semibold"
        >
          {{ otherUser.name.charAt(0).toUpperCase() }}
        </div>
        <div>
          <h1 class="text-lg font-semibold text-slate-900">{{ otherUser.name }}</h1>
          <p class="text-xs text-slate-500">
            {{ useMatrixChat ? 'Matrix · real-time' : otherUser.email }}
          </p>
        </div>
      </header>

      <div ref="scrollRef" class="flex-1 overflow-y-auto space-y-3 mb-4">
        <div
          v-for="message in displayMessages"
          :key="message.id"
          :class="[
            'max-w-[80%] px-4 py-2 rounded-2xl text-sm',
            message.is_mine
              ? 'ml-auto bg-cyan-600 text-white'
              : 'bg-slate-100 text-slate-900',
          ]"
        >
          <p>{{ message.content }}</p>
          <p :class="['text-xs mt-1', message.is_mine ? 'text-cyan-100' : 'text-slate-400']">
            {{ formatTime(message.created_at) }}
          </p>
        </div>
        <p v-if="displayMessages.length === 0" class="text-center text-slate-400 py-8">
          No messages yet.
        </p>
      </div>

      <form class="flex gap-2 border-t border-slate-200 pt-4" @submit.prevent="sendMessage">
        <input
          v-model="messageInput"
          type="text"
          placeholder="Type a message..."
          class="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          required
          aria-label="Message"
        />
        <button
          type="submit"
          class="px-4 py-2 rounded-lg bg-cyan-600 text-white text-sm font-medium hover:bg-cyan-700"
        >
          Send
        </button>
      </form>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, computed, ref, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useMatrix, type MatrixChatMessage } from '@/composables/useMatrix';
import api from '@/utils/api';

interface DisplayMessage {
  id: string;
  content: string;
  created_at: string;
  is_mine: boolean;
}

const route = useRoute();
const authStore = useAuthStore();
const {
  loadSession,
  isProvisioned,
  getDirectRoom,
  loadRoomMessages,
  subscribeToRoom,
  sendRoomMessage,
} = useMatrix();

const otherUser = ref<{ id: string; name: string; email: string } | null>(null);
const matrixMessages = ref<MatrixChatMessage[]>([]);
const legacyMessages = ref<DisplayMessage[]>([]);
const matrixRoomId = ref<string | null>(null);
const useMatrixChat = ref(false);
const matrixLoading = ref(true);
const messageInput = ref('');
const scrollRef = ref<HTMLElement | null>(null);
let unsubscribe: (() => void) | null = null;

const currentUserId = computed(() => authStore.user?.id);

const displayMessages = computed<DisplayMessage[]>(() => {
  if (useMatrixChat.value) {
    return matrixMessages.value;
  }
  return legacyMessages.value;
});

onMounted(async () => {
  const userId = route.params.userId as string;
  await loadUser(userId);

  await loadSession();
  if (isProvisioned.value) {
    const dm = await getDirectRoom(userId);
    if (dm?.room_id) {
      useMatrixChat.value = true;
      matrixRoomId.value = dm.room_id;
      matrixMessages.value = await loadRoomMessages(dm.room_id);
      unsubscribe = subscribeToRoom(dm.room_id, (msg) => {
        matrixMessages.value = [...matrixMessages.value, msg];
        scrollToBottom();
      });
    }
  }

  if (!useMatrixChat.value) {
    await loadLegacyMessages(userId);
  }

  matrixLoading.value = false;
  scrollToBottom();
});

onUnmounted(() => {
  unsubscribe?.();
});

async function loadUser(userId: string) {
  try {
    const response = await api.get(`/users/${userId}`);
    otherUser.value = response.data?.data ?? response.data;
  } catch {
    otherUser.value = null;
  }
}

async function loadLegacyMessages(userId: string) {
  try {
    const response = await api.get(`/messages/with/${userId}`);
    const data = response.data?.data ?? response.data;
    const messages = Array.isArray(data) ? data : data?.messages ?? [];
    legacyMessages.value = messages.map((m: { id: string; sender_id: string; content: string; created_at: string }) => ({
      id: m.id,
      content: m.content,
      created_at: m.created_at,
      is_mine: m.sender_id === currentUserId.value,
    }));
  } catch {
    legacyMessages.value = [];
  }
}

async function sendMessage() {
  if (!messageInput.value.trim()) {
    return;
  }

  const text = messageInput.value.trim();
  messageInput.value = '';

  try {
    if (useMatrixChat.value && matrixRoomId.value) {
      await sendRoomMessage(matrixRoomId.value, text);
    } else {
      await api.post(`/messages/to/${route.params.userId}`, { content: text });
      legacyMessages.value = [
        ...legacyMessages.value,
        {
          id: `${Date.now()}`,
          content: text,
          created_at: new Date().toISOString(),
          is_mine: true,
        },
      ];
    }
    scrollToBottom();
  } catch {
    messageInput.value = text;
  }
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const diffMins = Math.floor((Date.now() - date.getTime()) / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
  return date.toLocaleDateString();
}

function scrollToBottom() {
  nextTick(() => {
    if (scrollRef.value) {
      scrollRef.value.scrollTop = scrollRef.value.scrollHeight;
    }
  });
}
</script>
