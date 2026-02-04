<template>
  <div class="flex flex-col h-screen bg-bg-primary">
    <!-- Header -->
    <div class="glass-subtle border-b border-border p-4 flex justify-between items-center">
      <h1 class="text-headline font-semibold text-text-primary">AI-Assisted Meeting</h1>
      <div class="flex space-x-2 items-center">
        <span v-if="isConnected" class="px-3 py-1 bg-status-completed/10 text-status-completed rounded-full text-label font-medium border border-status-completed/30">
          Live
        </span>
        <span class="px-3 py-1 bg-bg-secondary text-text-secondary rounded-full text-label font-medium">
          {{ formatDuration(meetingDuration) }}
        </span>
        <NavigationMenu />
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Left - Facilitator and Presenter -->
      <div class="w-1/5 p-6 flex flex-col gap-4">
        <!-- Facilitator (top) -->
        <div class="h-1/3">
          <Facilitator :is-visible="isFacilitatorPresent" :is-video-off="isVideoOff" />
        </div>
        <!-- Presenter (middle) -->
        <div class="h-1/3">
          <Presenter :is-video-off="isVideoOff" />
        </div>
        <!-- Voice Controls (bottom) -->
        <div class="flex-1">
          <VoiceControls
            :is-listening="isListening"
            :transcript="transcript"
            @update:isListening="isListening = $event"
            @update:transcript="handleTranscriptUpdate"
            @add-message="handleAddMessage"
          />
        </div>
      </div>

      <!-- Middle - Notes and Chat -->
      <div class="w-3/5 border-l border-r border-border flex flex-col">
        <!-- Notes Panel (Top Half) -->
        <div class="h-1/2 border-b border-border overflow-y-auto">
          <NotesPanel :notes="notes" @add-note="addNote" @add-category="addNoteCategory" />
        </div>
        <!-- Chat (Bottom Half) -->
        <div class="h-1/2 flex flex-col">
          <ChatPanel :messages="chatMessages" @add-message="handleChatAddMessage" />
        </div>
      </div>

      <!-- Right - Participants -->
      <div class="w-1/5 bg-bg-secondary">
        <div class="p-3 glass-subtle border-b border-border font-medium text-title-medium text-text-primary">
          <span>Participants ({{ participants.length }})</span>
        </div>
        <div class="overflow-y-auto p-2">
          <Participants :participants="participants" />
        </div>
      </div>
    </div>

    <!-- Footer - Controls -->
    <div class="glass-subtle border-t border-border p-4 flex justify-center items-center space-x-6">
      <button
        :class="`p-3 rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center transition-all duration-fast ${
          isMuted ? 'bg-destructive text-white' : 'bg-bg-tertiary text-text-primary hover:bg-bg-secondary'
        }`"
        @click="isMuted = !isMuted"
        :aria-label="isMuted ? 'Unmute' : 'Mute'"
      >
        <MicIcon :size="20" />
      </button>
      <button
        :class="`p-3 rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center transition-all duration-fast ${
          isVideoOff ? 'bg-destructive text-white' : 'bg-bg-tertiary text-text-primary hover:bg-bg-secondary'
        }`"
        @click="isVideoOff = !isVideoOff"
        :aria-label="isVideoOff ? 'Turn on video' : 'Turn off video'"
      >
        <VideoIcon :size="20" />
      </button>
      <RecordButton @recording-complete="handleRecordingComplete" />
      <TranscriptDownloadButton :session-id="meetingId" :disabled="!messages.length" />
      <button
        :class="`p-3 rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center transition-all duration-fast ${
          isChatOpen ? 'bg-primary text-white' : 'bg-bg-tertiary text-text-primary hover:bg-bg-secondary'
        }`"
        @click="isChatOpen = !isChatOpen"
        :aria-label="isChatOpen ? 'Close chat' : 'Open chat'"
      >
        <MessageCircleIcon :size="20" />
      </button>
      <Button
        variant="ghost"
        @click="isFacilitatorPresent = !isFacilitatorPresent"
        :aria-label="isFacilitatorPresent ? 'Remove Facilitator' : 'Add Facilitator'"
        class="min-h-[44px]"
      >
        {{ isFacilitatorPresent ? 'Remove Facilitator' : 'Add Facilitator' }}
      </Button>
      <Button
        variant="destructive"
        @click="handleEndCall"
        class="min-h-[44px]"
      >
        End Call
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { VideoIcon, MessageCircleIcon, MicIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui';
import Presenter from './Presenter.vue';
import Facilitator from './Facilitator.vue';
import Participants from './Participants.vue';
import NotesPanel from './NotesPanel.vue';
import ChatPanel from './ChatPanel.vue';
import VoiceControls from './VoiceControls.vue';
import NavigationMenu from './NavigationMenu.vue';
import RecordButton from './RecordButton.vue';
import TranscriptDownloadButton from './TranscriptDownloadButton.vue';
import { useMeeting } from '@/composables/useMeeting';
import { useRealtimeChat } from '@/composables/useRealtimeChat';
import { useAuth } from '@/composables/useAuth';
import api from '@/services/api';

interface Props {
  meetingId?: string;
}

const props = withDefaults(defineProps<Props>(), {
  meetingId: 'current-meeting'
});

const router = useRouter();
const { user } = useAuth();
const { participants, notes, addNote, addNoteCategory, isConnected } = useMeeting(props.meetingId);
const { messages, sendMessage, loading: chatLoading } = useRealtimeChat(props.meetingId, user.value?.id || 'current-user');

const isMuted = ref(false);
const isVideoOff = ref(false);
const isChatOpen = ref(true);
const isListening = ref(false);
const transcript = ref('');
const recordingData = ref(null);
const isFacilitatorPresent = ref(true);
const meetingDuration = ref(0);

let durationInterval: ReturnType<typeof setInterval> | null = null;

const formatDuration = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const handleAddMessage = async (text: string) => {
  try {
    await sendMessage(text);
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

const handleTranscriptUpdate = (text: string) => {
  transcript.value = text;
};

const handleRecordingComplete = (data: any) => {
  recordingData.value = data;
};

const handleEndCall = async () => {
  try {
    await api.endMeeting(props.meetingId);
    router.push('/');
  } catch (error) {
    console.error('Error ending meeting:', error);
  }
};

const chatMessages = computed(() => {
  return messages.value.map(msg => ({
    sender: msg.is_ai_generated ? 'AI Assistant' : (user.value?.name || 'You'),
    text: msg.message_text,
    isAI: msg.is_ai_generated
  }));
});

const handleChatAddMessage = async (text: string) => {
  await handleAddMessage(text);
};

onMounted(async () => {
  try {
    await api.getNotes(props.meetingId);
  } catch (error) {
    console.error('Error loading notes:', error);
  }

  if (isConnected.value) {
    durationInterval = setInterval(() => {
      meetingDuration.value++;
    }, 1000);
  }
});

watch(isConnected, (connected) => {
  if (connected && !durationInterval) {
    durationInterval = setInterval(() => {
      meetingDuration.value++;
    }, 1000);
  } else if (!connected && durationInterval) {
    clearInterval(durationInterval);
    durationInterval = null;
  }
});

onUnmounted(() => {
  if (durationInterval) {
    clearInterval(durationInterval);
  }
});
</script>

