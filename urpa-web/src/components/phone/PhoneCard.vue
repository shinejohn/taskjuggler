<template>
  <div :class="['flex flex-col backdrop-blur-sm rounded-xl border-2 overflow-hidden shadow-lg', cardBg, cardBorder]">
    <!-- Header -->
    <div
      @click="!isInCall && (isExpanded = !isExpanded)"
      :class="['flex items-center justify-between p-4 transition-colors border-b-2', cardBorder, !isInCall && 'cursor-pointer', headerBg, theme === 'dark' ? 'hover:bg-slate-800/70' : 'hover:from-emerald-300 hover:to-teal-300']"
    >
      <div class="flex items-center gap-3">
        <div :class="['p-2 rounded-lg', theme === 'dark' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-300 text-emerald-900']">
          <Phone class="h-5 w-5" />
        </div>
        <div>
          <h3 :class="['text-base font-bold', textPrimary]">
            Phone Assistant
          </h3>
          <p v-if="!isExpanded && !isInCall" :class="['text-xs font-semibold', textSecondary]">
            {{ calls.length }} recent calls
          </p>
          <p v-if="isInCall" :class="['text-xs font-semibold', theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700']">
            In call • {{ formatDuration(callDuration) }}
          </p>
        </div>
      </div>
      <ChevronUp v-if="!isInCall && isExpanded" :class="['h-5 w-5', textSecondary]" />
      <ChevronDown v-else-if="!isInCall" :class="['h-5 w-5', textSecondary]" />
    </div>

    <!-- Active Call Interface -->
    <Transition name="expand">
      <div v-if="isInCall" class="overflow-hidden">
        <div class="p-6 space-y-6">
          <div class="text-center">
            <div
              :class="['w-24 h-24 mx-auto rounded-full bg-gradient-to-br flex items-center justify-center mb-4 shadow-lg', theme === 'dark' ? 'from-emerald-500 to-teal-600' : 'from-emerald-600 to-teal-700', 'animate-pulse']"
            >
              <PhoneCall class="h-12 w-12 text-white" />
            </div>
            <h4 :class="['text-xl font-bold mb-1', textPrimary]">
              Active Call
            </h4>
            <p :class="['text-sm', textSecondary]">
              AI Assistant is listening...
            </p>
          </div>

          <div class="flex justify-center gap-4">
            <button
              @click="isMuted = !isMuted"
              :class="['p-4 rounded-full transition-all', isMuted ? 'bg-red-500/20 text-red-500' : (theme === 'dark' ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-gray-300 text-gray-700 hover:bg-gray-400')]"
            >
              <MicOff v-if="isMuted" class="h-6 w-6" />
              <Mic v-else class="h-6 w-6" />
            </button>

            <button
              @click="isSpeakerOn = !isSpeakerOn"
              :class="['p-4 rounded-full transition-all', isSpeakerOn ? (theme === 'dark' ? 'bg-emerald-600 text-white' : 'bg-emerald-700 text-white') : (theme === 'dark' ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-gray-300 text-gray-700 hover:bg-gray-400')]"
            >
              <Volume2 v-if="isSpeakerOn" class="h-6 w-6" />
              <VolumeX v-else class="h-6 w-6" />
            </button>

            <button
              @click="handleEndCall"
              class="p-4 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              <Phone class="h-6 w-6 rotate-[135deg]" />
            </button>
          </div>

          <div :class="['p-4 rounded-lg border-2', theme === 'dark' ? 'bg-slate-900/50' : 'bg-gray-100', cardBorder]">
            <p :class="['text-xs font-semibold mb-2', textSecondary]">
              Actions Taken:
            </p>
            <div class="space-y-2">
              <div :class="['flex items-center gap-2 text-sm', textPrimary]">
                <CheckSquare class="h-4 w-4 text-green-500" />
                <span>Created task: "Follow up with client"</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Expanded Content -->
    <Transition name="expand">
      <div v-if="isExpanded && !isInCall" class="overflow-hidden">
        <div class="p-4 space-y-4">
          <!-- Assistant Phone Number -->
          <div :class="['p-4 rounded-lg border-2', theme === 'dark' ? 'bg-slate-900/50' : 'bg-emerald-50', cardBorder]">
            <p :class="['text-xs font-semibold mb-2', textSecondary]">
              Your AI Assistant Number
            </p>
            <div class="flex items-center justify-between">
              <p :class="['text-lg font-bold', theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700']">
                {{ assistantNumber }}
              </p>
              <button
                @click="handleCopyNumber"
                :class="['p-2 rounded-lg transition-colors', theme === 'dark' ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-emerald-200 text-emerald-700']"
              >
                <Check v-if="copiedNumber" class="h-4 w-4" />
                <Copy v-else class="h-4 w-4" />
              </button>
            </div>
            <p :class="['text-xs mt-2', textSecondary]">
              Forward calls to this number for AI assistance
            </p>
          </div>

          <!-- Capabilities -->
          <div :class="['p-4 rounded-lg border-2', theme === 'dark' ? 'bg-slate-900/50' : 'bg-gray-100', cardBorder]">
            <p :class="['text-xs font-semibold mb-3', textSecondary]">
              AI Can Handle:
            </p>
            <div class="grid grid-cols-2 gap-2">
              <div
                v-for="capability in capabilities"
                :key="capability.label"
                :class="['flex items-center gap-2 p-2 rounded-lg', theme === 'dark' ? 'bg-slate-800/50' : 'bg-white']"
              >
                <component :is="capability.icon" :class="['h-4 w-4', theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600']" />
                <span :class="['text-xs font-semibold', textPrimary]">
                  {{ capability.label }}
                </span>
              </div>
            </div>
          </div>

          <!-- Start Call Button -->
          <button
            @click="handleStartCall"
            :class="['w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r text-white font-semibold shadow-lg hover:shadow-xl transition-shadow', theme === 'dark' ? 'from-emerald-600 to-teal-600' : 'from-emerald-700 to-teal-700']"
          >
            <PhoneCall class="h-5 w-5" />
            Test Call Assistant
          </button>

          <!-- Call History -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <p :class="['text-xs font-semibold', textSecondary]">
                Call Log
              </p>
              <div class="flex gap-1">
                <button
                  v-for="type in filterTypes"
                  :key="type"
                  @click="filterType = type"
                  :class="['px-2 py-1 rounded text-xs font-semibold transition-all', filterType === type ? (theme === 'dark' ? 'bg-emerald-600 text-white' : 'bg-emerald-700 text-white') : (theme === 'dark' ? 'bg-slate-700 text-slate-400 hover:bg-slate-600' : 'bg-gray-300 text-gray-600 hover:bg-gray-400')]"
                >
                  {{ type.charAt(0).toUpperCase() + type.slice(1) }}
                </button>
              </div>
            </div>
            <div class="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
              <button
                v-for="(call, index) in filteredCalls"
                :key="call.id"
                @click="selectedCall = call"
                :class="['w-full text-left p-3 rounded-lg border-2 transition-all group', cardBorder, itemBg]"
              >
                <div class="flex items-start justify-between mb-2">
                  <div class="flex items-center gap-2">
                    <div :class="getCallColor(call.direction)">
                      <component :is="getCallIcon(call.direction)" class="h-4 w-4" />
                    </div>
                    <div>
                      <p :class="['text-sm font-bold', textPrimary]">
                        {{ call.contact?.first_name || call.caller_number || 'Unknown' }}
                      </p>
                      <div class="flex items-center gap-2 mt-1">
                        <Clock :class="['h-3 w-3', textSecondary]" />
                        <span :class="['text-xs', textSecondary]">
                          {{ formatCallTime(call.started_at) }}
                        </span>
                        <span :class="['text-xs', textSecondary]">•</span>
                        <span :class="['text-xs', textSecondary]">
                          {{ call.duration_seconds ? formatDuration(call.duration_seconds) : '0:00' }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Maximize2 :class="['h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity', textSecondary]" />
                </div>
                <div v-if="call.actions_taken && call.actions_taken.length > 0" class="flex flex-wrap gap-1 mt-2">
                  <div
                    v-for="(action, idx) in call.actions_taken"
                    :key="idx"
                    :class="['flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold', theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-gray-300 text-gray-700']"
                  >
                    <component :is="getActionIcon(action)" />
                    {{ action }}
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>

  <!-- Call Detail Modal -->
  <CallDetail
    v-if="selectedCall"
    :call="selectedCall"
    @close="selectedCall = null"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Phone, PhoneCall, PhoneIncoming, PhoneOutgoing, PhoneMissed, Mic, MicOff, Volume2, VolumeX, Copy, Check, ChevronDown, ChevronUp, Clock, Maximize2, CheckSquare, Mail, MessageSquare, Calendar } from 'lucide-vue-next';
