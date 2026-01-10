<template>
  <div class="h-full flex flex-col">
    <div class="p-3 glass-subtle border-b border-border font-medium text-title-medium text-text-primary">
      Chat
    </div>
    <div class="flex-1 overflow-y-auto p-4 space-y-4">
      <div v-if="messages.length === 0" class="text-center py-8 text-text-secondary text-body-medium">
        No messages yet. Start a conversation!
      </div>
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="`flex ${message.isAI ? 'justify-start' : 'justify-end'}`"
      >
        <div :class="`max-w-[80%] rounded-lg px-4 py-2 shadow-1 ${
          message.isAI
            ? 'bg-bg-secondary text-text-primary'
            : 'bg-primary text-white'
        }`">
          <p class="text-caption font-medium mb-1 opacity-80">{{ message.sender }}</p>
          <p class="text-body-medium">{{ message.text }}</p>
        </div>
      </div>
      <div ref="messagesEndRef" />
    </div>
    <div class="p-3 border-t border-border glass-subtle">
      <div class="flex items-center gap-2">
        <Input
          v-model="newMessage"
          type="text"
          class="flex-1"
          placeholder="Type a message..."
          @keypress.enter="handleSendMessage"
        />
        <Button
          @click="handleSendMessage"
          aria-label="Send message"
          class="min-h-[44px] min-w-[44px] p-0"
        >
          <SendIcon :size="18" />
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { SendIcon } from 'lucide-vue-next';
import { Input, Button } from '@/components/ui';

interface Message {
  sender: string;
  text: string;
  isAI: boolean;
}

interface Props {
  messages: Message[];
  addMessage: (text: string) => void | Promise<void>;
}

const props = defineProps<Props>();

const newMessage = ref('');
const messagesEndRef = ref<HTMLDivElement | null>(null);

const scrollToBottom = () => {
  messagesEndRef.value?.scrollIntoView({
    behavior: 'smooth'
  });
};

watch(() => props.messages, () => {
  nextTick(() => {
    scrollToBottom();
  });
}, { deep: true });

const handleSendMessage = async () => {
  if (newMessage.value.trim()) {
    await props.addMessage(newMessage.value.trim());
    newMessage.value = '';
  }
};
</script>
