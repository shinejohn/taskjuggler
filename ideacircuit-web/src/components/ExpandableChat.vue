<template>
  <div
    :class="`border-t border-gray-300 transition-all duration-300 flex flex-col ${
      isExpanded ? 'h-1/2' : 'h-14'
    }`"
  >
    <div
      class="flex justify-between items-center p-3 bg-gray-200 cursor-pointer"
      @click="isExpanded = !isExpanded"
    >
      <div class="font-medium flex items-center">
        <MessageCircleIcon :size="18" class="mr-2" />
        <span>Chat with AI Assistant</span>
      </div>
      <button class="p-1 hover:bg-gray-300 rounded">
        <ChevronDownIcon v-if="isExpanded" :size="18" />
        <ChevronUpIcon v-else :size="18" />
      </button>
    </div>
    <div v-if="isExpanded" class="flex-1 overflow-hidden">
      <ChatPanel :messages="messages" :add-message="addMessage" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ChevronUpIcon, ChevronDownIcon, MessageCircleIcon } from 'lucide-vue-next';
import ChatPanel from './ChatPanel.vue';

interface Props {
  messages: any[];
  addMessage: (message: any) => void;
  defaultExpanded?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  defaultExpanded: false
});

const isExpanded = ref(props.defaultExpanded);
</script>

