<template>
  <div class="flex flex-col h-full">
    <!-- Vapi Call Controls -->
    <div :class="['p-4 border-b rounded-t-lg', theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200']">
      <div class="flex items-center justify-between mb-4">
        <h3 :class="['text-lg font-bold', theme === 'dark' ? 'text-white' : 'text-gray-900']">
          Voice Assistant
        </h3>
        <StatusIndicator :status="callStatus" />
      </div>

      <div class="flex items-center justify-center gap-4">
        <button
          @click="toggleMute"
          :class="['p-4 rounded-full transition-all', isMuted ? 'bg-red-500/20 text-red-500' : (theme === 'dark' ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')]"
        >
          <MicOff v-if="isMuted" class="h-6 w-6" />
          <Mic v-else class="h-6 w-6" />
        </button>

        <button
          @click="startCall"
          v-if="!isCallActive"
          :class="['p-6 rounded-full bg-gradient-to-r text-white shadow-lg', theme === 'dark' ? 'from-emerald-600 to-teal-600' : 'from-emerald-700 to-teal-700']"
        >
          <Phone class="h-8 w-8" />
        </button>

        <button
          @click="endCall"
          v-else
          class="p-6 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg"
        >
          <PhoneOff class="h-8 w-8" />
        </button>
      </div>
    </div>

    <!-- Call Status -->
    <div v-if="isCallActive" :class="['p-4 border-t', theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-gray-50 border-gray-200']">
      <p :class="['text-sm text-center', theme === 'dark' ? 'text-slate-400' : 'text-gray-600']">
        Call duration: {{ formatDuration(callDuration) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { Phone, PhoneOff, Mic, MicOff } from 'lucide-vue-next';
import StatusIndicator, { type AIStatus } from '@/components/ui/StatusIndicator.vue';
import { useTheme } from '@/composables/useTheme';
import { useVoiceStore } from '@/stores/voice';
import { vapiService } from '@/services/vapi';

const error = ref<string | null>(null);

const { theme } = useTheme();
const voiceStore = useVoiceStore();

const isCallActive = ref(false);
const isMuted = ref(false);
const callDuration = ref(0);
const callStatus = ref<AIStatus>('idle');

let callInterval: ReturnType<typeof setInterval> | null = null;

const assistantId = ref<string>('');
const customerNumber = ref<string>('');

async function startCall() {
  if (!assistantId.value || !customerNumber.value) {
    error.value = 'Assistant ID and customer number are required';
    return;
  }

  try {
    isCallActive.value = true;
    callStatus.value = 'listening';
    callDuration.value = 0;
    
    callInterval = setInterval(() => {
      callDuration.value++;
    }, 1000);

    await vapiService.startCall({
      assistantId: assistantId.value,
      customerNumber: customerNumber.value,
    });
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to start call';
    isCallActive.value = false;
    if (callInterval) {
      clearInterval(callInterval);
      callInterval = null;
    }
  }
}

async function endCall() {
  if (voiceStore.currentCallId) {
    try {
      await vapiService.endCall(voiceStore.currentCallId);
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to end call';
    }
  }
  isCallActive.value = false;
  callStatus.value = 'idle';
  if (callInterval) {
    clearInterval(callInterval);
    callInterval = null;
  }
}

function toggleMute() {
  isMuted.value = !isMuted.value;
  // Note: Vapi mute/unmute would need to be implemented via backend API
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

onUnmounted(() => {
  if (callInterval) {
    clearInterval(callInterval);
  }
});
</script>

