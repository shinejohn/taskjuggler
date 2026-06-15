<template>
  <div class="p-6 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold text-slate-900 mb-2">Messages</h1>
    <p class="text-sm text-slate-500 mb-6">
      Direct messages synced via Matrix when the homeserver is connected.
    </p>

    <div
      v-if="matrixEnabled"
      class="mb-4 rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-900"
    >
      Matrix messaging active — conversations sync in real time.
    </div>

    <div v-if="loading" class="text-center py-12 text-slate-500">Loading conversations...</div>
    <div v-else-if="conversations.length === 0" class="text-center py-12 text-slate-500">
      No conversations yet.
    </div>
    <ul v-else class="space-y-2">
      <li v-for="conv in conversations" :key="conv.user.id">
        <router-link
          :to="`/messages/${conv.user.id}`"
          class="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-white hover:border-cyan-300 hover:shadow-sm transition-all"
        >
          <div
            class="w-11 h-11 rounded-full bg-cyan-600 flex items-center justify-center text-white font-semibold shrink-0"
          >
            {{ conv.user.name.charAt(0).toUpperCase() }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-2">
              <span class="font-medium text-slate-900 truncate">{{ conv.user.name }}</span>
              <span v-if="conv.unread_count > 0" class="text-xs bg-cyan-600 text-white px-2 py-0.5 rounded-full">
                {{ conv.unread_count }}
              </span>
            </div>
            <p class="text-sm text-slate-500 truncate">{{ conv.last_message.content }}</p>
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import api from '@/utils/api';
import { useMatrix } from '@/composables/useMatrix';

interface ConversationUser {
  id: string;
  name: string;
  email: string;
}

interface Conversation {
  user: ConversationUser;
  last_message: { content: string; sent_at: string };
  unread_count: number;
}

const { loadSession, isEnabled } = useMatrix();
const matrixEnabled = ref(false);
const loading = ref(true);
const conversations = ref<Conversation[]>([]);

onMounted(async () => {
  const session = await loadSession();
  matrixEnabled.value = isEnabled.value && session.provisioned === true;

  try {
    const response = await api.get('/messages/conversations');
    const data = response.data?.data ?? response.data;
    conversations.value = Array.isArray(data) ? data : data?.conversations ?? [];
  } catch {
    conversations.value = [];
  } finally {
    loading.value = false;
  }
});
</script>
