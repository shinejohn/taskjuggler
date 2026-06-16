<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Direct Messages</h1>

    <div
      v-if="matrixEnabled"
      class="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900"
    >
      Matrix messaging active — conversations sync in real time.
    </div>

    <div v-if="loading && conversations.length === 0" class="text-center py-8">Loading...</div>
    <div v-else-if="conversations.length === 0" class="text-center py-8 text-gray-500">
      No conversations yet. Start messaging someone!
    </div>
    <div v-else class="space-y-3">
      <div
        v-for="conv in conversations"
        :key="conv.user.id"
        class="card cursor-pointer hover:shadow-lg transition-shadow"
        @click="$router.push(`/messages/${conv.user.id}`)"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3 flex-1">
            <div class="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
              {{ conv.user.name.charAt(0).toUpperCase() }}
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <h3 class="font-semibold">{{ conv.user.name }}</h3>
                <span
                  v-if="conv.unread_count > 0"
                  class="px-2 py-1 bg-blue-600 text-white rounded-full text-xs font-medium"
                >
                  {{ conv.unread_count }}
                </span>
              </div>
              <p class="text-sm text-gray-600 truncate">
                {{ conv.last_message.content }}
              </p>
              <p class="text-xs text-gray-400 mt-1">
                {{ formatTime(conv.last_message.sent_at) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useMessagesStore } from '@/stores/messages';
import { useMatrix } from '@/composables/useMatrix';

interface ConversationItem {
  user: { id: string; name: string; email?: string };
  last_message: { content: string; sent_at: string };
  unread_count: number;
}

const messagesStore = useMessagesStore();
const { loadSession, isEnabled, isProvisioned, loadConversations } = useMatrix();
const matrixEnabled = ref(false);
const loading = ref(true);
const conversations = ref<ConversationItem[]>([]);

onMounted(async () => {
  const session = await loadSession();
  matrixEnabled.value = isEnabled.value && session.provisioned === true;

  if (isProvisioned.value) {
    conversations.value = await loadConversations();
  } else {
    await messagesStore.fetchConversations();
    conversations.value = messagesStore.conversations.map((c) => ({
      user: { ...c.user, email: '' },
      last_message: {
        content: c.last_message.content,
        sent_at: c.last_message.sent_at,
      },
      unread_count: c.unread_count,
    }));
    await messagesStore.fetchDirectUnreadCount();
  }

  loading.value = false;
});

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const diffMins = Math.floor((Date.now() - date.getTime()) / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
  return date.toLocaleDateString();
}
</script>

<script lang="ts">
export default {
  name: 'MessagesPage',
};
</script>