import { useTheme } from '@/composables/useTheme';
import { usePhoneStore } from '@/stores/phone';
import { useAuthStore } from '@/stores/auth';
import CallDetail from './CallDetail.vue';

const { theme } = useTheme();
const phoneStore = usePhoneStore();

const isExpanded = ref(false);
const isInCall = ref(false);
const isMuted = ref(false);
const isSpeakerOn = ref(false);
const copiedNumber = ref(false);
const callDuration = ref(0);
const selectedCall = ref<any>(null);
const filterType = ref<'all' | 'inbound' | 'outbound'>('all');

const assistantNumber = computed(() => {
  // Get from user profile or integration settings
  return user.value?.phone || '+1 (555) 123-4567';
});

const user = computed(() => {
  const authStore = useAuthStore();
  return authStore.user;
});
const calls = computed(() => phoneStore.calls);

const filterTypes = ['all', 'inbound', 'outbound'] as const;

const filteredCalls = computed(() => {
  if (filterType.value === 'all') return calls.value;
  return calls.value.filter(call => call.direction === filterType.value);
});

const cardBg = computed(() => theme.value === 'dark' ? 'bg-slate-800/30' : 'bg-white/95');
const cardBorder = computed(() => theme.value === 'dark' ? 'border-slate-700/50' : 'border-purple-400');
const headerBg = computed(() => theme.value === 'dark' ? 'bg-slate-800/50' : 'bg-gradient-to-r from-emerald-200 to-teal-200');
const textPrimary = computed(() => theme.value === 'dark' ? 'text-slate-200' : 'text-gray-900');
const textSecondary = computed(() => theme.value === 'dark' ? 'text-slate-400' : 'text-gray-700');
const itemBg = computed(() => theme.value === 'dark' ? 'bg-slate-800/50 hover:bg-slate-800' : 'bg-gray-200 hover:bg-gray-300');

