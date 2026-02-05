<template>
  <div class="flex flex-col h-full bg-slate-50">
    <!-- Chat Header -->
    <div class="bg-white border-b border-slate-200 p-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="relative">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white shadow-sm">
            <Bot class="w-6 h-6" />
          </div>
          <span class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
        </div>
        <div>
          <h3 class="font-bold text-slate-900">HealthBot</h3>
          <p class="text-xs text-slate-500">AI Assistant • Online</p>
        </div>
      </div>
    </div>

    <!-- Messages Area -->
    <div class="flex-1 overflow-y-auto p-4 space-y-4" ref="messagesContainer">
      <div v-for="(msg, index) in chatHistory" :key="index" :class="['flex', msg.role === 'user' ? 'justify-end' : 'justify-start']">
        <div 
          :class="[
            'max-w-[80%] rounded-2xl p-4 text-sm',
            msg.role === 'user' 
              ? 'bg-teal-600 text-white rounded-br-none' 
              : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'
          ]"
        >
          <p>{{ msg.text }}</p>
          <p :class="['text-[10px] mt-1', msg.role === 'user' ? 'text-teal-200' : 'text-slate-400']">
            {{ new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
          </p>
        </div>
      </div>
      <div v-if="isTyping" class="flex justify-start">
         <div class="bg-white border border-slate-200 rounded-2xl p-4 rounded-bl-none shadow-sm flex gap-1">
            <span class="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
            <span class="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></span>
            <span class="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></span>
         </div>
      </div>
    </div>

    <!-- Quick Actions/Suggestions -->
    <div v-if="suggestions.length > 0" class="px-4 pb-2 flex gap-2 overflow-x-auto">
      <button 
        v-for="suggestion in suggestions" 
        :key="suggestion"
        @click="handleSendMessage(suggestion)"
        class="flex-shrink-0 px-3 py-1.5 bg-white border border-teal-200 text-teal-700 text-xs font-semibold rounded-full hover:bg-teal-50 transition-colors"
      >
        {{ suggestion }}
      </button>
    </div>

    <!-- Input Area -->
    <div class="p-4 bg-white border-t border-slate-200">
      <form @submit.prevent="handleSubmit" class="flex gap-2">
        <input 
          v-model="newMessage" 
          type="text" 
          placeholder="Type your message..." 
          class="flex-1 px-4 py-2 border border-slate-300 rounded-full focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
        />
        <button 
          type="submit" 
          :disabled="!newMessage.trim()"
          class="p-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send class="w-5 h-5" />
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, watch } from 'vue';
import { Bot, Send } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { usePortalStore } from '@/stores/portalStore';

const store = usePortalStore();
const { chatHistory, isLoading: isTyping } = storeToRefs(store);

const suggestions = ref([
  "Schedule Appointment",
  "Refill Prescription",
  "Check Referral Status",
  "Intake Form Help"
]);

const newMessage = ref('');
const messagesContainer = ref<HTMLElement | null>(null);

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

// Initial welcome if history is empty
onMounted(() => {
  if (chatHistory.value.length === 0) {
    chatHistory.value.push({
      role: 'bot',
      text: "Hi! I'm your HealthBot assistant. I can help you schedule appointments, refill prescriptions, or answer questions about your care. How can I help today?"
    });
  }
  scrollToBottom();
});

watch(chatHistory, () => {
  scrollToBottom();
}, { deep: true });

const handleSendMessage = async (text: string) => {
  if (!text.trim() || isTyping.value) return;
  
  const query = text.trim();
  newMessage.value = '';
  suggestions.value = [];
  
  await store.sendMessage(query);
  
  // Update suggestions based on response actions if available
  const lastMsg = chatHistory.value[chatHistory.value.length - 1];
  if (lastMsg && lastMsg.actions) {
    suggestions.value = lastMsg.actions.map((a: any) => a.label);
  }
};

const handleSubmit = () => {
  handleSendMessage(newMessage.value);
};
</script>
