<template>
  <div class="h-[calc(100vh-12rem)] flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
    <!-- Chat Header -->
    <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
          <Building2 class="w-5 h-5" />
        </div>
        <div>
          <h3 class="font-bold text-slate-900">Clinic Message Board</h3>
          <p class="text-xs text-slate-500">Secure HIPPA-compliant channel</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
         <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
         <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active</span>
      </div>
    </div>

    <!-- Message List -->
    <div class="flex-1 overflow-y-auto p-6 space-y-6" ref="messageContainer">
      <div v-if="messages.length === 0" class="h-full flex flex-col items-center justify-center text-center opacity-50">
        <MessageSquare class="w-12 h-12 mb-4" />
        <p class="text-sm font-medium">No messages yet.</p>
        <p class="text-xs mt-1">Send a message to your care team to get started.</p>
      </div>

      <div 
        v-for="msg in messages" 
        :key="msg.id"
        :class="`flex ${msg.sender_id === authStore.user?.id ? 'justify-end' : 'justify-start'}`"
      >
        <div :class="`max-w-[80%] flex flex-col ${msg.sender_id === authStore.user?.id ? 'items-end' : 'items-start'}`">
          <div :class="`p-4 rounded-2xl text-sm ${
            msg.sender_id === authStore.user?.id 
              ? 'bg-slate-900 text-white rounded-tr-none' 
              : 'bg-slate-100 text-slate-900 rounded-tl-none border border-slate-200'
          }`">
            {{ msg.content }}
          </div>
          <span class="text-[10px] text-slate-400 mt-1 font-medium">{{ formatDate(msg.created_at) }}</span>
        </div>
      </div>
    </div>

    <!-- Chat Input -->
    <div class="p-4 border-t border-slate-100">
      <form @submit.prevent="handleSend" class="flex gap-2">
        <input 
          v-model="newMessage"
          type="text"
          placeholder="Type your message to the clinic..."
          class="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all"
        />
        <button 
          type="submit"
          :disabled="!newMessage.trim() || isSending"
          class="p-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Send class="w-5 h-5" />
        </button>
      </form>
      <p class="text-[10px] text-slate-400 mt-2 text-center">
        For medical emergencies, please call 911 or visit the nearest emergency room.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { usePortalStore } from '@/stores/portalStore';
import { useAuthStore } from '@/stores/auth';
import { 
  Building2, MessageSquare, Send 
} from 'lucide-vue-next';

const store = usePortalStore();
const authStore = useAuthStore();
const { messages } = storeToRefs(store);

const newMessage = ref('');
const isSending = ref(false);
const messageContainer = ref<HTMLElement | null>(null);

const formatDate = (date: string) => {
  if (!date) return '';
  return new Date(date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

const scrollToBottom = () => {
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
  }
};

const handleSend = async () => {
  if (!newMessage.value.trim() || isSending.value) return;
  
  isSending.value = true;
  try {
    // In this MVP, we send to the organization's main user or a placeholder admin
    // In production, this would be routed to a specific provider or staff member
    const placeholderRecipientId = '00000000-0000-0000-0000-000000000000'; 
    await store.sendDirectMessage(placeholderRecipientId, newMessage.value);
    newMessage.value = '';
    await nextTick();
    scrollToBottom();
  } catch (error) {
    console.error('Failed to send message', error);
  } finally {
    isSending.value = false;
  }
};

onMounted(async () => {
  await store.loadMessages();
  await nextTick();
  scrollToBottom();
});
</script>