const capabilities = [
  { icon: CheckSquare, label: 'Create Tasks' },
  { icon: MessageSquare, label: 'Take Messages' },
  { icon: Mail, label: 'Send Emails' },
  { icon: Calendar, label: 'Schedule Meetings' },
];

let callInterval: ReturnType<typeof setInterval> | null = null;

function handleCopyNumber() {
  navigator.clipboard.writeText(assistantNumber.value);
  copiedNumber.value = true;
  setTimeout(() => {
    copiedNumber.value = false;
  }, 2000);
}

async function handleStartCall() {
  try {
    isInCall.value = true;
    callDuration.value = 0;
    callInterval = setInterval(() => {
      callDuration.value++;
    }, 1000);
    
    // Initiate Vapi call
    await phoneStore.startCall({
      recipient_number: assistantNumber.value.replace(/\D/g, ''), // Remove formatting
    });
  } catch (error) {
    isInCall.value = false;
    if (callInterval) {
      clearInterval(callInterval);
      callInterval = null;
    }
  }
}

async function handleEndCall() {
  if (phoneStore.currentCall) {
    try {
      await phoneStore.endCall(phoneStore.currentCall.id);
    } catch (error) {
      // Handle error
    }
  }
  isInCall.value = false;
  isMuted.value = false;
  isSpeakerOn.value = false;
  if (callInterval) {
    clearInterval(callInterval);
    callInterval = null;
  }
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatCallTime(dateStr?: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getCallIcon(direction: string) {
  switch (direction) {
    case 'inbound':
      return PhoneIncoming;
    case 'outbound':
      return PhoneOutgoing;
    default:
      return PhoneMissed;
  }
}

function getCallColor(direction: string) {
  switch (direction) {
    case 'inbound':
      return theme.value === 'dark' ? 'text-green-400' : 'text-green-600';
    case 'outbound':
      return theme.value === 'dark' ? 'text-blue-400' : 'text-blue-600';
    default:
      return theme.value === 'dark' ? 'text-red-400' : 'text-red-600';
  }
}

function getActionIcon(action: string) {
  if (action.includes('task')) return CheckSquare;
  if (action.includes('email')) return Mail;
  if (action.includes('message')) return MessageSquare;
  if (action.includes('meeting') || action.includes('appointment')) return Calendar;
  return null;
}

onMounted(async () => {
  await phoneStore.fetchCalls();
});

onUnmounted(() => {
  if (callInterval) {
    clearInterval(callInterval);
  }
});
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
}

.expand-enter-from,
.expand-leave-to {
  height: 0;
  opacity: 0;
}
</style>

