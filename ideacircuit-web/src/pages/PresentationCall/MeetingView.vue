<template>
  <div class="h-full flex flex-col">
    <!-- Meeting Controls -->
    <div class="bg-blue-50 border-b border-blue-200 p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <PresentationIcon :size="24" class="text-blue-600" />
          <div>
            <h2 class="text-lg font-semibold text-blue-900">Meeting Room</h2>
            <p class="text-sm text-blue-700">
              {{ meetingId ? 'LiveKit video connected' : 'Connecting video...' }}
            </p>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <button
            type="button"
            @click="$emit('ai-setup')"
            class="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            <BotIcon :size="16" />
            <span>Setup AI</span>
          </button>
          <button
            type="button"
            @click="$emit('start-presentation')"
            class="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <PresentationIcon :size="16" />
            <span>Start Presentation</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Meeting Content -->
    <div class="flex-1 p-6">
      <div class="max-w-6xl mx-auto">
        <!-- Video Area -->
        <div class="mb-6">
          <MeetingVideoPanel
            ref="videoPanelRef"
            :meeting-id="meetingId"
            :is-video-off="!isVideoOn"
          />
        </div>

        <!-- Meeting Info -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-white rounded-lg border p-4">
            <div class="flex items-center space-x-3">
              <UsersIcon :size="20" class="text-blue-600" />
              <div>
                <h3 class="font-semibold text-gray-900">Participants</h3>
                <p class="text-sm text-gray-600">{{ meetingId ? 'Live session' : 'Waiting' }}</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-lg border p-4">
            <div class="flex items-center space-x-3">
              <ClockIcon :size="20" class="text-green-600" />
              <div>
                <h3 class="font-semibold text-gray-900">Duration</h3>
                <p class="text-sm text-gray-600">{{ formattedDuration }}</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-lg border p-4">
            <div class="flex items-center space-x-3">
              <CalendarIcon :size="20" class="text-purple-600" />
              <div>
                <h3 class="font-semibold text-gray-900">Status</h3>
                <p class="text-sm text-gray-600">{{ meetingId ? 'Active' : 'Starting' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Control Panel -->
        <div class="bg-white rounded-lg border p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Meeting Controls</h3>
          <div class="flex items-center justify-center space-x-4">
            <button
              type="button"
              @click="$emit('toggle-mute')"
              :class="`p-3 rounded-full ${isMuted ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`"
              :aria-label="isMuted ? 'Unmute' : 'Mute'"
            >
              <MicIcon :size="20" />
            </button>
            <button
              type="button"
              @click="$emit('toggle-video')"
              :class="`p-3 rounded-full ${isVideoOn ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`"
              :aria-label="isVideoOn ? 'Turn off video' : 'Turn on video'"
            >
              <VideoIcon :size="20" />
            </button>
            <button
              type="button"
              @click="$emit('toggle-recording')"
              :class="`p-3 rounded-full ${isRecording ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`"
              aria-label="Toggle recording"
            >
              <div class="w-5 h-5 rounded-full bg-current" />
            </button>
            <button
              type="button"
              class="p-3 rounded-full bg-red-600 text-white"
              aria-label="End call"
              @click="$emit('end-call')"
            >
              <PhoneIcon :size="20" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import {
  PresentationIcon,
  BotIcon,
  UsersIcon,
  CalendarIcon,
  ClockIcon,
  MicIcon,
  VideoIcon,
  PhoneIcon
} from 'lucide-vue-next';
import MeetingVideoPanel from '@/components/MeetingVideoPanel.vue';

const props = defineProps<{
  meetingId: string | null;
  isRecording: boolean;
  isMuted: boolean;
  isVideoOn: boolean;
}>();

defineEmits<{
  'ai-setup': [];
  'start-presentation': [];
  'toggle-recording': [];
  'toggle-mute': [];
  'toggle-video': [];
  'end-call': [];
}>();

const videoPanelRef = ref<InstanceType<typeof MeetingVideoPanel> | null>(null);
const durationSeconds = ref(0);
let durationInterval: ReturnType<typeof setInterval> | null = null;

const formattedDuration = computed(() => {
  const mins = Math.floor(durationSeconds.value / 60);
  const secs = durationSeconds.value % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
});

watch(() => props.isMuted, (muted) => {
  videoPanelRef.value?.setMicrophoneEnabled(!muted);
});

watch(() => props.isVideoOn, (on) => {
  videoPanelRef.value?.setCameraEnabled(on);
});

onMounted(() => {
  durationInterval = setInterval(() => {
    durationSeconds.value++;
  }, 1000);
});

onUnmounted(() => {
  if (durationInterval) {
    clearInterval(durationInterval);
  }
});
</script>
