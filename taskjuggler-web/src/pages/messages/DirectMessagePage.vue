<template>
  <div class="flex flex-col h-[calc(100vh-8rem)]">
    <div v-if="matrixLoading" class="text-center py-8">Connecting to Matrix...</div>

    <template v-else-if="otherUser">
      <div class="card mb-4">
        <div class="flex items-center gap-3">
          <div
            class="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold"
          >
            {{ otherUser.name.charAt(0).toUpperCase() }}
          </div>
          <div>
            <h1 class="text-xl font-bold">{{ otherUser.name }}</h1>
            <p class="text-sm text-gray-500">
              {{ useMatrixChat ? 'Matrix · end-to-end sync' : otherUser.email }}
            </p>
          </div>
        </div>
      </div>

      <div class="card flex-1 flex flex-col">
        <div ref="scrollRef" class="flex-1 overflow-y-auto p-4 space-y-3 mb-4">
          <div
            v-for="message in displayMessages"
            :key="message.id"
            :class="[
              'p-3 rounded-lg max-w-md',
              message.is_mine ?? message.sender_id === currentUserId
                ? 'bg-blue-600 text-white ml-auto'
                : 'bg-gray-100 text-gray-900',
            ]"
          >
            <p class="text-sm">{{ message.content }}</p>
            <p
              :class="[
                'text-xs mt-1',
                (message.is_mine ?? message.sender_id === currentUserId)
                  ? 'text-blue-100'
                  : 'text-gray-500',
              ]"
            >
              {{ formatTime(message.created_at) }}
            </p>
          </div>
          <div v-if="displayMessages.length === 0" class="text-center text-gray-500 py-8">
            No messages yet. Start the conversation!
          </div>
        </div>

        <form class="flex gap-2 border-t pt-4" @submit.prevent="sendMessage">
          <input
            v-model="messageInput"
            type="text"
            placeholder="Type a message..."
            class="input flex-1"
            required
            aria-label="Message"
          />
          <button type="submit" class="btn btn-primary">Send</button>
        </form>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, computed, ref, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useMessagesStore } from '@/stores/messages';
import { useAuthStore } from '@/stores/auth';
import { useMatrix, type MatrixChatMessage } from '@/composables/useMatrix';
import api from '@/utils/api';

interface DisplayMessage {
  id: string;
  sender_id?: string;
  content: string;
  created_at: string;
  is_mine?: boolean;
}

const route = useRoute();
const messagesStore = useMessagesStore();
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
const matrixRoomId = ref<string | null>(null);
const useMatrixChat = ref(false);
const matrixLoading = ref(true);
const messageInput = ref('');
const scrollRef = ref<HTMLElement | null>(null);
let unsubscribe: (() => void) | null = null;

const currentUserId = computed(() => authStore.user?.id);
const legacyMessages = computed(
  () => messagesStore.directMessages[route.params.userId as string] || []
);

const displayMessages = computed<DisplayMessage[]>(() => {
  if (useMatrixChat.value) {
    return matrixMessages.value;
  }
  return legacyMessages.value.map((m) => ({
    id: m.id,
    sender_id: m.sender_id,
    content: m.content,
    created_at: m.created_at,
    is_mine: m.sender_id === currentUserId.value,
  }));
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
    await messagesStore.fetchDirectMessages(userId);
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
      await messagesStore.sendDirectMessage(route.params.userId as string, text);
    }
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

<script lang="ts">
export default {
  name: 'DirectMessagePage',
};
</script>
