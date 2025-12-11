<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Direct Messages</h1>

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
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useMessagesStore } from '@/stores/messages';

const router = useRouter();
const messagesStore = useMessagesStore();

const conversations = computed(() => messagesStore.conversations);
const loading = computed(() => messagesStore.loading);

onMounted(async () => {
  await messagesStore.fetchConversations();
  await messagesStore.fetchDirectUnreadCount();
});

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
  name: 'MessagesPage'
}
</script>
