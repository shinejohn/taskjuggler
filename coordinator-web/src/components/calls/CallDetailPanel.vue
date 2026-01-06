<template>
  <!-- Backdrop -->
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/20 z-40 transition-opacity"
    @click="$emit('close')"
  />

  <!-- Panel -->
  <div
    :class="[
      'fixed top-0 right-0 h-full w-full sm:w-[500px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto flex flex-col',
      isOpen ? 'translate-x-0' : 'translate-x-full'
    ]"
  >
    <!-- Header -->
    <div class="sticky top-0 bg-white border-b border-slate-100 p-6 flex justify-between items-start z-10">
      <div>
        <h2 class="text-xl font-bold text-slate-900">Call Details</h2>
        <div class="flex items-center gap-2 text-sm text-slate-500 mt-1">
          <Calendar :size="14" />
          <span>{{ formatDate(call?.started_at) }} at {{ formatTime(call?.started_at) }}</span>
          <span>•</span>
          <Clock :size="14" />
          <span>{{ formatDuration(call?.duration_seconds || 0) }}</span>
        </div>
      </div>
      <div class="flex gap-2">
        <button
          v-if="call?.recording_url"
          @click="downloadRecording"
          class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        >
          <Download :size="20" />
        </button>
        <button
          @click="$emit('close')"
          class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X :size="20" />
        </button>
      </div>
    </div>

    <div v-if="call" class="flex-1 p-6 space-y-8 overflow-y-auto">
      <!-- Participants -->
      <div class="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
            <User :size="20" />
          </div>
          <div>
            <div class="font-bold text-slate-900">{{ getContactName(call) }}</div>
            <div class="text-xs text-slate-500">{{ call.from_number }}</div>
          </div>
        </div>
        <div class="h-8 w-px bg-slate-200"></div>
        <div class="flex items-center gap-3 text-right">
          <div>
            <div class="font-bold text-slate-900">{{ getCoordinatorName(call) }}</div>
            <div class="text-xs text-slate-500">Coordinator</div>
          </div>
          <div class="w-10 h-10 rounded-full bg-blue-100 text-[#1B4F72] flex items-center justify-center font-bold">
            {{ getCoordinatorInitial(call) }}
          </div>
        </div>
      </div>

      <!-- Outcome Badge -->
      <div class="flex justify-center">
        <span
          :class="[
            'px-4 py-1.5 rounded-full text-sm font-medium border',
            getOutcomeClass(call.outcome)
          ]"
        >
          {{ call.outcome || 'Completed' }}
        </span>
      </div>

      <!-- Audio Player -->
      <div v-if="call.recording_url" class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-bold text-slate-900">Recording</h3>
          <div class="flex gap-2 text-xs font-medium text-slate-500">
            <button class="hover:text-[#1B4F72]">1x</button>
            <button class="hover:text-[#1B4F72]">1.5x</button>
            <button class="hover:text-[#1B4F72]">2x</button>
          </div>
        </div>

        <!-- Waveform Visualization -->
        <div class="h-12 flex items-center gap-0.5 mb-4 px-2">
          <div
            v-for="i in 40"
            :key="i"
            :class="[
              'w-1.5 rounded-full transition-all',
              i < 15 ? 'bg-[#1B4F72]' : 'bg-slate-200'
            ]"
            :style="{ height: `${Math.max(20, Math.random() * 100)}%` }"
          />
        </div>

        <div class="flex items-center gap-4">
          <button
            @click="togglePlayback"
            class="w-10 h-10 rounded-full bg-[#1B4F72] text-white flex items-center justify-center hover:bg-[#153e5a] transition-colors shadow-sm"
          >
            <Play v-if="!isPlaying" :size="18" fill="currentColor" class="ml-0.5" />
            <Pause v-else :size="18" />
          </button>
          <div class="flex-1">
            <div class="h-1 bg-slate-200 rounded-full overflow-hidden">
              <div class="h-full bg-[#1B4F72] rounded-full" style="width: 35%"></div>
            </div>
            <div class="flex justify-between text-xs text-slate-500 mt-1">
              <span>0:45</span>
              <span>{{ formatDuration(call.duration_seconds) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Transcript -->
      <div v-if="call.transcript" class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <h3 class="text-sm font-bold text-slate-900 mb-3">Transcript</h3>
        <div class="space-y-3 text-sm text-slate-700">
          <div
            v-for="(segment, i) in transcriptSegments"
            :key="i"
            class="p-3 rounded-lg"
            :class="segment.speaker === 'coordinator' ? 'bg-blue-50' : 'bg-slate-50'"
          >
            <div class="font-semibold text-xs text-slate-500 mb-1">
              {{ segment.speaker === 'coordinator' ? getCoordinatorName(call) : getContactName(call) }}
            </div>
            <div>{{ segment.text }}</div>
          </div>
        </div>
      </div>

      <!-- AI Summary -->
      <div v-if="call.ai_summary" class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <h3 class="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Lightbulb :size="16" class="text-amber-500" />
          AI Summary
        </h3>
        <p class="text-sm text-slate-700">{{ call.ai_summary }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  X,
  Play,
  Pause,
  Calendar,
  Clock,
  Download,
  User,
  Lightbulb,
} from 'lucide-vue-next';
import type { CallLog } from '@/api/calls';

interface Props {
  call: CallLog | null;
  isOpen: boolean;
}

const props = defineProps<Props>();
defineEmits<{
  close: [];
}>();

const isPlaying = ref(false);

const transcriptSegments = computed(() => {
  if (!props.call?.transcript) return [];
  // Would parse transcript segments from backend
  return [
    { speaker: 'coordinator', text: 'Hello, thank you for calling...' },
    { speaker: 'customer', text: 'Hi, I need to schedule an appointment...' },
  ];
});

function formatDate(date?: string): string {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(date?: string): string {
  if (!date) return '';
  return new Date(date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function getContactName(call: CallLog): string {
  if ((call as any).contact) {
    const contact = (call as any).contact;
    return `${contact.first_name} ${contact.last_name || ''}`.trim() || 'Unknown';
  }
  return 'Unknown';
}

function getCoordinatorName(call: CallLog): string {
  if ((call as any).coordinator) {
    return (call as any).coordinator.display_name || 'Coordinator';
  }
  return 'Unknown';
}

function getCoordinatorInitial(call: CallLog): string {
  return getCoordinatorName(call).charAt(0).toUpperCase();
}

function getOutcomeClass(outcome?: string): string {
  if (!outcome) return 'bg-slate-50 text-slate-600 border-slate-200';
  const lower = outcome.toLowerCase();
  if (lower.includes('booked') || lower.includes('confirmed')) {
    return 'bg-green-50 text-green-700 border-green-200';
  }
  if (lower.includes('info')) {
    return 'bg-blue-50 text-blue-700 border-blue-200';
  }
  if (lower.includes('transferred')) {
    return 'bg-amber-50 text-amber-700 border-amber-200';
  }
  return 'bg-slate-50 text-slate-600 border-slate-200';
}

function togglePlayback() {
  isPlaying.value = !isPlaying.value;
}

function downloadRecording() {
  if (props.call?.recording_url) {
    window.open(props.call.recording_url, '_blank');
  }
}
</script>

