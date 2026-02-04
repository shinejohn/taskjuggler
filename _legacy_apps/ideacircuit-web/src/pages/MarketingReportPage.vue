<template>
  <div class="flex flex-col h-screen">
    <!-- Header -->
    <div class="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 class="text-xl font-bold">AI-Assisted Marketing Analysis</h1>
      <div class="flex space-x-2 items-center">
        <span class="px-3 py-1 bg-green-600 rounded-full text-sm">Live</span>
        <span class="px-3 py-1 bg-gray-600 rounded-full text-sm">00:15:32</span>
        <NavigationMenu />
      </div>
    </div>
    <!-- Main Content -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Left - Facilitator and Presenter -->
      <div class="w-1/5 p-4 flex flex-col">
        <!-- Facilitator (top) -->
        <div class="h-1/3 mb-2">
          <Facilitator :is-visible="isFacilitatorPresent" :is-video-off="isVideoOff" />
        </div>
        <!-- Presenter (middle) -->
        <div class="h-1/3 mb-2">
          <Presenter :is-video-off="isVideoOff" />
        </div>
        <!-- Voice Controls (bottom) -->
        <div class="flex-1">
          <VoiceControls
            :is-listening="isListening"
            :transcript="transcript"
            @update:isListening="isListening = $event"
            @update:transcript="handleTranscriptUpdate"
            @add-message="addMessage"
          />
        </div>
      </div>
      <!-- Middle - Marketing Report -->
      <div class="w-3/5 border-l border-r border-gray-300 flex flex-col">
        <div class="flex-1 overflow-y-auto">
          <MarketingPlanForm />
        </div>
        <!-- Expandable Chat -->
        <ExpandableChat :messages="messages" :default-expanded="false" @add-message="addMessage" />
      </div>
      <!-- Right - Participants -->
      <div class="w-1/5 bg-gray-50">
        <div class="p-3 bg-gray-200 font-medium">
          <span>Participants ({{ participants.length }})</span>
        </div>
        <div class="overflow-y-auto">
          <Participants :participants="participants" />
        </div>
      </div>
    </div>
    <!-- Footer - Controls -->
    <div class="bg-gray-800 text-white p-4 flex justify-center items-center space-x-6">
      <button
        :class="`p-3 rounded-full ${isMuted ? 'bg-red-500' : 'bg-gray-600 hover:bg-gray-500'}`"
        @click="isMuted = !isMuted"
      >
        <MicIcon :size="20" />
      </button>
      <button
        :class="`p-3 rounded-full ${isVideoOff ? 'bg-red-500' : 'bg-gray-600 hover:bg-gray-500'}`"
        @click="isVideoOff = !isVideoOff"
      >
        <VideoIcon :size="20" />
      </button>
      <button
        :class="`p-3 rounded-full ${isChatOpen ? 'bg-blue-500' : 'bg-gray-600 hover:bg-gray-500'}`"
        @click="isChatOpen = !isChatOpen"
      >
        <MessageCircleIcon :size="20" />
      </button>
      <button
        class="p-3 rounded-full bg-gray-600 hover:bg-gray-500"
        @click="isFacilitatorPresent = !isFacilitatorPresent"
      >
        {{ isFacilitatorPresent ? 'Remove Facilitator' : 'Add Facilitator' }}
      </button>
      <button class="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md font-medium">
        End Call
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { VideoIcon, MessageCircleIcon, MicIcon } from 'lucide-vue-next';
import Presenter from '@/components/Presenter.vue';
import Facilitator from '@/components/Facilitator.vue';
import Participants from '@/components/Participants.vue';
import MarketingPlanForm from '@/components/MarketingPlanForm.vue';
import ExpandableChat from '@/components/ExpandableChat.vue';
import VoiceControls from '@/components/VoiceControls.vue';
import NavigationMenu from '@/components/NavigationMenu.vue';

const isMuted = ref(false);
const isVideoOff = ref(false);
const isChatOpen = ref(true);
const isListening = ref(false);
const transcript = ref('');
const isFacilitatorPresent = ref(true);

const messages = ref([
  {
    sender: 'AI Assistant',
    text: 'Welcome to the marketing report. How can I help you analyze this marketing plan?',
    isAI: true
  },
  {
    sender: 'You',
    text: 'Can you explain the competitive analysis section in more detail?',
    isAI: false
  },
  {
    sender: 'AI Assistant',
    text: "The competitive analysis shows that your company has 8% market share compared to CompanyX (42%), CompanyY (27%), and CompanyZ (15%). Your advantage is in customer satisfaction (82% vs. competitor's 67%), while CompanyX leads in product quality but has higher pricing.",
    isAI: true
  }
]);

const participants = ref([
  {
    id: 1,
    name: 'John Doe',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 2,
    name: 'Jane Smith',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 3,
    name: 'Alex Johnson',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }
]);

const addMessage = (message: any) => {
  messages.value.push(message);
};

const handleTranscriptUpdate = (text: string) => {
  transcript.value = text;
};
</script>

