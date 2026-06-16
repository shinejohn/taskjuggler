<template>
  <div class="flex flex-col h-screen">
    <!-- Header -->
    <div class="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 class="text-xl font-bold">AI-Assisted Client Proposal</h1>
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
          <MeetingVideoPanel
            ref="videoPanelRef"
            :meeting-id="meetingId"
            :is-video-off="isVideoOff"
          />
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
      <!-- Middle - Proposal -->
      <div class="w-3/5 border-l border-r border-gray-300 flex flex-col">
        <div class="flex-1 overflow-y-auto">
          <ProposalForm />
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
import { ref, watch } from 'vue';
import { VideoIcon, MessageCircleIcon, MicIcon } from 'lucide-vue-next';
import MeetingVideoPanel from '@/components/MeetingVideoPanel.vue';
import Facilitator from '@/components/Facilitator.vue';
import Participants from '@/components/Participants.vue';
import ProposalForm from '@/components/ProposalForm.vue';
import ExpandableChat from '@/components/ExpandableChat.vue';
import VoiceControls from '@/components/VoiceControls.vue';
import NavigationMenu from '@/components/NavigationMenu.vue';
import { useIdeacircuitMeeting } from '@/composables/useIdeacircuitMeeting';

const { meetingId } = useIdeacircuitMeeting('Client Proposal', 'sales_call');
const videoPanelRef = ref<InstanceType<typeof MeetingVideoPanel> | null>(null);

const isMuted = ref(false);
const isVideoOff = ref(false);
const isChatOpen = ref(true);
const isListening = ref(false);
const transcript = ref('');
const isFacilitatorPresent = ref(true);

watch(isMuted, (muted) => {
  videoPanelRef.value?.setMicrophoneEnabled(!muted);
});

watch(isVideoOff, (off) => {
  videoPanelRef.value?.setCameraEnabled(!off);
});

const messages = ref<Array<{ sender: string; text: string; isAI: boolean }>>([]);
const participants = ref<Array<{ id: number; name: string; image: string }>>([]);

const addMessage = (message: any) => {
  messages.value.push(message);
};

const handleTranscriptUpdate = (text: string) => {
  transcript.value = text;
};
</script>

